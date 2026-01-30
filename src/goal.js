/**
 * Goal class - represents the doghouse that completes the level
 */
class Goal {
    /**
     * Create a goal
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Size
        this.width = 64;
        this.height = 64;
    }

    /**
     * Check collision between the player and this goal
     * @param {Player} player - The player object
     * @returns {boolean} True if player is colliding with the goal
     */
    checkCollision(player) {
        // AABB (Axis-Aligned Bounding Box) collision detection
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }

    /**
     * Render the goal (doghouse)
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} cameraX - Camera X offset
     */
    render(ctx, cameraX) {
        // Calculate screen position with camera offset
        const screenX = this.x - cameraX;
        const screenY = this.y;

        // Draw doghouse walls (tan/brown rectangle)
        ctx.fillStyle = '#D2B48C'; // Tan color
        ctx.fillRect(screenX + 8, screenY + 20, 48, 32);

        // Draw roof (triangle)
        ctx.fillStyle = '#8B4513'; // Saddle brown
        ctx.beginPath();
        ctx.moveTo(screenX + 8, screenY + 20); // Left corner
        ctx.lineTo(screenX + 32, screenY); // Peak
        ctx.lineTo(screenX + 56, screenY + 20); // Right corner
        ctx.closePath();
        ctx.fill();

        // Draw door (dark brown rectangle)
        ctx.fillStyle = '#654321'; // Dark brown
        ctx.fillRect(screenX + 24, screenY + 40, 16, 12);

        // Draw door handle (small circle)
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.beginPath();
        ctx.arc(screenX + 38, screenY + 46, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default Goal;
