export const FPS = 30;

export const INTRO = 96;
export const SCENE = 132;
export const SCENE_CROSS = 16;
export const OUTRO = 150;
export const BLOCK_CROSS = 16;

export const N = 7;

export const MONTAGE_LEN = N * SCENE - (N - 1) * SCENE_CROSS; // 828
export const sceneFrom = (i: number) => i * (SCENE - SCENE_CROSS);

export const MONTAGE_FROM = INTRO - BLOCK_CROSS;
export const OUTRO_FROM = MONTAGE_FROM + MONTAGE_LEN - BLOCK_CROSS;
export const TOTAL = OUTRO_FROM + OUTRO;
