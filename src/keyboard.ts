/**
 * Keyboard input manager for the platformer game.
 * Exports a singleton keys object, a setupKeyboardListeners function,
 * and common key state helpers for game actions.
 */

/**
 * Tracks the current pressed state of keys.
 */
export const keys: Record<string, boolean> = {};

/**
 * Sets up global keyboard event listeners to update the keys object.
 */
export function setupKeyboardListeners() {
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
}

/**
 * Key state helpers for game actions
 */
export const isDownKeyPressed = () => keys['ArrowDown'] || keys['s'];
export const isUpKeyPressed = () => keys['ArrowUp'] || keys['w'] || keys[' '];
export const isLeftKeyPressed = () => keys['ArrowLeft'] || keys['a'];
export const isRightKeyPressed = () => keys['ArrowRight'] || keys['d'];
