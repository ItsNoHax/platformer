export interface Animation {
  row: number;
  col: number;
  frames: number;
  frameRate: number;
  width: number;
  height: number;
}

export const idleAnim: Animation = {
  row: 0,
  col: 0,
  frames: 1,
  frameRate: 1,
  width: 32,
  height: 64,
};
export const walkAnim: Animation = {
  row: 0,
  col: 1,
  frames: 6,
  frameRate: 10,
  width: 32,
  height: 64,
};
export const crouchAnim: Animation = {
  row: 0,
  col: 7,
  frames: 3,
  frameRate: 8,
  width: 32,
  height: 64,
};
export const standAnim: Animation = {
  row: 1,
  col: 0,
  frames: 1,
  frameRate: 1,
  width: 32,
  height: 64,
};
export const jumpAnim: Animation = {
  row: 1,
  col: 7,
  frames: 3,
  frameRate: 8,
  width: 32,
  height: 64,
};
