/**
 * Loader module tests
 * Tests image loading, buffering, and memory management
 */

import { Loader } from '../core/Loader';
import type { ImageSource } from '../core/types';

// Mock image sources for testing
const mockImages: ImageSource[] = [
  'image1.png',
  'image2.png',
  'image3.png',
  'image4.png',
  'image5.png'
];

describe('Loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create loader with default config', () => {
      const loader = new Loader();
      expect(loader).toBeDefined();
    });

    it('should create loader with custom config', () => {
      const loader = new Loader({ preloadCount: 5, maxCacheSize: 10 });
      expect(loader).toBeDefined();
    });

    it('should throw error for invalid preload count', () => {
      expect(() => new Loader({ preloadCount: 0, maxCacheSize: 5 }))
        .toThrow('Preload count must be at least 1');
      expect(() => new Loader({ preloadCount: -1, maxCacheSize: 5 }))
        .toThrow('Preload count must be at least 1');
    });

    it('should throw error for invalid max cache size', () => {
      expect(() => new Loader({ preloadCount: 3, maxCacheSize: 0 }))
        .toThrow('Max cache size must be at least 1');
      expect(() => new Loader({ preloadCount: 3, maxCacheSize: -5 }))
        .toThrow('Max cache size must be at least 1');
    });
  });

  describe('Load Sequence', () => {
    it('should load sequence of images', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      
      expect(loader.getTotal()).toBe(5);
    });

    it('should preload initial images', async () => {
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      // Should have preloaded first 3 images
      expect(loader.isLoaded(0)).toBe(true);
      expect(loader.isLoaded(1)).toBe(true);
      expect(loader.isLoaded(2)).toBe(true);
      expect(loader.isLoaded(3)).toBe(false);
    });

    it('should handle empty sequence', async () => {
      const loader = new Loader();
      await expect(loader.loadSequence([])).rejects.toThrow('Image sources cannot be empty');
    });

    it('should replace previous sequence', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      expect(loader.getTotal()).toBe(5);
      
      await loader.loadSequence(['a.png', 'b.png']);
      expect(loader.getTotal()).toBe(2);
    });
  });

  describe('Get Bitmap', () => {
    it('should return bitmap for loaded index', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 5 });
      await loader.loadSequence(mockImages, 0);
      
      const bitmap = loader.getBitmap(0);
      expect(bitmap).toBeDefined();
      expect(bitmap).toHaveProperty('width');
      expect(bitmap).toHaveProperty('height');
    });

    it('should return null for unloaded index', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 5 });
      await loader.loadSequence(mockImages, 0);
      
      const bitmap = loader.getBitmap(4);
      expect(bitmap).toBeNull();
    });

    it('should throw error for out of bounds index', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      
      expect(() => loader.getBitmap(-1)).toThrow('Index out of bounds');
      expect(() => loader.getBitmap(5)).toThrow('Index out of bounds');
    });
  });

  describe('Is Loaded', () => {
    it('should return true for loaded images', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 5 });
      await loader.loadSequence(mockImages, 0);
      
      expect(loader.isLoaded(0)).toBe(true);
      expect(loader.isLoaded(1)).toBe(true);
    });

    it('should return false for unloaded images', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 5 });
      await loader.loadSequence(mockImages, 0);
      
      expect(loader.isLoaded(4)).toBe(false);
    });

    it('should throw error for out of bounds', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      
      expect(() => loader.isLoaded(-1)).toThrow('Index out of bounds');
      expect(() => loader.isLoaded(10)).toThrow('Index out of bounds');
    });
  });

  describe('Preload Around', () => {
    it('should preload images around current index', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      // Initial: 0, 1 loaded
      await loader.preloadAround(2, 2);
      
      // Should now have 2, 3 loaded
      expect(loader.isLoaded(2)).toBe(true);
      expect(loader.isLoaded(3)).toBe(true);
    });

    it('should not reload already loaded images', async () => {
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      const createImageBitmapSpy = jest.spyOn(global, 'createImageBitmap');
      const initialCalls = createImageBitmapSpy.mock.calls.length;
      
      // Try to preload already loaded images
      await loader.preloadAround(0, 2);
      
      // Should not have made new calls for already loaded images
      expect(createImageBitmapSpy.mock.calls.length).toBe(initialCalls);
    });

    it('should handle preload at end of sequence', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      await loader.preloadAround(4, 3); // Try to load beyond end
      
      expect(loader.isLoaded(4)).toBe(true);
      // Shouldn't crash, just stops at end
    });
  });

  describe('Memory Management', () => {
    it('should evict old images when cache is full', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 3 });
      await loader.loadSequence(mockImages, 0);
      
      // Load 0, 1
      expect(loader.isLoaded(0)).toBe(true);
      expect(loader.isLoaded(1)).toBe(true);
      
      // Load more, should evict old ones
      await loader.preloadAround(3, 2); // Load 3, 4
      
      expect(loader.isLoaded(3)).toBe(true);
      expect(loader.isLoaded(4)).toBe(true);
      
      // 0 should be evicted (oldest)
      expect(loader.isLoaded(0)).toBe(false);
    });

    it('should call close() on evicted ImageBitmaps', async () => {
      const loader = new Loader({ preloadCount: 1, maxCacheSize: 2 });
      await loader.loadSequence(mockImages, 0);
      
      const bitmap0 = loader.getBitmap(0);
      const closeSpy = jest.spyOn(bitmap0!, 'close');
      
      // Load more to trigger eviction
      await loader.preloadAround(2, 2);
      
      // Bitmap 0 should have been closed
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should handle cleanup on destroy', async () => {
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      const bitmap0 = loader.getBitmap(0);
      const closeSpy = jest.spyOn(bitmap0!, 'close');
      
      loader.cleanup();
      
      expect(closeSpy).toHaveBeenCalled();
      // After cleanup, sources array is empty, so can't check isLoaded
      expect(loader.getTotal()).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should emit error event on load failure', async () => {
      // Mock createImageBitmap to fail
      const originalCreateImageBitmap = global.createImageBitmap;
      global.createImageBitmap = jest.fn().mockRejectedValue(new Error('Load failed'));
      
      const loader = new Loader({ preloadCount: 1, maxCacheSize: 5 });
      const errorHandler = jest.fn();
      loader.on('error', errorHandler);
      
      await loader.loadSequence(mockImages, 0);
      
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0]).toMatchObject({
        index: 0,
        source: 'image1.png',
        error: expect.any(Error)
      });
      
      // Restore
      global.createImageBitmap = originalCreateImageBitmap;
    });

    it('should continue loading other images after failure', async () => {
      let callCount = 0;
      const originalCreateImageBitmap = global.createImageBitmap;
      global.createImageBitmap = jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Second image failed');
        }
        return { width: 100, height: 100, close: jest.fn() };
      });
      
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      await loader.loadSequence(mockImages, 0);
      
      // First and third should load, second should fail
      expect(loader.isLoaded(0)).toBe(true);
      expect(loader.isLoaded(1)).toBe(false); // Failed
      expect(loader.isLoaded(2)).toBe(true);
      
      // Restore
      global.createImageBitmap = originalCreateImageBitmap;
    });
  });

  describe('Progress Tracking', () => {
    it('should emit progress events during load', async () => {
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      const progressHandler = jest.fn();
      loader.on('progress', progressHandler);
      
      await loader.loadSequence(mockImages, 0);
      
      expect(progressHandler).toHaveBeenCalled();
      // Should have been called at least once with progress info
      expect(progressHandler.mock.calls[0][0]).toMatchObject({
        loaded: expect.any(Number),
        total: expect.any(Number)
      });
    });

    it('should emit loaded event when initial preload completes', async () => {
      const loader = new Loader({ preloadCount: 2, maxCacheSize: 10 });
      const loadedHandler = jest.fn();
      loader.on('loaded', loadedHandler);
      
      await loader.loadSequence(mockImages, 0);
      
      expect(loadedHandler).toHaveBeenCalledWith({
        totalImages: 5,
        preloadedCount: 2
      });
    });
  });

  describe('Get Source', () => {
    it('should return source for given index', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      
      expect(loader.getSource(0)).toBe('image1.png');
      expect(loader.getSource(2)).toBe('image3.png');
    });

    it('should throw error for out of bounds', async () => {
      const loader = new Loader();
      await loader.loadSequence(mockImages);
      
      expect(() => loader.getSource(-1)).toThrow('Index out of bounds');
      expect(() => loader.getSource(10)).toThrow('Index out of bounds');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single image sequence', async () => {
      const loader = new Loader({ preloadCount: 3, maxCacheSize: 10 });
      await loader.loadSequence(['single.png']);
      
      expect(loader.getTotal()).toBe(1);
      expect(loader.isLoaded(0)).toBe(true);
    });

    it('should handle preload count larger than sequence', async () => {
      const loader = new Loader({ preloadCount: 10, maxCacheSize: 20 });
      await loader.loadSequence(['a.png', 'b.png']);
      
      // Should load all available images (2), not crash
      expect(loader.isLoaded(0)).toBe(true);
      expect(loader.isLoaded(1)).toBe(true);
    });

    it('should handle cache size smaller than preload count', async () => {
      // This is a configuration that doesn't make much sense,
      // but should not crash
      const loader = new Loader({ preloadCount: 5, maxCacheSize: 2 });
      await loader.loadSequence(mockImages, 0);
      
      // Should still work, just aggressively evict
      expect(loader).toBeDefined();
    });
  });
});
