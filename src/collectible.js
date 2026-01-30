/**
 * Collectible class - represents treats and tennis balls the player can collect
 */
class Collectible {
    /**
     * Create a collectible
     * @param {Object} config - Configuration object
     * @param {number} config.x - X position
     * @param {number} config.y - Y position
     * @param {string} config.type - Type of collectible: 'treat' or 'tennis_ball'
     * @param {number} [config.value] - Points worth (default: 10 for treat, 50 for tennis_ball)
     */
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.type = config.type || 'treat';

        // Set default values based on type
        if (config.value !== undefined) {
            this.value = config.value;
        } else {
            this.value = this.type === 'tennis_ball' ? 50 : 10;
        }

        // Set dimensions based on type
        if (this.type === 'tennis_ball') {
            this.width = 20;
            this.height = 20;
        } else {
            this.width = 16;
            this.height = 12;
        }

        // State
        this.collected = false;

        // Animation state for bobbing motion
        this.bobOffset = 0;
        this.bobSpeed = 3; // pixels per second
        this.bobAmount = 8; // max offset in pixels
    }

    /**
     * Update collectible state (animation)
     * @param {number} deltaTime - Delta time in seconds
     */
    update(deltaTime) {
        if (this.collected) return;

        // Create a simple bobbing animation using sine wave
        this.bobOffset = Math.sin(Date.now() / 500) * this.bobAmount;
    }

    /**
     * Get the bounding box for collision detection
     * @returns {Object} Bounds object with x, y, width, height
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Mark this collectible as collected and return its point value
     * @returns {number} Point value of this collectible
     */
    collect() {
        this.collected = true;
        return this.value;
    }

    /**
     * Render the collectible
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} camera - Camera object with x and y offset
     */
    render(ctx, camera) {
        // Don't render if already collected
        if (this.collected) return;

        // Calculate screen position with camera offset
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + this.bobOffset;

        if (this.type === 'tennis_ball') {
            // Draw yellow circle for tennis ball
            ctx.fillStyle = '#FFD700'; // Gold/yellow
            ctx.beginPath();
            ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();

            // Add a subtle border
            ctx.strokeStyle = '#FFA500'; // Orange
            ctx.lineWidth = 1;
            ctx.stroke();
        } else {
            // Draw brown rectangle for treat
            ctx.fillStyle = '#8B6914'; // Brown/tan
            ctx.fillRect(screenX, screenY, this.width, this.height);

            // Add highlight
            ctx.fillStyle = 'rgba(255, 200, 100, 0.6)';
            ctx.fillRect(screenX + 2, screenY + 1, this.width - 4, 2);
        }
    }
}

export default Collectible;
