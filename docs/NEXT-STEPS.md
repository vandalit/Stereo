# Next Steps - Stereo Project

**Last Updated:** 2026-11-01  
**Current Status:** Phase 2 at 70%, awaiting UI redesign

---

## Immediate Actions (This Session)

### ✅ Completed
1. ✅ Built complete Electron app structure (main, preload, renderer)
2. ✅ Created Explorer and Player UIs (functional but styled differently)
3. ✅ Set up TypeScript compilation and build system
4. ✅ Documented Phase 2 progress (STATUS.md, ROADMAP.md)
5. ✅ Captured UI design reference from user mockup
6. ✅ Analyzed Metamedia project for design inspiration
7. ✅ Created comprehensive UI-DESIGN-REFERENCE.md

### ⏳ Pending User Input
- User considering whether to take a break
- Ready to continue with UI redesign when user confirms

---

## Next Session Priorities

### 1. UI Redesign (High Priority)
**Goal:** Remake both Explorer and Player to match minimalista style

**Explorer Window Redesign:**
- [ ] Remove elaborate header
- [ ] Create minimal toolbar: `[📁 Folder] [⚙ Settings] [▶ Play]`
- [ ] Simplify thumbnail grid (no borders, clean spacing)
- [ ] Remove info panels
- [ ] Apply Metamedia color scheme (black bg, semi-transparent panels)
- [ ] Use monospace font for any text
- [ ] Add status chips if needed

**Player Window Redesign:**
- [ ] Fullscreen canvas with minimal chrome
- [ ] Bottom toolbar: `[📁][◀][▶][⏺][▯][▯][▯][▯][⚙]`
- [ ] Right sidebar with vertical thumbnail stack
- [ ] Frame counter (top-left, small, discrete)
- [ ] Remove overlay controls
- [ ] Apply backdrop blur to panels
- [ ] Settings as floating panel (collapsible)

**Design System:**
- [ ] Create CSS variables based on Metamedia
- [ ] Standardize spacing (6-12px)
- [ ] Standardize border-radius (3-7px)
- [ ] Icon sizing (11-12px)
- [ ] Button sizing (8px 14px padding)

### 2. FrameEngine Integration (High Priority)
**Goal:** Make Player actually work with core engine

**Tasks:**
- [ ] Set up Webpack or electron-vite for renderer bundling
- [ ] Configure to bundle core modules with player
- [ ] Update player.js to import and use real FrameEngine
- [ ] Test end-to-end image playback
- [ ] Verify FPS and Hold controls work live

**Bundling Options:**
1. **Webpack** - Most flexible, widely used
2. **electron-vite** - Optimized for Electron
3. **Electron Forge** - All-in-one solution
4. **Rollup** - Lighter weight alternative

**Recommendation:** electron-vite for speed and Electron optimization

### 3. Core Features (Medium Priority)

**Thumbnail Generation:**
- [ ] Use `sharp` library for image resizing
- [ ] Generate 48x48 thumbnails
- [ ] Cache in temp directory
- [ ] Lazy load on scroll

**Image Loading:**
- [ ] Test filesystem module in runtime
- [ ] Verify image sorting (natural sort)
- [ ] Handle different image formats
- [ ] Add loading states

**Settings Panel:**
- [ ] Create floating panel UI (Metamedia style)
- [ ] Add controls: Sort order, FPS presets, Render mode
- [ ] Implement persistence (JSON config file)
- [ ] Test state sync between windows

### 4. Testing & Polish (Low Priority)

**End-to-End Testing:**
- [ ] Open app → Select folder → See thumbnails
- [ ] Click Play → Player opens → Images play
- [ ] Adjust FPS/Hold → See changes
- [ ] Keyboard shortcuts work
- [ ] Close player → Return to explorer

**Error Handling:**
- [ ] Empty folder scenario
- [ ] No images found
- [ ] Unsupported format
- [ ] Large image handling

**Performance:**
- [ ] Thumbnail generation speed
- [ ] Player playback smoothness
- [ ] Memory usage with many images

---

## Technical Decisions Needed

### Bundling Strategy
**Question:** Which bundler to use for renderer?

**Options:**
- **Webpack**: Most flexible, lots of plugins
- **electron-vite**: Purpose-built for Electron
- **Electron Forge**: All-in-one (webpack under hood)

**Recommendation:** Start with electron-vite for simplicity

### Settings Persistence
**Question:** How to save user settings?

**Options:**
- **JSON file**: Simple, readable, version controllable
- **electron-store**: NPM package, automatic
- **SQLite**: Overkill for this use case

**Recommendation:** Start with JSON file in user data directory

### Thumbnail Strategy
**Question:** When and how to generate thumbnails?

**Options:**
- **On-demand**: Generate when folder loads
- **Background**: Generate async after load
- **Persistent cache**: Save to disk, reuse

**Recommendation:** On-demand with persistent cache

---

## Phase 2 Completion Checklist

**Must Have (to reach 100%):**
- [ ] UI redesigned to match Metamedia style
- [ ] Player integrated with FrameEngine
- [ ] Thumbnail generation working
- [ ] Settings panel functional
- [ ] End-to-end workflow tested

**Nice to Have:**
- [ ] Multiple render modes working
- [ ] Presets (common FPS/hold combos)
- [ ] Drag-and-drop folder selection
- [ ] Recent folders list

**Can Wait for Phase 3:**
- Recording/export functionality
- Advanced effects
- Performance optimizations

---

## Files to Create/Modify

### New Files
```
desktop/renderer/styles/variables.css  (Metamedia design tokens)
desktop/renderer/components/           (Reusable UI components)
electron.vite.config.js                (Bundler config)
desktop/main/config.ts                 (Settings management)
```

### Files to Modify
```
desktop/renderer/explorer.html         (UI redesign)
desktop/renderer/explorer.css          (Apply new design)
desktop/renderer/player.html           (UI redesign)
desktop/renderer/player.css            (Apply new design)
desktop/renderer/player.js             (Integrate FrameEngine)
package.json                           (Add electron-vite)
```

### Files to Reference
```
docs/UI-DESIGN-REFERENCE.md           (Design system)
docs/ARCHITECTURE.md                   (Technical reference)
docs/PHASE-2-STATUS.md                 (Current state)
```

---

## Questions for User

1. **UI Redesign:** Ready to start now or prefer to rest first?
2. **Bundler Choice:** electron-vite ok or prefer webpack?
3. **Feature Priority:** Thumbnails first or FrameEngine integration first?
4. **Design Feedback:** Any specific changes to the mockup you showed?

---

## Session Summary

**What We Did:**
- ✅ Built complete Electron structure (70% of Phase 2)
- ✅ Analyzed Metamedia for design inspiration
- ✅ Created comprehensive design documentation
- ✅ Identified next steps clearly

**What's Next:**
- UI redesign (Explorer + Player)
- FrameEngine integration
- Testing and polish

**Current Blocker:**
- Awaiting user decision to continue or rest

---

**Ready to continue when you are!** 🚀
