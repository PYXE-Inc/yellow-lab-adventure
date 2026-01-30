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

// Input state
const input = {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false // Track if jump key was just pressed
};

// Create player instance
const player = new Player(100, GROUND_LEVEL - 48); // Start above ground

// Input handlers
function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
            input.left = true;
            break;
        case 'ArrowRight':
        case 'd':
            input.right = true;
            break;
        case 'ArrowUp':
        case 'w':
        case ' ':
            if (!input.jumpPressed) {
                input.jump = true;
                input.jumpPressed = true;
            }
            e.preventDefault();
            break;
    }
}

function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
            input.left = false;
            break;
        case 'ArrowRight':
        case 'd':
            input.right = false;
            break;
        case 'ArrowUp':
        case 'w':
        case ' ':
            input.jump = false;
            input.jumpPressed = false;
            break;
    }
}

// Add event listeners
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

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
