# Architecture Documentation - Stereo

**Version:** 1.0  
**Date:** 2024-10-31  
**Status:** Design Phase

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [System Architecture](#system-architecture)
4. [Core Engine](#core-engine)
5. [Desktop Application](#desktop-application)
6. [Web Component](#web-component)
7. [Data Flow](#data-flow)
8. [Performance Optimization](#performance-optimization)
9. [Security Considerations](#security-considerations)
10. [Testing Strategy](#testing-strategy)
11. [Build & Deployment](#build--deployment)
12. [Decision Log](#decision-log)

---

## Overview

Stereo uses a **modular, platform-agnostic architecture** with a shared TypeScript core that powers both desktop (Electron) and web (Custom Element) implementations.

### Key Characteristics

- **Separation of Concerns** - Core logic independent of platform
- **Performance First** - Optimized for 60+ FPS alternation
- **Testability** - Pure functions, dependency injection, mocked externals
- **Extensibility** - Plugin-ready design for future enhancements

---

## Design Principles

### 1. Core Agnosticism

The core engine (`core/`) has **zero dependencies** on DOM, Node.js, or Electron APIs. It operates on:
- Abstract image sources (ImageBitmap interface)
- Generic timing mechanisms (requestAnimationFrame callback)
- Event emitters (no framework-specific events)

This enables:
- Testing without browser/Electron environment
- Reuse across platforms (web, desktop, future mobile)
- Easy mocking and isolation

### 2. Single Responsibility

Each module has **one clear purpose**:
- `Timer` - Timing logic only
- `Sequencer` - Index management only
- `Loader` - Image loading only
- `Renderer` - Canvas drawing only
- `FrameEngine` - Orchestration only

No module does another's job. Communication happens through well-defined interfaces.

### 3. Composition Over Inheritance

Modules are **composed**, not extended:

```typescript
class FrameEngine {
  constructor(
    private timer: Timer,
    private sequencer: Sequencer,
    private loader: Loader,
    private renderer: Renderer
  ) {}
}
```

Benefits:
- Easy to swap implementations (e.g., different loaders for web vs desktop)
- Simplified testing (mock individual dependencies)
- Clear dependency graph

### 4. Immutability Where Possible

State updates are **explicit and traceable**:

```typescript
// ✅ Good - returns new state
const newState = { ...state, playing: true };

// ❌ Bad - mutates state
state.playing = true;
```

Exceptions: Performance-critical paths (Canvas rendering, ImageBitmap caching).

---

## System Architecture

### High-Level Diagram

```
┌───────────────────────────────────────────────────┐
│                   Core Engine                     │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐│
│  │ Timer   │ │Sequencer │ │ Loader │ │Renderer ││
│  └────┬────┘ └─────┬────┘ └───┬────┘ └────┬────┘│
│       └──────────┬─┴───────────┴──────────┬┘     │
│                  │    FrameEngine         │      │
│                  └────────────────────────┘      │
└──────────────────────┬────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼─────┐              ┌─────▼──────┐
    │ Desktop  │              │    Web     │
    │          │              │            │
    │ ┌──────┐ │              │ ┌────────┐ │
    │ │ Main │ │              │ │Custom  │ │
    │ │Process│◄─────IPC─────►│ │Element │ │
    │ └──┬───┘ │              │ └───┬────┘ │
    │    │     │              │     │      │
    │ ┌──▼────┐│              │ ┌───▼────┐ │
    │ │Render││              │ │Shadow  │ │
    │ │  UI  ││              │ │  DOM   │ │
    │ └──────┘│              │ └────────┘ │
    └─────────┘              └────────────┘
```

---

## Core Engine

### Module: Timer

**Responsibility:** Manage frame timing with FPS and hold frames.

**Interface:**
```typescript
interface ITimer {
  start(callback: (frameCount: number) => void): void;
  stop(): void;
  setFPS(fps: number): void;
  setHold(holdFrames: number): void;
  getFPS(): number;
  getHold(): number;
  getEffectiveFrequency(): number; // fps / hold
}
```

**Implementation Strategy:**
- Uses `requestAnimationFrame` for smooth timing
- Tracks elapsed time since last frame switch
- Switches image when `elapsed >= (holdFrames / fps)`
- Adjustable in real-time without restart

**Key Code Pattern:**
```typescript
class Timer implements ITimer {
  private lastSwitchTime = 0;
  private frameCount = 0;
  
  private tick = (timestamp: number) => {
    const elapsed = timestamp - this.lastSwitchTime;
    const interval = (this.holdFrames / this.fps) * 1000; // ms
    
    if (elapsed >= interval) {
      this.callback(this.frameCount++);
      this.lastSwitchTime = timestamp;
    }
    
    requestAnimationFrame(this.tick);
  };
}
```

---

### Module: Sequencer

**Responsibility:** Manage current frame index and navigation.

**Interface:**
```typescript
interface ISequencer {
  next(): number;
  prev(): number;
  jumpTo(index: number): number;
  getCurrent(): number;
  getTotal(): number;
  setLength(length: number): void;
}
```

**Implementation Strategy:**
- Circular navigation (wraps at boundaries)
- Validates indices (0 to length-1)
- Immutable operations (returns new index, doesn't store state)

**Edge Cases:**
- Empty sequence (length = 0): methods are no-ops
- Single item (length = 1): next/prev return same index
- Negative jumpTo: wraps from end (e.g., -1 = last item)

---

### Module: Loader

**Responsibility:** Load images, create ImageBitmaps, manage cache.

**Interface:**
```typescript
interface ILoader {
  loadSequence(images: ImageSource[], startIndex: number): Promise<void>;
  getBitmap(index: number): ImageBitmap | null;
  isLoaded(index: number): boolean;
  preloadAround(index: number, count: number): Promise<void>;
  cleanup(): void;
}

type ImageSource = string | Blob | File;
```

**Implementation Strategy:**
- **Preloading:** Load current + next N images
- **Cache management:** Release old ImageBitmaps (LRU or fixed window)
- **Error handling:** Skip failed loads, emit error events
- **Parallel loading:** Use `Promise.all` for batch loads

**Memory Management:**
```typescript
class Loader implements ILoader {
  private cache = new Map<number, ImageBitmap>();
  private maxCacheSize = 5; // configurable
  
  async preloadAround(index: number, count: number) {
    const toLoad = [];
    for (let i = index; i < index + count; i++) {
      if (!this.cache.has(i)) {
        toLoad.push(this.loadImage(i));
      }
    }
    await Promise.all(toLoad);
    this.evictOld(index);
  }
  
  private evictOld(currentIndex: number) {
    const toKeep = new Set(
      Array.from({length: this.maxCacheSize}, (_, i) => currentIndex + i)
    );
    for (const [idx, bitmap] of this.cache) {
      if (!toKeep.has(idx)) {
        bitmap.close(); // Release memory
        this.cache.delete(idx);
      }
    }
  }
}
```

---

### Module: Renderer

**Responsibility:** Draw ImageBitmap to Canvas with fill/fit modes.

**Interface:**
```typescript
interface IRenderer {
  render(bitmap: ImageBitmap, mode: RenderMode): void;
  resize(width: number, height: number): void;
  clear(): void;
}

type RenderMode = 'fill' | 'fit' | 'contain';
```

**Implementation Strategy:**
- **Fill mode** (default): Scale + crop to fill canvas
  - Calculate scale to cover canvas completely
  - Center and crop overflow
- **Fit mode:** Scale to fit inside canvas (letterbox if needed)
- **Contain mode:** Same as fit

**Optimizations:**
```typescript
class Renderer implements IRenderer {
  private ctx: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d', { alpha: false })!;
  }
  
  render(bitmap: ImageBitmap, mode: RenderMode = 'fill') {
    const { width: cw, height: ch } = this.ctx.canvas;
    const { width: iw, height: ih } = bitmap;
    
    if (mode === 'fill') {
      const scale = Math.max(cw / iw, ch / ih);
      const scaledW = iw * scale;
      const scaledH = ih * scale;
      const x = Math.floor((cw - scaledW) / 2);
      const y = Math.floor((ch - scaledH) / 2);
      
      this.ctx.drawImage(bitmap, x, y, scaledW, scaledH);
    }
    // ... other modes
  }
}
```

**HiDPI Support:**
```typescript
resize(width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  this.ctx.canvas.width = width * dpr;
  this.ctx.canvas.height = height * dpr;
  this.ctx.canvas.style.width = `${width}px`;
  this.ctx.canvas.style.height = `${height}px`;
  this.ctx.scale(dpr, dpr);
}
```

---

### Module: FrameEngine

**Responsibility:** Orchestrate all modules, provide public API.

**Interface:**
```typescript
interface IFrameEngine extends EventEmitter {
  loadSequence(sources: ImageSource[]): Promise<void>;
  play(): void;
  pause(): void;
  stop(): void;
  next(): void;
  prev(): void;
  setFPS(fps: number): void;
  setHold(hold: number): void;
  getState(): EngineState;
}

interface EngineState {
  playing: boolean;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  hold: number;
}
```

**Event System:**
```typescript
type EngineEvents = {
  'framechange': { index: number, total: number };
  'play': {};
  'pause': {};
  'ended': {};
  'error': { message: string, error: Error };
};
```

**Lifecycle:**
```
[Idle] ─loadSequence()→ [Loaded] ─play()→ [Playing]
                            ↑               ↓
                            └─────pause()────┘
```

---

## Desktop Application

### Electron Architecture

```
┌──────────────────────────────────────┐
│          Main Process                │
│  ┌────────────┐  ┌────────────┐     │
│  │ Filesystem │  │  Recorder  │     │
│  └──────┬─────┘  └──────┬─────┘     │
│         │                │           │
│         └────────┬───────┘           │
│                  │ IPC                │
└──────────────────┼───────────────────┘
                   │
┌──────────────────┼───────────────────┐
│                  │                   │
│         Renderer Process              │
│  ┌───────────────▼────────────────┐  │
│  │         UI (React)             │  │
│  │  ┌──────────┐  ┌────────────┐ │  │
│  │  │ Explorer │  │   Player   │ │  │
│  │  └──────────┘  └────────────┘ │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │      FrameEngine (Core)        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Main Process

**Responsibilities:**
- Filesystem access (read directories, images)
- Window management
- Video recording (FFmpeg)
- IPC handlers

**Key APIs:**
```typescript
// IPC Channels
const IPC_CHANNELS = {
  'fs:readDir': (path: string) => Promise<DirEntry[]>,
  'fs:readImages': (path: string) => Promise<ImageMetadata[]>,
  'fs:watchDir': (path: string) => void,
  'recorder:start': (options: RecordOptions) => Promise<void>,
  'recorder:stop': () => Promise<string>, // returns file path
};
```

**Security:**
- Context isolation enabled
- `nodeIntegration: false`
- Preload script for safe IPC exposure

### Renderer Process

**Responsibilities:**
- UI rendering (React + Tailwind)
- FrameEngine instantiation and control
- State management (Context API or Zustand)
- User input handling

**Component Structure:**
```
App
├── ExplorerMode
│   ├── FolderGrid
│   │   └── FolderCard (with thumbnail)
│   └── NavControls
└── PlayerMode
    ├── CanvasView (FrameEngine renders here)
    ├── PlayerControls
    ├── SettingsPanel
    └── RecorderControls
```

---

## Web Component

### Custom Element Structure

```typescript
class StereoPlayer extends HTMLElement {
  private engine: FrameEngine;
  private shadow: ShadowRoot;
  private canvas: HTMLCanvasElement;
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.canvas = document.createElement('canvas');
    this.shadow.appendChild(this.canvas);
    this.engine = new FrameEngine(/* ... */);
  }
  
  // Observed attributes
  static get observedAttributes() {
    return ['src', 'fps', 'hold', 'order', 'mode'];
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // React to attribute changes
  }
  
  // Public API
  play() { this.engine.play(); }
  pause() { this.engine.pause(); }
  next() { this.engine.next(); }
  prev() { this.engine.prev(); }
}

customElements.define('stereo-player', StereoPlayer);
```

### Web Loading Strategy

Since we can't use filesystem APIs, images are loaded via:
1. **Fetch API** for remote URLs
2. **Relative paths** for local images (same-origin)
3. **Base64 data URIs** (optional)

```typescript
class WebLoader implements ILoader {
  async loadImage(src: string): Promise<ImageBitmap> {
    const response = await fetch(src);
    const blob = await response.blob();
    return createImageBitmap(blob);
  }
}
```

**CORS Handling:**
- Images must be same-origin OR have CORS headers
- Provide clear error messages for CORS failures
- Docs explain limitations and solutions

---

## Data Flow

### Desktop: Load Folder → Play Sequence

```
User clicks folder
       ↓
[Main] fs:readImages IPC
       ↓
[Main] Reads folder, returns ImageMetadata[]
       ↓
[Renderer] Receives image paths
       ↓
[FrameEngine] loader.loadSequence(paths)
       ↓
[Loader] Loads ImageBitmaps (parallel, preload N)
       ↓
[FrameEngine] Emits 'loaded' event
       ↓
[UI] Shows Player mode
       ↓
User clicks Play
       ↓
[FrameEngine] timer.start(callback)
       ↓
[Timer] requestAnimationFrame loop
       ↓
[Timer] Callback fires every hold frames
       ↓
[Sequencer] index = next()
       ↓
[Loader] bitmap = getBitmap(index)
       ↓
[Renderer] render(bitmap)
       ↓
[Canvas] Image displayed
       ↓
[FrameEngine] Emits 'framechange' event
       ↓
[UI] Updates frame counter
```

### Web: Component Attribute → Playback

```
<stereo-player src="./images">
       ↓
attributeChangedCallback('src', null, './images')
       ↓
[WebLoader] Fetch './images' metadata (how?)
       ↓
(Option A) Fetch manifest.json with image list
(Option B) User provides image list via property
       ↓
[FrameEngine] loader.loadSequence(urls)
       ↓
(Same flow as desktop from here)
```

**Note:** Web component requires explicit image list since we can't "read directory" over HTTP. Solutions:
- Provide `images` property: `player.images = ['a.png', 'b.png']`
- Or fetch `manifest.json` from `src` folder

---

## Performance Optimization

### Target Metrics

- **60 FPS** sustained playback
- **<100ms** initial load time
- **<100MB** memory for 10x 1080p images

### Optimization Techniques

#### 1. ImageBitmap for Decoding

```typescript
// ✅ Fast - decoded off main thread
const bitmap = await createImageBitmap(blob);

// ❌ Slow - blocks main thread
const img = new Image();
img.src = url;
await img.decode();
```

#### 2. Canvas Context Options

```typescript
// Disable alpha channel if not needed (faster compositing)
const ctx = canvas.getContext('2d', { 
  alpha: false,
  desynchronized: true // allows offscreen rendering
});
```

#### 3. Integer Coordinates

```typescript
// ✅ Fast - no sub-pixel rendering
ctx.drawImage(bitmap, Math.floor(x), Math.floor(y));

// ❌ Slow - triggers anti-aliasing
ctx.drawImage(bitmap, x + 0.5, y + 0.5);
```

#### 4. Preloading Strategy

```typescript
// Adaptive preload count based on memory
const preloadCount = Math.min(
  5, // max count
  Math.floor(availableMemory / estimatedImageSize)
);
```

#### 5. Debounce Resize

```typescript
window.addEventListener('resize', debounce(() => {
  renderer.resize(canvas.clientWidth, canvas.clientHeight);
}, 200));
```

#### 6. Offscreen Canvas for Thumbnails

```typescript
// Generate thumbnails without blocking main canvas
const offscreen = new OffscreenCanvas(200, 200);
const ctx = offscreen.getContext('2d');
ctx.drawImage(bitmap, 0, 0, 200, 200);
const thumbnail = await offscreen.convertToBlob();
```

---

## Security Considerations

### Desktop (Electron)

**Context Isolation:**
```javascript
// main.ts
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

**Preload Script:**
```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
  // Only expose safe, validated APIs
});
```

**Input Validation:**
```typescript
// Validate file paths to prevent directory traversal
ipcMain.handle('fs:readDir', async (event, dirPath: string) => {
  const normalized = path.normalize(dirPath);
  if (!normalized.startsWith(app.getPath('home'))) {
    throw new Error('Access denied');
  }
  // ... safe to proceed
});
```

### Web Component

**CORS:**
- Document CORS requirements clearly
- Provide example server config (Access-Control-Allow-Origin)

**XSS Prevention:**
- Sanitize any user-provided HTML/attributes
- Use Shadow DOM for style encapsulation

**CSP Compatibility:**
- No inline scripts in component
- No `eval()` or `Function()` constructors

---

## Testing Strategy

### Unit Tests (Jest)

**Core modules (80%+ coverage):**
```typescript
// Timer.test.ts
describe('Timer', () => {
  it('should call callback at correct intervals', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const timer = new Timer(60, 6); // 60 FPS, hold 6
    timer.start(callback);
    
    jest.advanceTimersByTime(100); // 0.1s = 6 frames at 60fps
    expect(callback).toHaveBeenCalledTimes(1);
    
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
```

**Mocking Canvas:**
```typescript
// Renderer.test.ts
const mockContext = {
  drawImage: jest.fn(),
  clearRect: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
```

### Integration Tests

**FrameEngine with real modules:**
```typescript
describe('FrameEngine integration', () => {
  it('should load and play sequence', async () => {
    const engine = new FrameEngine(/* real dependencies */);
    await engine.loadSequence([mockImage1, mockImage2]);
    engine.play();
    
    await waitFor(() => {
      expect(engine.getState().currentFrame).toBe(1);
    });
  });
});
```

### E2E Tests (Playwright - Optional)

**Desktop app:**
```typescript
test('should navigate folders and play', async () => {
  const app = await launch();
  await app.click('[data-testid="folder-1"]');
  await app.click('[data-testid="enter-button"]');
  await app.click('[data-testid="play-button"]');
  
  const canvas = await app.$('canvas');
  // Assert canvas is rendering (visual regression testing)
});
```

---

## Build & Deployment

### Build Targets

```json
{
  "scripts": {
    "build": "npm run build:core && npm run build:desktop && npm run build:web",
    "build:core": "tsc -p tsconfig.core.json",
    "build:desktop": "webpack --config webpack.electron.js",
    "build:web": "webpack --config webpack.web.js"
  }
}
```

### Webpack Configs

**Desktop (Electron):**
```javascript
// webpack.electron.js
module.exports = [
  {
    // Main process
    target: 'electron-main',
    entry: './desktop/main/main.ts',
    output: { path: './dist/main' }
  },
  {
    // Renderer process
    target: 'electron-renderer',
    entry: './desktop/renderer/app.tsx',
    output: { path: './dist/renderer' }
  }
];
```

**Web Component:**
```javascript
// webpack.web.js
module.exports = {
  entry: './web/StereoPlayer.ts',
  output: {
    filename: 'stereo-player.js',
    library: 'StereoPlayer',
    libraryTarget: 'umd'
  },
  externals: {
    // Don't bundle if user has these
  }
};
```

### Distribution

**Desktop:**
- **electron-builder** for installers
- Targets: Windows (NSIS), macOS (DMG), Linux (AppImage)

**Web:**
- NPM package: `@stereo/player`
- CDN: jsDelivr / unpkg

---

## Decision Log

### ADR-001: TypeScript Strict Mode

**Decision:** Enable TypeScript strict mode.  
**Rationale:** Catch errors early, improve code quality, better IDE support.  
**Trade-offs:** More verbose type annotations, but worth it for maintainability.

### ADR-002: Webpack Over Vite

**Decision:** Use Webpack for builds.  
**Rationale:** Better Electron integration, more mature plugin ecosystem.  
**Trade-offs:** Slower builds than Vite, but acceptable for project size. May revisit in v2.

### ADR-003: React/Preact for Desktop UI

**Decision:** Use React (or Preact for smaller bundle).  
**Rationale:** Team familiarity, rich ecosystem, Tailwind integration.  
**Trade-offs:** Adds framework dependency, but UI is small enough that bundle size is acceptable.

### ADR-004: ImageBitmap Over Image

**Decision:** Use ImageBitmap API for all image loading.  
**Rationale:** Better performance (off-thread decoding), explicit memory management.  
**Trade-offs:** Less browser support (but acceptable given target browsers).

### ADR-005: Fill Mode as Default

**Decision:** Default rendering mode is "fill" (crop to fill canvas).  
**Rationale:** Matches creative tool expectations (Photoshop, TouchDesigner). Users want immersive fullscreen.  
**Trade-offs:** Some images will be cropped, but users can switch to fit/contain if needed.

---

## Future Architectural Changes

### Potential Refactors (Post-v1)

- **Plugin System:** Allow third-party effects/filters via hooks
- **Worker Threads:** Move image loading to Web Workers for true parallelism
- **WebGL Renderer:** For shader-based effects (gaussian splatting, depth maps)
- **WASM Core:** Rewrite performance-critical parts in Rust/C++

---

**Document Status:** Living Document  
**Last Updated:** 2024-10-31  
**Next Review:** After Phase 1 completion
