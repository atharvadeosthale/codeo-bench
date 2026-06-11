#!/usr/bin/env bash
# Launch an interactive Codex session for one benchmark entry, then publish.
# Usage: scripts/run-entry-codex.sh projects/<model>/<slug>
# Runs from the entry directory so template-level agent skills apply (or don't).
# Publish runs automatically after the Codex session exits.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENTRY="$1"
DIR="$ROOT/$ENTRY"

if [ ! -f "$DIR/meta.json" ]; then
  echo "no meta.json in $DIR" >&2
  exit 1
fi

PROMPT="$(node -e '
const fs = require("fs");
const meta = JSON.parse(fs.readFileSync(process.argv[1] + "/meta.json", "utf8"));
const config = JSON.parse(fs.readFileSync(process.argv[2] + "/benchmark.config.json", "utf8"));
console.log(
  "You are writing a Remotion " + config.remotionVersion + " composition. " +
  "This directory is a ready Remotion project; write your code in src/. " +
  "You may install any additional packages you need, but do not change the " +
  "Remotion packages or their version (" + config.remotionVersion + "), and do not edit meta.json.\n\n" + meta.prompt
);
' "$DIR" "$ROOT")"

cd "$DIR"
codex --yolo -m gpt-5.5 -c model_reasoning_effort="xhigh" "$PROMPT" || true

echo
echo "── codex session ended, publishing ─────────────────"
cd "$ROOT"
pnpm publish-video "$ENTRY"
