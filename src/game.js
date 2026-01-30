// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS; // ~16.67ms per frame

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
    running: true,
    frameCount: 0,
    deltaTime: 0,
    lastTime: performance.now(),
    fps: 0,
    fpsUpdateTime: 0
};

// Create level instance with default level
const level = Level.createDefaultLevel();
const worldBounds = level.getWorldBounds();

// Create player instance - start at beginning of level on first platform
const PLAYER_START_X = 50;
const PLAYER_START_Y = 452; // Just above first platform at y=500
const player = new Player(PLAYER_START_X, PLAYER_START_Y);

// Create camera instance
const camera = new Camera(CANVAS_WIDTH, CANVAS_HEIGHT);
camera.follow(player);
camera.setBounds(0, 0, worldBounds.width, worldBounds.height);

// Update game state
function update(deltaTime) {
    gameState.deltaTime = deltaTime;
    gameState.frameCount++;

    // Convert deltaTime to seconds
    const dt = deltaTime / 1000;

    // Build input object from Input module
    const input = {
        left: Input.isKeyDown('left'),
        right: Input.isKeyDown('right'),
        jump: Input.isKeyDown('jump')
    };

    // Update player with input
    player.update(dt, input);

    // Apply physics
    applyGravity(player, dt);

    // Apply vertical velocity
    player.y += player.vy * dt;

    // Get platforms from level and check collision
    const platforms = level.getPlatforms();
    const collision = checkPlatformCollision(
        {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            velocityY: player.vy
        },
        platforms
    );

    // Apply collision correction
    if (collision.grounded) {
        player.y = collision.correctedY;
        player.vy = 0;
        player.isGrounded = true;
    } else {
        player.isGrounded = false;
    }

    // Check if player fell off the world
    if (player.y > worldBounds.height) {
        // Reset player to start position
        player.x = PLAYER_START_X;
        player.y = PLAYER_START_Y;
        player.vx = 0;
        player.vy = 0;
        player.isGrounded = false;
    }

    // Update camera position to follow player
    camera.update();

    // Calculate FPS every second
    gameState.fpsUpdateTime += deltaTime;
    if (gameState.fpsUpdateTime >= 1000) {
        gameState.fps = gameState.frameCount;
        gameState.frameCount = 0;
        gameState.fpsUpdateTime = 0;

        // Update FPS display
        const fpsDisplay = document.getElementById('fps');
        if (fpsDisplay) {
            fpsDisplay.textContent = `FPS: ${gameState.fps}`;
        }
    }
}

// Clear canvas
function clear() {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Render frame
function render() {
    clear();

    // Get camera offset
    const offset = camera.getOffset();

    // Save context state
    ctx.save();

    // Apply camera offset
    ctx.translate(offset.x, offset.y);

    // Draw all platforms from level
    const platforms = level.getPlatforms();
    platforms.forEach(platform => {
        // Choose color based on platform type
        switch (platform.type) {
            case 'ground':
                ctx.fillStyle = '#228B22'; // Green for ground
                break;
            case 'floating':
                ctx.fillStyle = '#8B4513'; // Brown for floating platforms
                break;
            case 'obstacle':
                ctx.fillStyle = '#DC143C'; // Red for obstacles
                break;
            default:
                ctx.fillStyle = '#808080'; // Gray
        }

        // Draw platform
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        // Add a subtle highlight for depth
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            3
        );
    });

    // Draw player with camera offset
    player.render(ctx);

    // Restore context state
    ctx.restore();
}

// Main game loop
function gameLoop(currentTime) {
    if (gameState.running) {
        // Calculate delta time
        const deltaTime = currentTime - gameState.lastTime;
        gameState.lastTime = currentTime;

        // Update and render
        update(deltaTime);
        render();
    }

    // Schedule next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
console.log('Game initialized - starting game loop...');
requestAnimationFrame(gameLoop);
