/**
 * Explorer Renderer Script
 * 
 * UI for browsing folders and loading images
 */

interface ImageFile {
  path: string;
  name: string;
  size: number;
  modified: Date;
}

class ExplorerUI {
  private currentFolder: string | null = null;
  private images: ImageFile[] = [];
  private fps: number = 10;
  private hold: number = 1;

  // DOM elements
  private selectFolderBtn: HTMLButtonElement;
  private folderPath: HTMLDivElement;
  private imageCount: HTMLDivElement;
  private fpsInput: HTMLInputElement;
  private holdInput: HTMLInputElement;
  private playBtn: HTMLButtonElement;
  private thumbnailGrid: HTMLDivElement;

  constructor() {
    // Get DOM elements - USANDO IDs CORRECTOS DEL HTML
    this.selectFolderBtn = document.getElementById('btnFolder') as HTMLButtonElement;
    this.folderPath = document.getElementById('folderChip') as HTMLDivElement;
    this.imageCount = document.getElementById('countChip') as HTMLDivElement;
    this.fpsInput = document.getElementById('fpsInput') as HTMLInputElement;
    this.holdInput = document.getElementById('holdInput') as HTMLInputElement;
    this.playBtn = document.getElementById('playBtn') as HTMLButtonElement;
    this.thumbnailGrid = document.getElementById('thumbGrid') as HTMLDivElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.selectFolderBtn.addEventListener('click', () => this.selectFolder());
    this.playBtn.addEventListener('click', () => this.openPlayer());
    this.fpsInput.addEventListener('change', () => {
      this.fps = parseInt(this.fpsInput.value, 10);
    });
    this.holdInput.addEventListener('change', () => {
      this.hold = parseInt(this.holdInput.value, 10);
    });
  }

  private async selectFolder(): Promise<void> {
    const folderPath = await window.stereoAPI.selectFolder();
    
    if (!folderPath) return;

    this.currentFolder = folderPath;
    await this.loadImages();
  }

  private async loadImages(): Promise<void> {
    if (!this.currentFolder) return;

    this.images = await window.stereoAPI.loadImages(this.currentFolder);

    // Update UI
    this.folderPath.textContent = this.currentFolder;
    this.imageCount.textContent = `${this.images.length} image${this.images.length !== 1 ? 's' : ''}`;

    // Enable play button if we have images
    this.playBtn.disabled = this.images.length === 0;

    // Render thumbnails
    this.renderThumbnails();
  }

  private renderThumbnails(): void {
    if (this.images.length === 0) {
      this.thumbnailGrid.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="12" width="48" height="40" rx="2"/>
            <path d="M8 40l12-12 8 8 12-12 8 8"/>
            <circle cx="44" cy="24" r="3"/>
          </svg>
          <p>No images found in this folder</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid';

    for (const image of this.images) {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      
      const img = document.createElement('img');
      img.src = `file://${image.path}`;
      img.alt = image.name;
      
      const name = document.createElement('div');
      name.className = 'thumbnail-name';
      name.textContent = image.name;
      
      thumbnail.appendChild(img);
      thumbnail.appendChild(name);
      grid.appendChild(thumbnail);
    }

    this.thumbnailGrid.innerHTML = '';
    this.thumbnailGrid.appendChild(grid);
  }

  private async openPlayer(): Promise<void> {
    if (this.images.length === 0) return;

    const imagePaths = this.images.map(img => img.path);
    
    // Store settings
    window.stereoAPI.setFps(this.fps);
    window.stereoAPI.setHold(this.hold);

    // Open player window
    await window.stereoAPI.openPlayer(imagePaths);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ExplorerUI());
} else {
  new ExplorerUI();
}
