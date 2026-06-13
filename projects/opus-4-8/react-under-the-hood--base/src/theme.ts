// Design tokens for the "React Under the Hood" explainer.

export const COLORS = {
  bg: "#05080f",
  bgDeep: "#03060c",
  panel: "rgba(18, 26, 43, 0.72)",
  panelSolid: "#0c1322",
  border: "rgba(97, 218, 251, 0.18)",
  grid: "rgba(97, 218, 251, 0.05)",

  react: "#61DAFB", // React cyan — primary
  reactDim: "#2b7a8c",
  text: "#E8F0FA",
  textDim: "#8DA2BD",
  textFaint: "#52647e",

  add: "#4ADE80", // green — additions
  remove: "#F87171", // red — removals
  change: "#F471B5", // magenta/pink — changes / state
  fiber: "#FBBF24", // amber — fiber work
  jsx: "#C084FC", // purple — jsx / props
  commit: "#38BDF8", // sky — commit

  // syntax
  synTag: "#7EE787",
  synAttr: "#79C0FF",
  synStr: "#A5D6FF",
  synKw: "#FF7B72",
  synFn: "#D2A8FF",
  synPunct: "#8B949E",
  synComment: "#6E7681",
};

export const FONT = {
  sans: '"Inter", system-ui, -apple-system, "SF Pro Text", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", "Fira Code", ui-monospace, Menlo, monospace',
};

// Scene timing (frames @ 30fps). Each entry: [start, duration].
export const FPS = 30;
