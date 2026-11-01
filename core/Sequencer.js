"use strict";
/**
 * Sequencer module - Manages frame index navigation with circular looping
 *
 * The Sequencer handles navigation through a sequence of frames:
 * - next() / prev() for sequential navigation
 * - jumpTo() for direct access
 * - Circular wrapping (after last → first, before first → last)
 * - Dynamic length updates
 *
 * Example: With 5 frames (0-4), next from 4 wraps to 0, prev from 0 wraps to 4
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequencer = void 0;
class Sequencer {
    /**
     * Create a new Sequencer
     * @param length - Total number of items in sequence (must be >= 1)
     * @param startIndex - Initial index (default: 0, must be within bounds)
     */
    constructor(length, startIndex = 0) {
        this.validateLength(length);
        this.length = length;
        this.validateIndex(startIndex, 'Starting index out of bounds');
        this.currentIndex = startIndex;
    }
    /**
     * Get current index
     */
    getCurrent() {
        return this.currentIndex;
    }
    /**
     * Get total number of items
     */
    getTotal() {
        return this.length;
    }
    /**
     * Check if at first index
     */
    isFirst() {
        return this.currentIndex === 0;
    }
    /**
     * Check if at last index
     */
    isLast() {
        return this.currentIndex === this.length - 1;
    }
    /**
     * Advance to next index (wraps to 0 after last)
     * @returns New current index
     */
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.length;
        return this.currentIndex;
    }
    /**
     * Go to previous index (wraps to last from 0)
     * @returns New current index
     */
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.length) % this.length;
        return this.currentIndex;
    }
    /**
     * Jump to specific index
     * @param index - Target index (can be negative to count from end: -1 = last)
     * @returns New current index
     */
    jumpTo(index) {
        // Handle negative indices (Python-style)
        if (index < 0) {
            index = this.length + index;
        }
        this.validateIndex(index, 'Index out of bounds');
        this.currentIndex = index;
        return this.currentIndex;
    }
    /**
     * Reset to first index (0)
     */
    reset() {
        this.currentIndex = 0;
    }
    /**
     * Update sequence length
     * If current index is now out of bounds, clamps to last valid index
     * @param length - New length (must be >= 1)
     */
    setLength(length) {
        this.validateLength(length);
        this.length = length;
        // Clamp current index if now out of bounds
        if (this.currentIndex >= this.length) {
            this.currentIndex = this.length - 1;
        }
    }
    /**
     * Peek at next index without changing state
     * @returns What next index would be
     */
    peekNext() {
        return (this.currentIndex + 1) % this.length;
    }
    /**
     * Peek at previous index without changing state
     * @returns What previous index would be
     */
    peekPrev() {
        return (this.currentIndex - 1 + this.length) % this.length;
    }
    /**
     * Validate length value
     */
    validateLength(length) {
        if (length < 1) {
            throw new Error('Length must be at least 1');
        }
    }
    /**
     * Validate index is within bounds
     */
    validateIndex(index, message = 'Index out of bounds') {
        if (index < 0 || index >= this.length) {
            throw new Error(message);
        }
    }
}
exports.Sequencer = Sequencer;
//# sourceMappingURL=Sequencer.js.map