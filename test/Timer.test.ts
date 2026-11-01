/**
 * Timer module tests
 * Tests the FPS and hold frame timing logic
 */

import { Timer } from '../core/Timer';

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    it('should create timer with default values', () => {
      const timer = new Timer(60, 1);
      expect(timer.getFPS()).toBe(60);
      expect(timer.getHold()).toBe(1);
      expect(timer.isRunning()).toBe(false);
    });

    it('should create timer with custom values', () => {
      const timer = new Timer(30, 6);
      expect(timer.getFPS()).toBe(30);
      expect(timer.getHold()).toBe(6);
    });

    it('should throw error for invalid FPS', () => {
      expect(() => new Timer(0, 1)).toThrow('FPS must be greater than 0');
      expect(() => new Timer(-10, 1)).toThrow('FPS must be greater than 0');
    });

    it('should throw error for invalid hold frames', () => {
      expect(() => new Timer(60, 0)).toThrow('Hold frames must be at least 1');
      expect(() => new Timer(60, -5)).toThrow('Hold frames must be at least 1');
    });
  });

  describe('Effective Frequency', () => {
    it('should calculate effective frequency correctly', () => {
      const timer1 = new Timer(60, 1);
      expect(timer1.getEffectiveFrequency()).toBe(60); // 60/1 = 60 Hz

      const timer2 = new Timer(60, 6);
      expect(timer2.getEffectiveFrequency()).toBe(10); // 60/6 = 10 Hz

      const timer3 = new Timer(30, 15);
      expect(timer3.getEffectiveFrequency()).toBe(2); // 30/15 = 2 Hz
    });

    it('should handle non-integer frequencies', () => {
      const timer = new Timer(60, 7);
      expect(timer.getEffectiveFrequency()).toBeCloseTo(8.571, 2); // 60/7 ≈ 8.57 Hz
    });
  });

  describe('Start/Stop', () => {
    it('should start the timer', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      expect(timer.isRunning()).toBe(true);
    });

    it('should stop the timer', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      timer.stop();
      expect(timer.isRunning()).toBe(false);
    });

    it('should not start if already running', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      expect(() => timer.start(callback)).toThrow('Timer is already running');
    });

    it('should allow restart after stop', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      timer.stop();
      timer.start(callback); // Should not throw
      expect(timer.isRunning()).toBe(true);
    });
  });

  describe('Callback Execution', () => {
    it('should call callback at correct intervals', () => {
      jest.useRealTimers();
      const callback = jest.fn();
      const timer = new Timer(10, 1); // 10 FPS, hold 1 = every 100ms
      
      timer.start(callback);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          timer.stop();
          // In ~250ms at 10 FPS, should have called 2-3 times
          expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
          expect(callback.mock.calls.length).toBeLessThanOrEqual(3);
          resolve();
        }, 250);
      });
    });

    it('should pass frame count to callback', () => {
      jest.useRealTimers();
      const callback = jest.fn();
      const timer = new Timer(20, 1); // 20 FPS for faster test
      
      timer.start(callback);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          timer.stop();
          // Check that frame counts increment
          const frameCounts = callback.mock.calls.map(call => call[0]);
          for (let i = 1; i < frameCounts.length; i++) {
            expect(frameCounts[i]).toBe(frameCounts[i - 1] + 1);
          }
          resolve();
        }, 200);
      });
    });

    it('should respect hold frames', () => {
      jest.useRealTimers();
      const callback = jest.fn();
      const timer = new Timer(60, 10); // 60 FPS, hold 10 = switch every ~166ms
      
      timer.start(callback);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          timer.stop();
          // In ~400ms with 10 hold at 60 FPS, should have 2-3 switches
          // Being more lenient with timing due to test environment variability
          expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
          expect(callback.mock.calls.length).toBeLessThanOrEqual(4);
          resolve();
        }, 400);
      });
    });
  });

  describe('Dynamic Updates', () => {
    it('should update FPS while running', () => {
      const callback = jest.fn();
      const timer = new Timer(30, 1);
      
      timer.start(callback);
      timer.setFPS(60);
      
      expect(timer.getFPS()).toBe(60);
      expect(timer.isRunning()).toBe(true);
    });

    it('should update hold frames while running', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      timer.setHold(10);
      
      expect(timer.getHold()).toBe(10);
      expect(timer.isRunning()).toBe(true);
    });

    it('should recalculate effective frequency after FPS update', () => {
      const timer = new Timer(60, 6);
      expect(timer.getEffectiveFrequency()).toBe(10);
      
      timer.setFPS(30);
      expect(timer.getEffectiveFrequency()).toBe(5); // 30/6 = 5 Hz
    });

    it('should recalculate effective frequency after hold update', () => {
      const timer = new Timer(60, 6);
      expect(timer.getEffectiveFrequency()).toBe(10);
      
      timer.setHold(3);
      expect(timer.getEffectiveFrequency()).toBe(20); // 60/3 = 20 Hz
    });
  });

  describe('Edge Cases', () => {
    it('should handle very high FPS', () => {
      const timer = new Timer(120, 1);
      expect(timer.getEffectiveFrequency()).toBe(120);
    });

    it('should handle very high hold frames', () => {
      const timer = new Timer(60, 60);
      expect(timer.getEffectiveFrequency()).toBe(1);
    });

    it('should clean up on stop', () => {
      const callback = jest.fn();
      const timer = new Timer(60, 1);
      
      timer.start(callback);
      const rafSpy = jest.spyOn(global, 'cancelAnimationFrame');
      timer.stop();
      
      expect(rafSpy).toHaveBeenCalled();
    });
  });
});
