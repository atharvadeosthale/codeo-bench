import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  PROJECTS_DIR,
  SLUG_RE,
  TEMPLATES_DIR,
  type TaskDef,
  generateManifest,
  readConfig,
  readTasks,
  slugify,
  writeJson,
} from "./lib.ts";

const { values: args } = parseArgs({
  options: {
    model: { type: "string" },
    name: { type: "string" },
    task: { type: "string" },
    template: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

if (args.help) {
  console.log(`
${pc.bold("codeo bench — new project")}

Scaffold a benchmark entry: one model attempting one task from a pinned template.
Tasks are managed separately — add them first with ${pc.bold("pnpm new-task")}.

${pc.bold("Interactive:")}   pnpm new-project
${pc.bold("Direct:")}        pnpm new-project --model gpt-5.2 --name "GPT-5.2" --task codeo-trailer --template base

${pc.bold("Flags")}
  --model      model slug (directory + id, e.g. claude-fable-5)
  --name       model display name (e.g. "Claude Fable 5")
  --task       task slug from tasks/*.json
  --template   ${fs.readdirSync(TEMPLATES_DIR).join(" | ")}

The entry directory is ${pc.bold("projects/<model>/<task>--<template>")}, so the same
model can attempt the same task once per template.
`);
  process.exit(0);
}

const config = readConfig();
const tasks = readTasks();
const templates = fs
  .readdirSync(TEMPLATES_DIR)
  .filter((t) => fs.statSync(path.join(TEMPLATES_DIR, t)).isDirectory());

const nonInteractive = Boolean(args.model && args.name && args.task && args.template);

function bail(message: string): never {
  if (nonInteractive) {
    console.error(`${pc.red("✗")} ${message}`);
  } else {
    p.cancel(message);
  }
  process.exit(1);
}

if (tasks.length === 0) {
  bail("no tasks defined yet. Add one first: pnpm new-task");
}

let modelId: string;
let modelName: string;
let task: TaskDef;
let template: string;

if (nonInteractive) {
  modelId = args.model as string;
  modelName = args.name as string;
  template = args.template as string;
  if (!SLUG_RE.test(modelId)) bail(`invalid model slug: ${modelId}`);
  if (!templates.includes(template))
    bail(`unknown template "${template}" (have: ${templates.join(", ")})`);
  const found = tasks.find((t) => t.id === args.task);
  if (!found)
    bail(`unknown task "${args.task}" (have: ${tasks.map((t) => t.id).join(", ")})`);
  task = found;
} else {
  console.log();
  p.intro(
    `${pc.bgCyan(pc.black(" codeo bench · new project "))} ${pc.dim(`${config.currentVersion} · remotion ${config.remotionVersion}`)}`,
  );

  const name = await p.text({
    message: "Model display name",
    placeholder: "Claude Fable 5",
    validate: (v) => (v.trim().length === 0 ? "Required" : undefined),
  });
  if (p.isCancel(name)) bail("Cancelled.");
  modelName = name.trim();

  const id = await p.text({
    message: "Model slug",
    initialValue: slugify(modelName),
    validate: (v) =>
      SLUG_RE.test(v) ? undefined : "Lowercase letters, digits, dots and dashes only",
  });
  if (p.isCancel(id)) bail("Cancelled.");
  modelId = id;

  const taskChoice = await p.select({
    message: "Task (add new ones with: pnpm new-task)",
    options: tasks.map((t) => ({ value: t.id, label: t.title, hint: t.id })),
  });
  if (p.isCancel(taskChoice)) bail("Cancelled.");
  task = tasks.find((t) => t.id === taskChoice) as TaskDef;

  const tpl = await p.select({
    message: "Template",
    options: templates.map((t) => ({
      value: t,
      label: t,
      hint:
        t === "base"
          ? "Tailwind, no agent skills"
          : "Tailwind + remotion-best-practices skill",
    })),
  });
  if (p.isCancel(tpl)) bail("Cancelled.");
  template = tpl as string;
}

const slug = `${task.id}--${template}`;
const dest = path.join(PROJECTS_DIR, modelId, slug);
if (fs.existsSync(dest))
  bail(
    `already exists: projects/${modelId}/${slug} (this model already attempted this task with this template)`,
  );

fs.cpSync(path.join(TEMPLATES_DIR, template), dest, {
  recursive: true,
  verbatimSymlinks: true,
});

const pkgPath = path.join(dest, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = `@bench/${modelId}--${slug}`;
writeJson(pkgPath, pkg);

writeJson(path.join(dest, "meta.json"), {
  model: { id: modelId, name: modelName },
  task: { id: task.id, title: task.title },
  template,
  composition: task.composition,
  benchmarkVersion: config.currentVersion,
  date: new Date().toISOString().slice(0, 10),
  prompt: task.prompt,
  status: "pending",
  video: null,
  poster: null,
});

generateManifest();

const rel = `projects/${modelId}/${slug}`;
if (nonInteractive) {
  console.log(`${pc.green("✓")} created ${pc.bold(rel)} from template ${pc.bold(template)}`);
  console.log(
    `${pc.dim("next:")} pnpm install && paste model output into ${rel}/src/ && pnpm publish-video ${rel}`,
  );
} else {
  p.log.success(`created ${pc.bold(rel)} from template ${pc.bold(template)}`);
  p.note(
    [
      `1. pnpm install`,
      `2. Run the task prompt against ${modelName}, paste output into ${rel}/src/`,
      `3. pnpm publish-video ${rel}`,
    ].join("\n"),
    "next steps",
  );
  p.outro("done");
}
