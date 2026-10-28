// Tải ảnh album demo từ Unsplash (Unsplash License) theo src/content/demo-album/images.json.
// Mục có "existing" (file đã nằm trong repo) → bỏ qua. Ảnh mới lưu JPG gốc (không resize, repo không
// có dependency ảnh) vào public/images/wedding/demo-album/<file>.jpg, bỏ qua nếu đã có, và append credit
// vào public/images/wedding/CREDITS.md chỉ khi vừa tải file mới.
//
// README: Tony thêm 2–3 ảnh cùng buổi chụp của Bin Thieu vào images.json rồi chạy `npm run demo-album:fetch`.
import { appendFile, access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const MAX_BYTES = 30 * 1024 * 1024;
const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const unsplashId = /^[A-Za-z0-9_-]{11}$/;
const ALLOWED_HOST = "images.unsplash.com";
const MAX_REDIRECTS = 5;

export function parseDemoAlbumManifest(value) {
  if (!Array.isArray(value)) throw new Error("images.json phải là một mảng.");
  const seen = new Set();
  return value.map((item, index) => {
    const label = `images.json[${index}]`;
    for (const field of [
      "file",
      "unsplashId",
      "photographer",
      "photographerUrl",
      "unsplashUrl",
      "alt",
    ]) {
      if (typeof item?.[field] !== "string" || !item[field].trim()) {
        throw new Error(`${label}: thiếu hoặc sai trường ${field}.`);
      }
      if (/[\r\n]/.test(item[field])) throw new Error(`${label}: ${field} chứa ký tự xuống dòng.`);
    }
    if (!kebab.test(item.file)) throw new Error(`${label}: file phải là kebab-case.`);
    if (seen.has(item.file)) throw new Error(`${label}: file trùng ${item.file}.`);
    seen.add(item.file);
    if (!unsplashId.test(item.unsplashId)) {
      throw new Error(`${label}: unsplashId phải gồm 11 ký tự [A-Za-z0-9_-].`);
    }
    for (const field of ["photographerUrl", "unsplashUrl"]) {
      let url;
      try {
        url = new URL(item[field]);
      } catch {
        throw new Error(`${label}: ${field} không phải URL hợp lệ.`);
      }
      if (
        url.protocol !== "https:" ||
        url.hostname !== "unsplash.com" ||
        url.username ||
        url.password
      ) {
        throw new Error(`${label}: ${field} phải là URL HTTPS trên unsplash.com.`);
      }
    }
    if (item.existing !== undefined) {
      if (
        typeof item.existing !== "string" ||
        !/^\/images\/[A-Za-z0-9/_.-]+$/.test(item.existing) ||
        item.existing.includes("..")
      ) {
        throw new Error(`${label}: existing phải là đường dẫn /images/… hợp lệ.`);
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

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

// Theo redirect thủ công để kiểm host từng bước: chỉ nhận ảnh cuối ở images.unsplash.com.
async function download(item, fetchImpl) {
  let url = `https://unsplash.com/photos/${item.unsplashId}/download?force=true`;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetchImpl(url, {
      signal: AbortSignal.timeout(60_000),
      redirect: "manual",
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("redirect thiếu header location");
      const next = new URL(location, url);
      if (
        next.protocol !== "https:" ||
        (next.hostname !== ALLOWED_HOST && next.hostname !== "unsplash.com")
      ) {
        throw new Error(`redirect tới host không cho phép: ${next.hostname}`);
      }
      url = next.href;
      continue;
    }
    if (new URL(url).hostname !== ALLOWED_HOST) {
      throw new Error(`ảnh phải nằm trên ${ALLOWED_HOST}, nhận ${new URL(url).hostname}`);
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
    if (type !== "image/jpeg")
      throw new Error(`content-type phải là image/jpeg, nhận ${type ?? "(không có)"}`);
    const declared = Number(response.headers.get("content-length"));
    if (declared > MAX_BYTES)
      throw new Error(`content-length ${declared} vượt giới hạn ${MAX_BYTES}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > MAX_BYTES)
      throw new Error(`dung lượng ${bytes.length} vượt giới hạn ${MAX_BYTES}`);
    if (bytes.length <= 50 * 1024)
      throw new Error(`dung lượng ${bytes.length} byte, yêu cầu lớn hơn 50KB`);
    return bytes;
  }
  throw new Error("quá nhiều redirect");
}

export async function fetchDemoAlbum({
  manifestPath = join(projectRoot, "src/content/demo-album/images.json"),
  outputDir = join(projectRoot, "public/images/wedding/demo-album"),
  creditsPath = join(projectRoot, "public/images/wedding/CREDITS.md"),
  fetchImpl = fetch,
  report = (message) => process.stdout.write(`${message}\n`),
} = {}) {
  let raw;
  try {
    raw = await readFile(manifestPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") throw new Error(`Chưa có manifest: ${manifestPath}.`);
    throw error;
  }
  const items = parseDemoAlbumManifest(JSON.parse(raw));
  const errors = [];
  for (const item of items) {
    const name = `${item.file}.jpg`;
    try {
      if (item.existing) {
        report(`Bỏ qua: ${name} (đã có ${item.existing}).`);
        continue;
      }
      const destination = join(outputDir, name);
      if (await exists(destination)) {
        report(`Bỏ qua: ${name} (đã có).`);
        continue;
      }
      const bytes = await download(item, fetchImpl);
      await mkdir(outputDir, { recursive: true });
      await writeFile(destination, bytes, { flag: "wx" });
      await appendFile(
        creditsPath,
        `- demo-album/${name} — ${item.photographer} — ${item.unsplashUrl}\n`,
      );
      report(`Đã tải: ${name}.`);
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    }
  }
  if (errors.length)
    throw new Error(`Không tải được ${errors.length} ảnh:\n- ${errors.join("\n- ")}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fetchDemoAlbum().catch((error) => {
    process.stderr.write(`Lỗi tải album demo: ${error.message}\n`);
    process.exitCode = 1;
  });
}
