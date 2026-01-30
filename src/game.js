// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS; // ~16.67ms per frame
const GROUND_LEVEL = 500; // Fixed ground level for testing

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

// Create player instance
const player = new Player(100, GROUND_LEVEL - 48); // Start above ground

// Render ground
function renderGround() {
    ctx.fillStyle = '#8B4513'; // Brown color for ground
    ctx.fillRect(0, GROUND_LEVEL, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
}

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

    // Check ground collision
    checkGroundCollision(player, GROUND_LEVEL);

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
    renderGround();
    player.render(ctx);
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
