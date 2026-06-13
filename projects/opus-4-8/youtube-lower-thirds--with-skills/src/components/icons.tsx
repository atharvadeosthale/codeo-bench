import React from "react";

type IconProps = { size?: number; color?: string };

export const YouTubeGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="4" fill={color} />
    <path d="M10 9l5 3-5 3V9z" fill="#0A0C12" />
  </svg>
);

export const XGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3l7.5 9.5L3.4 21h2.3l5.6-6.6L16.6 21H21l-7.8-9.9L20.4 3h-2.3l-5.2 6.1L8 3H3z"
      fill={color}
    />
  </svg>
);

export const InstagramGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.3" fill={color} />
  </svg>
);

export const TikTokGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M14 3c.4 2.6 2 4.3 4.5 4.6v3c-1.7 0-3.2-.5-4.5-1.4v5.7A5.9 5.9 0 1 1 8 9.1v3.1a2.8 2.8 0 1 0 2.9 2.8V3H14z"
      fill={color}
    />
  </svg>
);

export const BellGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3a5 5 0 0 0-5 5c0 4-1.5 5.5-2 6.5h14c-.5-1-2-2.5-2-6.5a5 5 0 0 0-5-5z"
      fill={color}
    />
    <path d="M10 18a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.8" fill="none" />
  </svg>
);

export const VerifiedGlyph: React.FC<IconProps> = ({ size = 20, color = "#3B82F6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l2.3 1.7 2.8-.3 1 2.7 2.4 1.5-.8 2.7.8 2.7-2.4 1.5-1 2.7-2.8-.3L12 22l-2.3-1.7-2.8.3-1-2.7L3.5 16l.8-2.7-.8-2.7 2.4-1.5 1-2.7 2.8.3L12 2z"
      fill={color}
    />
    <path d="M8.5 12l2.3 2.3 4.7-4.8" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayGlyph: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M8 5v14l11-7L8 5z" fill={color} />
  </svg>
);

export const PinGlyph: React.FC<IconProps> = ({ size = 18, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"
      fill={color}
    />
    <circle cx="12" cy="9" r="2.6" fill="#0A0C12" />
  </svg>
);
