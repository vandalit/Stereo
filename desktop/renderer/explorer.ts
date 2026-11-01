import { FrameEngine } from '../../core/FrameEngine';
import type { RenderMode } from '../../core/types';

interface ImageFile { path: string; name: string; size: number; modified: Date; }

class PlayerUI {
  private images: ImageFile[] = [];
  private fps = 60;
  private hold = 6;
  private mode: RenderMode = 'fill';
  private isPlaying = false;
  private engine: FrameEngine | null = null;
  
  private canvas: HTMLCanvasElement;
  private frameInfo: HTMLElement;
  private btnFolder: HTMLButtonElement;
  private btnPrev: HTMLButtonElement;
  private playPauseBtn: HTMLButtonElement;
  private btnNext: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private playIcon: SVGElement;
  private pauseIcon: SVGElement;
  private btnFps: HTMLButtonElement;
  private btnHold: HTMLButtonElement;
  private fpsPopup: HTMLElement;
  private holdPopup: HTMLElement;
  private fpsSlider: HTMLInputElement;
  private holdSlider: HTMLInputElement;
  private fpsValue: HTMLElement;
  private holdValue: HTMLElement;
  private resizeTimeout: number | null = null;

  constructor() {
    this.canvas = document.getElementById('playerCanvas') as HTMLCanvasElement;
    this.frameInfo = document.getElementById('frameInfo')!;
    this.btnFolder = document.getElementById('btnFolder') as HTMLButtonElement;
    this.btnPrev = document.getElementById('btnPrev') as HTMLButtonElement;
    this.playPauseBtn = document.getElementById('playPauseBtn') as HTMLButtonElement;
    this.btnNext = document.getElementById('btnNext') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    this.btnFps = document.getElementById('btnFps') as HTMLButtonElement;
    this.btnHold = document.getElementById('btnHold') as HTMLButtonElement;
    this.playIcon = document.getElementById('playIcon') as any;
    this.pauseIcon = document.getElementById('pauseIcon') as any;

    // Popup elements
    this.fpsPopup = document.getElementById('fpsPopup')!;
    this.holdPopup = document.getElementById('holdPopup')!;
    this.fpsSlider = document.getElementById('fpsSlider') as HTMLInputElement;
    this.holdSlider = document.getElementById('holdSlider') as HTMLInputElement;
    this.fpsValue = document.getElementById('fpsValue')!;
    this.holdValue = document.getElementById('holdValue')!;

    this.setupCanvas();
    this.btnFolder.addEventListener('click', () => this.selectFolder());
    this.playPauseBtn.addEventListener('click', () => this.togglePlay());
    this.stopBtn.addEventListener('click', () => this.stop());
    this.btnPrev.addEventListener('click', () => this.engine?.prev());
    this.btnNext.addEventListener('click', () => this.engine?.next());
    this.btnFps.addEventListener('click', () => this.toggleFpsPopup());
    this.btnHold.addEventListener('click', () => this.toggleHoldPopup());

    // Slider listeners
    this.fpsSlider.addEventListener('input', () => this.onFpsChange());
    this.holdSlider.addEventListener('input', () => this.onHoldChange());

    // Click outside to close popups
    document.addEventListener('click', (e) => this.handleClickOutside(e));
    
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') { e.preventDefault(); this.togglePlay(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.engine?.prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); this.engine?.next(); }
      else if (e.key === 'Escape') { this.closeAllPopups(); }
    });
  }

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 56;
    window.addEventListener('resize', () => {
      // Debounce: solo actualizar canvas después de 150ms sin cambios
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 56;
        if (this.engine) {
          const state = this.engine.getState();
          if (state.totalFrames > 0) this.engine.jumpTo(state.currentFrame);
        }
        this.resizeTimeout = null;
      }, 150);
    });
  }

  private async selectFolder() {
    const path = await window.stereoAPI.selectFolder();
    if (!path) return;
    this.images = await window.stereoAPI.loadImages(path);
    if (this.images.length === 0) return;
    
    const urls = this.images.map(img => img.path.startsWith('file://') ? img.path : `file://${img.path}`);
    this.engine = new FrameEngine(this.canvas, { fps: this.fps, hold: this.hold, mode: this.mode, preloadCount: 3, maxCacheSize: this.images.length });
    this.engine.on('framechange', ({ index, total }) => { this.frameInfo.textContent = `frame ${index + 1} / ${total}`; });
    await this.engine.loadSequence(urls);
    await this.engine.play();
    this.isPlaying = true;
    this.updateIcon();
  }

  private async togglePlay() {
    if (!this.engine) return;
    this.isPlaying ? this.engine.pause() : await this.engine.play();
    this.isPlaying = !this.isPlaying;
    this.updateIcon();
  }

  private stop() {
    this.engine?.stop();
    this.isPlaying = false;
    this.updateIcon();
  }

  private updateIcon() {
    this.playIcon.style.display = this.isPlaying ? 'none' : 'block';
    this.pauseIcon.style.display = this.isPlaying ? 'block' : 'none';
  }

  private toggleFpsPopup() {
    const isOpen = this.fpsPopup.classList.contains('open');
    this.closeAllPopups();
    if (!isOpen) {
      this.fpsPopup.classList.add('open');
      this.btnFps.classList.add('active');
    }
  }

  private toggleHoldPopup() {
    const isOpen = this.holdPopup.classList.contains('open');
    this.closeAllPopups();
    if (!isOpen) {
      this.holdPopup.classList.add('open');
      this.btnHold.classList.add('active');
    }
  }

  private closeAllPopups() {
    this.fpsPopup.classList.remove('open');
    this.holdPopup.classList.remove('open');
    this.btnFps.classList.remove('active');
    this.btnHold.classList.remove('active');
  }

  private handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!this.fpsPopup.contains(target) && !this.btnFps.contains(target) &&
        !this.holdPopup.contains(target) && !this.btnHold.contains(target)) {
      this.closeAllPopups();
    }
  }

  private onFpsChange() {
    this.fps = parseInt(this.fpsSlider.value, 10);
    this.fpsValue.textContent = this.fps.toString();
    if (this.engine) {
      this.engine.setFPS(this.fps);
    }
  }

  private onHoldChange() {
    this.hold = parseInt(this.holdSlider.value, 10);
    this.holdValue.textContent = this.hold.toString();
    if (this.engine) {
      this.engine.setHold(this.hold);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PlayerUI());
} else {
  new PlayerUI();
}
