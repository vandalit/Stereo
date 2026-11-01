// Jest setup file
// Add global test utilities and mocks here

// Mock Canvas API for Node.js environment
global.HTMLCanvasElement = class HTMLCanvasElement {
  getContext() {
    return {
      drawImage: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      canvas: {
        width: 800,
        height: 600
      }
    };
  }
} as any;

// Mock createImageBitmap
global.createImageBitmap = jest.fn().mockResolvedValue({
  width: 100,
  height: 100,
  close: jest.fn()
});

// Mock requestAnimationFrame
let frameId = 0;
global.requestAnimationFrame = jest.fn((callback) => {
  frameId++;
  setTimeout(() => callback(performance.now()), 16);
  return frameId;
});

global.cancelAnimationFrame = jest.fn((id) => {
  // Mock implementation
});

// Mock performance.now()
if (typeof performance === 'undefined') {
  (global as any).performance = {
    now: () => Date.now()
  };
}
