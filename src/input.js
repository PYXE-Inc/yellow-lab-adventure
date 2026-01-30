// Input handler module
// Tracks keyboard state and maps keys to logical actions

const Input = {
    // Internal state tracking
    _keys: {},

    // Action mappings
    _actionMap: {
        'left': ['ArrowLeft', 'a', 'A'],
        'right': ['ArrowRight', 'd', 'D'],
        'up': ['ArrowUp', 'w', 'W'],
        'down': ['ArrowDown', 's', 'S'],
        'jump': ['ArrowUp', 'w', 'W', ' ']
    },

    // Keys that should prevent default behavior
    _preventDefaultKeys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '],

    // Check if an action is currently pressed
    isKeyDown(action) {
        const keys = this._actionMap[action];
        if (!keys) return false;

        return keys.some(key => this._keys[key]);
    },

    // Internal: Handle keydown event
    _handleKeyDown(e) {
        this._keys[e.key] = true;

        // Prevent default for game keys to stop page scrolling
        if (this._preventDefaultKeys.includes(e.key)) {
            e.preventDefault();
        }
    },

    // Internal: Handle keyup event
    _handleKeyUp(e) {
        this._keys[e.key] = false;
    },

    // Initialize event listeners
    _init() {
        window.addEventListener('keydown', (e) => this._handleKeyDown(e));
        window.addEventListener('keyup', (e) => this._handleKeyUp(e));
    }
};

// Initialize listeners on module load
Input._init();
