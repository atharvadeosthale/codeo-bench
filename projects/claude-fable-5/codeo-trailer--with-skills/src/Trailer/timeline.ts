export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Hard-cut timeline. Every scene owns its frames exactly — no overlaps.
export const LEADER = { from: 0, dur: 105 };
export const ST1 = { from: 105, dur: 65 };
export const ST2 = { from: 170, dur: 65 };
export const ST3 = { from: 235, dur: 85 };
export const BRIEF = { from: 320, dur: 160 };
export const REEL = { from: 480, dur: 225 };
export const SLAM1 = { from: 705, dur: 42 };
export const SLAM2 = { from: 747, dur: 42 };
export const SLAM3 = { from: 789, dur: 90 };
export const JUDGE = { from: 879, dur: 95 };
export const TITLE = { from: 974, dur: 166 };

export const DURATION = TITLE.from + TITLE.dur; // 1140 — 38s @ 30fps
