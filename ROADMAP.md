# Roadmap

> Development phases and feature planning for Stereo

---

## Overview

Stereo follows a **phased development approach**, building from core functionality to advanced features. Each phase delivers a working, testable increment.

**Current Status:** 🚧 Phase 2 - Desktop Application (70% complete)

---

## Phase 1: Core Engine ✅

**Goal:** Build the frame alternation engine with precise timing control

### Completed ✅
- ✅ Project planning and documentation
- ✅ Initial folder structure
- ✅ Project setup (package.json, dependencies)
- ✅ TypeScript configuration
- ✅ Jest testing framework configured
- ✅ Timer module (FPS + hold frames) - **20/20 tests passing**
- ✅ Sequencer module (circular navigation) - **33/33 tests passing**
- ✅ Loader module (ImageBitmap + buffering) - **29/29 tests passing**
- ✅ Renderer module (Canvas rendering) - **25/25 tests passing**
- ✅ FrameEngine orchestrator (integration) - **35/35 tests passing**

**Target:** Working core that can cycle through images with configurable timing ✅ **ACHIEVED!**

**Demo:** Reproduce 3+ images at adjustable FPS and hold rates - **READY FOR DEMO**

**Progress:** 5/5 core modules complete (**100%** ✅)

**Total Tests:** 142/142 passing (100%)

---

## 🎊 Phase 1 COMPLETE!

---

## Phase 2: Desktop Application ⏳

**Goal:** Electron app with Explorer and Player modes

### Completed ✅
- ✅ Electron dependencies installed (electron, electron-builder)
- ✅ Main process structure (index.ts, windows.ts, filesystem.ts)
- ✅ Preload script with IPC bridge
- ✅ Explorer UI (HTML + CSS + JS)
- ✅ Player UI (HTML + CSS + JS)
- ✅ Window management system
- ✅ Global shortcuts (Space, Escape, Ctrl+Q)
- ✅ TypeScript compilation setup
- ✅ Build scripts configured

### In Progress 🚧
- 🚧 Player integration with FrameEngine (needs bundling)
- 🚧 Image thumbnail generation
- 🚧 Settings persistence

### Pending
- Settings panel (order, ratios, presets)
- State management between modes
- Full integration testing

**Target:** Fully functional desktop app for browsing and playing image sequences

**Demo:** Navigate local folders, preview thumbnails, play sequences with live FPS/hold adjustments

**Progress:** 7/10 tasks complete (**70%** ⏳)

---

## Phase 3: Recording & Test Assets ⏳

**Goal:** Video export and validation with test content

### Tasks
- FFmpeg recorder integration
- Recording UI (REC button, progress, notifications)
- Export formats (MP4, WebM)
- SVG test images (vanishing point parallax effect)
- Documentation of test assets

**Target:** Record sequences to video files

**Demo:** Play SVG test images at 10 Hz, see convincing depth effect, export to MP4

---

## Phase 4: Web Component ⏳

**Goal:** Reusable web component for embedding in websites

### Tasks
- Web Component wrapper (Custom Element)
- Shadow DOM encapsulation
- Public API (attributes, methods, events)
- Webpack bundle configuration (UMD + ESM)
- Demo page with examples
- Cross-framework integration tests (React, Vue, vanilla)

**Target:** Drop-in component for web projects

**Demo:** `<stereo-player>` works in HTML, React app, and Vue app

---

## Phase 5: Polish & Release ⏳

**Goal:** Production-ready v1.0.0

### Tasks
- Comprehensive documentation
- Performance benchmarking and optimization
- Memory profiling (verify no leaks)
- Production builds (minified, optimized)
- Electron installers (Windows, macOS, Linux)
- NPM package publication
- Version tagging and release notes

**Target:** Distributable application and published npm package

**Demo:** Install from installer/npm, works standalone without dev environment

---

## Future Enhancements (Post v1.0)

### Advanced Rendering
- [ ] **Frame interpolation** - Tweening between images for smooth transitions
- [ ] **Motion blur** - Realistic blur effect during fast alternation
- [ ] **Cross-fade transitions** - Smooth blending between frames
- [ ] **Custom shaders** - WebGL effects and filters

### 3D & Spatial
- [ ] **Gaussian splatting** - Real-time 3D reconstruction from image pairs
- [ ] **Depth maps** - Generate and render depth information
- [ ] **Camera transforms** - Simulate camera movements from static images
- [ ] **Parallax scrolling** - Depth-based interactive effects

### Content & Media
- [ ] **Video file support** - Play video files, not just images
- [ ] **GIF export** - Generate animated GIFs from sequences
- [ ] **Sequence presets** - Saved configurations for different effects
- [ ] **Playlist system** - Chain multiple folders/sequences

### Collaboration & Sharing
- [ ] **Cloud storage integration** - Load images from cloud services
- [ ] **Shared galleries** - Publish and browse community creations
- [ ] **Embed codes** - Easy sharing with iframe embeds
- [ ] **Export templates** - Pre-configured setups for common use cases

### Platform Expansion
- [ ] **Mobile apps** - React Native with shared core
- [ ] **Browser extension** - Quick viewer for web images
- [ ] **CLI tool** - Headless rendering and batch processing
- [ ] **Plugin system** - Third-party effects and filters

### Performance & Quality
- [ ] **Hardware acceleration** - GPU-accelerated effects
- [ ] **High-res support** - Optimized for 4K+ images
- [ ] **Batch optimization** - Pre-process large image sets
- [ ] **Adaptive quality** - Automatic quality adjustment based on performance

### Creative Tools
- [ ] **Image capture** - Built-in camera support for creating sequences
- [ ] **Timeline editor** - Frame-by-frame editing and timing adjustments
- [ ] **Audio sync** - Synchronize playback with audio tracks
- [ ] **Live input** - Real-time camera/screen capture

---

## Versioning Strategy

- **v0.1.0** - Core engine (Phase 1)
- **v0.2.0** - Desktop app (Phase 2)
- **v0.3.0** - Recording (Phase 3)
- **v0.4.0** - Web component (Phase 4)
- **v1.0.0** - Polish & release (Phase 5)
- **v1.x.x** - Incremental improvements
- **v2.0.0** - Major feature additions (3D, interpolation)

---

## Community Requests

Have an idea? [Open a discussion](https://github.com/yourusername/stereo/discussions) to suggest features!

**Most Requested:**
- _No community requests yet - be the first!_

---

## Breaking Changes

We maintain a **changelog** of breaking changes between versions:

### Planned Breaking Changes
- None currently planned before v1.0.0

---

Last Updated: 2024-10-31
