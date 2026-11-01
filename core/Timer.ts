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

export class Timer {
  private fps: number;
  private holdFrames: number;
  private running: boolean = false;
  private frameId: number | null = null;
  private callback: TimerCallback | null = null;
  private lastSwitchTime: number = 0;
  private frameCount: number = 0;

  /**
   * Create a new Timer
   * @param fps - Frames per second (must be > 0)
   * @param holdFrames - Number of frames to hold each image (must be >= 1)
   */
  constructor(fps: number, holdFrames: number) {
    this.validateFPS(fps);
    this.validateHold(holdFrames);
    
    this.fps = fps;
    this.holdFrames = holdFrames;
  }

  /**
   * Get current FPS setting
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get current hold frames setting
   */
  getHold(): number {
    return this.holdFrames;
  }

  /**
   * Calculate effective alternation frequency in Hz
   * Formula: fps / holdFrames
   */
  getEffectiveFrequency(): number {
    return this.fps / this.holdFrames;
  }

  /**
   * Check if timer is currently running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Start the timer
   * @param callback - Function to call on each frame switch
   */
  start(callback: TimerCallback): void {
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
  stop(): void {
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
  setFPS(fps: number): void {
    this.validateFPS(fps);
    this.fps = fps;
  }

  /**
   * Update hold frames (can be called while running)
   * @param holdFrames - New hold frames value
   */
  setHold(holdFrames: number): void {
    this.validateHold(holdFrames);
    this.holdFrames = holdFrames;
  }

  /**
   * Main tick function called by requestAnimationFrame
   */
  private tick = (timestamp: number): void => {
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

  /**
   * Validate FPS value
   */
  private validateFPS(fps: number): void {
    if (fps <= 0) {
      throw new Error('FPS must be greater than 0');
    }
  }

  /**
   * Validate hold frames value
   */
  private validateHold(holdFrames: number): void {
    if (holdFrames < 1) {
      throw new Error('Hold frames must be at least 1');
    }
  }
}
