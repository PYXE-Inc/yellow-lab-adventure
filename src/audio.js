/**
 * AudioManager - Handles all sound loading and playback for the game
 * Uses Web Audio API for low-latency sound effects
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.musicGainNode = null;
        this.sfxGainNode = null;
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.initialized = false;
    }

    /**
     * Initialize AudioContext - must be called on user interaction
     */
    init() {
        if (this.initialized) {
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for volume control
            this.musicGainNode = this.audioContext.createGain();
            this.musicGainNode.gain.value = this.musicVolume;
            this.musicGainNode.connect(this.audioContext.destination);

            this.sfxGainNode = this.audioContext.createGain();
            this.sfxGainNode.gain.value = this.sfxVolume;
            this.sfxGainNode.connect(this.audioContext.destination);

            this.initialized = true;
            console.log('AudioManager initialized');
        } catch (error) {
            console.error('Failed to initialize AudioManager:', error);
        }
    }

    /**
     * Resume AudioContext if suspended (some browsers suspend it initially)
     */
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Load and decode an audio file
     * @param {string} name - Name to store the sound as
     * @param {string} url - URL of the audio file
     */
    async loadSound(name, url) {
        if (!this.initialized) {
            console.warn('AudioManager not initialized. Call init() first.');
            return;
        }

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.sounds.set(name, audioBuffer);
            console.log(`Loaded sound: ${name}`);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }

    /**
     * Play a loaded sound effect
     * @param {string} name - Name of the sound to play
     * @param {Object} options - Optional parameters
     * @param {number} options.volume - Volume multiplier (0-1)
     * @param {boolean} options.loop - Whether to loop the sound
     */
    playSound(name, options = {}) {
        if (!this.initialized) {
            console.warn('AudioManager not initialized. Call init() first.');
            return null;
        }

        this.resumeContext();

        const audioBuffer = this.sounds.get(name);
        if (!audioBuffer) {
            console.warn(`Sound not found: ${name}`);
            return null;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Apply volume if specified
        if (options.volume !== undefined) {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = options.volume;
            source.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
        } else {
            source.connect(this.sfxGainNode);
        }

        // Apply loop if specified
        if (options.loop) {
            source.loop = true;
        }

        source.start(0);
        return source;
    }

    /**
     * Start background music with looping
     * @param {string} name - Name of the music to play
     */
    playMusic(name) {
        if (!this.initialized) {
            console.warn('AudioManager not initialized. Call init() first.');
            return;
        }

        this.resumeContext();

        // Stop current music if playing
        this.stopMusic();

        const audioBuffer = this.sounds.get(name);
        if (!audioBuffer) {
            console.warn(`Music not found: ${name}`);
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(this.musicGainNode);
        source.start(0);

        this.currentMusic = source;
        console.log(`Playing music: ${name}`);
    }

    /**
     * Stop current background music
     */
    stopMusic() {
        if (this.currentMusic) {
            try {
                this.currentMusic.stop();
            } catch (error) {
                // Ignore errors if already stopped
            }
            this.currentMusic = null;
        }
    }

    /**
     * Adjust music volume
     * @param {number} level - Volume level (0-1)
     */
    setMusicVolume(level) {
        this.musicVolume = Math.max(0, Math.min(1, level));
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicVolume;
        }
    }

    /**
     * Adjust sound effects volume
     * @param {number} level - Volume level (0-1)
     */
    setSfxVolume(level) {
        this.sfxVolume = Math.max(0, Math.min(1, level));
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = this.sfxVolume;
        }
    }

    /**
     * Preload all game sounds
     */
    async loadAllSounds() {
        if (!this.initialized) {
            console.warn('AudioManager not initialized. Call init() first.');
            return;
        }

        const soundFiles = [
            { name: 'jump', url: 'assets/audio/jump.mp3' },
            { name: 'bark', url: 'assets/audio/bark.mp3' },
            { name: 'collect', url: 'assets/audio/collect.mp3' },
            { name: 'win', url: 'assets/audio/win.mp3' },
            { name: 'lose', url: 'assets/audio/lose.mp3' },
            { name: 'music', url: 'assets/audio/music.mp3' }
        ];

        const loadPromises = soundFiles.map(sound =>
            this.loadSound(sound.name, sound.url)
        );

        await Promise.all(loadPromises);
        console.log('All sounds loaded');
    }
}

// Export singleton instance
export const audioManager = new AudioManager();
