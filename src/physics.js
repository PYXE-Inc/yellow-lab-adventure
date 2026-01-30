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

/**
 * Check platform collision for one-way platforms
 * @param {Object} entity - Entity with {x, y, width, height, velocityY} properties
 * @param {Array} platforms - Array of platform objects with {x, y, width, height}
 * @returns {Object} Collision info: {grounded: boolean, correctedY: number}
 */
function checkPlatformCollision(entity, platforms) {
    let grounded = false;
    let correctedY = entity.y;

    // Only check collision when falling
    if (entity.velocityY <= 0) {
        return { grounded, correctedY };
    }

    for (const platform of platforms) {
        // AABB collision detection
        const entityBottom = entity.y + entity.height;
        const entityTop = entity.y;
        const entityLeft = entity.x;
        const entityRight = entity.x + entity.width;

        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        // Check horizontal overlap
        const horizontalOverlap = entityRight > platformLeft && entityLeft < platformRight;

        // Check if entity is landing on top of platform
        // Only trigger if previously above the platform and now intersecting
        const landingOnTop = entityBottom >= platformTop &&
                             entityTop < platformTop &&
                             horizontalOverlap;

        if (landingOnTop) {
            // Snap to platform top
            correctedY = platformTop - entity.height;
            grounded = true;
            break; // Stop checking once we find a collision
        }
    }

    return { grounded, correctedY };
}
