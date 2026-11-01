/**
 * Loader module - Image loading with smart buffering and memory management
 * 
 * The Loader handles:
 * - Loading images from various sources (URLs, Blobs, Files)
 * - Converting to ImageBitmap for optimal Canvas rendering
 * - Smart preloading (current + N next images)
 * - Memory management (LRU cache with configurable size)
 * - Error handling and progress tracking
 * 
 * Example: With preloadCount=3, always keeps current + next 2 images in memory
 */

import EventEmitter from 'eventemitter3';
import type { ImageSource, LoaderConfig } from './types';

interface LoaderEvents {
  'progress': (data: { loaded: number; total: number }) => void;
  'loaded': (data: { totalImages: number; preloadedCount: number }) => void;
  'error': (data: { index: number; source: ImageSource; error: Error }) => void;
}

const DEFAULT_CONFIG: LoaderConfig = {
  preloadCount: 3,
  maxCacheSize: 10
};

export class Loader extends EventEmitter<LoaderEvents> {
  private config: LoaderConfig;
  private sources: ImageSource[] = [];
  private cache = new Map<number, ImageBitmap>();
  private loadOrder: number[] = []; // Track load order for LRU eviction

  /**
   * Create a new Loader
   * @param config - Optional configuration for preloading and caching
   */
  constructor(config: Partial<LoaderConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.validateConfig();
  }

  /**
   * Load a sequence of images
   * @param sources - Array of image sources (URLs, Blobs, Files)
   * @param startIndex - Index to start preloading from (default: 0)
   */
  async loadSequence(sources: ImageSource[], startIndex: number = 0): Promise<void> {
    if (sources.length === 0) {
      throw new Error('Image sources cannot be empty');
    }

    // Clear previous sequence
    this.cleanup();
    this.sources = sources;
    
    // Preload initial images
    await this.preloadAround(startIndex, this.config.preloadCount);
    
    this.emit('loaded', {
      totalImages: this.sources.length,
      preloadedCount: this.cache.size
    });
  }

  /**
   * Get ImageBitmap for specific index
   * @param index - Image index
   * @returns ImageBitmap or null if not loaded
   */
  getBitmap(index: number): ImageBitmap | null {
    this.validateIndex(index);
    return this.cache.get(index) || null;
  }

  /**
   * Check if image at index is loaded
   * @param index - Image index
   */
  isLoaded(index: number): boolean {
    this.validateIndex(index);
    return this.cache.has(index);
  }

  /**
   * Get source for specific index
   * @param index - Image index
   */
  getSource(index: number): ImageSource {
    this.validateIndex(index);
    return this.sources[index];
  }

  /**
   * Get total number of images
   */
  getTotal(): number {
    return this.sources.length;
  }

  /**
   * Preload images around a specific index
   * @param startIndex - Starting index
   * @param count - Number of images to preload
   */
  async preloadAround(startIndex: number, count: number): Promise<void> {
    const toLoad: Promise<void>[] = [];
    const endIndex = Math.min(startIndex + count, this.sources.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.cache.has(i)) {
        toLoad.push(this.loadImage(i));
      }
    }
    
    await Promise.all(toLoad);
    this.evictOldImages(startIndex);
  }

  /**
   * Load single image by index
   * @param index - Image index to load
   */
  private async loadImage(index: number): Promise<void> {
    try {
      const source = this.sources[index];
      const bitmap = await this.createBitmapFromSource(source);
      
      this.cache.set(index, bitmap);
      this.loadOrder.push(index);
      
      this.emit('progress', {
        loaded: this.cache.size,
        total: this.sources.length
      });
    } catch (error) {
      this.emit('error', {
        index,
        source: this.sources[index],
        error: error as Error
      });
    }
  }

  /**
   * Create ImageBitmap from various source types
   * @param source - Image source (URL, Blob, File)
   */
  private async createBitmapFromSource(source: ImageSource): Promise<ImageBitmap> {
    if (typeof source === 'string') {
      // URL or path
      const response = await fetch(source);
      const blob = await response.blob();
      return createImageBitmap(blob);
    } else {
      // Blob or File
      return createImageBitmap(source);
    }
  }

  /**
   * Evict old images from cache when it exceeds maxCacheSize
   * Keeps images around the current index, evicts oldest accessed ones
   * @param currentIndex - Current playback index
   */
  private evictOldImages(currentIndex: number): void {
    if (this.cache.size <= this.config.maxCacheSize) {
      return;
    }

    // Calculate which indices to keep (around current index)
    const keepIndices = new Set<number>();
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(this.sources.length, currentIndex + this.config.maxCacheSize);
    
    for (let i = start; i < end; i++) {
      keepIndices.add(i);
    }

    // Evict images not in keep set, oldest first (by load order)
    const toEvict: number[] = [];
    
    for (const index of this.loadOrder) {
      if (!keepIndices.has(index) && this.cache.has(index)) {
        toEvict.push(index);
        if (this.cache.size - toEvict.length <= this.config.maxCacheSize) {
          break; // Evicted enough
        }
      }
    }

    // Actually evict
    for (const index of toEvict) {
      const bitmap = this.cache.get(index);
      if (bitmap) {
        bitmap.close(); // Release memory
        this.cache.delete(index);
        
        // Remove from load order
        const orderIndex = this.loadOrder.indexOf(index);
        if (orderIndex !== -1) {
          this.loadOrder.splice(orderIndex, 1);
        }
      }
    }
  }

  /**
   * Clean up all loaded images and release memory
   */
  cleanup(): void {
    for (const [index, bitmap] of this.cache) {
      bitmap.close();
    }
    this.cache.clear();
    this.loadOrder = [];
    this.sources = [];
  }

  /**
   * Validate index is within bounds
   */
  private validateIndex(index: number): void {
    if (index < 0 || index >= this.sources.length) {
      throw new Error('Index out of bounds');
    }
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    if (this.config.preloadCount < 1) {
      throw new Error('Preload count must be at least 1');
    }
    if (this.config.maxCacheSize < 1) {
      throw new Error('Max cache size must be at least 1');
    }
  }
}
