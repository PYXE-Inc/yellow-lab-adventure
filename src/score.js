// Score class for tracking and displaying player score
class Score {
    /**
     * Create a new Score tracker
     */
    constructor() {
        this.current = 0;
        this.highScore = this.loadHighScore();
    }

    /**
     * Load high score from localStorage
     * @returns {number} The saved high score, or 0 if none exists
     */
    loadHighScore() {
        const saved = localStorage.getItem('yellowLabHighScore');
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * Add points to the current score
     * @param {number} points - Number of points to add
     */
    add(points) {
        this.current += points;
    }

    /**
     * Reset current score to 0 (keeps highScore)
     */
    reset() {
        this.current = 0;
    }

    /**
     * Save high score to localStorage if current score is higher
     */
    saveHighScore() {
        if (this.current > this.highScore) {
            this.highScore = this.current;
            localStorage.setItem('yellowLabHighScore', this.highScore);
        }
    }

    /**
     * Render the score display in the top-left corner
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    render(ctx) {
        // Save context state to avoid affecting other renders
        ctx.save();

        // Use fixed font and size
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';

        // Draw black outline/shadow for readability
        ctx.fillStyle = '#000000';
        ctx.fillText(`Score: ${this.current}`, 12, 32);
        ctx.fillText(`Best: ${this.highScore}`, 12, 62);

        // Draw white text on top
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Score: ${this.current}`, 10, 30);
        ctx.fillText(`Best: ${this.highScore}`, 10, 60);

        // Restore context state
        ctx.restore();
    }
}
