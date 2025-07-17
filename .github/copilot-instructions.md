<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a Vite + TypeScript platformer game. Prefer canvas-based rendering and game loop patterns. Use assets from the public/assets folder for sprites.

The player sprite uses `ninja_full.png` as a sprite sheet. Frame layout and animation details are explained in `frameGuide.png` in the `.github` folder:
- Each frame is 32x64 pixels
- The sprite sheet is made out of 10 columns and 10 rows of frames
- The idle animation consists of one frame at row 0 column 0 in the sprite sheet.
- The walk animation consists of 6 frames starting from row 0, column 1 and moving right.
- The crouch animation consists of 3 frames starting from row 0 column 7 and moving right.
- The stand animation consists of 1 frame at row 1 column 0.
- The jump animation consists of 3 frames starting from row 1 column 7 and moving right.
- To draw a specific frame: use `ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)` where `(sx, sy)` is the top-left of the frame in the sheet.
