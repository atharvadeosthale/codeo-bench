export const FPS = 30;

export const INTRO_DURATION = 85;
export const SCENE_DURATION = 110;
export const OUTRO_DURATION = 145;
export const SCENE_COUNT = 5;

export const TOTAL_DURATION =
  INTRO_DURATION + SCENE_DURATION * SCENE_COUNT + OUTRO_DURATION;

export const sceneStart = (index: number) =>
  INTRO_DURATION + SCENE_DURATION * index;
