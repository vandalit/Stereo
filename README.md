# Stereo

> High-performance visual frame player for stereoscopy, sprite animation, and experimental VFX

**Stereo** is a dual-purpose tool: a desktop application for creating stereoscopic effects and video recordings, and a reusable web component for embedding dynamic image sequences in web projects.

![Status: In Development](https://img.shields.io/badge/status-in%20development-yellow)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

---

## Features

### 🎬 Core Capabilities
- **Frame alternation engine** - Cycle through N images with precise timing control
- **Dual timing control** - Separate FPS (24/30/60/120) and hold frames for fine-tuned effects
- **Smart buffering** - Preload next frames using ImageBitmap for 60+ FPS performance
- **Fill rendering** - Images scale and crop to fill the canvas (no letterboxing)
- **Flexible ordering** - Sort by name, date modified, date created, or file size

### 🖥️ Desktop App (Electron)
- **Explorer mode** - Navigate folders with animated thumbnail previews (2fps)
- **Player mode** - Full-canvas playback with minimal, elastic UI
- **Video recording** - Export sequences to MP4/WebM using FFmpeg
- **Filesystem integration** - Direct access to local image folders
- **Keyboard shortcuts** - Navigate with arrow keys, UP, ENTER, SPACE

### 🌐 Web Component
- **Framework agnostic** - Use with React, Vue, or vanilla JS
- **Shadow DOM** - Encapsulated styles, no conflicts
- **Simple API** - Attributes for configuration, methods for control
- **CDN ready** - Drop-in script tag or npm install

---

## Use Cases

- **Stereoscopy** - Create depth illusions by alternating left/right eye images at high frequency
- **Sprite animation** - Classic flipbook-style animation from keyframes
- **Visual effects** - Hero sections, interactive galleries, experimental visuals
- **Performance art** - TouchDesigner-style visual tool for VJs and artists
- **Future experiments** - Gaussian splatting, depth maps, interpolation

---

## Quick Start

### Desktop App

```bash
# Clone the repository
git clone https://github.com/yourusername/stereo.git
cd stereo

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build:desktop
```

### Web Component

```html
<!-- Via CDN -->
<script src="https://cdn.jsdelivr.net/npm/@stereo/player@latest"></script>

<stereo-player 
  src="./images" 
  fps="60" 
  hold="6"
  order="alphabetical">
</stereo-player>

<script>
  const player = document.querySelector('stereo-player');
  player.play();
</script>
```

```bash
# Via npm
npm install @stereo/player

import { StereoPlayer } from '@stereo/player';
```

---

## Architecture

Stereo is built with a **shared core** that powers both desktop and web versions:

```
┌─────────────────────────────────────┐
│         Core Engine (TS)            │
│  Timer · Sequencer · Loader · Renderer │
└──────────┬──────────────────┬───────┘
           │                  │
    ┌──────▼─────┐     ┌─────▼──────┐
    │  Desktop   │     │    Web     │
    │  (Electron)│     │ (Component)│
    └────────────┘     └────────────┘
```

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed technical documentation.

---

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Desktop:** Electron 28+
- **Build:** Webpack 5 + ts-loader
- **UI:** React/Preact + Tailwind CSS
- **Testing:** Jest + ts-jest
- **Recording:** FFmpeg (fluent-ffmpeg)
- **Rendering:** Canvas API + ImageBitmap

---

## Development

### Project Structure

```
Stereo/
├── core/           # Shared TypeScript engine
├── desktop/        # Electron app
│   ├── main/       # Main process (Node.js)
│   └── renderer/   # UI (React + Tailwind)
├── web/            # Web Component
├── test/           # Jest tests
└── docs/           # Documentation
```

### Commands

```bash
npm run dev           # Start Electron in dev mode
npm run build         # Build all targets
npm run build:desktop # Build desktop app only
npm run build:web     # Build web component only
npm test              # Run Jest tests
npm run test:watch    # Run tests in watch mode
npm run lint          # Lint with ESLint
npm run format        # Format with Prettier
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- Timer.test.ts
```

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and progress.

**Current Phase:** Phase 1 - Core Engine Development

**Next Up:**
- ✅ Project setup and tooling
- 🔄 Timer module implementation
- ⏳ Sequencer module
- ⏳ Loader with ImageBitmap
- ⏳ Canvas renderer

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This is primarily a personal project for experimentation, but feel free to:
- Report bugs and issues
- Suggest features
- Submit pull requests for bug fixes
- Share your use cases and results

---

## Documentation

- [Product Requirements Document](docs/PRD.md) - Full specification and requirements
- [Architecture](docs/ARCHITECTURE.md) - Technical design and data flow
- [Roadmap](ROADMAP.md) - Development phases and future features

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Credits

Created by [vandalit](https://github.com/vandalit)

Inspired by tools like TouchDesigner and the creative coding community.

---

## Support

- 🐛 **Bug reports:** [GitHub Issues](https://github.com/yourusername/stereo/issues)
- 💡 **Feature requests:** [GitHub Discussions](https://github.com/yourusername/stereo/discussions)
- 📧 **Contact:** your.email@example.com

---

**Note:** Stereo is in active development. APIs and features may change before v1.0.
