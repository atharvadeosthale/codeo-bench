// Shared design tokens for the Lower Thirds trailer.
// Kept intentionally framework-agnostic — every value is a plain string/number
// so it can be dropped straight into inline styles.

export const fonts = {
  sans: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, "SF Mono", "Menlo", "Consolas", monospace',
};

export const palette = {
  ink: "#05060a",
  paper: "#f7f8fb",
  white: "#ffffff",

  // accent ramps used across the lower thirds
  cyan: "#22d3ee",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  magenta: "#ec4899",
  red: "#ef4444",
  amber: "#f59e0b",
  gold: "#e8c372",
  emerald: "#10b981",
  lime: "#84cc16",
};

// Reusable easing for interpolate() calls. Quint in/out feels expensive.
export const EASE = {
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export type SceneAccent = {
  from: string;
  to: string;
};
