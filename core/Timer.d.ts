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
import type { TimerCallback } from './types';
export declare class Timer {
    private fps;
    private holdFrames;
    private running;
    private frameId;
    private callback;
    private lastSwitchTime;
    private frameCount;
    /**
     * Create a new Timer
     * @param fps - Frames per second (must be > 0)
     * @param holdFrames - Number of frames to hold each image (must be >= 1)
     */
    constructor(fps: number, holdFrames: number);
    /**
     * Get current FPS setting
     */
    getFPS(): number;
    /**
     * Get current hold frames setting
     */
    getHold(): number;
    /**
     * Calculate effective alternation frequency in Hz
     * Formula: fps / holdFrames
     */
    getEffectiveFrequency(): number;
    /**
     * Check if timer is currently running
     */
    isRunning(): boolean;
    /**
     * Start the timer
     * @param callback - Function to call on each frame switch
     */
    start(callback: TimerCallback): void;
    /**
     * Stop the timer
     */
    stop(): void;
    /**
     * Update FPS (can be called while running)
     * @param fps - New FPS value
     */
    setFPS(fps: number): void;
    /**
     * Update hold frames (can be called while running)
     * @param holdFrames - New hold frames value
     */
    setHold(holdFrames: number): void;
    /**
     * Main tick function called by requestAnimationFrame
     */
    private tick;
    /**
     * Validate FPS value
     */
    private validateFPS;
    /**
     * Validate hold frames value
     */
    private validateHold;
}
//# sourceMappingURL=Timer.d.ts.map