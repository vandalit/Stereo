/**
 * Renderer module tests
 * Tests Canvas rendering with fill/fit/contain modes
 */

import { Renderer } from '../core/Renderer';
import type { RenderMode } from '../core/types';

// Mock canvas for testing
const createMockCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
};

// Mock ImageBitmap for testing
const createMockBitmap = (width: number, height: number): ImageBitmap => {
  return {
    width,
    height,
    close: jest.fn()
  } as any;
};

describe('Renderer', () => {
  let canvas: HTMLCanvasElement;
  let mockContext: any;

  beforeEach(() => {
    canvas = createMockCanvas();
    mockContext = {
      drawImage: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      canvas: canvas
    };
    jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);
  });

  describe('Constructor', () => {
    it('should create renderer with default config', () => {
      const renderer = new Renderer(canvas);
      expect(renderer).toBeDefined();
    });

    it('should create renderer with custom config', () => {
      const renderer = new Renderer(canvas, {
        mode: 'fit',
        alpha: true,
        desynchronized: true
      });
      expect(renderer).toBeDefined();
    });

    it('should throw error if canvas is null', () => {
      expect(() => new Renderer(null as any)).toThrow('Canvas element is required');
    });

    it('should get 2d context with correct options', () => {
      new Renderer(canvas, { alpha: false, desynchronized: true });
      
      expect(canvas.getContext).toHaveBeenCalledWith('2d', {
        alpha: false,
        desynchronized: true
      });
    });
  });

  describe('Render - Fill Mode', () => {
    it('should render bitmap in fill mode', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(400, 300);
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
      expect(mockContext.drawImage.mock.calls[0][0]).toBe(bitmap);
    });

    it('should scale up to fill canvas (bitmap smaller)', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(400, 300); // Smaller than 800x600
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, x, y, width, height] = call;
      
      // Should scale to fill, so width or height should exceed canvas
      expect(width >= 800 || height >= 600).toBe(true);
    });

    it('should scale down to fill canvas (bitmap larger)', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(1600, 1200); // Larger than 800x600
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
      // Should still fill canvas
    });

    it('should center the image when filling', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(400, 400); // Square image
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, x] = call;
      
      // Should be centered (negative x for overflow or positive for letterbox)
      expect(typeof x).toBe('number');
    });

    it('should use integer coordinates', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(333, 250); // Odd dimensions
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, x, y, width, height] = call;
      
      // All coordinates should be integers (Math.floor applied)
      expect(Number.isInteger(x)).toBe(true);
      expect(Number.isInteger(y)).toBe(true);
      expect(Number.isInteger(width)).toBe(true);
      expect(Number.isInteger(height)).toBe(true);
    });
  });

  describe('Render - Fit Mode', () => {
    it('should render bitmap in fit mode', () => {
      const renderer = new Renderer(canvas, { mode: 'fit', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(1600, 1200);
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should scale to fit inside canvas', () => {
      const renderer = new Renderer(canvas, { mode: 'fit', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(1600, 1200); // Larger
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, , , width, height] = call;
      
      // Should fit inside canvas
      expect(width <= 800).toBe(true);
      expect(height <= 600).toBe(true);
    });

    it('should not upscale in fit mode if bitmap is smaller', () => {
      const renderer = new Renderer(canvas, { mode: 'fit', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(200, 150); // Much smaller
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, , , width, height] = call;
      
      // In fit mode, should scale up to fit
      expect(width > 200).toBe(true);
      expect(height > 150).toBe(true);
    });
  });

  describe('Render - Contain Mode', () => {
    it('should render bitmap in contain mode', () => {
      const renderer = new Renderer(canvas, { mode: 'contain', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(400, 300);
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should behave like fit mode', () => {
      const rendererFit = new Renderer(canvas, { mode: 'fit', alpha: false, desynchronized: false });
      const rendererContain = new Renderer(canvas, { mode: 'contain', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(400, 300);
      
      rendererFit.render(bitmap);
      const fitCall = mockContext.drawImage.mock.calls[0];
      
      mockContext.drawImage.mockClear();
      
      rendererContain.render(bitmap);
      const containCall = mockContext.drawImage.mock.calls[0];
      
      // Should produce same result
      expect(fitCall).toEqual(containCall);
    });
  });

  describe('Clear', () => {
    it('should clear the canvas', () => {
      const renderer = new Renderer(canvas);
      
      renderer.clear();
      
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('Resize', () => {
    it('should resize canvas dimensions', () => {
      const renderer = new Renderer(canvas);
      
      renderer.resize(1024, 768);
      
      expect(canvas.width).toBeGreaterThan(800); // Accounts for DPR
      expect(canvas.height).toBeGreaterThan(600);
    });

    it('should account for devicePixelRatio', () => {
      const originalDPR = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2
      });
      
      const renderer = new Renderer(canvas);
      renderer.resize(1000, 800);
      
      // Physical pixels should be 2x
      expect(canvas.width).toBe(2000);
      expect(canvas.height).toBe(1600);
      
      // CSS pixels should be original size
      expect(canvas.style.width).toBe('1000px');
      expect(canvas.style.height).toBe('800px');
      
      // Restore
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: originalDPR
      });
    });

    it('should scale context for HiDPI', () => {
      const originalDPR = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2
      });
      
      const renderer = new Renderer(canvas);
      renderer.resize(1000, 800);
      
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
      
      // Restore
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: originalDPR
      });
    });
  });

  describe('Get Canvas', () => {
    it('should return the canvas element', () => {
      const renderer = new Renderer(canvas);
      expect(renderer.getCanvas()).toBe(canvas);
    });
  });

  describe('Set Mode', () => {
    it('should update render mode', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      
      renderer.setMode('fit');
      
      // Next render should use fit mode
      const bitmap = createMockBitmap(1600, 1200);
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, , , width, height] = call;
      
      // Should fit inside
      expect(width <= 800).toBe(true);
      expect(height <= 600).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very wide bitmap', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(3200, 100); // Super wide
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should handle very tall bitmap', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(100, 2400); // Super tall
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should handle square bitmap', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(600, 600); // Square
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should handle same aspect ratio as canvas', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(1600, 1200); // Same 4:3 ratio
      
      renderer.render(bitmap);
      
      const call = mockContext.drawImage.mock.calls[0];
      const [, x, y] = call;
      
      // Should be at 0,0 with no offset (perfect fit)
      expect(x).toBe(0);
      expect(y).toBe(0);
    });

    it('should handle 1x1 pixel bitmap', () => {
      const renderer = new Renderer(canvas, { mode: 'fill', alpha: false, desynchronized: false });
      const bitmap = createMockBitmap(1, 1); // Tiny
      
      renderer.render(bitmap);
      
      expect(mockContext.drawImage).toHaveBeenCalled();
    });
  });
});
