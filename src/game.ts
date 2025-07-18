/**
 * Main game logic for the platformer.
 * Handles player input, physics, animation, and rendering.
 *
 * Exports the init function to start the game.
 */
import { createPlayer } from './player';
import { idleAnim, walkAnim, crouchAnim, standAnim, jumpAnim } from './animations';
import type { Animation } from './animations';
import { setupKeyboardListeners, isDownKeyPressed, isUpKeyPressed, isLeftKeyPressed, isRightKeyPressed } from './keyboard';
import { getSpriteFrame } from './spritesheet';
import './style.css';
import ninjaFullUrl from '/assets/ninja_full.png?url';
import cloudsBgUrl from '/assets/Clouds3/1.png?url';
import moonUrl from '/assets/Clouds3/2.png?url';
import cloudsNearUrl from '/assets/Clouds3/3.png?url';
import cloudsFarUrl from '/assets/Clouds3/4.png?url';

/** Canvas and rendering context */
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

/** Player instance */
const player = createPlayer();

/** Game logic */
const gravity = 0.3;

/** Player sprite image */
const playerImg = new Image();
playerImg.src = ninjaFullUrl;

/** Parallax background images */
const cloudsBgImg = new Image();
cloudsBgImg.src = cloudsBgUrl;
const moonImg = new Image();
moonImg.src = moonUrl;
const cloudsNearImg = new Image();
cloudsNearImg.src = cloudsNearUrl;
const cloudsFarImg = new Image();
cloudsFarImg.src = cloudsFarUrl;

/**
 * Update game state: player movement, physics, animation.
 * Runs at a fixed timestep (1/60th second).
 */
function update() {
  player.isWalking = false;
  // Handle left/right/crouch movement
  if (isDownKeyPressed()) {
    player.vx = 0;
  } else if (isLeftKeyPressed()) {
    player.vx = -player.speed;
    player.facing = -1;
    player.isWalking = true;
  } else if (isRightKeyPressed()) {
    player.vx = player.speed;
    player.facing = 1;
    player.isWalking = true;
  } else {
    player.vx = 0;
  }

  // Jumping
  if (isUpKeyPressed() && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }

  // Apply gravity and update position
  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  // Ground collision
  if (player.y + player.height >= canvas.height - 10) {
    player.y = canvas.height - 10 - player.height;
    player.vy = 0;
    player.onGround = true;
  }

  // Map edge collision (left/right, using scaled width)
  const zoom = 1.5;
  const drawWidth = player.width * zoom;
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  } else if (player.x + drawWidth > canvas.width) {
    player.x = canvas.width - drawWidth;
    player.vx = 0;
  }

  // Determine player animation state
  if (!player.onGround) {
    player.state = 'jump';
  } else if (isDownKeyPressed()) {
    player.state = 'crouch';
  } else if (player.isWalking) {
    player.state = 'walk';
  } else if (player.state === 'crouch' && !isDownKeyPressed()) {
    player.state = 'stand';
  } else {
    player.state = 'idle';
  }

  // Animation update
  let anim: Animation;
  switch (player.state) {
    case 'walk':
      anim = walkAnim;
      break;
    case 'crouch':
      anim = crouchAnim;
      break;
    case 'stand':
      anim = standAnim;
      break;
    case 'jump':
      anim = jumpAnim;
      break;
    default:
      anim = idleAnim;
  }
  // Clamp frameIndex to valid range for current animation
  if (player.frameIndex > anim.frames - 1) {
    player.frameIndex = anim.frames - 1;
  }
  player.frameTimer++;
  if (player.state === 'crouch') {
    // Play crouch animation once, then hold last frame
    if (player.frameIndex < anim.frames - 1 && player.frameTimer >= 60 / anim.frameRate) {
      player.frameIndex++;
      player.frameTimer = 0;
    }
  } else {
    if (player.frameTimer >= 60 / anim.frameRate) {
      player.frameIndex = (player.frameIndex + 1) % anim.frames;
      player.frameTimer = 0;
    }
  }
  if (player.state === 'idle') {
    player.frameIndex = 0;
    player.frameTimer = 0;
  }
}

/**
 * Render the game scene and player.
 */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parallax background layers
  // 1. Main background (static)
  ctx.drawImage(cloudsBgImg, 0, 0, canvas.width, canvas.height);

  // 2. Far clouds (move slowly)
  const farCloudsOffset = (player.x * 0.1) % canvas.width;
  ctx.drawImage(cloudsFarImg, -farCloudsOffset, 0, canvas.width, canvas.height);
  ctx.drawImage(cloudsFarImg, canvas.width - farCloudsOffset, 0, canvas.width, canvas.height);

  // 3. Moon (moves a bit faster than far clouds)
  const moonOffset = (player.x * 0.15) % canvas.width;
  const moonScale = 3;
  ctx.drawImage(moonImg, canvas.width * 0.5 - moonOffset, canvas.height * 0.1 / moonScale, canvas.width * 0.3 * moonScale, canvas.height * 0.3 * moonScale);

  // 4. Near clouds (move faster)
  const nearCloudsOffset = (player.x * 0.3) % canvas.width;
  ctx.drawImage(cloudsNearImg, -nearCloudsOffset, 0, canvas.width, canvas.height);
  ctx.drawImage(cloudsNearImg, canvas.width - nearCloudsOffset, 0, canvas.width, canvas.height);

  // Draw ground edge (10px black layer)
  ctx.fillStyle = '#222';
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

  // Select animation for current state
  let anim: Animation;
  switch (player.state) {
    case 'walk':
      anim = walkAnim;
      break;
    case 'crouch':
      anim = crouchAnim;
      break;
    case 'stand':
      anim = standAnim;
      break;
    case 'jump':
      anim = jumpAnim;
      break;
    default:
      anim = idleAnim;
  }
  // Use spritesheet helper to get frame
  const [sx, sy, sw, sh] = getSpriteFrame(anim, player.frameIndex);
  const zoom = 1.5;
  const drawHeight = player.height * zoom;
  const drawWidth = player.width * zoom;
  const drawX = player.x;
  const drawY = player.y + player.height - drawHeight;
  ctx.save();
  if (player.facing === -1) {
    ctx.translate(drawX + drawWidth / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-drawX - drawWidth / 2, 0);
  }
  ctx.drawImage(
    playerImg,
    sx, sy, sw, sh,
    drawX, drawY, drawWidth, drawHeight
  );
  ctx.restore();
}

/**
 * Main game loop. Calls update and render, then schedules next frame.
 * Uses fixed timestep accumulator pattern for consistent simulation.
 */
const FIXED_TIMESTEP = 1 / 60; // seconds
let lastTime = performance.now();
let accumulator = 0;
function gameLoop(now = performance.now()) {
  accumulator += Math.min((now - lastTime) / 1000, 0.25); // seconds, clamp to avoid spiral of death
  lastTime = now;
  while (accumulator >= FIXED_TIMESTEP) {
    update();
    accumulator -= FIXED_TIMESTEP;
  }
  render();
  requestAnimationFrame(gameLoop);
}

/**
 * Loads all game images and resolves when all are ready.
 */
async function prepareAssets(): Promise<void> {
  const images = [playerImg, cloudsBgImg, moonImg, cloudsNearImg, cloudsFarImg];
  await Promise.all(images.map(img => {
    return new Promise<void>(resolve => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
      }
    });
  }));
}

/**
 * Initialize the game. Loads assets and starts the game loop.
 */
export async function init() {
  setupKeyboardListeners();
  await prepareAssets();
  gameLoop();
}
