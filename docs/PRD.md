# Product Requirements Document - Stereo

**Version:** 1.0  
**Date:** 2024-10-31  
**Status:** Planning Phase  
**Author:** vandalit

---

## Executive Summary

**Stereo** is a high-performance visual frame player designed for stereoscopy, sprite animation, and experimental visual effects. It provides precise control over image alternation timing, enabling creative professionals to create depth illusions, animations, and interactive web experiences.

The product consists of two complementary implementations:
1. **Desktop Application** (Electron) - Standalone tool with filesystem access and video recording
2. **Web Component** - Reusable module for embedding in web projects

Both share a common TypeScript core engine, ensuring consistent behavior and maintainability.

---

## Problem Statement

### Current Challenges

**For Stereoscopy Creators:**
- Existing tools are heavyweight (video editors, 3D software)
- Difficult to achieve precise frame alternation timing
- No easy way to preview stereoscopic effects in real-time
- Export process is cumbersome

**For Web Developers:**
- No lightweight solution for image sequence effects
- Custom implementations are performance-limited
- Difficult to achieve 60+ FPS alternation
- Sprite animation libraries are overly complex

**For Creative Technologists:**
- TouchDesigner and similar tools have steep learning curves
- Need simple tool for rapid prototyping of visual effects
- Want flexibility to experiment with frame rates and timing
- Desire portable solution that works desktop and web

### Opportunity

Create a **focused, high-performance tool** that excels at one thing: cycling through images with precise timing control. By separating concerns (core engine vs. platform-specific features) and prioritizing performance, we can build a tool that's both powerful and accessible.

---

## Goals & Non-Goals

### Goals

✅ **Performance First**
- Achieve 60+ FPS alternation on modern hardware
- Support 4K+ images without performance degradation
- Efficient memory management with smart buffering

✅ **Dual Platform**
- Desktop app for content creation and recording
- Web component for deployment and distribution

✅ **Precise Control**
- Separate FPS and hold frame controls
- Real-time adjustment without restart
- Predictable, deterministic timing

✅ **Minimal UI**
- Compact, elastic interface that doesn't obscure content
- Keyboard-driven navigation
- Context-sensitive controls (Explorer vs Player)

✅ **Developer Friendly**
- Well-documented API
- Framework-agnostic web component
- Easy integration into existing projects

### Non-Goals

❌ **Not a video editor** - No timeline editing, trimming, or effects stack  
❌ **Not an image editor** - No filters, adjustments, or retouching  
❌ **Not a 3D tool** - Basic stereoscopy only, no depth reconstruction (v1)  
❌ **Not a streaming platform** - No cloud hosting or social features (v1)  
❌ **Not a replacement for TouchDesigner** - Focused tool, not visual programming environment

---

## User Personas

### 1. **Stereoscopy Experimenter**
- **Who:** Creative technologist exploring 3D illusions
- **Need:** Quick way to test left/right image pairs and find optimal alternation rate
- **Pain:** Current tools (Photoshop, video editors) are slow and inflexible
- **Usage:** Desktop app to preview effects, adjust timing, export demos

### 2. **Web Developer**
- **Who:** Frontend developer building portfolio or marketing sites
- **Need:** Lightweight component for hero sections or galleries
- **Pain:** Custom Canvas code is buggy and doesn't hit 60 FPS
- **Usage:** Web component imported via npm or CDN

### 3. **VJ / Performance Artist**
- **Who:** Visual performer creating live visuals for events
- **Need:** Reliable, keyboard-driven tool for triggering image sequences
- **Pain:** VJ software is expensive and overcomplicated
- **Usage:** Desktop app with keyboard shortcuts, minimal chrome

### 4. **Sprite Animator**
- **Who:** Game developer or animator creating sprite sheets
- **Need:** Preview tool to test animation timing before implementation
- **Pain:** Game engines require rebuilding to preview timing changes
- **Usage:** Desktop app to iterate on frame holds and playback speed

---

## Functional Requirements

### Core Engine

#### FR-1: Frame Sequencing
- **Must** support loading N images (2 to 1000+) from a source
- **Must** cycle through images in configurable order (alphabetical, date, size)
- **Must** support circular looping (next after last returns to first)
- **Must** expose `next()`, `prev()`, `jumpTo(index)` methods

#### FR-2: Timing Control
- **Must** support FPS targets: 24, 30, 60, 120 (and custom)
- **Must** support hold frames: 1-N frames per image
- **Must** calculate effective alternation frequency: `fps / holdFrames`
- **Must** use `requestAnimationFrame` for timing accuracy
- **Should** adapt to display refresh rate when possible

#### FR-3: Image Loading
- **Must** use `ImageBitmap` API for optimal performance
- **Must** preload current + N+1 + N+2 frames (configurable)
- **Must** release old ImageBitmaps to prevent memory leaks
- **Should** support JPEG, PNG, WebP, SVG formats
- **Could** support AVIF and other modern formats

#### FR-4: Rendering
- **Must** use Canvas API for rendering
- **Must** support "fill" mode (scale + crop to fill canvas)
- **Should** support "fit" and "contain" modes
- **Must** optimize for HiDPI displays (devicePixelRatio)
- **Must** disable alpha channel when not needed (`alpha: false`)
- **Must** use integer coordinates to avoid sub-pixel rendering

#### FR-5: State Management
- **Must** expose state: `playing`, `paused`, `stopped`
- **Must** emit events: `framechange`, `play`, `pause`, `ended`
- **Must** allow subscribing to state changes
- **Must** persist state across mode switches (Explorer ↔ Player)

### Desktop Application

#### FR-6: Filesystem Integration
- **Must** read local directories and list folders
- **Must** read image files from selected folder
- **Must** support sorting by: name, date modified, date created, file size
- **Should** watch for folder changes and auto-reload
- **Could** support drag-and-drop of folders

#### FR-7: Explorer Mode
- **Must** display grid/list of folders with thumbnails
- **Must** generate thumbnails with mini FrameEngine instance (2fps preview)
- **Must** support navigation: ◄ (prev folder), ▶ (next folder), ▲ (up directory)
- **Must** support ENTER to select folder and switch to Player
- **Should** display folder metadata (name, image count)
- **Could** support filtering and search

#### FR-8: Player Mode
- **Must** display full-canvas playback
- **Must** overlay minimal controls (lateral/bottom)
- **Must** support: PLAY/PAUSE (spacebar/ENTER), ◄ (prev frame), ▶ (next frame)
- **Must** support ▲ UP to return to Explorer
- **Must** display FPS and hold frame sliders
- **Must** update playback in real-time when adjusting controls
- **Should** display current frame index and total count
- **Could** support fullscreen mode (F11)

#### FR-9: Settings Panel
- **Must** provide dropdown for sort order (name, date, size)
- **Must** provide preset buttons for aspect ratios (16:9, 4:3, 1:1, 21:9, Free)
- **Must** apply aspect ratio to window dimensions
- **Must** persist settings to local config file
- **Should** allow configuring preload count
- **Could** support custom keybindings

#### FR-10: Video Recording
- **Must** support recording canvas output to video file
- **Must** support MP4 and WebM formats
- **Must** provide REC button in Player UI
- **Must** show recording indicator while active
- **Should** allow configuring output FPS (may differ from playback FPS)
- **Should** show progress during encoding
- **Should** notify user when file is ready with file path
- **Could** support GIF export

### Web Component

#### FR-11: Component API
- **Must** register as Custom Element `<stereo-player>`
- **Must** support attributes:
  - `src` - folder/URL of images
  - `fps` - target FPS (default: 60)
  - `hold` - hold frames (default: 1)
  - `order` - sort order (default: alphabetical)
  - `mode` - fill/fit/contain (default: fill)
- **Must** support methods:
  - `play()`, `pause()`, `stop()`
  - `next()`, `prev()`, `jumpTo(index)`
  - `setFPS(fps)`, `setHold(hold)`
- **Must** emit custom events:
  - `framechange` (detail: {index, total})
  - `play`, `pause`, `ended`
- **Should** use Shadow DOM for style encapsulation

#### FR-12: Web Loading
- **Must** support loading images via URLs (relative or absolute)
- **Must** handle CORS properly
- **Should** provide loading state and progress
- **Could** support base64 data URIs

#### FR-13: Framework Integration
- **Must** work in vanilla JavaScript
- **Must** work with React (as ref or wrapper)
- **Must** work with Vue (as component)
- **Should** provide TypeScript types
- **Should** provide framework-specific wrappers for convenience

---

## Non-Functional Requirements

### Performance

**NFR-1: Frame Rate**
- Target: 60 FPS sustained playback
- Acceptable: 30 FPS minimum on lower-end hardware
- Measurement: Chrome DevTools Performance profiler

**NFR-2: Load Time**
- Target: <100ms to load and display first frame
- Acceptable: <500ms for 10 images
- Measurement: `performance.now()` timestamps

**NFR-3: Memory Usage**
- Target: <100MB for 10x 1080p images
- Acceptable: <1GB for 100x 4K images
- Measurement: Chrome DevTools Memory profiler

**NFR-4: Responsiveness**
- Target: <50ms response to user input (play/pause/next/prev)
- Acceptable: <100ms
- Measurement: Input event to visual change timing

### Compatibility

**NFR-5: Browser Support (Web Component)**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

**NFR-6: Desktop Platform Support**
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+)

**NFR-7: Node.js Requirements**
- Node.js 18+ LTS
- npm 9+

### Reliability

**NFR-8: Error Handling**
- Graceful degradation when images fail to load
- Clear error messages for invalid configurations
- No crashes from user input

**NFR-9: Memory Safety**
- No memory leaks during extended playback
- Proper cleanup on component unmount / app close

### Usability

**NFR-10: Learning Curve**
- New user should be able to play their first sequence in <2 minutes
- All core features discoverable without reading docs
- Keyboard shortcuts visible in UI or via tooltip

**NFR-11: Accessibility**
- Keyboard navigation for all features
- Screen reader support for controls (ARIA labels)
- High contrast mode support

### Maintainability

**NFR-12: Code Quality**
- TypeScript strict mode enabled
- 80%+ test coverage on core modules
- JSDoc comments on all public APIs
- Consistent code style (ESLint + Prettier)

**NFR-13: Documentation**
- README with quick start
- API documentation for web component
- Architecture documentation for contributors
- Inline code comments for complex logic

---

## User Stories

### Desktop App

**Story 1: Quick Preview**
> As a stereoscopy experimenter,  
> I want to quickly load a folder of image pairs and see them alternate,  
> So that I can validate my captures work before post-processing.

**Acceptance Criteria:**
- Open app, click "Open Folder", select directory
- Images display and begin alternating immediately
- Default settings provide reasonable preview (30 FPS, 10 hold)

---

**Story 2: Fine-Tune Timing**
> As a VJ preparing for a performance,  
> I want to adjust frame rate and hold duration in real-time,  
> So that I can dial in the perfect effect for my set.

**Acceptance Criteria:**
- Sliders for FPS and Hold visible during playback
- Changes apply immediately without restart
- Visual feedback shows current values

---

**Story 3: Record Output**
> As a creative sharing work online,  
> I want to export my sequence as a video file,  
> So that I can post it on social media or embed in websites.

**Acceptance Criteria:**
- Click REC button in Player mode
- Select format (MP4/WebM) and duration
- Encoding completes and file location is shown
- Video plays in standard media players

---

### Web Component

**Story 4: Drop-In Effect**
> As a web developer building a portfolio,  
> I want to add a stereoscopic effect to my hero section,  
> So that it stands out without writing custom Canvas code.

**Acceptance Criteria:**
- Add `<script>` tag from CDN
- Add `<stereo-player src="./images">` to HTML
- Effect plays automatically on page load
- No JavaScript configuration required

---

**Story 5: Programmatic Control**
> As a creative developer building an interactive experience,  
> I want to control playback via JavaScript,  
> So that I can integrate the effect with other interactions.

**Acceptance Criteria:**
- Access player via `document.querySelector('stereo-player')`
- Call `.play()`, `.pause()`, `.next()` methods
- Listen to `framechange` events
- All methods work reliably

---

## UI/UX Specifications

### Design Principles

1. **Minimal Chrome** - UI should not compete with content
2. **Context Sensitivity** - Controls adapt to mode (Explorer vs Player)
3. **Keyboard First** - All actions accessible via keyboard
4. **Elastic Layout** - UI adapts to window size and content
5. **Immediate Feedback** - Changes apply instantly, no "Apply" button

### Desktop UI

#### Explorer Mode Layout

```
┌────────────────────────────────────┐
│  Stereo - Explorer                 │
├────────────────────────────────────┤
│                                    │
│   ┌────┐  ┌────┐  ┌────┐  ┌────┐ │
│   │ 📁 │  │ 📁 │  │ 📁 │  │ 📁 │ │
│   │Proj│  │Proj│  │Proj│  │Proj│ │
│   │  A │  │  B │  │  C │  │  D │ │
│   └────┘  └────┘  └────┘  └────┘ │
│   (animated thumbnails 2fps)      │
│                                    │
└────────────────────────────────────┘
│   [◄]  [▲ UP]  [▶]  [↵ ENTER]    │
└────────────────────────────────────┘
```

#### Player Mode Layout

```
┌────────────────────────────────────┐
│          [canvas fullscreen]       │
│                                    │
│          [image content]           │
│                                    │
│ ┌────┐                             │
│ │FPS │  ← Sidebar controls         │
│ │    │     (minimal, semi-transparent)
│ │Hold│                             │
│ └────┘                             │
└────────────────────────────────────┘
│ [◄] [⏯ PLAY/PAUSE] [▶] [▲UP] [⚙] │
└────────────────────────────────────┘
```

#### Settings Panel (Overlay)

```
┌─────────────────────┐
│ Settings            │
├─────────────────────┤
│ Order:              │
│ [Alphabetical ▼]    │
│                     │
│ Aspect Ratio:       │
│ [16:9][4:3][1:1]... │
│                     │
│ Preload: [3 ▼]      │
│                     │
│ [Close]             │
└─────────────────────┘
```

### Web Component UI

The web component has **no chrome** by default—just the canvas. Control is entirely programmatic via JavaScript API. Optionally, a companion UI library can provide controls as separate web components.

---

## Technical Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical design.

### High-Level Architecture

```
┌─────────────────────────────────────┐
│         Core Engine (TS)            │
│  Timer · Sequencer · Loader · Renderer │
└──────────┬──────────────────┬───────┘
           │                  │
    ┌──────▼─────┐     ┌─────▼──────┐
    │  Desktop   │     │    Web     │
    │  (Electron)│     │ (Component)│
    │            │     │            │
    │ • Filesystem    │ • Shadow DOM │
    │ • IPC           │ • Attributes │
    │ • FFmpeg        │ • Events     │
    └────────────┘     └────────────┘
```

### Key Technologies

- **Language:** TypeScript (strict mode)
- **Desktop:** Electron 28+
- **Build:** Webpack 5
- **UI:** React/Preact + Tailwind CSS
- **Testing:** Jest + ts-jest
- **Recording:** FFmpeg (fluent-ffmpeg)
- **Rendering:** Canvas API + ImageBitmap

---

## Success Metrics

### Launch Criteria (v1.0)

- ✅ All functional requirements (FR-1 through FR-13) implemented
- ✅ 80%+ test coverage on core modules
- ✅ Desktop app runs on Windows, macOS, Linux
- ✅ Web component works in Chrome, Firefox, Safari
- ✅ Documentation complete (README, ARCHITECTURE, API docs)
- ✅ No critical bugs in issue tracker

### Post-Launch Metrics

**Adoption:**
- GitHub stars (target: 100 in first 3 months)
- npm downloads (target: 500/month after 6 months)
- Desktop app downloads (target: 1000 in first year)

**Quality:**
- Bug report rate (<5 critical bugs per month)
- Average issue resolution time (<2 weeks)
- User satisfaction (survey: >4/5 stars)

**Performance:**
- 95th percentile FPS >55 (target: 60)
- Memory usage <200MB for typical use
- No memory leaks in 24-hour stress test

---

## Risks & Mitigations

### Technical Risks

**Risk 1: Canvas Performance**
- **Impact:** High - Core value proposition
- **Likelihood:** Medium
- **Mitigation:** Early prototyping, benchmark against targets, fallback to lower FPS

**Risk 2: Memory Leaks**
- **Impact:** High - App unusable after extended use
- **Likelihood:** Medium
- **Mitigation:** Automated memory profiling, stress testing, proper cleanup patterns

**Risk 3: Browser Compatibility**
- **Impact:** Medium - Limits web component adoption
- **Likelihood:** Low
- **Mitigation:** Test on multiple browsers, polyfills if needed, clear docs on supported browsers

### Product Risks

**Risk 4: Too Niche**
- **Impact:** Medium - Limited user base
- **Likelihood:** Medium
- **Mitigation:** Position as general-purpose frame player, highlight multiple use cases, gather feedback early

**Risk 5: Feature Creep**
- **Impact:** Medium - Delays launch, increases complexity
- **Likelihood:** High
- **Mitigation:** Strict adherence to Non-Goals, defer post-v1 features to roadmap

---

## Open Questions

1. **Image Formats:** Should we support AVIF and HEIC in v1, or defer to v2?
   - *Decision needed by:* Phase 1 completion
   - *Recommendation:* Defer, focus on PNG/JPEG/WebP

2. **Playlist Feature:** Is playlist/sequence chaining valuable enough for v1?
   - *Decision needed by:* Phase 2 planning
   - *Recommendation:* Defer to v2, keep v1 simple

3. **Mobile Apps:** Should we plan React Native from start, or add later?
   - *Decision needed by:* Architecture finalization
   - *Recommendation:* Core is already platform-agnostic, add in v2

4. **Cloud Storage:** Do users want to load images from Google Drive, Dropbox, etc?
   - *Decision needed by:* Phase 4 (Web Component)
   - *Recommendation:* Not in v1, gather feedback first

---

## Appendix

### Glossary

- **FPS (Frames Per Second):** Display refresh rate, how many times per second the canvas updates
- **Hold Frames:** How many display frames an image is shown before switching to next
- **Effective Frequency:** Actual alternation rate, calculated as `fps / holdFrames` (in Hz)
- **Stereoscopy:** Technique of creating depth illusion by showing slightly different images to each eye
- **ImageBitmap:** Browser API for optimized image decoding and rendering
- **Fill Mode:** Scaling behavior where image fills canvas, cropping if necessary to maintain aspect

### References

- [Canvas Optimization - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [ImageBitmap API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap)
- [Web Components - MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)

---

**Document Status:** Approved  
**Last Updated:** 2024-10-31  
**Next Review:** Phase 2 kickoff
