/**
 * Player Renderer Script - Minimal UI
 */

class PlayerUI {
  constructor() {
    this.engine = null;
    this.images = [];
    this.isPlaying = false;
    this.currentMode = 'fill';
    this.currentIndex = 0;

    // Get DOM elements
    this.canvas = document.getElementById('playerCanvas');
    this.frameInfo = document.getElementById('frameInfo');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.playIcon = document.getElementById('playIcon');
    this.pauseIcon = document.getElementById('pauseIcon');
    this.fpsSlider = document.getElementById('fpsSlider');
    this.holdSlider = document.getElementById('holdSlider');
    this.fpsValue = document.getElementById('fpsValue');
    this.holdValue = document.getElementById('holdValue');
    this.settingsPanel = document.getElementById('settingsPanel');
    this.btnSettings = document.getElementById('btnSettings');
    this.thumbList = document.getElementById('thumbList');

    this.setupCanvas();
    this.setupEventListeners();
    this.setupIPC();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.render();
    });
  }

  setupEventListeners() {
    // Play/Pause
    this.playPauseBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    // Navigation
    document.getElementById('btnPrev')?.addEventListener('click', () => this.prev());
    document.getElementById('btnNext')?.addEventListener('click', () => this.next());

    // Settings toggle
    this.btnSettings.addEventListener('click', () => {
      this.settingsPanel.classList.toggle('open');
      this.btnSettings.classList.toggle('active');
    });

    // Settings header toggle
    document.getElementById('settingsHeader').addEventListener('click', () => {
      this.settingsPanel.classList.toggle('open');
    });

    // FPS slider
    this.fpsSlider.addEventListener('input', () => {
      const fps = parseInt(this.fpsSlider.value, 10);
      this.fpsValue.textContent = fps.toString();
      // TODO: Update engine FPS
    });

    // Hold slider
    this.holdSlider.addEventListener('input', () => {
      const hold = parseInt(this.holdSlider.value, 10);
      this.holdValue.textContent = hold.toString();
      // TODO: Update engine hold
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.dataset.mode;
        // TODO: Update engine render mode
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
        window.stereoAPI.closePlayer();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
  }

  setupIPC() {
    // Listen for image load
    window.stereoAPI.on('player:loadImages', (images) => {
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
  }

  async loadImages(images) {
    this.images = images;
    this.currentIndex = 0;
    
    console.log('Loaded images:', images.length);
    this.updateFrameInfo();
    this.renderThumbnails();
    this.render();
    
    // Auto-play
    this.play();
  }

  renderThumbnails() {
    this.thumbList.innerHTML = '';
    
    this.images.forEach((imgPath, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumb-item';
      if (index === this.currentIndex) {
        thumb.classList.add('active');
      }
      
      // Placeholder icon for now
      thumb.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      `;
      
      thumb.addEventListener('click', () => {
        this.jumpTo(index);
      });
      
      this.thumbList.appendChild(thumb);
    });
  }

  play() {
    if (this.isPlaying || this.images.length === 0) return;

    this.isPlaying = true;
    this.updatePlayPauseButton();
    console.log('Playing...');
    
    // TODO: Implement proper frame engine playback
    // For now, simple interval
    this.playInterval = setInterval(() => {
      this.next();
    }, 1000 / parseInt(this.fpsSlider.value) * parseInt(this.holdSlider.value));
  }

  pause() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
    this.updatePlayPauseButton();
    console.log('Paused');
  }

  stop() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
    this.currentIndex = 0;
    this.updatePlayPauseButton();
    this.updateFrameInfo();
    this.render();
    console.log('Stopped');
  }

  next() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateFrameInfo();
    this.updateThumbnails();
    this.render();
  }

  prev() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateFrameInfo();
    this.updateThumbnails();
    this.render();
  }

  jumpTo(index) {
    if (index < 0 || index >= this.images.length) return;
    this.currentIndex = index;
    this.updateFrameInfo();
    this.updateThumbnails();
    this.render();
  }

  render() {
    if (this.images.length === 0) return;

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Load and render actual image
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Image ${this.currentIndex + 1} / ${this.images.length}`, 
      this.canvas.width / 2, 
      this.canvas.height / 2
    );
  }

  updatePlayPauseButton() {
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

  updateFrameInfo() {
    this.frameInfo.textContent = `frame ${this.currentIndex + 1}`;
  }

  updateThumbnails() {
    const thumbs = this.thumbList.querySelectorAll('.thumb-item');
    thumbs.forEach((thumb, index) => {
      if (index === this.currentIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PlayerUI());
} else {
  new PlayerUI();
}
