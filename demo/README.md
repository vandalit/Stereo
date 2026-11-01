# Stereo Demo

Interactive demonstration of the Stereo Frame Engine.

## What's Included

- **3 SVG Test Images** - Frames with different vanishing points to demonstrate stereoscopic effect
- **Interactive Controls** - FPS, Hold frames, render modes
- **Real-time Info** - State, frame counter, effective frequency
- **Complete Core Engine** - Uses all 5 core modules

## Running the Demo

### Option 1: Using npm script (Recommended)

```bash
npm run demo
```

Then open: http://localhost:8080

### Option 2: Manual

```bash
node demo/serve.js
```

Then open: http://localhost:8080

### Option 3: Any HTTP server

You can use any static file server, just make sure to serve from the project root so that `/core/` paths resolve to `/dist/core/`.

## Features Demonstrated

### 1. **Frame Alternation**
- Load 3 SVG images with different perspectives
- Automatic playback at configurable rates
- Manual frame navigation

### 2. **Timing Control**
- **FPS**: 1-120 frames per second (display refresh rate)
- **Hold Frames**: 1-30 frames to hold each image
- **Effective Frequency**: FPS ÷ Hold = alternation rate in Hz

### 3. **Render Modes**
- **Fill**: Scale and crop to fill canvas completely
- **Fit**: Scale to fit inside canvas (letterbox if needed)
- **Contain**: Same as fit

### 4. **Playback Control**
- Play / Pause / Stop
- Previous / Next frame navigation
- Real-time FPS and Hold adjustments

## Test Images

### frame-1.svg - Left Perspective
- Vanishing point on the left
- Creates leftward depth perception

### frame-2.svg - Right Perspective
- Vanishing point on the right
- Creates rightward depth perception

### frame-3.svg - Center Perspective
- Vanishing point in center
- Neutral perspective

When alternated rapidly (e.g., 10 Hz), these create an illusion of depth and movement.

## Recommended Settings for Stereoscopy

1. **Slow Alternation** (Visible switches)
   - FPS: 30
   - Hold: 15
   - Frequency: 2 Hz

2. **Medium Alternation** (Stereoscopic sweet spot)
   - FPS: 60
   - Hold: 6
   - Frequency: 10 Hz

3. **Fast Alternation** (Smooth blending)
   - FPS: 60
   - Hold: 2
   - Frequency: 30 Hz

4. **Maximum Speed** (Perceptual fusion)
   - FPS: 120
   - Hold: 1
   - Frequency: 120 Hz (if supported)

## How It Works

The demo uses all 5 core modules:

```javascript
import { FrameEngine } from '../core/FrameEngine.js';

const engine = new FrameEngine(canvas, {
  fps: 60,
  hold: 6,
  mode: 'fill'
});

await engine.loadSequence([
  './images/frame-1.svg',
  './images/frame-2.svg',
  './images/frame-3.svg'
]);

engine.play();
```

The FrameEngine coordinates:
- **Timer**: Controls frame timing
- **Sequencer**: Manages frame navigation
- **Loader**: Loads and caches ImageBitmaps
- **Renderer**: Draws frames to canvas

## Browser Console

Open browser console (F12) to see detailed logs:
- Load events
- Playback events
- Frame change events
- Error events (if any)

## Next Steps

After testing the demo:
1. Take screenshots of different render modes
2. Record GIF of alternation effect
3. Add screenshots to main README.md
4. Consider adding more test images

## Troubleshooting

**Module not found errors:**
- Make sure you ran `npm run build` first
- Server must be started from project root

**Images not loading:**
- Check browser console for CORS errors
- Make sure server is running (not file://)

**Performance issues:**
- Try lower FPS settings
- Check browser performance tab
- Some browsers may cap refresh rate

## Performance Notes

The engine is optimized for 60+ FPS:
- Uses ImageBitmap for hardware-accelerated decoding
- Integer coordinates prevent sub-pixel rendering
- Alpha channel disabled for faster compositing
- RequestAnimationFrame for smooth timing

Actual performance depends on:
- Browser and hardware
- Display refresh rate
- Image size and complexity
- System load
