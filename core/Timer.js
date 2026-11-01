"use strict";
/**
 * Timer module - Manages frame timing with configurable FPS and hold frames
 *
 * The Timer controls when to switch between frames based on:
 * - FPS (frames per second): How many display frames happen per second
 * - Hold frames: How many display frames to show each image before switching
 *
 * Effective frequency = FPS / holdFrames (in Hz)
 *
 * Example: 60 FPS with 6 hold frames = 10 Hz alternation (100ms per image)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    /**
     * Create a new Timer
     * @param fps - Frames per second (must be > 0)
     * @param holdFrames - Number of frames to hold each image (must be >= 1)
     */
    constructor(fps, holdFrames) {
        this.running = false;
        this.frameId = null;
        this.callback = null;
        this.lastSwitchTime = 0;
        this.frameCount = 0;
        /**
         * Main tick function called by requestAnimationFrame
         */
        this.tick = (timestamp) => {
            if (!this.running) {
                return;
            }
            const elapsed = timestamp - this.lastSwitchTime;
            const interval = (this.holdFrames / this.fps) * 1000; // Convert to milliseconds
            // Switch frame when enough time has passed
            if (elapsed >= interval) {
                if (this.callback) {
                    this.callback(this.frameCount);
                }
                this.frameCount++;
                this.lastSwitchTime = timestamp;
            }
            // Schedule next tick
            this.frameId = requestAnimationFrame(this.tick);
        };
        this.validateFPS(fps);
        this.validateHold(holdFrames);
        this.fps = fps;
        this.holdFrames = holdFrames;
    }
    /**
     * Get current FPS setting
     */
    getFPS() {
        return this.fps;
    }
    /**
     * Get current hold frames setting
     */
    getHold() {
        return this.holdFrames;
    }
    /**
     * Calculate effective alternation frequency in Hz
     * Formula: fps / holdFrames
     */
    getEffectiveFrequency() {
        return this.fps / this.holdFrames;
    }
    /**
     * Check if timer is currently running
     */
    isRunning() {
        return this.running;
    }
    /**
     * Start the timer
     * @param callback - Function to call on each frame switch
     */
    start(callback) {
        if (this.running) {
            throw new Error('Timer is already running');
        }
        this.callback = callback;
        this.running = true;
        this.frameCount = 0;
        this.lastSwitchTime = performance.now();
        this.tick(this.lastSwitchTime);
    }
    /**
     * Stop the timer
     */
    stop() {
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.running = false;
        this.callback = null;
    }
    /**
     * Update FPS (can be called while running)
     * @param fps - New FPS value
     */
    setFPS(fps) {
        this.validateFPS(fps);
        this.fps = fps;
    }
    /**
     * Update hold frames (can be called while running)
     * @param holdFrames - New hold frames value
     */
    setHold(holdFrames) {
        this.validateHold(holdFrames);
        this.holdFrames = holdFrames;
    }
    /**
     * Validate FPS value
     */
    validateFPS(fps) {
        if (fps <= 0) {
            throw new Error('FPS must be greater than 0');
        }
    }
    /**
     * Validate hold frames value
     */
    validateHold(holdFrames) {
        if (holdFrames < 1) {
            throw new Error('Hold frames must be at least 1');
        }
    }
}
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map