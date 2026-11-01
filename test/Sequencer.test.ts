/**
 * Sequencer module tests
 * Tests circular navigation and frame index management
 */

import { Sequencer } from '../core/Sequencer';

describe('Sequencer', () => {
  describe('Constructor', () => {
    it('should create sequencer with default index 0', () => {
      const seq = new Sequencer(5);
      expect(seq.getCurrent()).toBe(0);
      expect(seq.getTotal()).toBe(5);
    });

    it('should create sequencer with custom starting index', () => {
      const seq = new Sequencer(10, 3);
      expect(seq.getCurrent()).toBe(3);
      expect(seq.getTotal()).toBe(10);
    });

    it('should throw error for invalid length', () => {
      expect(() => new Sequencer(0)).toThrow('Length must be at least 1');
      expect(() => new Sequencer(-5)).toThrow('Length must be at least 1');
    });

    it('should throw error for invalid starting index', () => {
      expect(() => new Sequencer(5, -1)).toThrow('Starting index out of bounds');
      expect(() => new Sequencer(5, 5)).toThrow('Starting index out of bounds');
      expect(() => new Sequencer(5, 10)).toThrow('Starting index out of bounds');
    });
  });

  describe('Next Navigation', () => {
    it('should advance to next index', () => {
      const seq = new Sequencer(5);
      expect(seq.next()).toBe(1);
      expect(seq.getCurrent()).toBe(1);
    });

    it('should advance multiple times', () => {
      const seq = new Sequencer(5);
      seq.next(); // 1
      seq.next(); // 2
      const result = seq.next(); // 3
      expect(result).toBe(3);
      expect(seq.getCurrent()).toBe(3);
    });

    it('should wrap around to 0 after last index', () => {
      const seq = new Sequencer(3, 2); // Start at index 2 (last)
      const result = seq.next(); // Should wrap to 0
      expect(result).toBe(0);
      expect(seq.getCurrent()).toBe(0);
    });

    it('should continue wrapping in circular fashion', () => {
      const seq = new Sequencer(3);
      seq.next(); // 1
      seq.next(); // 2
      seq.next(); // 0 (wrap)
      const result = seq.next(); // 1
      expect(result).toBe(1);
    });
  });

  describe('Previous Navigation', () => {
    it('should go to previous index', () => {
      const seq = new Sequencer(5, 2);
      expect(seq.prev()).toBe(1);
      expect(seq.getCurrent()).toBe(1);
    });

    it('should wrap around to last index from 0', () => {
      const seq = new Sequencer(5, 0);
      const result = seq.prev();
      expect(result).toBe(4); // Last index
      expect(seq.getCurrent()).toBe(4);
    });

    it('should continue wrapping backwards', () => {
      const seq = new Sequencer(3, 1);
      seq.prev(); // 0
      seq.prev(); // 2 (wrap to end)
      const result = seq.prev(); // 1
      expect(result).toBe(1);
    });
  });

  describe('Jump To', () => {
    it('should jump to specific index', () => {
      const seq = new Sequencer(10);
      const result = seq.jumpTo(7);
      expect(result).toBe(7);
      expect(seq.getCurrent()).toBe(7);
    });

    it('should handle jump to 0', () => {
      const seq = new Sequencer(5, 3);
      seq.jumpTo(0);
      expect(seq.getCurrent()).toBe(0);
    });

    it('should handle jump to last index', () => {
      const seq = new Sequencer(5);
      seq.jumpTo(4);
      expect(seq.getCurrent()).toBe(4);
    });

    it('should throw error for out of bounds index', () => {
      const seq = new Sequencer(5);
      expect(() => seq.jumpTo(5)).toThrow('Index out of bounds');
      expect(() => seq.jumpTo(10)).toThrow('Index out of bounds');
      expect(() => seq.jumpTo(-6)).toThrow('Index out of bounds'); // Beyond negative range
    });

    it('should support negative indices (counting from end)', () => {
      const seq = new Sequencer(5);
      seq.jumpTo(-1); // Last item
      expect(seq.getCurrent()).toBe(4);
      
      seq.jumpTo(-2); // Second to last
      expect(seq.getCurrent()).toBe(3);
    });
  });

  describe('Reset', () => {
    it('should reset to index 0', () => {
      const seq = new Sequencer(5, 3);
      seq.reset();
      expect(seq.getCurrent()).toBe(0);
    });

    it('should reset after navigation', () => {
      const seq = new Sequencer(5);
      seq.next();
      seq.next();
      seq.reset();
      expect(seq.getCurrent()).toBe(0);
    });
  });

  describe('Set Length', () => {
    it('should update length', () => {
      const seq = new Sequencer(5);
      seq.setLength(10);
      expect(seq.getTotal()).toBe(10);
    });

    it('should keep current index if within new bounds', () => {
      const seq = new Sequencer(5, 3);
      seq.setLength(10); // Expand
      expect(seq.getCurrent()).toBe(3); // Still valid
    });

    it('should clamp current index if now out of bounds', () => {
      const seq = new Sequencer(10, 7);
      seq.setLength(5); // Shrink, index 7 now invalid
      expect(seq.getCurrent()).toBe(4); // Clamped to last valid index
    });

    it('should throw error for invalid length', () => {
      const seq = new Sequencer(5);
      expect(() => seq.setLength(0)).toThrow('Length must be at least 1');
      expect(() => seq.setLength(-3)).toThrow('Length must be at least 1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item sequence', () => {
      const seq = new Sequencer(1);
      expect(seq.next()).toBe(0);
      expect(seq.prev()).toBe(0);
      expect(seq.getCurrent()).toBe(0);
    });

    it('should handle two item sequence', () => {
      const seq = new Sequencer(2);
      expect(seq.next()).toBe(1);
      expect(seq.next()).toBe(0); // Wrap
      expect(seq.prev()).toBe(1); // Wrap back
    });

    it('should maintain consistency after many operations', () => {
      const seq = new Sequencer(3);
      
      // Do many operations
      for (let i = 0; i < 100; i++) {
        seq.next();
      }
      
      // After 100 next on length 3, should cycle back to start
      // 100 % 3 = 1, so should be at index 1
      expect(seq.getCurrent()).toBe(1);
    });

    it('should handle alternating next/prev', () => {
      const seq = new Sequencer(5, 2);
      seq.next(); // 3
      seq.prev(); // 2
      seq.next(); // 3
      seq.prev(); // 2
      expect(seq.getCurrent()).toBe(2);
    });
  });

  describe('Getters', () => {
    it('should return current index', () => {
      const seq = new Sequencer(5, 3);
      expect(seq.getCurrent()).toBe(3);
    });

    it('should return total length', () => {
      const seq = new Sequencer(10);
      expect(seq.getTotal()).toBe(10);
    });

    it('should return if at first index', () => {
      const seq = new Sequencer(5, 0);
      expect(seq.isFirst()).toBe(true);
      
      seq.next();
      expect(seq.isFirst()).toBe(false);
    });

    it('should return if at last index', () => {
      const seq = new Sequencer(5, 4);
      expect(seq.isLast()).toBe(true);
      
      seq.prev();
      expect(seq.isLast()).toBe(false);
    });
  });

  describe('Immutability (if desired)', () => {
    it('should allow peeking next without changing state', () => {
      const seq = new Sequencer(5, 2);
      const peekNext = seq.peekNext();
      
      expect(peekNext).toBe(3);
      expect(seq.getCurrent()).toBe(2); // Unchanged
    });

    it('should allow peeking previous without changing state', () => {
      const seq = new Sequencer(5, 2);
      const peekPrev = seq.peekPrev();
      
      expect(peekPrev).toBe(1);
      expect(seq.getCurrent()).toBe(2); // Unchanged
    });

    it('should handle peek with wrapping', () => {
      const seq = new Sequencer(3, 2);
      expect(seq.peekNext()).toBe(0); // Would wrap
      
      seq.jumpTo(0);
      expect(seq.peekPrev()).toBe(2); // Would wrap
    });
  });
});
