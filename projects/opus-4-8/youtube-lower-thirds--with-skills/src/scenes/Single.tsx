import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrops";
import { FilmChrome } from "../components/Chrome";
import { LOWER_THIRDS } from "../lowerthirds";

/** Standalone preview of a single lower third on its backdrop. */
export const Single: React.FC<{ id: string }> = ({ id }) => {
  const entry = LOWER_THIRDS.find((e) => e.id === id) ?? LOWER_THIRDS[0];
  const { Component } = entry;
  return (
    <AbsoluteFill style={{ background: "#050609" }}>
      <Backdrop variant={entry.backdrop} />
      <Component enterAt={8} />
      <FilmChrome />
    </AbsoluteFill>
  );
};
