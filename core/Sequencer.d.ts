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
export declare class Sequencer {
    private length;
    private currentIndex;
    /**
     * Create a new Sequencer
     * @param length - Total number of items in sequence (must be >= 1)
     * @param startIndex - Initial index (default: 0, must be within bounds)
     */
    constructor(length: number, startIndex?: number);
    /**
     * Get current index
     */
    getCurrent(): number;
    /**
     * Get total number of items
     */
    getTotal(): number;
    /**
     * Check if at first index
     */
    isFirst(): boolean;
    /**
     * Check if at last index
     */
    isLast(): boolean;
    /**
     * Advance to next index (wraps to 0 after last)
     * @returns New current index
     */
    next(): number;
    /**
     * Go to previous index (wraps to last from 0)
     * @returns New current index
     */
    prev(): number;
    /**
     * Jump to specific index
     * @param index - Target index (can be negative to count from end: -1 = last)
     * @returns New current index
     */
    jumpTo(index: number): number;
    /**
     * Reset to first index (0)
     */
    reset(): void;
    /**
     * Update sequence length
     * If current index is now out of bounds, clamps to last valid index
     * @param length - New length (must be >= 1)
     */
    setLength(length: number): void;
    /**
     * Peek at next index without changing state
     * @returns What next index would be
     */
    peekNext(): number;
    /**
     * Peek at previous index without changing state
     * @returns What previous index would be
     */
    peekPrev(): number;
    /**
     * Validate length value
     */
    private validateLength;
    /**
     * Validate index is within bounds
     */
    private validateIndex;
}
//# sourceMappingURL=Sequencer.d.ts.map