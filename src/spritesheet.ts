/**
 * SpriteSheet helper for extracting frames from a sprite sheet image.
 * Provides a function to get the source rectangle for a given animation and frame.
 */
import type { Animation } from './animations';

/**
 * Returns the source rectangle for a given animation and frame index.
 * @param anim Animation object
 * @param frameIndex Current frame index
 * @returns [sx, sy, sw, sh] for ctx.drawImage
 */
export function getSpriteFrame(anim: Animation, frameIndex: number): [number, number, number, number] {
  const sx = (anim.col + frameIndex) * anim.width;
  const sy = anim.row * anim.height;
  const sw = anim.width;
  const sh = anim.height;
  return [sx, sy, sw, sh];
}
