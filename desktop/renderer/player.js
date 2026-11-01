/**
 * Player Renderer Script (Simplified)
 * Note: This would normally import FrameEngine from dist/core
 * For now, using placeholder until proper bundling is set up
 */

class PlayerUI {
  constructor() {
    this.engine = null;
    this.images = [];
    this.isPlaying = false;
    this.idleTimeout = null;
    this.currentMode = 'fill';
    this.currentIndex = 0;

    // Get DOM elements
    this.canvas = document.getElementById('playerCanvas');
    this.controlsOverlay = document.getElementById('controlsOverlay');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.fpsSlider = document.getElementById('fpsSlider');
    this.holdSlider = document.getElementById('holdSlider');
    this.fpsValue = document.getElementById('fpsValue');
    this.holdValue = document.getElementById('holdValue');
    this.frameInfo = document.getElementById('frameInfo');
    this.playIcon = document.getElementById('playIcon');
    this.pauseIcon = document.getElementById('pauseIcon');

    this.setupCanvas();
    this.setupEventListeners();
    this.setupIPC();
    this.startIdleTimer();
  }

  setupCanvas() {
    // Match canvas to window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.render();
    });
  }

  setupEventListeners() {
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
      // TODO: Update engine FPS
    });

    // Hold slider
    this.holdSlider.addEventListener('input', () => {
      const hold = parseInt(this.holdSlider.value, 10);
      this.holdValue.textContent = hold.toString();
      // TODO: Update engine hold
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

  setupIPC() {
    // Listen for image load
    window.stereoAPI.on('player:loadImages', (images) => {
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
  }

  async loadImages(images) {
    this.images = images;
    this.currentIndex = 0;
    
    console.log('Loaded images:', images.length);
    this.updateFrameInfo(1, images.length);
    
    // Render first frame
    this.render();
    
    // Auto-play
    this.play();
  }

  play() {
    if (this.isPlaying || this.images.length === 0) return;

    this.isPlaying = true;
    this.updatePlayPauseButton();
    
    // TODO: Implement proper frame engine playback
    console.log('Playing...');
  }

  pause() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.updatePlayPauseButton();
    console.log('Paused');
  }

  stop() {
    this.isPlaying = false;
    this.currentIndex = 0;
    this.updatePlayPauseButton();
    this.render();
    console.log('Stopped');
  }

  render() {
    if (this.images.length === 0) return;

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Load and render image from this.images[this.currentIndex]
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Frame ${this.currentIndex + 1} / ${this.images.length}`, 
                 this.canvas.width / 2, this.canvas.height / 2);
  }

  updatePlayPauseButton() {
    if (this.isPlaying) {
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
    } else {
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
    }
  }

  updateFrameInfo(current, total) {
    this.frameInfo.textContent = `Frame ${current} / ${total}`;
  }

  showControls() {
    this.controlsOverlay.classList.remove('hidden');
  }

  hideControls() {
    this.controlsOverlay.classList.add('hidden');
  }

  startIdleTimer() {
    this.idleTimeout = setTimeout(() => {
      this.hideControls();
      document.body.classList.remove('show-cursor');
    }, 3000);
  }

  resetIdleTimer() {
    if (this.idleTimeout !== null) {
      clearTimeout(this.idleTimeout);
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
