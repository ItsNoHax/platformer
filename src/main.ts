import './style.css'
import ninjaFullUrl from '../public/assets/ninja_full.png';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Player properties (extended for animation)
const player = {
  x: 100,
  y: 260,
  width: 32,
  height: 64,
  vx: 0,
  vy: 0,
  speed: 2,
  jumpPower: -7,
  onGround: false,
  // Animation state
  frameIndex: 0,
  frameTimer: 0,
  facing: 1, // 1 = right, -1 = left
  isWalking: false,
  state: 'idle', // 'idle', 'walk', 'crouch', 'jump'
};

const gravity = 0.3;

// Load player sprite
const playerImg = new Image();
playerImg.src = ninjaFullUrl;

// Animation properties for the player
const idleAnim = {
  row: 0,
  col: 0,
  frames: 1,
  frameRate: 1,
  width: 32,
  height: 64,
};
const walkAnim = {
  row: 0,
  col: 1,
  frames: 6,
  frameRate: 10,
  width: 32,
  height: 64,
};
const crouchAnim = {
  row: 0,
  col: 7,
  frames: 3,
  frameRate: 8,
  width: 32,
  height: 64,
};
const standAnim = {
  row: 1,
  col: 0,
  frames: 1,
  frameRate: 1,
  width: 32,
  height: 64,
};
const jumpAnim = {
  row: 1,
  col: 7,
  frames: 3,
  frameRate: 8,
  width: 32,
  height: 64,
};

// Keyboard input
const keys: Record<string, boolean> = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function update() {
  // Simple left/right movement
  player.isWalking = false;
  // Prevent movement while crouching
  if (keys['ArrowDown'] || keys['s']) {
    player.vx = 0;
  } else if (keys['ArrowLeft'] || keys['a']) {
    player.vx = -player.speed;
    player.facing = -1;
    player.isWalking = true;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.vx = player.speed;
    player.facing = 1;
    player.isWalking = true;
  } else {
    player.vx = 0;
  }

  // Jump
  if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }

  // Apply gravity
  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  // Simple ground collision
  if (player.y + player.height >= canvas.height - 20) {
    player.y = canvas.height - 20 - player.height;
    player.vy = 0;
    player.onGround = true;
  }

  // Map edge collision (left and right) using drawWidth
  const zoom = 1.5;
  const drawWidth = player.width * zoom;
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  } else if (player.x + drawWidth > canvas.width) {
    player.x = canvas.width - drawWidth;
    player.vx = 0;
  }

  // Determine player state
  if (!player.onGround) {
    player.state = 'jump';
  } else if ((keys['ArrowDown'] || keys['s'])) {
    player.state = 'crouch';
  } else if (player.isWalking) {
    player.state = 'walk';
  } else if (player.state === 'crouch' && !(keys['ArrowDown'] || keys['s'])) {
    player.state = 'stand';
  } else {
    player.state = 'idle';
  }

  // Animation update
  let anim;
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

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = '#444';
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60); // Make ground thicker for zoom

  // Draw player (animation)
  let anim;
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
  let sx = (anim.col + player.frameIndex) * anim.width;
  let sy = anim.row * anim.height;
  let sw = anim.width;
  let sh = anim.height;
  // Draw player larger (zoom 1.5x)
  const zoom = 1.5;
  const drawHeight = player.height * zoom;
  const drawWidth = player.width * zoom;
  // Align feet to ground
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

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

playerImg.onload = () => {
  gameLoop();
}
