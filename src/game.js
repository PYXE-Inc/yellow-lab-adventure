// Import modules
import Goal from './goal.js';
import { GameState } from './gameState.js';
import { Level } from './level.js';
import { audioManager } from './audio.js';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS; // ~16.67ms per frame

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Frame tracking state
const frameState = {
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

// Create game state instance
const gameState = new GameState();

// Create goal instance at end of level (level width is 3000, place at 2900)
const goal = new Goal(2900, 436); // y=436 places it on the ground (500 - 64)

// Create score instance
const score = new Score();

// Update game state
function update(deltaTime) {
    frameState.deltaTime = deltaTime;
    frameState.frameCount++;

    // Convert deltaTime to seconds
    const dt = deltaTime / 1000;

    // Only update game logic if playing
    if (gameState.isPlaying()) {
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
            gameState.lose();
        }

        // Update level (collectibles and enemies)
        level.update(dt);

        // Check collectible collisions (iterate backwards to safely remove items)
        for (let i = level.collectibles.length - 1; i >= 0; i--) {
            const collectible = level.collectibles[i];
            if (collectible.checkCollision(player)) {
                score.add(collectible.value);
                level.collectibles.splice(i, 1);
                audioManager.playSound('collect');
            }
        }

        // Check enemy collisions with player
        level.enemies.forEach(enemy => {
            // AABB collision detection
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                audioManager.playSound('lose');
                gameState.lose();
            }
        });

        // Check goal collision
        if (goal.checkCollision(player)) {
            audioManager.playSound('win');
            gameState.win();
        }

        // Update camera position to follow player
        camera.update();
    }

    // Calculate FPS every second
    frameState.fpsUpdateTime += deltaTime;
    if (frameState.fpsUpdateTime >= 1000) {
        frameState.fps = frameState.frameCount;
        frameState.frameCount = 0;
        frameState.fpsUpdateTime = 0;

        // Update FPS display
        const fpsDisplay = document.getElementById('fps');
        if (fpsDisplay) {
            fpsDisplay.textContent = `FPS: ${frameState.fps}`;
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

    // Render collectibles
    level.collectibles.forEach(collectible => {
        collectible.render(ctx, { x: -offset.x, y: -offset.y });
    });

    // Render enemies
    level.enemies.forEach(enemy => {
        enemy.render(ctx, camera);
    });

    // Draw player with camera offset
    player.render(ctx);

    // Draw goal (doghouse)
    goal.render(ctx, -offset.x);

    // Restore context state
    ctx.restore();

    // Render score (not affected by camera)
    score.render(ctx);

    // Render game state overlay (win/lose screen)
    gameState.renderOverlay(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Restart function - resets game to initial state
function restart() {
    // Reset player position and velocity
    player.x = PLAYER_START_X;
    player.y = PLAYER_START_Y;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = false;

    // Reset game state
    gameState.reset();

    // Reset score
    score.reset();

    // Reset level (respawn collectibles and enemies)
    level.reset();

    // Reset camera
    camera.follow(player);

    // Restart background music
    audioManager.playMusic('music');
}

// Expose audioManager to window for non-module scripts
window.audioManager = audioManager;

// Initialize audio system
audioManager.init();
audioManager.loadAllSounds().then(() => {
    console.log('Audio system ready');
    // Start background music when audio is ready
    audioManager.playMusic('music');
});

// Add keyboard listener for R key to restart
document.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        if (gameState.isWon() || gameState.isLost()) {
            restart();
        }
    }
});

// Main game loop
function gameLoop(currentTime) {
    if (frameState.running) {
        // Calculate delta time
        const deltaTime = currentTime - frameState.lastTime;
        frameState.lastTime = currentTime;

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
