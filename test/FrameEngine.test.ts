/**
 * FrameEngine module tests
 * Tests integration of Timer, Sequencer, Loader, and Renderer
 */

import { FrameEngine } from '../core/FrameEngine';
import type { ImageSource } from '../core/types';

// Mock image sources
const mockImages: ImageSource[] = [
  'image1.png',
  'image2.png',
  'image3.png'
];

describe('FrameEngine', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create engine with default config', () => {
      const engine = new FrameEngine(canvas);
      expect(engine).toBeDefined();
      expect(engine.getState().state).toBe('idle');
    });

    it('should create engine with custom config', () => {
      const engine = new FrameEngine(canvas, {
        fps: 30,
        hold: 10,
        preloadCount: 5,
        maxCacheSize: 15,
        mode: 'fit'
      });
      expect(engine).toBeDefined();
    });

    it('should throw error if canvas is null', () => {
      expect(() => new FrameEngine(null as any)).toThrow('Canvas element is required');
    });
  });

  describe('Load Sequence', () => {
    it('should load sequence of images', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const state = engine.getState();
      expect(state.state).toBe('loaded');
      expect(state.totalFrames).toBe(3);
    });

    it('should emit loaded event', async () => {
      const engine = new FrameEngine(canvas);
      const loadedHandler = jest.fn();
      engine.on('loaded', loadedHandler);
      
      await engine.loadSequence(mockImages);
      
      expect(loadedHandler).toHaveBeenCalledWith({
        totalFrames: 3
      });
    });

    it('should handle empty sequence', async () => {
      const engine = new FrameEngine(canvas);
      await expect(engine.loadSequence([])).rejects.toThrow();
    });

    it('should reset to first frame on load', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      expect(engine.getState().currentFrame).toBe(0);
    });
  });

  describe('Play/Pause/Stop', () => {
    it('should start playing', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      
      expect(engine.getState().state).toBe('playing');
    });

    it('should emit play event', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const playHandler = jest.fn();
      engine.on('play', playHandler);
      
      engine.play();
      
      expect(playHandler).toHaveBeenCalled();
    });

    it('should pause playback', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.pause();
      
      expect(engine.getState().state).toBe('paused');
    });

    it('should emit pause event', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const pauseHandler = jest.fn();
      engine.on('pause', pauseHandler);
      
      engine.play();
      engine.pause();
      
      expect(pauseHandler).toHaveBeenCalled();
    });

    it('should stop playback', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.stop();
      
      expect(engine.getState().state).toBe('stopped');
    });

    it('should emit stop event', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const stopHandler = jest.fn();
      engine.on('stop', stopHandler);
      
      engine.play();
      engine.stop();
      
      expect(stopHandler).toHaveBeenCalled();
    });

    it('should not play if no sequence loaded', () => {
      const engine = new FrameEngine(canvas);
      expect(() => engine.play()).toThrow('No sequence loaded');
    });

    it('should allow resume after pause', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.pause();
      engine.play();
      
      expect(engine.getState().state).toBe('playing');
    });
  });

  describe('Navigation', () => {
    it('should advance to next frame', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.next();
      
      expect(engine.getState().currentFrame).toBe(1);
    });

    it('should go to previous frame', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.next(); // Go to 1
      engine.prev(); // Back to 0
      
      expect(engine.getState().currentFrame).toBe(0);
    });

    it('should emit framechange event', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const framechangeHandler = jest.fn();
      engine.on('framechange', framechangeHandler);
      
      engine.next();
      
      expect(framechangeHandler).toHaveBeenCalledWith({
        index: 1,
        total: 3
      });
    });

    it('should render frame on navigation', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      // Just verify no errors - rendering is tested in Renderer module
      expect(() => engine.next()).not.toThrow();
      expect(engine.getState().currentFrame).toBe(1);
    });

    it('should wrap around at end', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.next(); // 1
      engine.next(); // 2
      engine.next(); // 0 (wrap)
      
      expect(engine.getState().currentFrame).toBe(0);
    });
  });

  describe('FPS and Hold Controls', () => {
    it('should update FPS', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.setFPS(30);
      
      expect(engine.getState().fps).toBe(30);
    });

    it('should update hold frames', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.setHold(10);
      
      expect(engine.getState().hold).toBe(10);
    });

    it('should update effective frequency', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.setFPS(60);
      engine.setHold(6);
      
      expect(engine.getState().effectiveFrequency).toBe(10);
    });

    it('should allow updates while playing', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.setFPS(120);
      
      expect(engine.getState().fps).toBe(120);
      expect(engine.getState().state).toBe('playing');
    });
  });

  describe('Render Mode', () => {
    it('should update render mode', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.setRenderMode('fit');
      
      // Verify mode change doesn't crash and frame updates
      expect(() => engine.next()).not.toThrow();
      expect(engine.getState().currentFrame).toBe(1);
    });
  });

  describe('State Management', () => {
    it('should return complete state', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const state = engine.getState();
      
      expect(state).toMatchObject({
        state: 'loaded',
        currentFrame: 0,
        totalFrames: 3,
        fps: expect.any(Number),
        hold: expect.any(Number),
        effectiveFrequency: expect.any(Number)
      });
    });

    it('should transition states correctly', async () => {
      const engine = new FrameEngine(canvas);
      
      expect(engine.getState().state).toBe('idle');
      
      await engine.loadSequence(mockImages);
      expect(engine.getState().state).toBe('loaded');
      
      engine.play();
      expect(engine.getState().state).toBe('playing');
      
      engine.pause();
      expect(engine.getState().state).toBe('paused');
      
      engine.stop();
      expect(engine.getState().state).toBe('stopped');
    });
  });

  describe('Automatic Playback', () => {
    it('should advance frames during playback', async () => {
      jest.useRealTimers();
      
      const engine = new FrameEngine(canvas, { fps: 20, hold: 1 });
      await engine.loadSequence(mockImages);
      
      const framechangeHandler = jest.fn();
      engine.on('framechange', framechangeHandler);
      
      engine.play();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          engine.stop();
          // Should have advanced at least once in 200ms at 20 FPS
          expect(framechangeHandler).toHaveBeenCalled();
          resolve();
        }, 200);
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.cleanup();
      
      // Should stop playback
      expect(engine.getState().state).toBe('idle');
    });
  });

  describe('Error Handling', () => {
    it('should emit error on load failure', async () => {
      const originalCreateImageBitmap = global.createImageBitmap;
      global.createImageBitmap = jest.fn().mockRejectedValue(new Error('Load failed'));
      
      const engine = new FrameEngine(canvas);
      const errorHandler = jest.fn();
      engine.on('error', errorHandler);
      
      await engine.loadSequence(mockImages);
      
      expect(errorHandler).toHaveBeenCalled();
      
      // Restore
      global.createImageBitmap = originalCreateImageBitmap;
    });

    it('should handle navigation without loaded sequence gracefully', () => {
      const engine = new FrameEngine(canvas);
      
      // Should not crash
      expect(() => engine.next()).toThrow('No sequence loaded');
      expect(() => engine.prev()).toThrow('No sequence loaded');
    });
  });

  describe('Jump To', () => {
    it('should jump to specific frame', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.jumpTo(2);
      
      expect(engine.getState().currentFrame).toBe(2);
    });

    it('should emit framechange on jump', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      const framechangeHandler = jest.fn();
      engine.on('framechange', framechangeHandler);
      
      engine.jumpTo(1);
      
      expect(framechangeHandler).toHaveBeenCalledWith({
        index: 1,
        total: 3
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single frame sequence', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(['single.png']);
      
      engine.next();
      expect(engine.getState().currentFrame).toBe(0); // Wraps back
    });

    it('should handle rapid play/pause', async () => {
      const engine = new FrameEngine(canvas);
      await engine.loadSequence(mockImages);
      
      engine.play();
      engine.pause();
      engine.play();
      engine.pause();
      
      expect(engine.getState().state).toBe('paused');
    });
  });
});
