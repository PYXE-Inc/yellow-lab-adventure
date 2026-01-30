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

        // Animation
        this.animator = new SpriteAnimator('assets/lab-spritesheet.png', 48, 48);
    }

    /**
     * Update player state based on input
     * @param {number} dt - Delta time in seconds
     * @param {Object} input - Input state object with left, right, jump properties
     */
    update(dt, input) {
        // Horizontal movement
        const isMoving = input.left || input.right;

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

        // Select animation based on player state
        this.updateAnimation(isMoving);

        // Update animator
        this.animator.update(dt);
    }

    /**
     * Select the appropriate animation based on player state
     * @param {boolean} isMoving - Whether the player is moving horizontally
     */
    updateAnimation(isMoving) {
        if (!this.isGrounded) {
            // In air - check if jumping (going up) or falling (going down)
            if (this.vy < 0) {
                this.animator.setAnimation('jump');
            } else {
                this.animator.setAnimation('fall');
            }
        } else {
            // On ground - check if moving or idle
            if (isMoving) {
                this.animator.setAnimation('run');
            } else {
                this.animator.setAnimation('idle');
            }
        }
    }

    /**
     * Render the player
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        // Flip sprite when facing left
        const flipX = this.facingDirection === -1;
        this.animator.render(ctx, this.x, this.y, flipX);
    }
}
