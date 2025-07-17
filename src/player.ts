export type PlayerState = 'idle' | 'walk' | 'crouch' | 'stand' | 'jump';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  speed: number;
  jumpPower: number;
  onGround: boolean;
  frameIndex: number;
  frameTimer: number;
  facing: 1 | -1;
  isWalking: boolean;
  state: PlayerState;
}

export function createPlayer(): Player {
  return {
    x: 100,
    y: 260,
    width: 32,
    height: 64,
    vx: 0,
    vy: 0,
    speed: 2,
    jumpPower: -7,
    onGround: false,
    frameIndex: 0,
    frameTimer: 0,
    facing: 1,
    isWalking: false,
    state: 'idle',
  };
}
