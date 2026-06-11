import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  ROOT,
  SLUG_RE,
  TASKS_DIR,
  readTasks,
  slugify,
  writeJson,
} from "./lib.ts";

const { values: args } = parseArgs({
  options: {
    title: { type: "string" },
    slug: { type: "string" },
    prompt: { type: "string" },
    "prompt-file": { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

if (args.help) {
  console.log(`
${pc.bold("codeo bench — new task")}

Add a task (one canonical prompt, reused for every model) to tasks/.

${pc.bold("Interactive:")}   pnpm new-task
${pc.bold("Direct:")}        pnpm new-task --title "Codeo Trailer" --prompt "..."
               pnpm new-task --title "Codeo Trailer" --prompt-file prompt.md

${pc.bold("Flags")}
  --title        task display title
  --slug         task slug (defaults to slugified title)
  --prompt       the canonical prompt, inline
  --prompt-file  read the canonical prompt from a file
`);
  process.exit(0);
}

const tasks = readTasks();

function bail(message: string): never {
  if (args.title) {
    console.error(`${pc.red("✗")} ${message}`);
  } else {
    p.cancel(message);
  }
  process.exit(1);
}

let title: string;
let slug: string;
let prompt: string;

if (args.title) {
  title = args.title.trim();
  slug = args.slug ?? slugify(title);
  if (!SLUG_RE.test(slug)) bail(`invalid slug: ${slug}`);
  if (args["prompt-file"]) {
    const file = path.resolve(ROOT, args["prompt-file"]);
    if (!fs.existsSync(file)) bail(`prompt file not found: ${file}`);
    prompt = fs.readFileSync(file, "utf8").trim();
  } else if (args.prompt) {
    prompt = args.prompt.trim();
  } else {
    bail("pass --prompt or --prompt-file");
  }
} else {
  console.log();
  p.intro(pc.bgCyan(pc.black(" codeo bench · new task ")));

  const t = await p.text({
    message: "Task title",
    placeholder: "Codeo Trailer",
    validate: (v) => (v.trim().length === 0 ? "Required" : undefined),
  });
  if (p.isCancel(t)) bail("Cancelled.");
  title = t.trim();

  const s = await p.text({
    message: "Task slug",
    initialValue: slugify(title),
    validate: (v) =>
      SLUG_RE.test(v) ? undefined : "Lowercase letters, digits, dots and dashes only",
  });
  if (p.isCancel(s)) bail("Cancelled.");
  slug = s;

  const pr = await p.text({
    message: "Canonical prompt (given verbatim to every model)",
    validate: (v) => (v.trim().length === 0 ? "Required" : undefined),
  });
  if (p.isCancel(pr)) bail("Cancelled.");
  prompt = pr.trim();
}

if (tasks.some((t) => t.id === slug)) bail(`task "${slug}" already exists`);

writeJson(path.join(TASKS_DIR, `${slug}.json`), {
  id: slug,
  title,
  prompt,
  composition: "HelloWorld",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 150,
});

const msg = `task saved to ${pc.dim(`tasks/${slug}.json`)}`;
if (args.title) {
  console.log(`${pc.green("✓")} ${msg}`);
} else {
  p.log.success(msg);
  p.outro("done");
}
