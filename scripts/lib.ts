import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const PROJECTS_DIR = path.join(ROOT, "projects");
export const TEMPLATES_DIR = path.join(ROOT, "templates");
export const TASKS_DIR = path.join(ROOT, "tasks");
export const MANIFEST_PATH = path.join(ROOT, "src/data/manifest.json");
export const CONFIG_PATH = path.join(ROOT, "benchmark.config.json");

export type BenchmarkConfig = {
  currentVersion: string;
  remotionVersion: string;
  homepageOrder: string[];
};

export type ProjectMeta = {
  model: { id: string; name: string };
  task: { id: string; title: string };
  template: string;
  composition: string;
  benchmarkVersion: string;
  date: string;
  prompt: string | null;
  status: "pending" | "rendered" | "published" | "failed";
  video: string | null;
  poster: string | null;
};

export type TaskDef = {
  id: string;
  title: string;
  prompt: string;
  composition: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
};

export function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function writeJson(file: string, data: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function readConfig(): BenchmarkConfig {
  return readJson<BenchmarkConfig>(CONFIG_PATH);
}

export function readTasks(): TaskDef[] {
  if (!fs.existsSync(TASKS_DIR)) return [];
  return fs
    .readdirSync(TASKS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson<TaskDef>(path.join(TASKS_DIR, f)));
}

export function listProjects(): Array<{
  dir: string;
  slug: string;
  meta: ProjectMeta;
}> {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const out: Array<{ dir: string; slug: string; meta: ProjectMeta }> = [];
  for (const model of fs.readdirSync(PROJECTS_DIR)) {
    const modelDir = path.join(PROJECTS_DIR, model);
    if (!fs.statSync(modelDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(modelDir)) {
      const dir = path.join(modelDir, slug);
      const metaPath = path.join(dir, "meta.json");
      if (fs.existsSync(metaPath)) {
        out.push({ dir, slug, meta: readJson<ProjectMeta>(metaPath) });
      }
    }
  }
  return out;
}

export function generateManifest(): number {
  const config = readConfig();
  const projects = listProjects();
  // the entry slug is its directory name; it keys URLs and R2 paths
  const entries = projects.map(({ slug, meta }) => ({
    id: `${meta.model.id}/${slug}`,
    slug,
    ...meta,
  }));

  // homepageOrder lists model slugs; entries group by model, ordered tasks within
  const order = config.homepageOrder;
  entries.sort((a, b) => {
    if (a.model.id !== b.model.id) {
      const ai = order.indexOf(a.model.id);
      const bi = order.indexOf(b.model.id);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.date.localeCompare(a.date) || a.model.id.localeCompare(b.model.id);
    }
    return a.slug.localeCompare(b.slug);
  });

  writeJson(MANIFEST_PATH, {
    version: config.currentVersion,
    remotionVersion: config.remotionVersion,
    entries,
  });
  return entries.length;
}

export function loadEnv(): Record<string, string> {
  const envPath = path.join(ROOT, ".env");
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return { ...env, ...(process.env as Record<string, string>) };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_RE = /^[a-z0-9][a-z0-9.-]*$/;
