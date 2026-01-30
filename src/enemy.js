/**
 * Enemy class for Yellow Lab Adventure
 * Represents patrolling enemies (squirrels and cats)
 */
class Enemy {
  /**
   * Create an enemy
   * @param {Object} config - Configuration object
   * @param {number} config.x - Starting x position
   * @param {number} config.y - Starting y position
   * @param {string} config.type - Enemy type ('squirrel' or 'cat')
   * @param {number} [config.patrolStart] - Left patrol boundary (defaults to x - 100)
   * @param {number} [config.patrolEnd] - Right patrol boundary (defaults to x + 100)
   */
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = 48;
    this.height = 48;
    this.type = config.type; // 'squirrel' or 'cat'

    // Set patrol boundaries (default ±100px from starting position)
    this.patrolStart = config.patrolStart !== undefined ? config.patrolStart : config.x - 100;
    this.patrolEnd = config.patrolEnd !== undefined ? config.patrolEnd : config.x + 100;

    // Enemy speeds (pixels per second)
    const speeds = {
      squirrel: 80,
      cat: 50
    };
    this.speed = speeds[config.type] || 50;

    // Direction: -1 = left, 1 = right
    this.velocityX = -1 * this.speed;

    // Active state
    this.active = true;
  }

  /**
   * Update enemy position and patrol behavior
   * @param {number} deltaTime - Time elapsed since last frame (in seconds)
   */
  update(deltaTime) {
    if (!this.active) return;

    // Move enemy
    this.x += this.velocityX * deltaTime;

    // Check patrol bounds and reverse direction
    if (this.x <= this.patrolStart) {
      this.x = this.patrolStart;
      this.velocityX = this.speed; // Move right
    } else if (this.x >= this.patrolEnd) {
      this.x = this.patrolEnd;
      this.velocityX = -this.speed; // Move left
    }
  }

  /**
   * Get collision bounds for this enemy
   * @returns {Object} Bounds object {x, y, width, height}
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
   * Render the enemy on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} camera - Camera object with getOffset() method
   */
  render(ctx, camera) {
    if (!this.active) return;

    const offset = camera.getOffset();
    const screenX = this.x + offset.x;
    const screenY = this.y + offset.y;

    // Color based on type
    const colors = {
      squirrel: '#808080', // Gray
      cat: '#FFA500'       // Orange
    };
    const color = colors[this.type] || '#808080';

    // Draw as a simple rectangle
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, this.width, this.height);

    // Optional: Draw a border for clarity
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX, screenY, this.width, this.height);
  }
}
