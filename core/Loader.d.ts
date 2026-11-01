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
    'progress': (data: {
        loaded: number;
        total: number;
    }) => void;
    'loaded': (data: {
        totalImages: number;
        preloadedCount: number;
    }) => void;
    'error': (data: {
        index: number;
        source: ImageSource;
        error: Error;
    }) => void;
}
export declare class Loader extends EventEmitter<LoaderEvents> {
    private config;
    private sources;
    private cache;
    private loadOrder;
    /**
     * Create a new Loader
     * @param config - Optional configuration for preloading and caching
     */
    constructor(config?: Partial<LoaderConfig>);
    /**
     * Load a sequence of images
     * @param sources - Array of image sources (URLs, Blobs, Files)
     * @param startIndex - Index to start preloading from (default: 0)
     */
    loadSequence(sources: ImageSource[], startIndex?: number): Promise<void>;
    /**
     * Get ImageBitmap for specific index
     * @param index - Image index
     * @returns ImageBitmap or null if not loaded
     */
    getBitmap(index: number): ImageBitmap | null;
    /**
     * Check if image at index is loaded
     * @param index - Image index
     */
    isLoaded(index: number): boolean;
    /**
     * Get source for specific index
     * @param index - Image index
     */
    getSource(index: number): ImageSource;
    /**
     * Get total number of images
     */
    getTotal(): number;
    /**
     * Preload images around a specific index
     * @param startIndex - Starting index
     * @param count - Number of images to preload
     */
    preloadAround(startIndex: number, count: number): Promise<void>;
    /**
     * Load single image by index
     * @param index - Image index to load
     */
    private loadImage;
    /**
     * Create ImageBitmap from various source types
     * @param source - Image source (URL, Blob, File)
     */
    private createBitmapFromSource;
    /**
     * Evict old images from cache when it exceeds maxCacheSize
     * Keeps images around the current index, evicts oldest accessed ones
     * @param currentIndex - Current playback index
     */
    private evictOldImages;
    /**
     * Clean up all loaded images and release memory
     */
    cleanup(): void;
    /**
     * Validate index is within bounds
     */
    private validateIndex;
    /**
     * Validate configuration
     */
    private validateConfig;
}
export {};
//# sourceMappingURL=Loader.d.ts.map