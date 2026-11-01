/**
 * FrameEngine - Main orchestrator that integrates all core modules
 *
 * The FrameEngine coordinates:
 * - Timer: Controls frame timing (FPS + hold)
 * - Sequencer: Manages frame navigation
 * - Loader: Loads and caches ImageBitmaps
 * - Renderer: Draws frames to canvas
 *
 * Public API:
 * - loadSequence(): Load images from sources
 * - play/pause/stop(): Control playback
 * - next/prev/jumpTo(): Manual navigation
 * - setFPS/setHold: Adjust timing
 * - Events: loaded, play, pause, stop, framechange, error
 */
import EventEmitter from 'eventemitter3';
import type { ImageSource, EngineState, RenderMode } from './types';
interface EngineConfig {
    fps?: number;
    hold?: number;
    preloadCount?: number;
    maxCacheSize?: number;
    mode?: RenderMode;
    alpha?: boolean;
    desynchronized?: boolean;
}
interface EngineEvents {
    'loaded': (data: {
        totalFrames: number;
    }) => void;
    'play': () => void;
    'pause': () => void;
    'stop': () => void;
    'framechange': (data: {
        index: number;
        total: number;
    }) => void;
    'error': (data: {
        message: string;
        error: Error;
    }) => void;
}
export declare class FrameEngine extends EventEmitter<EngineEvents> {
    private canvas;
    private timer;
    private sequencer;
    private loader;
    private renderer;
    private config;
    private playbackState;
    /**
     * Create a new FrameEngine
     * @param canvas - Canvas element to render to
     * @param config - Optional configuration
     */
    constructor(canvas: HTMLCanvasElement, config?: Partial<EngineConfig>);
    /**
     * Load a sequence of images
     * @param sources - Array of image sources
     */
    loadSequence(sources: ImageSource[]): Promise<void>;
    /**
     * Start playback
     */
    play(): void;
    /**
     * Pause playback
     */
    pause(): void;
    /**
     * Stop playback and reset to first frame
     */
    stop(): void;
    /**
     * Advance to next frame
     */
    next(): void;
    /**
     * Go to previous frame
     */
    prev(): void;
    /**
     * Jump to specific frame
     * @param index - Target frame index
     */
    jumpTo(index: number): void;
    /**
     * Set FPS (can be called while playing)
     * @param fps - New FPS value
     */
    setFPS(fps: number): void;
    /**
     * Set hold frames (can be called while playing)
     * @param hold - New hold frames value
     */
    setHold(hold: number): void;
    /**
     * Set render mode
     * @param mode - New render mode
     */
    setRenderMode(mode: RenderMode): void;
    /**
     * Get current engine state
     */
    getState(): EngineState;
    /**
     * Clean up resources
     */
    cleanup(): void;
    /**
     * Advance frame during playback
     */
    private advanceFrame;
    /**
     * Render current frame to canvas
     */
    private renderCurrentFrame;
    /**
     * Preload images around current frame
     */
    private preloadAround;
    /**
     * Emit framechange event
     */
    private emitFrameChange;
    /**
     * Ensure sequence is loaded before operations
     */
    private ensureSequenceLoaded;
}
export {};
//# sourceMappingURL=FrameEngine.d.ts.map