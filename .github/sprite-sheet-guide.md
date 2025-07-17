# Sprite Sheet Guide for Copilot

The player sprite uses `ninja_full.png` as a sprite sheet. The layout and frame details are explained in `frameGuide.png` in the `.github` folder.

**Sprite Sheet Details:**
- Each frame is 48x48 pixels.
- Frames are arranged in a grid.
- Use the guide in `frameGuide.png` to determine the row and column for each animation frame (idle, run, jump, etc).
- To draw a specific frame: use `ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)` where `(sx, sy)` is the top-left of the frame in the sheet.

Refer to `frameGuide.png` for the exact frame layout and animation sequences.

---

This helps Copilot generate correct code for sprite animations and frame selection.
