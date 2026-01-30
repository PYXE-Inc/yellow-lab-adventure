// Player class
class Player {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // Size
        this.width = 48;
        this.height = 48;

        // Movement constants
        this.MOVE_SPEED = 300; // pixels/sec
        this.JUMP_FORCE = -500; // pixels/sec (negative = up)
        this.MAX_FALL_SPEED = 600; // pixels/sec

        // State
        this.isGrounded = false;
        this.facingDirection = 1; // 1 = right, -1 = left
    }

    /**
     * Update player state based on input
     * @param {number} dt - Delta time in seconds
     * @param {Object} input - Input state object with left, right, jump properties
     */
    update(dt, input) {
        // Horizontal movement
        if (input.left) {
            this.vx = -this.MOVE_SPEED;
            this.facingDirection = -1;
        } else if (input.right) {
            this.vx = this.MOVE_SPEED;
            this.facingDirection = 1;
        } else {
            this.vx = 0;
        }

        // Jump - only when grounded
        if (input.jump && this.isGrounded) {
            this.vy = this.JUMP_FORCE;
            this.isGrounded = false;
        }

        // Apply horizontal velocity
        this.x += this.vx * dt;
    }

    /**
     * Render the player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        ctx.fillStyle = '#F4D03F'; // Yellow color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
