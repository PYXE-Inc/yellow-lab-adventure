// Camera class for side-scrolling platformer
class Camera {
    /**
     * Create a new camera
     * @param {number} viewportWidth - Width of the visible viewport
     * @param {number} viewportHeight - Height of the visible viewport
     */
    constructor(viewportWidth, viewportHeight) {
        // Viewport dimensions
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        // Camera position (top-left of viewport in world space)
        this.x = 0;
        this.y = 0;

        // Target to follow
        this.target = null;

        // Dead zone - area in center where target can move without moving camera
        this.deadZoneWidth = viewportWidth * 0.25; // 25% of viewport width
        this.deadZoneHeight = viewportHeight * 0.15; // 15% of viewport height

        // Smoothing factor for lerp (lower = smoother, higher = more responsive)
        this.smoothing = 0.1;

        // World bounds (optional - set via setBounds method)
        this.worldBounds = {
            minX: 0,
            minY: 0,
            maxX: Infinity,
            maxY: Infinity
        };
    }

    /**
     * Set the target entity for the camera to follow
     * @param {Object} target - Target object with x, y, width, height properties
     */
    follow(target) {
        this.target = target;
    }

    /**
     * Set world bounds to constrain camera movement
     * @param {number} minX - Minimum X coordinate
     * @param {number} minY - Minimum Y coordinate
     * @param {number} maxX - Maximum X coordinate
     * @param {number} maxY - Maximum Y coordinate
     */
    setBounds(minX, minY, maxX, maxY) {
        this.worldBounds = { minX, minY, maxX, maxY };
    }

    /**
     * Update camera position to follow target
     */
    update() {
        if (!this.target) {
            return;
        }

        // Calculate target center position
        const targetCenterX = this.target.x + this.target.width / 2;
        const targetCenterY = this.target.y + this.target.height / 2;

        // Calculate desired camera position (centered on target)
        let desiredX = targetCenterX - this.viewportWidth / 2;
        let desiredY = targetCenterY - this.viewportHeight / 2;

        // Apply dead zone logic
        const deadZoneLeft = this.x + (this.viewportWidth - this.deadZoneWidth) / 2;
        const deadZoneRight = deadZoneLeft + this.deadZoneWidth;
        const deadZoneTop = this.y + (this.viewportHeight - this.deadZoneHeight) / 2;
        const deadZoneBottom = deadZoneTop + this.deadZoneHeight;

        // Only move camera if target is outside dead zone
        if (targetCenterX < deadZoneLeft) {
            desiredX = targetCenterX - (this.viewportWidth - this.deadZoneWidth) / 2 - this.deadZoneWidth / 2;
        } else if (targetCenterX > deadZoneRight) {
            desiredX = targetCenterX - (this.viewportWidth - this.deadZoneWidth) / 2 - this.deadZoneWidth / 2;
        } else {
            desiredX = this.x; // Stay in place horizontally
        }

        if (targetCenterY < deadZoneTop) {
            desiredY = targetCenterY - (this.viewportHeight - this.deadZoneHeight) / 2 - this.deadZoneHeight / 2;
        } else if (targetCenterY > deadZoneBottom) {
            desiredY = targetCenterY - (this.viewportHeight - this.deadZoneHeight) / 2 - this.deadZoneHeight / 2;
        } else {
            desiredY = this.y; // Stay in place vertically
        }

        // Apply smoothing with lerp
        this.x = this.lerp(this.x, desiredX, this.smoothing);
        this.y = this.lerp(this.y, desiredY, this.smoothing);

        // Constrain to world bounds
        this.x = Math.max(this.worldBounds.minX, Math.min(this.x, this.worldBounds.maxX - this.viewportWidth));
        this.y = Math.max(this.worldBounds.minY, Math.min(this.y, this.worldBounds.maxY - this.viewportHeight));
    }

    /**
     * Linear interpolation helper
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * Get the camera offset for rendering
     * @returns {Object} Object with x and y offset values
     */
    getOffset() {
        return {
            x: -this.x,
            y: -this.y
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} World coordinates {x, y}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}
