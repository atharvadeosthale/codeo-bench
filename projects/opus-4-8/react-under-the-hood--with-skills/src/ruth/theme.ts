// Shared design tokens for the "React Under the Hood" explainer.

export const COLORS = {
  // Backdrop
  bg0: "#05070e",
  bg1: "#080c16",
  bg2: "#0c1322",
  panel: "#0d1424",
  panelEdge: "#1c2740",
  grid: "#101a2e",

  // Brand
  react: "#61dafb",
  reactDim: "#2b7a99",
  violet: "#c792ea",
  pink: "#ff6ba6",
  green: "#9ae86b",
  yellow: "#ffcb6b",
  orange: "#f78c6c",
  blue: "#82aaff",

  // Text
  white: "#eef4fb",
  muted: "#8294b0",
  faint: "#465268",
};

// Syntax-highlight token colors
export const SYNTAX = {
  plain: "#c4d2e6",
  keyword: "#ff6ba6",
  tag: "#61dafb",
  attr: "#c792ea",
  string: "#9ae86b",
  fn: "#ffcb6b",
  number: "#f78c6c",
  punct: "#6b7c99",
  comment: "#4b5b73",
  prop: "#82aaff",
};

export const FONT_SANS =
  '"Inter", system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif';
export const FONT_MONO =
  '"SF Mono", "JetBrains Mono", "Fira Code", "Menlo", ui-monospace, monospace';

// Deterministic pseudo-random in [0,1) from an integer seed.
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
