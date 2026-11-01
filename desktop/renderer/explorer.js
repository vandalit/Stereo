/**
 * Explorer Renderer Script (Compiled from TypeScript)
 */

class ExplorerUI {
  constructor() {
    this.currentFolder = null;
    this.images = [];
    this.fps = 10;
    this.hold = 1;

    // Get DOM elements
    this.selectFolderBtn = document.getElementById('selectFolderBtn');
    this.folderPath = document.getElementById('folderPath');
    this.imageCount = document.getElementById('imageCount');
    this.fpsInput = document.getElementById('fpsInput');
    this.holdInput = document.getElementById('holdInput');
    this.playBtn = document.getElementById('playBtn');
    this.thumbnailGrid = document.getElementById('thumbnailGrid');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.selectFolderBtn.addEventListener('click', () => this.selectFolder());
    this.playBtn.addEventListener('click', () => this.openPlayer());
    this.fpsInput.addEventListener('change', () => {
      this.fps = parseInt(this.fpsInput.value, 10);
    });
    this.holdInput.addEventListener('change', () => {
      this.hold = parseInt(this.holdInput.value, 10);
    });
  }

  async selectFolder() {
    const folderPath = await window.stereoAPI.selectFolder();
    
    if (!folderPath) return;

    this.currentFolder = folderPath;
    await this.loadImages();
  }

  async loadImages() {
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

  renderThumbnails() {
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

  async openPlayer() {
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
