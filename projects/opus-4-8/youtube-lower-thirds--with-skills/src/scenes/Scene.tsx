import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrops";
import { SceneTitle } from "../components/Chrome";
import { fonts, palette } from "../theme";
import { track } from "../lib/anim";
import { SCENE, SCENE_CROSS } from "../timeline";
import type { LowerThird } from "../lowerthirds";

/** One showcase scene: contextual backdrop + the lower third + labels. */
export const Scene: React.FC<{ entry: LowerThird }> = ({ entry }) => {
  const frame = useCurrentFrame();
  const fadeIn = track(frame, [0, SCENE_CROSS], [0, 1]);
  const fadeOut = track(frame, [SCENE - SCENE_CROSS, SCENE], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  // gentle push-in for cinematic life
  const scale = track(frame, [0, SCENE], [1.06, 1.0]);
  const chipY = track(frame, [4, 24], [-24, 0]);
  const chipO = track(frame, [4, 22], [0, 1]);
  const { Component } = entry;

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Backdrop variant={entry.backdrop} />
      </AbsoluteFill>

      {/* context pill, top center */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: "50%",
          transform: `translate(-50%, ${chipY}px)`,
          opacity: chipO,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "9px 18px",
          borderRadius: 999,
          background: "rgba(10,12,18,0.6)",
          border: `1px solid ${entry.accent.a}44`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: entry.accent.a,
            boxShadow: `0 0 10px ${entry.accent.a}`,
          }}
        />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 14,
            letterSpacing: 4,
            color: palette.white,
          }}
        >
          {entry.context}
        </span>
      </div>

      <Component enterAt={SCENE_CROSS - 4} />

      <SceneTitle kicker={entry.kind} title={entry.title} color={entry.accent.a} />
    </AbsoluteFill>
  );
};
