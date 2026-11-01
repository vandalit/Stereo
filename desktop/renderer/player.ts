/**
 * Player Renderer Script
 * 
 * Fullscreen canvas player using FrameEngine
 */

import { FrameEngine } from '../../core/FrameEngine';
import type { RenderMode } from '../../core/types';

class PlayerUI {
  private engine: FrameEngine | null = null;
  private images: string[] = [];
  private isPlaying: boolean = false;
  private idleTimeout: number | null = null;
  private currentMode: RenderMode = 'fill';

  // DOM elements
  private canvas: HTMLCanvasElement;
  private controlsOverlay: HTMLDivElement;
  private playPauseBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private fpsSlider: HTMLInputElement;
  private holdSlider: HTMLInputElement;
  private fpsValue: HTMLSpanElement;
  private holdValue: HTMLSpanElement;
  private frameInfo: HTMLDivElement;
  private playIcon: HTMLElement;
  private pauseIcon: HTMLElement;

  constructor() {
    // Get DOM elements
    this.canvas = document.getElementById('playerCanvas') as HTMLCanvasElement;
    this.controlsOverlay = document.getElementById('controlsOverlay') as HTMLDivElement;
    this.playPauseBtn = document.getElementById('playPauseBtn') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    this.fpsSlider = document.getElementById('fpsSlider') as HTMLInputElement;
    this.holdSlider = document.getElementById('holdSlider') as HTMLInputElement;
    this.fpsValue = document.getElementById('fpsValue') as HTMLSpanElement;
    this.holdValue = document.getElementById('holdValue') as HTMLSpanElement;
    this.frameInfo = document.getElementById('frameInfo') as HTMLDivElement;
    this.playIcon = document.getElementById('playIcon')!;
    this.pauseIcon = document.getElementById('pauseIcon')!;

    this.setupCanvas();
    this.setupEventListeners();
    this.setupIPC();
    this.startIdleTimer();
  }

  private setupCanvas(): void {
    // Match canvas to window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      // Re-render current frame after resize
      if (this.engine) {
        const state = this.engine.getState();
        if (state.totalFrames > 0) {
          this.engine.jumpTo(state.currentFrame);
        }
      }
    });
  }

  private setupEventListeners(): void {
    // Play/Pause button
    this.playPauseBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    // Stop button
    this.stopBtn.addEventListener('click', () => {
      this.stop();
      window.stereoAPI.closePlayer();
    });

    // FPS slider
    this.fpsSlider.addEventListener('input', () => {
      const fps = parseInt(this.fpsSlider.value, 10);
      this.fpsValue.textContent = fps.toString();
      if (this.engine) {
        this.engine.setFPS(fps);
      }
    });

    // Hold slider
    this.holdSlider.addEventListener('input', () => {
      const hold = parseInt(this.holdSlider.value, 10);
      this.holdValue.textContent = hold.toString();
      if (this.engine) {
        this.engine.setHold(hold);
      }
    });

    // Mouse movement - show controls
    document.addEventListener('mousemove', () => {
      this.showControls();
      document.body.classList.add('show-cursor');
      this.resetIdleTimer();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      } else if (e.key === 'Escape') {
        this.stop();
        window.stereoAPI.closePlayer();
      }
    });
  }

  private setupIPC(): void {
    // Listen for image load
    window.stereoAPI.on('player:loadImages', (images: string[]) => {
      this.loadImages(images);
    });

    // Listen for control messages
    window.stereoAPI.on('player:play', () => this.play());
    window.stereoAPI.on('player:pause', () => this.pause());
    window.stereoAPI.on('player:stop', () => this.stop());
    window.stereoAPI.on('player:togglePlayPause', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });
    window.stereoAPI.on('player:setFps', (fps: number) => {
      this.fpsSlider.value = fps.toString();
      this.fpsValue.textContent = fps.toString();
      if (this.engine) {
        this.engine.setFPS(fps);
      }
    });
    window.stereoAPI.on('player:setHold', (hold: number) => {
      this.holdSlider.value = hold.toString();
      this.holdValue.textContent = hold.toString();
      if (this.engine) {
        this.engine.setHold(hold);
      }
    });
  }

  private async loadImages(images: string[]): Promise<void> {
    this.images = images;

    // Convert file:// paths to proper format
    const urls = images.map(path => {
      return path.startsWith('file://') ? path : `file://${path}`;
    });

    // Create engine
    this.engine = new FrameEngine(this.canvas, {
      fps: parseInt(this.fpsSlider.value, 10),
      hold: parseInt(this.holdSlider.value, 10),
      mode: this.currentMode,
      preloadCount: 3,
      maxCacheSize: images.length
    });

    // Listen for frame updates
    this.engine.on('framechange', ({ index, total }) => {
      this.updateFrameInfo(index + 1, total);
    });

    // Load sequence
    await this.engine.loadSequence(urls);

    // Auto-play
    await this.play();
  }

  private async play(): Promise<void> {
    if (!this.engine) return;

    await this.engine.play();
    this.isPlaying = true;
    this.updatePlayPauseButton();
  }

  private pause(): void {
    if (!this.engine) return;

    this.engine.pause();
    this.isPlaying = false;
    this.updatePlayPauseButton();
  }

  private stop(): void {
    if (!this.engine) return;

    this.engine.stop();
    this.isPlaying = false;
    this.updatePlayPauseButton();
  }

  private updatePlayPauseButton(): void {
    if (this.isPlaying) {
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
    } else {
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
    }
  }

  private updateFrameInfo(current: number, total: number): void {
    this.frameInfo.textContent = `Frame ${current} / ${total}`;
  }

  private showControls(): void {
    this.controlsOverlay.classList.remove('hidden');
  }

  private hideControls(): void {
    this.controlsOverlay.classList.add('hidden');
  }

  private startIdleTimer(): void {
    this.idleTimeout = window.setTimeout(() => {
      this.hideControls();
      document.body.classList.remove('show-cursor');
    }, 3000);
  }

  private resetIdleTimer(): void {
    if (this.idleTimeout !== null) {
      window.clearTimeout(this.idleTimeout);
    }
    this.startIdleTimer();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PlayerUI());
} else {
  new PlayerUI();
}
