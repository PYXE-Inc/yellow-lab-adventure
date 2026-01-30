/**
 * Platform class - represents a single platform in the level
 */
class Platform {
    /**
     * Create a platform
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Platform width
     * @param {number} height - Platform height
     * @param {string} type - Platform type: 'ground', 'floating', or 'obstacle'
     */
    constructor(x, y, width, height, type = 'ground') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    /**
     * Check if a point is inside this platform
     * @param {number} px - Point X coordinate
     * @param {number} py - Point Y coordinate
     * @returns {boolean} True if point is inside platform
     */
    contains(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    /**
     * Get the top surface Y coordinate of the platform
     * @returns {number} Y coordinate of platform top
     */
    getTop() {
        return this.y;
    }
}

/**
 * Level class - manages the level layout and platforms
 */
class Level {
    /**
     * Create a level
     * @param {number} width - World width in pixels
     * @param {number} height - World height in pixels
     * @param {Array<Platform>} platforms - Array of platforms
     */
    constructor(width, height, platforms = []) {
        this.width = width;
        this.height = height;
        this.platforms = platforms;
    }

    /**
     * Get all platforms in the level
     * @returns {Array<Platform>} Array of all platforms
     */
    getPlatforms() {
        return this.platforms;
    }

    /**
     * Get world boundaries
     * @returns {{width: number, height: number}} World dimensions
     */
    getWorldBounds() {
        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Add a platform to the level
     * @param {Platform} platform - Platform to add
     */
    addPlatform(platform) {
        this.platforms.push(platform);
    }

    /**
     * Create a default platformer level with varied challenges
     * @returns {Level} A pre-built level ready to play
     */
    static createDefaultLevel() {
        const WORLD_WIDTH = 3000;
        const WORLD_HEIGHT = 600;
        const platforms = [];

        // Ground level platforms - create a varied ground with gaps
        // Starting safe zone
        platforms.push(new Platform(0, 500, 400, 100, 'ground'));

        // First gap (easy jump)
        platforms.push(new Platform(500, 500, 300, 100, 'ground'));

        // Second gap (medium difficulty)
        platforms.push(new Platform(900, 500, 250, 100, 'ground'));

        // Long ground section for a breather
        platforms.push(new Platform(1250, 500, 500, 100, 'ground'));

        // Challenging gap section
        platforms.push(new Platform(1850, 500, 200, 100, 'ground'));

        platforms.push(new Platform(2150, 500, 180, 100, 'ground'));

        // Final ground section
        platforms.push(new Platform(2450, 500, 550, 100, 'ground'));

        // Floating platforms - Low tier (easy to reach)
        platforms.push(new Platform(250, 380, 120, 20, 'floating'));
        platforms.push(new Platform(420, 350, 100, 20, 'floating'));
        platforms.push(new Platform(650, 380, 140, 20, 'floating'));

        // Floating platforms - Mid tier (requires good jump timing)
        platforms.push(new Platform(1000, 300, 100, 20, 'floating'));
        platforms.push(new Platform(1180, 280, 90, 20, 'floating'));
        platforms.push(new Platform(1400, 250, 120, 20, 'floating'));

        // Floating platforms - High tier (challenging)
        platforms.push(new Platform(1650, 220, 100, 20, 'floating'));
        platforms.push(new Platform(1850, 200, 80, 20, 'floating'));

        // Obstacle platforms - Small, tricky jumps
        platforms.push(new Platform(2050, 420, 60, 20, 'obstacle'));
        platforms.push(new Platform(2180, 380, 60, 20, 'obstacle'));
        platforms.push(new Platform(2300, 340, 60, 20, 'obstacle'));

        // Secret high platform (hard to reach, rewarding)
        platforms.push(new Platform(2600, 180, 150, 20, 'floating'));

        // Stepping stones over the last gap
        platforms.push(new Platform(2350, 450, 80, 15, 'obstacle'));

        // Mid-level platforms for variety
        platforms.push(new Platform(800, 400, 110, 20, 'floating'));
        platforms.push(new Platform(1550, 380, 100, 20, 'floating'));

        // Additional challenge platforms
        platforms.push(new Platform(2700, 320, 90, 20, 'floating'));
        platforms.push(new Platform(2850, 280, 100, 20, 'floating'));

        return new Level(WORLD_WIDTH, WORLD_HEIGHT, platforms);
    }

    /**
     * Render all platforms to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} offsetX - Camera X offset for scrolling
     * @param {number} offsetY - Camera Y offset for scrolling
     */
    render(ctx, offsetX = 0, offsetY = 0) {
        this.platforms.forEach(platform => {
            // Choose color based on platform type
            switch (platform.type) {
                case 'ground':
                    ctx.fillStyle = '#8B4513'; // Brown
                    break;
                case 'floating':
                    ctx.fillStyle = '#2E8B57'; // Sea green
                    break;
                case 'obstacle':
                    ctx.fillStyle = '#DC143C'; // Crimson red
                    break;
                default:
                    ctx.fillStyle = '#808080'; // Gray
            }

            // Draw platform with camera offset
            ctx.fillRect(
                platform.x - offsetX,
                platform.y - offsetY,
                platform.width,
                platform.height
            );

            // Add a subtle highlight for depth
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(
                platform.x - offsetX,
                platform.y - offsetY,
                platform.width,
                3
            );
        });
    }
}
