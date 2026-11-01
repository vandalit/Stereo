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
import { Timer } from './Timer';
import { Sequencer } from './Sequencer';
import { Loader } from './Loader';
import { Renderer } from './Renderer';
import type { 
  ImageSource, 
  EngineState, 
  PlaybackState,
  RenderMode,
  LoaderConfig,
  RendererConfig 
} from './types';

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
  'loaded': (data: { totalFrames: number }) => void;
  'play': () => void;
  'pause': () => void;
  'stop': () => void;
  'framechange': (data: { index: number; total: number }) => void;
  'error': (data: { message: string; error: Error }) => void;
}

const DEFAULT_CONFIG: Required<EngineConfig> = {
  fps: 60,
  hold: 6,
  preloadCount: 3,
  maxCacheSize: 10,
  mode: 'fill',
  alpha: false,
  desynchronized: false
};

export class FrameEngine extends EventEmitter<EngineEvents> {
  private canvas: HTMLCanvasElement;
  private timer: Timer;
  private sequencer: Sequencer | null = null;
  private loader: Loader;
  private renderer: Renderer;
  private config: Required<EngineConfig>;
  private playbackState: PlaybackState = 'idle';

  /**
   * Create a new FrameEngine
   * @param canvas - Canvas element to render to
   * @param config - Optional configuration
   */
  constructor(canvas: HTMLCanvasElement, config: Partial<EngineConfig> = {}) {
    super();

    if (!canvas) {
      throw new Error('Canvas element is required');
    }

    this.canvas = canvas;
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize modules
    this.timer = new Timer(this.config.fps, this.config.hold);
    
    this.loader = new Loader({
      preloadCount: this.config.preloadCount,
      maxCacheSize: this.config.maxCacheSize
    });

    this.renderer = new Renderer(canvas, {
      mode: this.config.mode,
      alpha: this.config.alpha,
      desynchronized: this.config.desynchronized
    });

    // Wire up loader events
    this.loader.on('error', (data) => {
      this.emit('error', {
        message: `Failed to load image at index ${data.index}`,
        error: data.error
      });
    });
  }

  /**
   * Load a sequence of images
   * @param sources - Array of image sources
   */
  async loadSequence(sources: ImageSource[]): Promise<void> {
    this.playbackState = 'loading';

    try {
      // Load images
      await this.loader.loadSequence(sources, 0);

      // Initialize sequencer with correct length
      this.sequencer = new Sequencer(sources.length, 0);

      // Render first frame
      this.renderCurrentFrame();

      this.playbackState = 'loaded';
      this.emit('loaded', { totalFrames: sources.length });
    } catch (error) {
      this.playbackState = 'idle';
      throw error;
    }
  }

  /**
   * Start playback
   */
  play(): void {
    this.ensureSequenceLoaded();

    if (this.playbackState === 'playing') {
      return; // Already playing
    }

    this.playbackState = 'playing';
    
    this.timer.start(() => {
      this.advanceFrame();
    });

    this.emit('play');
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.playbackState !== 'playing') {
      return;
    }

    this.timer.stop();
    this.playbackState = 'paused';
    this.emit('pause');
  }

  /**
   * Stop playback and reset to first frame
   */
  stop(): void {
    if (this.playbackState === 'idle') {
      return;
    }

    this.timer.stop();
    
    if (this.sequencer) {
      this.sequencer.reset();
      this.renderCurrentFrame();
    }

    this.playbackState = 'stopped';
    this.emit('stop');
  }

  /**
   * Advance to next frame
   */
  next(): void {
    this.ensureSequenceLoaded();
    this.sequencer!.next();
    this.renderCurrentFrame();
    this.emitFrameChange();
    this.preloadAround();
  }

  /**
   * Go to previous frame
   */
  prev(): void {
    this.ensureSequenceLoaded();
    this.sequencer!.prev();
    this.renderCurrentFrame();
    this.emitFrameChange();
    this.preloadAround();
  }

  /**
   * Jump to specific frame
   * @param index - Target frame index
   */
  jumpTo(index: number): void {
    this.ensureSequenceLoaded();
    this.sequencer!.jumpTo(index);
    this.renderCurrentFrame();
    this.emitFrameChange();
    this.preloadAround();
  }

  /**
   * Set FPS (can be called while playing)
   * @param fps - New FPS value
   */
  setFPS(fps: number): void {
    this.timer.setFPS(fps);
    this.config.fps = fps;
  }

  /**
   * Set hold frames (can be called while playing)
   * @param hold - New hold frames value
   */
  setHold(hold: number): void {
    this.timer.setHold(hold);
    this.config.hold = hold;
  }

  /**
   * Set render mode
   * @param mode - New render mode
   */
  setRenderMode(mode: RenderMode): void {
    this.renderer.setMode(mode);
    this.config.mode = mode;
    
    // Re-render with new mode if sequence is loaded
    if (this.sequencer) {
      this.renderCurrentFrame();
    }
  }

  /**
   * Get current engine state
   */
  getState(): EngineState {
    return {
      state: this.playbackState,
      currentFrame: this.sequencer?.getCurrent() ?? 0,
      totalFrames: this.sequencer?.getTotal() ?? 0,
      fps: this.config.fps,
      hold: this.config.hold,
      effectiveFrequency: this.timer.getEffectiveFrequency()
    };
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stop();
    this.loader.cleanup();
    this.sequencer = null;
    this.playbackState = 'idle';
  }

  /**
   * Advance frame during playback
   */
  private advanceFrame(): void {
    if (!this.sequencer || this.playbackState !== 'playing') {
      return;
    }

    this.sequencer.next();
    this.renderCurrentFrame();
    this.emitFrameChange();
    this.preloadAround();
  }

  /**
   * Render current frame to canvas
   */
  private renderCurrentFrame(): void {
    if (!this.sequencer) {
      return;
    }

    const currentIndex = this.sequencer.getCurrent();
    const bitmap = this.loader.getBitmap(currentIndex);

    if (bitmap) {
      this.renderer.clear();
      this.renderer.render(bitmap);
    }
  }

  /**
   * Preload images around current frame
   */
  private preloadAround(): void {
    if (!this.sequencer) {
      return;
    }

    const currentIndex = this.sequencer.getCurrent();
    this.loader.preloadAround(currentIndex, this.config.preloadCount);
  }

  /**
   * Emit framechange event
   */
  private emitFrameChange(): void {
    if (!this.sequencer) {
      return;
    }

    this.emit('framechange', {
      index: this.sequencer.getCurrent(),
      total: this.sequencer.getTotal()
    });
  }

  /**
   * Ensure sequence is loaded before operations
   */
  private ensureSequenceLoaded(): void {
    if (!this.sequencer || this.playbackState === 'idle') {
      throw new Error('No sequence loaded');
    }
  }
}
