import { spawn } from "node:child_process";
import {
  access,
  appendFile,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const MAX_BYTES = 30 * 1024 * 1024; // bản print ~2–5MB; chặn trên để file lạ không ngốn RAM
const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const palettes = ["do-do", "hong"];
const MAX_EDGE = 1200;

function checkUrl(label, field, value, host) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label}: ${field} không phải URL hợp lệ.`);
  }
  if (url.protocol !== "https:" || url.hostname !== host || url.username || url.password) {
    throw new Error(`${label}: ${field} phải là URL HTTPS trên ${host}.`);
  }
}

export function parseOrnamentManifest(value) {
  if (!Array.isArray(value)) throw new Error("redoute.json phải là một mảng.");
  const seen = new Set();
  return value.map((item, index) => {
    const label = `redoute.json[${index}]`;
    for (const field of [
      "id",
      "accessionNumber",
      "file",
      "palette",
      "title",
      "date",
      "license",
      "imageUrl",
      "museumUrl",
    ]) {
      if (typeof item?.[field] !== "string" || !item[field].trim()) {
        throw new Error(`${label}: thiếu hoặc sai trường ${field}.`);
      }
      if (/[\r\n]/.test(item[field])) throw new Error(`${label}: ${field} chứa ký tự xuống dòng.`);
    }
    if (!kebab.test(item.file)) throw new Error(`${label}: file phải là kebab-case.`);
    if (seen.has(item.file)) throw new Error(`${label}: file trùng ${item.file}.`);
    seen.add(item.file);
    if (!palettes.includes(item.palette)) {
      throw new Error(`${label}: palette phải là ${palettes.join(" hoặc ")}.`);
    }
    if (item.license !== "CC0") throw new Error(`${label}: license phải là CC0.`);
    checkUrl(label, "imageUrl", item.imageUrl, "openaccess-cdn.clevelandart.org");
    checkUrl(label, "museumUrl", item.museumUrl, "clevelandart.org");
    if (!Array.isArray(item.artists) || item.artists.length === 0) {
      throw new Error(`${label}: artists phải là mảng không rỗng.`);
    }
    for (const artist of item.artists) {
      for (const field of ["name", "role"]) {
        if (typeof artist?.[field] !== "string" || !artist[field].trim()) {
          throw new Error(`${label}: artists thiếu hoặc sai trường ${field}.`);
        }
        if (/[\r\n]/.test(artist[field])) {
          throw new Error(`${label}: artists.${field} chứa ký tự xuống dòng.`);
        }
      }
    }
    for (const field of ["width", "height"]) {
      if (!Number.isInteger(item[field]) || item[field] <= 0) {
        throw new Error(`${label}: ${field} phải là số nguyên dương.`);
      }
    }
    return item;
  });
}

/** Tham số -resize cho cwebp: cạnh dài nhất <= 1200, giữ tỉ lệ, không phóng to. */
export function resizeArgs(width, height) {
  if (Math.max(width, height) <= MAX_EDGE) return [];
  return height >= width ? ["-resize", "0", String(MAX_EDGE)] : ["-resize", String(MAX_EDGE), "0"];
}

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (error) =>
      reject(error.code === "ENOENT" ? new Error("Cần cài cwebp (brew install webp).") : error),
    );
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} lỗi (mã ${code}): ${stderr.trim().split("\n").pop()}`));
    });
  });
}

function defaultConvert({ input, output, width, height }) {
  return run("cwebp", ["-q", "80", ...resizeArgs(width, height), input, "-o", output]);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function markdown(text) {
  return text.replace(/[\\`*_[\]<>]/g, "\\$&");
}

export async function fetchOrnaments({
  manifestPath = join(projectRoot, "src/content/ornaments/redoute.json"),
  outputDir = join(projectRoot, "public/images/ornaments/redoute"),
  fetchImpl = fetch,
  convert = defaultConvert,
  report = (message) => process.stdout.write(`${message}\n`),
} = {}) {
  let raw;
  try {
    raw = await readFile(manifestPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") throw new Error(`Chưa có manifest: ${manifestPath}.`);
    throw error;
  }
  const items = parseOrnamentManifest(JSON.parse(raw));
  const creditsPath = join(outputDir, "CREDITS.md");
  const errors = [];
  for (const item of items) {
    const name = `${item.file}.webp`;
    const destination = join(outputDir, name);
    let tmp;
    try {
      if (await exists(destination)) {
        report(`Bỏ qua: ${name} (đã có).`);
      } else {
        const response = await fetchImpl(item.imageUrl, {
          signal: AbortSignal.timeout(60_000),
          redirect: "error",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status} khi tải ${item.imageUrl}`);
        const type = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
        if (type !== "image/jpeg") {
          throw new Error(`content-type phải là image/jpeg, nhận ${type ?? "(không có)"}`);
        }
        const declared = Number(response.headers.get("content-length"));
        if (declared > MAX_BYTES) {
          throw new Error(`content-length ${declared} byte, vượt giới hạn ${MAX_BYTES} byte`);
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > MAX_BYTES) {
          throw new Error(`dung lượng ${bytes.length} byte, vượt giới hạn ${MAX_BYTES} byte`);
        }
        if (bytes.length <= 50 * 1024) {
          throw new Error(`dung lượng ${bytes.length} byte, yêu cầu lớn hơn 50KB (51200 byte)`);
        }
        tmp = await mkdtemp(join(tmpdir(), "henuoc-ornament-"));
        const input = join(tmp, `${item.file}.jpg`);
        const output = join(tmp, name);
        await writeFile(input, bytes);
        await convert({ input, output, width: item.width, height: item.height });
        await mkdir(outputDir, { recursive: true });
        await copyFile(output, destination, 1); // COPYFILE_EXCL: không ghi đè
        report(`Đã tải: ${name}.`);
      }
      await mkdir(outputDir, { recursive: true });
      if (!(await exists(creditsPath))) {
        await writeFile(
          creditsPath,
          "# Tranh hoa Redouté\n\nNguồn: Cleveland Museum of Art, CC0 · https://creativecommons.org/publicdomain/zero/1.0/\n",
          { flag: "wx" },
        );
      }
      const credits = await readFile(creditsPath, "utf8");
      const marker = `<!-- ornament: ${name} -->`;
      if (!credits.includes(marker)) {
        const artists = item.artists
          .map((artist) => `${markdown(artist.name)} (${markdown(artist.role)})`)
          .join(", ");
        await appendFile(
          creditsPath,
          `\n${marker}\n- \`${name}\`: ${markdown(item.title)}, ${markdown(item.date)} — ${artists}. Cleveland Museum of Art, CC0. [Nguồn](<${item.museumUrl}>)\n`,
        );
      }
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    } finally {
      if (tmp) await rm(tmp, { recursive: true, force: true });
    }
  }
  if (errors.length)
    throw new Error(`Không tải được ${errors.length} ảnh:\n- ${errors.join("\n- ")}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fetchOrnaments().catch((error) => {
    process.stderr.write(`Lỗi tải tranh hoa: ${error.message}\n`);
    process.exitCode = 1;
  });
}
