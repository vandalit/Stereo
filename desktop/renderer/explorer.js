/**
 * Explorer Renderer Script - Minimal UI
 */

class ExplorerUI {
  constructor() {
    this.currentFolder = null;
    this.images = [];
    this.fps = 60;
    this.hold = 6;

    // Get DOM elements
    this.btnFolder = document.getElementById('btnFolder');
    this.btnSettings = document.getElementById('btnSettings');
    this.playBtn = document.getElementById('playBtn');
    this.thumbGrid = document.getElementById('thumbGrid');
    this.folderChip = document.getElementById('folderChip');
    this.countChip = document.getElementById('countChip');
    this.fpsInput = document.getElementById('fpsInput');
    this.holdInput = document.getElementById('holdInput');
    this.settingsPanel = document.getElementById('settingsPanel');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.btnFolder.addEventListener('click', () => this.selectFolder());
    this.playBtn.addEventListener('click', () => this.openPlayer());
    
    // Settings toggle
    this.btnSettings.addEventListener('click', () => {
      this.settingsPanel.classList.toggle('open');
      this.btnSettings.classList.toggle('active');
    });

    // Settings header toggle
    document.getElementById('settingsHeader').addEventListener('click', () => {
      this.settingsPanel.classList.toggle('open');
    });
    
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

    // Update status chips
    const folderName = this.currentFolder.split('/').pop() || this.currentFolder;
    this.folderChip.textContent = folderName;
    this.countChip.textContent = `${this.images.length} image${this.images.length !== 1 ? 's' : ''}`;
    
    if (this.images.length > 0) {
      this.folderChip.classList.add('ok');
      this.countChip.classList.add('ok');
    }

    // Enable play button if we have images
    this.playBtn.disabled = this.images.length === 0;

    // Render thumbnails
    this.renderThumbnails();
  }

  renderThumbnails() {
    if (this.images.length === 0) {
      this.thumbGrid.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <p>no images found</p>
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
      
      // Optional: click to select
      thumbnail.addEventListener('click', () => {
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('selected'));
        thumbnail.classList.add('selected');
      });
      
      grid.appendChild(thumbnail);
    }

    this.thumbGrid.innerHTML = '';
    this.thumbGrid.appendChild(grid);
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
