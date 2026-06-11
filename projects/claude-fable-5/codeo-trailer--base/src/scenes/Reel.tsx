import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_SOFT, FONT_MONO } from "../theme";
import { Kicker, RisingLine, outlineStyle } from "../ui/Type";

const PANELS = [
  { name: "CLAUDE FABLE 5", take: "TAKE 01" },
  { blank: true },
  { name: "GPT-5.2", take: "TAKE 01" },
  { blank: true },
  { name: "TEST MODEL", take: "TAKE 02" },
  { blank: true },
  { name: "CLAUDE FABLE 5", take: "TAKE 02" },
  { blank: true },
  { name: "GPT-5.2", take: "TAKE 02" },
  { blank: true },
] as const;

const PANEL_W = 380;
const PANEL_H = 214;
const RADIUS = 640;

const Panel: React.FC<{
  index: number;
  ringRot: number;
}> = ({ index, ringRot }) => {
  const p = PANELS[index];
  const baseAngle = (index / PANELS.length) * 360;
  // world-space facing: 0 = directly facing camera
  const world = ((baseAngle + ringRot) % 360 + 360) % 360;
  const facing = Math.cos((world * Math.PI) / 180); // 1 front, -1 back
  const front = (facing + 1) / 2;
  const brightness = 0.38 + 0.62 * front;
  const blur = (1 - front) * 3.2;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: PANEL_W,
        height: PANEL_H,
        marginLeft: -PANEL_W / 2,
        marginTop: -PANEL_H / 2,
        transform: `rotateY(${baseAngle}deg) translateZ(${RADIUS}px)`,
        border: "1px solid rgba(238,240,226,0.14)",
        borderRadius: 8,
        overflow: "hidden",
        background: "blank" in p && p.blank
          ? `repeating-linear-gradient(0deg, transparent 0 3px, rgba(238,240,226,0.018) 3px 4px), linear-gradient(160deg, #14170e, #090a06)`
          : "linear-gradient(160deg, #171a10, #0b0c08)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.55), inset 0 0 22px rgba(0,0,0,0.5)",
        filter: `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`,
        backfaceVisibility: "hidden",
      }}
    >
      {/* lime sheen + bottom falloff, as on the site's reel panels */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(212,255,63,0.09), transparent 36%), linear-gradient(0deg, rgba(5,6,3,0.55), transparent 45%)",
        }}
      />
      {"blank" in p && p.blank ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_MONO,
            fontSize: 16,
            letterSpacing: "0.3em",
            color: "rgba(238,240,226,0.25)",
          }}
        >
          AWAITING&nbsp;ENTRY
        </div>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 26,
              right: 26,
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: 33,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: C.ink,
              textTransform: "uppercase",
            }}
          >
            {"name" in p ? p.name : null}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              fontFamily: FONT_MONO,
              fontSize: 14,
              letterSpacing: "0.14em",
              color: C.inkDim,
            }}
          >
            <span>CODEO-TRAILER</span>
            <span style={{ color: C.accent }}>
              {"take" in p ? p.take : null}
            </span>
          </div>
        </>
      )}
      {/* sprocket edges on blanks */}
      {"blank" in p && p.blank ? (
        <>
          {[10, PANEL_W - 14].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: 8,
                bottom: 8,
                left: x,
                width: 4,
                backgroundImage: `repeating-linear-gradient(180deg, ${C.inkFaint} 0 6px, transparent 6px 14px)`,
                opacity: 0.5,
              }}
            />
          ))}
        </>
      ) : null}
    </div>
  );
};

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();

  // ring spin: fast entry, settles to a steady projector pace
  const spinIn = interpolate(frame, [0, 60], [120, 0], {
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const ringRot = -(frame * 0.62) - spinIn;

  // camera dolly + rise
  const dolly = interpolate(frame, [0, 90], [0.86, 1.12], {
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const enter = interpolate(frame, [0, 26], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });

  return (
    <AbsoluteFill>
      {/* headline sits behind the ring, like the site hero */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", transform: "translateY(-110px)" }}>
          <Kicker
            text="the lineup"
            delay={10}
            style={{ textAlign: "center", marginBottom: 24 }}
          />
          <RisingLine delay={16} fontSize={168}>
            Same brief.
          </RisingLine>
          <RisingLine delay={22} fontSize={168}>
            <span style={outlineStyle}>Different eyes.</span>
          </RisingLine>
        </div>
      </AbsoluteFill>

      {/* the zoetrope ring */}
      <AbsoluteFill
        style={{
          perspective: 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateY(${(1 - enter) * 60 + 118}px) scale(${dolly.toFixed(4)}) rotateX(-11deg)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: PANEL_W,
              height: PANEL_H,
              transformStyle: "preserve-3d",
              transform: `rotateY(${ringRot.toFixed(2)}deg)`,
            }}
          >
            {PANELS.map((_, i) => (
              <Panel key={i} index={i} ringRot={ringRot} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* floor glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "9%",
          width: 760,
          height: 90,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(212,255,63,0.09), transparent 70%)",
          filter: "blur(10px)",
          opacity: enter,
        }}
      />
    </AbsoluteFill>
  );
};
