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

// Render a test rectangle
function renderTestRectangle() {
    // Draw a rectangle in the center of the canvas
    const rectWidth = 100;
    const rectHeight = 80;
    const x = (CANVAS_WIDTH - rectWidth) / 2;
    const y = (CANVAS_HEIGHT - rectHeight) / 2;

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(x, y, rectWidth, rectHeight);

    // Draw a border around it
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, rectWidth, rectHeight);

    // Draw text to indicate it's working
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Game Running', CANVAS_WIDTH / 2, y + rectHeight + 20);
}

// Update game state
function update(deltaTime) {
    gameState.deltaTime = deltaTime;
    gameState.frameCount++;

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

        // Log to console for verification
        console.log(`Frame count: ${gameState.frameCount}, FPS: ${gameState.fps}`);
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
    renderTestRectangle();
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
