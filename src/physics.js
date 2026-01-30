// Physics constants
const GRAVITY = 1200; // pixels/sec²

/**
 * Apply gravity to an entity
 * @param {Object} entity - Entity with vy and MAX_FALL_SPEED properties
 * @param {number} dt - Delta time in seconds
 */
function applyGravity(entity, dt) {
    entity.vy += GRAVITY * dt;

    // Cap fall speed
    if (entity.vy > entity.MAX_FALL_SPEED) {
        entity.vy = entity.MAX_FALL_SPEED;
    }
}

/**
 * Check and resolve ground collision
 * @param {Object} entity - Entity with y, height, vy, and isGrounded properties
 * @param {number} groundLevel - Y coordinate of the ground
 */
function checkGroundCollision(entity, groundLevel) {
    if (entity.y + entity.height > groundLevel) {
        // Snap to ground
        entity.y = groundLevel - entity.height;
        entity.vy = 0;
        entity.isGrounded = true;
    } else {
        entity.isGrounded = false;
    }
}
