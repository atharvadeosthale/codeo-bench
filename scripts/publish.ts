import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import pc from "picocolors";
import {
  ROOT,
  type ProjectMeta,
  generateManifest,
  loadEnv,
  readJson,
  writeJson,
} from "./lib.ts";

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    local: { type: "boolean" },
    "skip-render": { type: "boolean" },
    frame: { type: "string", default: "75" },
    help: { type: "boolean", short: "h" },
  },
});

if (flags.help || positionals.length === 0) {
  console.log(`
${pc.bold("codeo bench — publish")}

Render a project and publish video + poster (R2, or public/media with --local).

${pc.bold("Usage:")}  pnpm publish-video projects/<model>/<task> [--local] [--skip-render] [--frame N]

R2 env vars (in .env): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
Falls back to --local automatically when R2 env is absent.
`);
  process.exit(flags.help ? 0 : 1);
}

const projectDir = path.resolve(ROOT, positionals[0]);
const metaPath = path.join(projectDir, "meta.json");
if (!fs.existsSync(metaPath)) {
  console.error(`${pc.red("✗")} no meta.json in ${projectDir}`);
  process.exit(1);
}

const meta = readJson<ProjectMeta>(metaPath);
const slug = path.basename(projectDir);
const id = `${meta.model.id}/${slug}`;
const key = `${meta.benchmarkVersion}/${meta.model.id}/${slug}`;
const outDir = path.join(projectDir, "out");
const videoPath = path.join(outDir, "video.mp4");
const posterPath = path.join(outDir, "poster.jpeg");

const run = (cmd: string) =>
  execSync(cmd, { cwd: projectDir, stdio: "inherit" });

if (!flags["skip-render"]) {
  // models name their own composition; detect the registered id instead of trusting meta
  try {
    const out = execSync("pnpm exec remotion compositions 2>/dev/null", {
      cwd: projectDir,
      encoding: "utf8",
    });
    const line = out.split("\n").find((l) => /^[A-Za-z][\w-]*\s+\d+\s/.test(l));
    const detected = line?.trim().split(/\s+/)[0];
    if (detected && detected !== meta.composition) {
      console.log(`${pc.yellow("!")} composition is "${detected}" (meta said "${meta.composition}") — updating meta`);
      meta.composition = detected;
      writeJson(metaPath, meta);
    }
  } catch {}
  console.log(`${pc.cyan("▸")} rendering ${pc.bold(id)} (${meta.composition})`);
  try {
    run(`pnpm exec remotion render ${meta.composition} out/video.mp4 --log=error`);
    run(`pnpm exec remotion still ${meta.composition} out/poster.jpeg --frame=${flags.frame} --log=error`);
  } catch {
    meta.status = "failed";
    writeJson(metaPath, meta);
    generateManifest();
    console.error(`${pc.red("✗")} render failed — recorded status "failed" for ${id}`);
    process.exit(1);
  }
}

for (const f of [videoPath, posterPath]) {
  if (!fs.existsSync(f)) {
    console.error(`${pc.red("✗")} missing ${f} (use without --skip-render?)`);
    process.exit(1);
  }
}

const env = loadEnv();
const hasR2 =
  env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET && env.R2_PUBLIC_URL;

if (!flags.local && !hasR2) {
  console.log(`${pc.yellow("!")} R2 env not configured — publishing locally to public/media/`);
}

if (flags.local || !hasR2) {
  const destDir = path.join(ROOT, "public/media", key);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(videoPath, path.join(destDir, "video.mp4"));
  fs.copyFileSync(posterPath, path.join(destDir, "poster.jpeg"));
  meta.video = `/media/${key}/video.mp4`;
  meta.poster = `/media/${key}/poster.jpeg`;
  meta.status = "rendered";
} else {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  for (const [file, name, type] of [
    [videoPath, "video.mp4", "video/mp4"],
    [posterPath, "poster.jpeg", "image/jpeg"],
  ] as const) {
    console.log(`${pc.cyan("▸")} uploading ${key}/${name}`);
    await s3.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: `${key}/${name}`,
        Body: fs.readFileSync(file),
        ContentType: type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  }
  const base = env.R2_PUBLIC_URL.replace(/\/$/, "");
  meta.video = `${base}/${key}/video.mp4`;
  meta.poster = `${base}/${key}/poster.jpeg`;
  meta.status = "published";
}

writeJson(metaPath, meta);
const count = generateManifest();
console.log(`${pc.green("✓")} ${id} ${meta.status} → ${meta.video}`);
console.log(`${pc.green("✓")} manifest regenerated (${count} entries)`);
