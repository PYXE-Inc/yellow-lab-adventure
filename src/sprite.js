// SpriteAnimator class - handles sprite animation loading, timing, and rendering
class SpriteAnimator {
    constructor(imagePath, frameWidth, frameHeight) {
        // Spritesheet properties
        this.image = new Image();
        this.image.src = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.imageLoaded = false;

        // Set loaded flag when image loads
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        // Animation definitions: name -> array of frame indices
        this.animations = {
            idle: [0],
            run: [1, 2, 3, 4],
            jump: [5],
            fall: [6]
        };

        // Animation state
        this.currentAnimation = 'idle';
        this.currentFrameIndex = 0; // Index in the animation array
        this.frameTimer = 0;
        this.frameDuration = 100; // milliseconds per frame (for run animation)
    }

    /**
     * Set the current animation
     * @param {string} animationName - Name of the animation to play
     */
    setAnimation(animationName) {
        // Only change if it's a different animation
        if (this.currentAnimation !== animationName && this.animations[animationName]) {
            this.currentAnimation = animationName;
            this.currentFrameIndex = 0;
            this.frameTimer = 0;
        }
    }

    /**
     * Update animation timing
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        const animation = this.animations[this.currentAnimation];

        // Only advance frames if animation has multiple frames
        if (animation.length > 1) {
            this.frameTimer += dt * 1000; // Convert to milliseconds

            // Advance to next frame when timer exceeds duration
            if (this.frameTimer >= this.frameDuration) {
                this.frameTimer = 0;
                this.currentFrameIndex = (this.currentFrameIndex + 1) % animation.length;
            }
        }
    }

    /**
     * Get the current frame number from the spritesheet
     * @returns {number} The frame index in the spritesheet
     */
    getCurrentFrame() {
        const animation = this.animations[this.currentAnimation];
        return animation[this.currentFrameIndex];
    }

    /**
     * Render the current frame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} x - X position to render at
     * @param {number} y - Y position to render at
     * @param {boolean} flipX - Whether to flip horizontally (for facing direction)
     */
    render(ctx, x, y, flipX = false) {
        if (!this.imageLoaded) {
            // Fallback: render colored rectangle with animation state label
            this.renderFallback(ctx, x, y);
            return;
        }

        const frame = this.getCurrentFrame();

        // Calculate source position in spritesheet (assuming horizontal layout)
        const sx = frame * this.frameWidth;
        const sy = 0;

        ctx.save();

        // Apply horizontal flip if needed
        if (flipX) {
            ctx.translate(x + this.frameWidth, y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                sx, sy, this.frameWidth, this.frameHeight,
                0, 0, this.frameWidth, this.frameHeight
            );
        } else {
            ctx.drawImage(
                this.image,
                sx, sy, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth, this.frameHeight
            );
        }

        ctx.restore();
    }

    /**
     * Fallback rendering when sprite is not loaded
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} x - X position to render at
     * @param {number} y - Y position to render at
     */
    renderFallback(ctx, x, y) {
        // Animation state colors
        const colors = {
            idle: '#F4D03F',    // Yellow
            run: '#F39C12',     // Orange
            jump: '#3498DB',    // Blue
            fall: '#9B59B6'     // Purple
        };

        // Draw colored rectangle
        ctx.fillStyle = colors[this.currentAnimation] || '#F4D03F';
        ctx.fillRect(x, y, this.frameWidth, this.frameHeight);

        // Draw animation state label
        ctx.fillStyle = '#000';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.currentAnimation.toUpperCase(),
            x + this.frameWidth / 2,
            y + this.frameHeight / 2
        );
    }
}
