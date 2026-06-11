import React from "react";
import { sora } from "../fonts";

export const Avatar: React.FC<{
  initials: string;
  size: number;
  colors: [string, string];
  ring?: string;
}> = ({ initials, size, colors, ring }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: ring
          ? `0 0 0 3px ${ring}, 0 8px 24px rgba(0,0,0,0.35)`
          : "0 8px 24px rgba(0,0,0,0.35)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: sora,
          fontWeight: 700,
          fontSize: size * 0.36,
          color: "rgba(255,255,255,0.95)",
          letterSpacing: "0.04em",
        }}
      >
        {initials}
      </span>
    </div>
  );
};
