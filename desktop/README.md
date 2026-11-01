# Stereo Desktop Application

Electron-based desktop application for browsing and playing image sequences with precise timing control.

## Architecture

```
desktop/
├── main/              # Main process (Node.js)
│   ├── index.ts       # Entry point, app lifecycle
│   ├── windows.ts     # Window management
│   └── filesystem.ts  # File operations
├── preload/           # Preload scripts (IPC bridge)
│   └── index.ts       # Context bridge API
└── renderer/          # Renderer process (UI)
    ├── explorer.html  # Folder browser UI
    ├── explorer.js    # Explorer logic
    ├── player.html    # Fullscreen player UI
    ├── player.js      # Player logic
    └── styles/        # CSS stylesheets
```

## Features

### Explorer Window
- **Folder Selection**: Browse filesystem to select image folders
- **Thumbnail Grid**: Visual preview of all images
- **Image Count**: Display total images found
- **Playback Settings**: Configure FPS and hold frames
- **Quick Launch**: Open player with selected images

### Player Window
- **Fullscreen Canvas**: Immersive playback experience
- **On-Screen Controls**: Fade-in/fade-out overlay
- **Live Adjustments**: Change FPS/hold during playback
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause toggle
  - `Escape`: Close player
  - `Ctrl+Q`: Quit application
- **Auto-Hide Cursor**: Cursor hides after 3 seconds of inactivity

## IPC Channels

### Main → Renderer
- `player:loadImages` - Send image paths to player
- `player:play` - Start playback
- `player:pause` - Pause playback
- `player:stop` - Stop playback
- `player:togglePlayPause` - Toggle play/pause
- `player:setFps` - Update FPS value
- `player:setHold` - Update hold frames value

### Renderer → Main
- `fs:selectFolder` - Open folder selection dialog
- `fs:loadImages` - Load images from folder path
- `window:openPlayer` - Create player window
- `window:closePlayer` - Close player window

## Development

### Build
```bash
npm run build              # Build all (core + desktop)
npm run build:desktop      # Build desktop only
```

### Run
```bash
npm run electron           # Production mode
npm run electron:dev       # Development mode (with devtools)
```

### Package
```bash
npm run dist               # Build for current platform
npm run dist:linux         # Linux AppImage + deb
npm run dist:mac           # macOS dmg + zip
npm run dist:win           # Windows nsis + portable
```

## Current Status

**Phase 2 Progress: 70%**

✅ **Complete:**
- Main process structure
- IPC communication layer
- Window management
- UI layouts (Explorer + Player)
- Keyboard shortcuts
- Build configuration

🚧 **In Progress:**
- Player integration with FrameEngine (needs bundling)
- Image thumbnail generation
- Settings persistence

⏳ **Pending:**
- Settings panel
- State synchronization
- Full integration testing

## Known Issues

1. **FrameEngine Integration**: Player UI needs proper bundling to import core modules
2. **Thumbnails**: Explorer needs thumbnail generation for large images
3. **Settings**: No persistence layer yet for user preferences

## Next Steps

1. Set up Webpack/Rollup for renderer bundling
2. Integrate FrameEngine into player window
3. Implement thumbnail generation
4. Add settings panel
5. Full end-to-end testing

---

Last Updated: 2026-11-01
