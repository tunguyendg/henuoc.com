import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const moods = ["trang-trong", "lang-man", "vui-tuoi"];
const licenses = ["PD", "CC0", "Pixabay", "CC-BY-4.0"];
const allowedHosts = ["upload.wikimedia.org", "incompetech.com"];
const MAX_SECONDS = 180;
const FADE_IN = 2;
const FADE_OUT = 5;

export function parseMusicLibrary(value) {
  if (!Array.isArray(value)) throw new Error("library.json phải là một mảng.");
  const seen = new Set();
  return value.map((track, index) => {
    const label = `library.json[${index}]`;
    for (const field of ["slug", "title", "artist", "licenseUrl", "sourceUrl", "credit"]) {
      if (typeof track?.[field] !== "string" || !track[field].trim()) {
        throw new Error(`${label}: thiếu hoặc sai trường ${field}.`);
      }
    }
    if (!slugPattern.test(track.slug)) throw new Error(`${label}: slug phải là kebab-case.`);
    if (seen.has(track.slug)) throw new Error(`${label}: slug trùng ${track.slug}.`);
    seen.add(track.slug);
    if (!moods.includes(track.mood)) throw new Error(`${label}: mood phải là ${moods.join("|")}.`);
    if (!licenses.includes(track.license)) {
      throw new Error(`${label}: license phải là ${licenses.join("|")}.`);
    }
    for (const field of ["contentId", "hasVocals", "enabled"]) {
      if (typeof track[field] !== "boolean") throw new Error(`${label}: ${field} phải là boolean.`);
    }
    for (const field of ["licenseUrl", "sourceUrl"]) {
      if (new URL(track[field]).protocol !== "https:") {
        throw new Error(`${label}: ${field} phải là HTTPS.`);
      }
    }
    if (track.downloadUrl !== null) {
      const url = new URL(track.downloadUrl);
      if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) {
        throw new Error(
          `${label}: downloadUrl phải là HTTPS trên ${allowedHosts.join(", ")} hoặc null (tải tay).`,
        );
      }
    }
    return track;
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

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (error) =>
      reject(error.code === "ENOENT" ? new Error(`Chưa cài ${command}.`) : error),
    );
    child.on("close", (code) => {
      if (code === 0) resolvePromise(stdout);
      else reject(new Error(`${command} lỗi (mã ${code}): ${stderr.trim().split("\n").pop()}`));
    });
  });
}

async function duration(path) {
  const out = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    path,
  ]);
  const seconds = Number.parseFloat(out);
  if (!Number.isFinite(seconds) || seconds < 10) {
    throw new Error(`file không đọc được thời lượng hoặc quá ngắn (${out.trim() || "?"}).`);
  }
  return seconds;
}

async function transcode(input, output) {
  const length = Math.min(await duration(input), MAX_SECONDS);
  const filter = [
    `atrim=0:${length}`,
    `afade=t=in:st=0:d=${FADE_IN}`,
    `afade=t=out:st=${(length - FADE_OUT).toFixed(2)}:d=${FADE_OUT}`,
    "loudnorm=I=-16:TP=-1.5:LRA=11",
  ].join(",");
  await run("ffmpeg", [
    "-v",
    "error",
    "-n",
    "-i",
    input,
    "-vn",
    "-af",
    filter,
    "-ac",
    "2",
    "-ar",
    "44100",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    output,
  ]);
}

async function download(url, destination, fetchImpl) {
  const response = await fetchImpl(url, {
    signal: AbortSignal.timeout(120_000),
    headers: { "User-Agent": "henuoc-music-fetch/1.0 (https://henuoc.com)" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} khi tải ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length <= 100 * 1024) {
    throw new Error(`dung lượng ${bytes.length} byte, nghi là trang lỗi chứ không phải file nhạc`);
  }
  await writeFile(destination, bytes, { flag: "wx" });
}

function cell(text) {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function renderCredits(tracks) {
  const rows = tracks
    .filter((track) => track.enabled)
    .map(
      (track) =>
        `| \`library/${track.slug}.m4a\` | ${cell(track.title)} | ${cell(track.artist)} | [Nguồn](<${track.sourceUrl}>) | [${track.license}](<${track.licenseUrl}>) | ${track.contentId ? "Có" : "Không"} |`,
    );
  const attributions = tracks
    .filter((track) => track.enabled && track.license === "CC-BY-4.0")
    .map(
      (track) =>
        `\`library/${track.slug}.m4a\` — đã chỉnh sửa (cắt 3 phút, fade, chuẩn hoá âm lượng):\n\n\`\`\`\n${track.credit}\n\`\`\``,
    );
  return `# Nhạc nền — nguồn & giấy phép

<!-- File này do \`npm run music:fetch\` sinh từ src/content/music/library.json. Đừng sửa tay. -->

Mỗi file nhạc trong thư mục này phải có một dòng ở đây (docs/07-THEMES.md §9). Không có giấy phép rõ → không dùng.

| File | Tên | Tác giả | Nguồn | Giấy phép |
|---|---|---|---|---|
| \`demo-piano.m4a\` | Demo piano (C–Am–F–G), 28 giây | Hẹn Ước (tự tổng hợp bằng script Python, không dùng mẫu âm thanh nào) | Tự tạo, 2026-10-23 | CC0 1.0 (public domain) |

\`demo-piano.m4a\` chỉ dùng cho trang \`/demo/*\`.

## Thư viện nhạc thiệp

Tất cả đã cắt ≤ ${MAX_SECONDS} giây, fade in ${FADE_IN}s / out ${FADE_OUT}s, chuẩn hoá −16 LUFS, AAC 128k.

| File | Tên | Tác giả | Nguồn | Giấy phép | Content ID |
|---|---|---|---|---|---|
${rows.join("\n")}

## Ghi tên bắt buộc (CC BY 4.0)

${attributions.join("\n\n")}
`;
}

export async function fetchMusic({
  libraryPath = join(projectRoot, "src/content/music/library.json"),
  outputDir = join(projectRoot, "public/audio/library"),
  creditsPath = join(projectRoot, "public/audio/CREDITS.md"),
  manualDir = join(homedir(), "Downloads/henuoc-music"),
  fetchImpl = fetch,
  report = (message) => process.stdout.write(`${message}\n`),
} = {}) {
  const tracks = parseMusicLibrary(JSON.parse(await readFile(libraryPath, "utf8")));
  await mkdir(outputDir, { recursive: true });
  const workDir = await mkdtemp(join(tmpdir(), "henuoc-music-"));
  const errors = [];
  const manual = [];
  try {
    for (const track of tracks.filter((item) => item.enabled)) {
      const output = join(outputDir, `${track.slug}.m4a`);
      try {
        if (await exists(output)) {
          report(`Bỏ qua: ${track.slug} (đã có).`);
          continue;
        }
        const manualFile = join(manualDir, `${track.slug}.mp3`);
        let input;
        if (await exists(manualFile)) {
          input = manualFile;
          report(`Dùng file tải tay: ${manualFile}`);
        } else if (track.downloadUrl) {
          input = join(workDir, track.slug);
          await download(track.downloadUrl, input, fetchImpl);
        } else {
          manual.push(track);
          continue;
        }
        await transcode(input, output);
        report(`Xong: library/${track.slug}.m4a`);
      } catch (error) {
        errors.push(`${track.slug}: ${error.message}`);
      }
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
  await writeFile(creditsPath, renderCredits(tracks));
  report(`Đã ghi ${creditsPath}`);
  if (manual.length) {
    report(
      `\nCần tải tay ${manual.length} bài (nguồn chặn tải tự động). Mở từng trang, bấm Download, lưu thành:\n` +
        manual.map((t) => `- ${join(manualDir, `${t.slug}.mp3`)}  ←  ${t.sourceUrl}`).join("\n") +
        "\nRồi chạy lại: npm run music:fetch",
    );
  }
  if (errors.length) throw new Error(`Lỗi ${errors.length} bài:\n- ${errors.join("\n- ")}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fetchMusic().catch((error) => {
    process.stderr.write(`Lỗi tải nhạc: ${error.message}\n`);
    process.exitCode = 1;
  });
}
