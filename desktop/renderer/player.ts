/**
 * Player Renderer - FIXED
 * Conecta TODOS los elementos del HTML con FrameEngine
 * Recupera funcionalidad del commit 96cff37
 */

import { FrameEngine } from '../../core/FrameEngine';
import type { RenderMode } from '../../core/types';

class PlayerUI {
  private engine: FrameEngine | null = null;
  private images: string[] = [];
  private isPlaying: boolean = false;
  private currentMode: RenderMode = 'fill';

  // DOM elements
  private canvas: HTMLCanvasElement;
  private frameInfo: HTMLElement;
  
  // Toolbar buttons
  private btnFolder: HTMLButtonElement;
  private btnPrev: HTMLButtonElement;
  private playPauseBtn: HTMLButtonElement;
  private btnNext: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private btnRecord: HTMLButtonElement;
  private thumb1: HTMLButtonElement;
  private thumb2: HTMLButtonElement;
  private btnFps: HTMLButtonElement;
  private btnHold: HTMLButtonElement;
  private btnSettings: HTMLButtonElement;
  
  // Play/Pause icons
  private playIcon: SVGElement;
  private pauseIcon: SVGElement;
  
  // Sliders (settings panel)
  private fpsSlider: HTMLInputElement;
  private holdSlider: HTMLInputElement;
  private fpsValue: HTMLElement;
  private holdValue: HTMLElement;
  
  // Sliders (toolbar popups)
  private fpsSliderToolbar: HTMLInputElement;
  private holdSliderToolbar: HTMLInputElement;
  private fpsValueToolbar: HTMLElement;
  private holdValueToolbar: HTMLElement;
  private fpsPopup: HTMLElement;
  private holdPopup: HTMLElement;
  
  // Settings
  private settingsPanel: HTMLElement;
  private settingsBody: HTMLElement;
  private modeButtons: NodeListOf<HTMLButtonElement>;

  constructor() {
    // Canvas y frame counter
    this.canvas = document.getElementById('playerCanvas') as HTMLCanvasElement;
    this.frameInfo = document.getElementById('frameInfo')!;
    
    // Toolbar buttons
    this.btnFolder = document.getElementById('btnFolder') as HTMLButtonElement;
    this.btnPrev = document.getElementById('btnPrev') as HTMLButtonElement;
    this.playPauseBtn = document.getElementById('playPauseBtn') as HTMLButtonElement;
    this.btnNext = document.getElementById('btnNext') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    this.btnRecord = document.getElementById('btnRecord') as HTMLButtonElement;
    this.thumb1 = document.getElementById('thumb1') as HTMLButtonElement;
    this.thumb2 = document.getElementById('thumb2') as HTMLButtonElement;
    this.btnFps = document.getElementById('btnFps') as HTMLButtonElement;
    this.btnHold = document.getElementById('btnHold') as HTMLButtonElement;
    this.btnSettings = document.getElementById('btnSettings') as HTMLButtonElement;
    
    // Icons
    this.playIcon = document.getElementById('playIcon') as SVGElement;
    this.pauseIcon = document.getElementById('pauseIcon') as SVGElement;
    
    // Settings panel sliders
    this.fpsSlider = document.getElementById('fpsSlider') as HTMLInputElement;
    this.holdSlider = document.getElementById('holdSlider') as HTMLInputElement;
    this.fpsValue = document.getElementById('fpsValue')!;
    this.holdValue = document.getElementById('holdValue')!;
    
    // Toolbar popup sliders
    this.fpsSliderToolbar = document.getElementById('fpsSliderToolbar') as HTMLInputElement;
    this.holdSliderToolbar = document.getElementById('holdSliderToolbar') as HTMLInputElement;
    this.fpsValueToolbar = document.getElementById('fpsValueToolbar')!;
    this.holdValueToolbar = document.getElementById('holdValueToolbar')!;
    this.fpsPopup = document.getElementById('fpsPopup')!;
    this.holdPopup = document.getElementById('holdPopup')!;
    
    // Settings
    this.settingsPanel = document.getElementById('settingsPanel')!;
    this.settingsBody = document.getElementById('settingsBody')!;
    this.modeButtons = document.querySelectorAll('.mode-btn');

    this.setupCanvas();
    this.setupEventListeners();
    this.setupIPC();
  }

  private setupCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      if (this.engine) {
        const state = this.engine.getState();
        if (state.totalFrames > 0) {
          this.engine.jumpTo(state.currentFrame);
        }
      }
    });
  }

  private setupEventListeners(): void {
    // Folder selector
    this.btnFolder.addEventListener('click', () => {
      window.stereoAPI.selectFolder();
    });

    // Prev frame
    this.btnPrev.addEventListener('click', () => {
      this.engine?.prev();
    });

    // Play/Pause
    this.playPauseBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    // Next frame
    this.btnNext.addEventListener('click', () => {
      this.engine?.next();
    });

    // Stop
    this.stopBtn.addEventListener('click', () => {
      this.stop();
      window.stereoAPI.closePlayer();
    });

    // FPS popup toggle
    this.btnFps.addEventListener('click', () => {
      const isOpen = this.fpsPopup.classList.toggle('open');
      this.btnFps.classList.toggle('active', isOpen);
      if (isOpen) {
        this.holdPopup.classList.remove('open');
        this.btnHold.classList.remove('active');
      }
    });

    // Hold popup toggle
    this.btnHold.addEventListener('click', () => {
      const isOpen = this.holdPopup.classList.toggle('open');
      this.btnHold.classList.toggle('active', isOpen);
      if (isOpen) {
        this.fpsPopup.classList.remove('open');
        this.btnFps.classList.remove('active');
      }
    });

    // FPS sliders (sync both)
    this.fpsSlider.addEventListener('input', () => {
      const fps = parseInt(this.fpsSlider.value, 10);
      this.fpsValue.textContent = fps.toString();
      this.fpsSliderToolbar.value = fps.toString();
      this.fpsValueToolbar.textContent = fps.toString();
      this.engine?.setFPS(fps);
    });

    this.fpsSliderToolbar.addEventListener('input', () => {
      const fps = parseInt(this.fpsSliderToolbar.value, 10);
      this.fpsValueToolbar.textContent = fps.toString();
      this.fpsSlider.value = fps.toString();
      this.fpsValue.textContent = fps.toString();
      this.engine?.setFPS(fps);
    });

    // Hold sliders (sync both)
    this.holdSlider.addEventListener('input', () => {
      const hold = parseInt(this.holdSlider.value, 10);
      this.holdValue.textContent = hold.toString();
      this.holdSliderToolbar.value = hold.toString();
      this.holdValueToolbar.textContent = hold.toString();
      this.engine?.setHold(hold);
    });

    this.holdSliderToolbar.addEventListener('input', () => {
      const hold = parseInt(this.holdSliderToolbar.value, 10);
      this.holdValueToolbar.textContent = hold.toString();
      this.holdSlider.value = hold.toString();
      this.holdValue.textContent = hold.toString();
      this.engine?.setHold(hold);
    });

    // Settings toggle
    this.btnSettings.addEventListener('click', () => {
      const isOpen = this.settingsPanel.classList.toggle('open');
      this.btnSettings.classList.toggle('active', isOpen);
    });

    // Mode buttons
    this.modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.dataset.mode as RenderMode;
        // TODO: Recreate engine with new mode if needed
      });
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
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.engine?.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.engine?.next();
      }
    });
  }

  private setupIPC(): void {
    window.stereoAPI.on('player:loadImages', (images: string[]) => {
      this.loadImages(images);
    });

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
      this.fpsSliderToolbar.value = fps.toString();
      this.fpsValueToolbar.textContent = fps.toString();
      this.engine?.setFPS(fps);
    });

    window.stereoAPI.on('player:setHold', (hold: number) => {
      this.holdSlider.value = hold.toString();
      this.holdValue.textContent = hold.toString();
      this.holdSliderToolbar.value = hold.toString();
      this.holdValueToolbar.textContent = hold.toString();
      this.engine?.setHold(hold);
    });
  }

  private async loadImages(images: string[]): Promise<void> {
    this.images = images;

    const urls = images.map(path => {
      return path.startsWith('file://') ? path : `file://${path}`;
    });

    this.engine = new FrameEngine(this.canvas, {
      fps: parseInt(this.fpsSlider.value, 10),
      hold: parseInt(this.holdSlider.value, 10),
      mode: this.currentMode,
      preloadCount: 3,
      maxCacheSize: images.length
    });

    this.engine.on('framechange', ({ index, total }) => {
      this.updateFrameInfo(index + 1, total);
    });

    await this.engine.loadSequence(urls);
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
      this.playPauseBtn.classList.add('active');
    } else {
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
      this.playPauseBtn.classList.remove('active');
    }
  }

  private updateFrameInfo(current: number, total: number): void {
    this.frameInfo.textContent = `frame ${current} / ${total}`;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PlayerUI());
} else {
  new PlayerUI();
}
