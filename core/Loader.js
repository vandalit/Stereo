"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const DEFAULT_CONFIG = {
    preloadCount: 3,
    maxCacheSize: 10
};
class Loader extends eventemitter3_1.default {
    /**
     * Create a new Loader
     * @param config - Optional configuration for preloading and caching
     */
    constructor(config = {}) {
        super();
        this.sources = [];
        this.cache = new Map();
        this.loadOrder = []; // Track load order for LRU eviction
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.validateConfig();
    }
    /**
     * Load a sequence of images
     * @param sources - Array of image sources (URLs, Blobs, Files)
     * @param startIndex - Index to start preloading from (default: 0)
     */
    async loadSequence(sources, startIndex = 0) {
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
    getBitmap(index) {
        this.validateIndex(index);
        return this.cache.get(index) || null;
    }
    /**
     * Check if image at index is loaded
     * @param index - Image index
     */
    isLoaded(index) {
        this.validateIndex(index);
        return this.cache.has(index);
    }
    /**
     * Get source for specific index
     * @param index - Image index
     */
    getSource(index) {
        this.validateIndex(index);
        return this.sources[index];
    }
    /**
     * Get total number of images
     */
    getTotal() {
        return this.sources.length;
    }
    /**
     * Preload images around a specific index
     * @param startIndex - Starting index
     * @param count - Number of images to preload
     */
    async preloadAround(startIndex, count) {
        const toLoad = [];
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
    async loadImage(index) {
        try {
            const source = this.sources[index];
            const bitmap = await this.createBitmapFromSource(source);
            this.cache.set(index, bitmap);
            this.loadOrder.push(index);
            this.emit('progress', {
                loaded: this.cache.size,
                total: this.sources.length
            });
        }
        catch (error) {
            this.emit('error', {
                index,
                source: this.sources[index],
                error: error
            });
        }
    }
    /**
     * Create ImageBitmap from various source types
     * @param source - Image source (URL, Blob, File)
     */
    async createBitmapFromSource(source) {
        if (typeof source === 'string') {
            // URL or path
            const response = await fetch(source);
            const blob = await response.blob();
            return createImageBitmap(blob);
        }
        else {
            // Blob or File
            return createImageBitmap(source);
        }
    }
    /**
     * Evict old images from cache when it exceeds maxCacheSize
     * Keeps images around the current index, evicts oldest accessed ones
     * @param currentIndex - Current playback index
     */
    evictOldImages(currentIndex) {
        if (this.cache.size <= this.config.maxCacheSize) {
            return;
        }
        // Calculate which indices to keep (around current index)
        const keepIndices = new Set();
        const start = Math.max(0, currentIndex - 1);
        const end = Math.min(this.sources.length, currentIndex + this.config.maxCacheSize);
        for (let i = start; i < end; i++) {
            keepIndices.add(i);
        }
        // Evict images not in keep set, oldest first (by load order)
        const toEvict = [];
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
    cleanup() {
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
    validateIndex(index) {
        if (index < 0 || index >= this.sources.length) {
            throw new Error('Index out of bounds');
        }
    }
    /**
     * Validate configuration
     */
    validateConfig() {
        if (this.config.preloadCount < 1) {
            throw new Error('Preload count must be at least 1');
        }
        if (this.config.maxCacheSize < 1) {
            throw new Error('Max cache size must be at least 1');
        }
    }
}
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map