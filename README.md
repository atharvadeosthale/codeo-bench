# Codeo Bench

A **visual benchmark** of AI-generated [Remotion](https://remotion.dev) videos. Same prompt, same pinned template, different model — no scores, no rankings. Watch and judge.

## How it works

- `tasks/*.json` — one canonical prompt per task, given verbatim to every model.
- `templates/` — pinned Remotion scaffolds (`base`: Tailwind; `with-skills`: Tailwind + the remotion-best-practices agent skill). The template version *is* the benchmark version.
- `projects/<model>/<task>/` — one entry: a full Remotion project whose `src/` is the model's untouched output, plus `meta.json`.
- Videos live in Cloudflare R2 under immutable keys (`v1/<model>/<task>/…`), never in git. The site reads only `src/data/manifest.json`.

## Adding an entry

```bash
pnpm new-project            # interactive — or pass --model/--name/--task/--template
pnpm install
# run the task prompt against the model, paste its output into projects/<model>/<task>/src/
pnpm publish-video projects/<model>/<task>   # render → R2 (or --local) → manifest
```

Homepage order is curated by hand in `benchmark.config.json` → `homepageOrder`.

## Site

TanStack Start + Tailwind v4.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm check      # biome
```

See `AGENTS.md` for the full benchmark protocol and agent instructions (`CLAUDE.md` symlinks to it).
