# Animation System Testing Guide

## Setup Instructions

### 1. Generate the Spritesheet

Open `assets/spritesheet-generator.html` in a web browser:
```bash
# Open in your default browser (adjust command for your OS)
open assets/spritesheet-generator.html  # macOS
xdg-open assets/spritesheet-generator.html  # Linux
start assets/spritesheet-generator.html  # Windows
```

Click the "Download PNG" button to download `lab-spritesheet.png` and place it in the `assets/` directory.

### 2. Run the Game

Open `index.html` in a web browser to run the game.

## Testing the Animation System

### Animation States to Verify

1. **Idle Animation** (Frame 0)
   - **Test:** Don't press any keys while player is on the ground
   - **Expected:** Yellow rectangle with "IDLE" text
   - **Verification:** Player should display a standing/sitting lab pose

2. **Run Animation** (Frames 1-4)
   - **Test:** Press and hold Left Arrow or Right Arrow while on ground
   - **Expected:** Orange rectangle cycling with "RUN" text
   - **Verification:** Animation should smoothly cycle through 4 frames at 100ms per frame
   - **Duration:** Complete cycle = 400ms (0.4 seconds)

3. **Jump Animation** (Frame 5)
   - **Test:** Press Space/Up Arrow to jump (while ascending)
   - **Expected:** Blue rectangle with "JUMP" text
   - **Verification:** Should show while player is moving upward (vy < 0)

4. **Fall Animation** (Frame 6)
   - **Test:** Jump and watch as player reaches peak and starts falling
   - **Expected:** Purple rectangle with "FALL" text
   - **Verification:** Should show while player is moving downward (vy > 0)

### Sprite Flipping to Verify

1. **Face Right** (facingDirection = 1)
   - **Test:** Press Right Arrow
   - **Expected:** Sprite facing right (no flip)

2. **Face Left** (facingDirection = -1)
   - **Test:** Press Left Arrow
   - **Expected:** Sprite horizontally flipped

### Animation Transitions to Test

Test these state transitions:
- Idle → Run (start moving)
- Run → Idle (stop moving)
- Idle → Jump (jump from standing)
- Run → Jump (jump while running)
- Jump → Fall (reach peak of jump)
- Fall → Idle (land without moving)
- Fall → Run (land while holding movement key)

## Fallback Behavior

If the spritesheet image fails to load or is not found, the system will automatically fall back to colored rectangles with animation state labels:
- **Yellow** = Idle
- **Orange** = Run
- **Blue** = Jump
- **Purple** = Fall

This fallback allows the game to function and demonstrate the animation system even without the spritesheet image.

## Key Features Implemented

- ✅ SpriteAnimator class loads spritesheet
- ✅ Frame sequences defined: idle[0], run[1-4], jump[5], fall[6]
- ✅ Frame timing at 100ms per frame for run animation
- ✅ update(dt) advances frames based on delta time
- ✅ render(ctx, x, y, flipX) draws current frame with flip support
- ✅ Player selects animation based on state (grounded, vy, input)
- ✅ Horizontal flip support for facing direction
- ✅ Smooth animation transitions between states
- ✅ Colored rectangle fallback with state labels

## Expected Spritesheet Format

**File:** `assets/lab-spritesheet.png`
**Dimensions:** 336x48 pixels (7 frames × 48px)
**Layout:** Horizontal strip of 7 frames
**Frame Size:** 48x48 pixels each
**Background:** Transparent PNG

## Files Modified/Created

### New Files:
- `src/sprite.js` - SpriteAnimator class
- `assets/spritesheet-generator.html` - Tool to generate placeholder spritesheet
- `assets/README.md` - Spritesheet format documentation

### Modified Files:
- `src/player.js` - Integrated animator, added updateAnimation() method
- `index.html` - Added sprite.js script reference

## Controls

- **Arrow Keys** or **WASD**: Move left/right, jump
- **Space**: Jump
