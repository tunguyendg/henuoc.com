import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const segment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseImageManifest(value) {
  if (!Array.isArray(value)) throw new Error("images.json phải là một mảng.");
  const seen = new Set();
  return value.map((image, index) => {
    const label = `images.json[${index}]`;
    if (image?.source !== undefined && !["own", "unsplash"].includes(image.source)) {
      throw new Error(`${label}: source phải là own hoặc unsplash.`);
    }
    const fields =
      image?.source === "own"
        ? ["slug", "file", "alt", "caption"]
        : ["slug", "file", "cdnPath", "photographer", "photographerUrl", "unsplashUrl", "alt"];
    for (const field of fields) {
      if (typeof image?.[field] !== "string" || !image[field].trim()) {
        throw new Error(`${label}: thiếu hoặc sai trường ${field}.`);
      }
      if (/[\r\n]/.test(image[field])) throw new Error(`${label}: ${field} chứa ký tự xuống dòng.`);
    }
    const prefix = `cam-nang/${image.slug}/`;
    const filename = image.file.startsWith(prefix) ? image.file.slice(prefix.length) : image.file;
    const file = filename.endsWith(".webp") ? filename.slice(0, -5) : filename;
    if (!segment.test(image.slug) || !segment.test(file)) {
      throw new Error(
        `${label}: slug và tên file phải là kebab-case; đường dẫn chỉ được nằm trong cam-nang/<slug>/.`,
      );
    }
    if (image.source === "own") {
      for (const field of ["cdnPath", "photographer", "photographerUrl", "unsplashUrl"]) {
        if (field in image) throw new Error(`${label}: ảnh own không dùng trường ${field}.`);
      }
      if (!["cover", "inline"].includes(image.role))
        throw new Error(`${label}: role phải là cover hoặc inline.`);
    } else {
      if (!/^photo-[a-zA-Z0-9-]+$/.test(image.cdnPath)) {
        throw new Error(
          `${label}: cdnPath phải là photo-… trên images.unsplash.com, không gồm query.`,
        );
      }
      for (const field of ["photographerUrl", "unsplashUrl"]) {
        const url = new URL(image[field]);
        if (
          url.protocol !== "https:" ||
          url.hostname !== "unsplash.com" ||
          url.username ||
          url.password
        ) {
          throw new Error(`${label}: ${field} phải là URL HTTPS trên unsplash.com.`);
        }
      }
    }
    const key = `${image.slug}/${file}`;
    if (seen.has(key)) throw new Error(`${label}: ảnh trùng ${key}.`);
    seen.add(key);
    return { ...image, file };
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

function markdown(text) {
  return text.replace(/[\\`*_[\]<>]/g, "\\$&");
}

export async function fetchArticleImages({
  manifestPath = join(projectRoot, "src/content/cam-nang/images.json"),
  outputDir = join(projectRoot, "public/images/cam-nang"),
  fetchImpl = fetch,
  report = (message) => process.stdout.write(`${message}\n`),
} = {}) {
  let raw;
  try {
    raw = await readFile(manifestPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Chưa có manifest: ${manifestPath}. Hãy tạo images.json trước khi tải ảnh.`);
    }
    throw error;
  }
  const images = parseImageManifest(JSON.parse(raw));
  const creditsPath = join(outputDir, "CREDITS.md");
  const errors = [];
  for (const image of images) {
    const relativePath = `${image.slug}/${image.file}.webp`;
    const destination = join(outputDir, image.slug, `${image.file}.webp`);
    if (image.source === "own") {
      report(`Bỏ qua ảnh tự chụp: ${relativePath} (không tải hoặc sửa credit Unsplash).`);
      continue;
    }
    try {
      if (await exists(destination)) {
        report(`Bỏ qua: ${relativePath} (đã có).`);
      } else {
        const url = `https://images.unsplash.com/${image.cdnPath}?w=1600&q=75&fm=webp&fit=max`;
        const response = await fetchImpl(url, {
          signal: AbortSignal.timeout(30_000),
          redirect: "error",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status} khi tải ${url}`);
        const type = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
        if (type !== "image/webp") {
          throw new Error(`content-type phải là image/webp, nhận ${type ?? "(không có)"}`);
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length <= 20 * 1024) {
          throw new Error(`dung lượng ${bytes.length} byte, yêu cầu lớn hơn 20KB (20480 byte)`);
        }
        await mkdir(dirname(destination), { recursive: true });
        await writeFile(destination, bytes, { flag: "wx" });
        report(`Đã tải: ${relativePath} (${bytes.length} byte).`);
      }
      await mkdir(outputDir, { recursive: true });
      if (!(await exists(creditsPath))) {
        await writeFile(
          creditsPath,
          "# Ảnh cẩm nang\n\nNguồn: Unsplash · https://unsplash.com/license\n",
          { flag: "wx" },
        );
      }
      const credits = await readFile(creditsPath, "utf8");
      const marker = `<!-- image: ${relativePath} -->`;
      if (!credits.includes(marker)) {
        await appendFile(
          creditsPath,
          `\n${marker}\n- \`${relativePath}\`: ${markdown(image.alt)} — Ảnh: [${markdown(image.photographer)}](<${image.photographerUrl}>) / [Unsplash](<${image.unsplashUrl}>).\n`,
        );
      }
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
  if (errors.length)
    throw new Error(`Không tải được ${errors.length} ảnh:\n- ${errors.join("\n- ")}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fetchArticleImages().catch((error) => {
    process.stderr.write(`Lỗi tải ảnh cẩm nang: ${error.message}\n`);
    process.exitCode = 1;
  });
}
