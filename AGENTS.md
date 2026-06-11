# Codeo Bench

A **visual benchmark** of AI-generated Remotion videos. Not a leaderboard — no scores. Every entry is one model's interpretation of one canonical task prompt, rendered from a pinned template and shown on the site for humans to watch and compare.

## Layout

```
templates/base/          Pinned Remotion scaffold (Tailwind, no agent skills)
templates/with-skills/   Same + remotion-best-practices agent skill
tasks/<task>.json        Task registry: one canonical prompt per task
projects/<model>/<task>--<template>/
                         One benchmark entry (a full Remotion project + meta.json).
                         The directory name is the entry "slug": it keys site URLs
                         (/v/<model>/<slug>) and R2 paths, and lets the same model
                         attempt the same task once per template.
scripts/                 new-task / new-project / publish / generate-manifest (run via pnpm)
benchmark.config.json    currentVersion, remotionVersion, homepageOrder
src/                     TanStack Start site (gallery). Reads src/data/manifest.json only.
public/media/            Local published videos (gitignored). R2 replaces this in prod.
```

## Benchmark protocol — do not bend these

1. **The model under test receives only the task prompt** from `tasks/<task>.json`, plus the fixed framing (see `scripts/run-entry.sh`): it writes its code in `src/`, may install any additional packages it needs, but must not change the Remotion packages/version or edit `meta.json`. No hints, no retries with feedback.
2. **The model's output lands in its entry directory verbatim.** Never fix, format, or "improve" it. `meta.json` and the pinned Remotion version are harness territory; the rest of the project is the model's.
3. **Failures are results.** If it doesn't render, `publish` records `status: "failed"` and the entry stays. Don't delete failed entries.
4. **Never edit `templates/`** except when deliberately bumping the benchmark version (then also bump `currentVersion` + `remotionVersion` in `benchmark.config.json` and re-render everything).
5. **`meta.json.prompt` must be the verbatim prompt used.** `model.id` is the slug (dirs, URLs, R2 keys); `model.name` is the display name and may contain spaces.

## Workflow

```bash
pnpm new-task                          # add the assignment first (interactive)
pnpm new-task --title "Codeo Trailer" --prompt-file prompt.md
pnpm new-project                       # interactive (model, task, template)
pnpm new-project --model gpt-5.2 --name "GPT-5.2" --task codeo-trailer --template base
pnpm install                           # link the new workspace package
# run the prompt against the model, paste output into projects/<model>/<slug>/src/
pnpm publish-video projects/<model>/<slug>          # render → upload → meta → manifest
pnpm publish-video projects/<model>/<slug> --local  # skip R2, publish to public/media/
pnpm manifest                          # regenerate src/data/manifest.json only
```

Tasks and projects are separate concepts: a task is the reusable assignment (one
canonical prompt), a project is one model's attempt at it with one template.
`new-project` only selects existing tasks; it never creates them.

Homepage order: edit `homepageOrder` in `benchmark.config.json` (a list of model
slugs; unlisted models sort by date below the curated ones).

## Publishing / R2

`publish` renders `out/video.mp4` + `out/poster.jpeg` (gitignored), then uploads to Cloudflare R2 under the immutable key `<version>/<model>/<task>/` — keys are never overwritten; a re-render means a version bump. Falls back to `public/media/` when R2 env is missing. R2 credentials live in `.env` (gitignored): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`.

## Site

TanStack Start + Tailwind v4. `pnpm dev` (port 3000), `pnpm build`, `pnpm check` (biome). The site reads only `src/data/manifest.json` — never the filesystem at runtime. Design system lives in `src/styles.css` (dark screening-room aesthetic; keep it).
