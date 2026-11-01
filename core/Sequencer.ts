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

export class Sequencer {
  private length: number;
  private currentIndex: number;

  /**
   * Create a new Sequencer
   * @param length - Total number of items in sequence (must be >= 1)
   * @param startIndex - Initial index (default: 0, must be within bounds)
   */
  constructor(length: number, startIndex: number = 0) {
    this.validateLength(length);
    this.length = length;
    
    this.validateIndex(startIndex, 'Starting index out of bounds');
    this.currentIndex = startIndex;
  }

  /**
   * Get current index
   */
  getCurrent(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of items
   */
  getTotal(): number {
    return this.length;
  }

  /**
   * Check if at first index
   */
  isFirst(): boolean {
    return this.currentIndex === 0;
  }

  /**
   * Check if at last index
   */
  isLast(): boolean {
    return this.currentIndex === this.length - 1;
  }

  /**
   * Advance to next index (wraps to 0 after last)
   * @returns New current index
   */
  next(): number {
    this.currentIndex = (this.currentIndex + 1) % this.length;
    return this.currentIndex;
  }

  /**
   * Go to previous index (wraps to last from 0)
   * @returns New current index
   */
  prev(): number {
    this.currentIndex = (this.currentIndex - 1 + this.length) % this.length;
    return this.currentIndex;
  }

  /**
   * Jump to specific index
   * @param index - Target index (can be negative to count from end: -1 = last)
   * @returns New current index
   */
  jumpTo(index: number): number {
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
  reset(): void {
    this.currentIndex = 0;
  }

  /**
   * Update sequence length
   * If current index is now out of bounds, clamps to last valid index
   * @param length - New length (must be >= 1)
   */
  setLength(length: number): void {
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
  peekNext(): number {
    return (this.currentIndex + 1) % this.length;
  }

  /**
   * Peek at previous index without changing state
   * @returns What previous index would be
   */
  peekPrev(): number {
    return (this.currentIndex - 1 + this.length) % this.length;
  }

  /**
   * Validate length value
   */
  private validateLength(length: number): void {
    if (length < 1) {
      throw new Error('Length must be at least 1');
    }
  }

  /**
   * Validate index is within bounds
   */
  private validateIndex(index: number, message: string = 'Index out of bounds'): void {
    if (index < 0 || index >= this.length) {
      throw new Error(message);
    }
  }
}
