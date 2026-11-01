import { FrameEngine } from '../../core/FrameEngine';
import type { RenderMode } from '../../core/types';

interface ImageFile { path: string; name: string; size: number; modified: Date; }

class UnifiedUI {
  private currentFolder: string | null = null;
  private images: ImageFile[] = [];
  private fps = 60;
  private hold = 6;
  private mode: RenderMode = 'fill';
  private isPlaying = false;
  private engine: FrameEngine | null = null;
  
  // Explorer DOM
  private btnFolder: HTMLButtonElement;
  private folderChip: HTMLDivElement;
  private countChip: HTMLDivElement;
  private fpsInput: HTMLInputElement;
  private holdInput: HTMLInputElement;
  private playBtn: HTMLButtonElement;
  private thumbGrid: HTMLDivElement;
  private statusBar: HTMLElement;
  
  // Player DOM
  private canvas: HTMLCanvasElement;
  private frameCounter: HTMLElement;
  private frameInfo: HTMLElement;
  private btnPrev: HTMLButtonElement;
  private btnNext: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private playIcon: SVGElement;
  private pauseIcon: SVGElement;

  constructor() {
    this.btnFolder = document.getElementById('btnFolder') as HTMLButtonElement;
    this.folderChip = document.getElementById('folderChip') as HTMLDivElement;
    this.countChip = document.getElementById('countChip') as HTMLDivElement;
    this.fpsInput = document.getElementById('fpsInput') as HTMLInputElement;
    this.holdInput = document.getElementById('holdInput') as HTMLInputElement;
    this.playBtn = document.getElementById('playBtn') as HTMLButtonElement;
    this.thumbGrid = document.getElementById('thumbGrid') as HTMLDivElement;
    this.statusBar = document.getElementById('statusBar')!;
    this.canvas = document.getElementById('playerCanvas') as HTMLCanvasElement;
    this.frameCounter = document.getElementById('frameCounter')!;
    this.frameInfo = document.getElementById('frameInfo')!;
    this.btnPrev = document.getElementById('btnPrev') as HTMLButtonElement;
    this.btnNext = document.getElementById('btnNext') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    this.playIcon = document.getElementById('playIcon') as any;
    this.pauseIcon = document.getElementById('pauseIcon') as any;

    this.btnFolder.addEventListener('click', () => this.selectFolder());
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.stopBtn?.addEventListener('click', () => this.stopPlayer());
    this.btnPrev?.addEventListener('click', () => this.engine?.prev());
    this.btnNext?.addEventListener('click', () => this.engine?.next());
  }

  private async selectFolder() {
    const path = await window.stereoAPI.selectFolder();
    if (!path) return;
    this.currentFolder = path;
    this.images = await window.stereoAPI.loadImages(path);
    this.folderChip.textContent = path.split('/').pop() || path;
    this.countChip.textContent = `${this.images.length} images`;
    this.playBtn.disabled = this.images.length === 0;
  }

  private async togglePlay() {
    if (this.canvas.style.display === 'none') {
      await this.startPlayer();
    } else {
      this.isPlaying ? this.engine?.pause() : await this.engine?.play();
      this.isPlaying = !this.isPlaying;
      this.updateIcon();
    }
  }

  private async startPlayer() {
    this.thumbGrid.style.display = 'none';
    this.statusBar.style.display = 'none';
    this.canvas.style.display = 'block';
    this.frameCounter.style.display = 'block';
    document.querySelectorAll('.player-only').forEach(el => (el as HTMLElement).style.display = 'flex');
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 56;
    
    const urls = this.images.map(img => img.path.startsWith('file://') ? img.path : `file://${img.path}`);
    this.engine = new FrameEngine(this.canvas, { fps: this.fps, hold: this.hold, mode: this.mode, preloadCount: 3, maxCacheSize: this.images.length });
    this.engine.on('framechange', ({ index, total }) => { this.frameInfo.textContent = `frame ${index + 1} / ${total}`; });
    await this.engine.loadSequence(urls);
    await this.engine.play();
    this.isPlaying = true;
    this.updateIcon();
  }

  private stopPlayer() {
    this.engine?.stop();
    this.engine = null;
    this.isPlaying = false;
    this.canvas.style.display = 'none';
    this.frameCounter.style.display = 'none';
    document.querySelectorAll('.player-only').forEach(el => (el as HTMLElement).style.display = 'none');
    this.thumbGrid.style.display = 'flex';
    this.statusBar.style.display = 'flex';
    this.updateIcon();
  }

  private updateIcon() {
    this.playIcon.style.display = this.isPlaying ? 'none' : 'block';
    this.pauseIcon.style.display = this.isPlaying ? 'block' : 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new UnifiedUI());
} else {
  new UnifiedUI();
}
