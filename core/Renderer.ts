/**
 * Renderer module - Canvas rendering with multiple display modes
 * 
 * The Renderer draws ImageBitmaps to a Canvas with:
 * - Fill mode: Scale and crop to fill canvas completely
 * - Fit mode: Scale to fit inside canvas (letterbox if needed)
 * - Contain mode: Same as fit
 * 
 * Optimizations:
 * - Uses alpha: false for faster compositing when possible
 * - Integer coordinates to avoid sub-pixel rendering
 * - HiDPI support with devicePixelRatio
 * - Optional desynchronized for reduced input latency
 */

import type { RenderMode, RendererConfig } from './types';

const DEFAULT_CONFIG: RendererConfig = {
  mode: 'fill',
  alpha: false,
  desynchronized: false
};

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: RendererConfig;

  /**
   * Create a new Renderer
   * @param canvas - Canvas element to render to
   * @param config - Optional rendering configuration
   */
  constructor(canvas: HTMLCanvasElement, config: Partial<RendererConfig> = {}) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }

    this.canvas = canvas;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    const context = this.canvas.getContext('2d', {
      alpha: this.config.alpha,
      desynchronized: this.config.desynchronized
    });

    if (!context) {
      throw new Error('Failed to get 2D context');
    }

    this.ctx = context;
  }

  /**
   * Render an ImageBitmap to the canvas
   * @param bitmap - ImageBitmap to render
   * @param mode - Optional render mode override
   */
  render(bitmap: ImageBitmap, mode?: RenderMode): void {
    const renderMode = mode || this.config.mode;
    
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;
    const imageWidth = bitmap.width;
    const imageHeight = bitmap.height;

    // Calculate scale and position based on mode
    const { x, y, width, height } = this.calculateLayout(
      canvasWidth,
      canvasHeight,
      imageWidth,
      imageHeight,
      renderMode
    );

    // Use integer coordinates to avoid sub-pixel rendering
    const drawX = Math.floor(x);
    const drawY = Math.floor(y);
    const drawWidth = Math.floor(width);
    const drawHeight = Math.floor(height);

    this.ctx.drawImage(bitmap, drawX, drawY, drawWidth, drawHeight);
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  /**
   * Resize the canvas
   * Accounts for devicePixelRatio for HiDPI displays
   * @param width - New width in CSS pixels
   * @param height - New height in CSS pixels
   */
  resize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;
    
    // Set physical size (actual pixels)
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    
    // Set CSS size
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    // Scale context to account for DPR
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Update render mode
   * @param mode - New render mode
   */
  setMode(mode: RenderMode): void {
    this.config.mode = mode;
  }

  /**
   * Calculate image layout for rendering
   * @param canvasWidth - Canvas width
   * @param canvasHeight - Canvas height
   * @param imageWidth - Image width
   * @param imageHeight - Image height
   * @param mode - Render mode
   * @returns Position and size for drawImage
   */
  private calculateLayout(
    canvasWidth: number,
    canvasHeight: number,
    imageWidth: number,
    imageHeight: number,
    mode: RenderMode
  ): { x: number; y: number; width: number; height: number } {
    const canvasRatio = canvasWidth / canvasHeight;
    const imageRatio = imageWidth / imageHeight;

    if (mode === 'fill') {
      // Scale to cover canvas completely (crop overflow)
      // Use larger scale to ensure full coverage
      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;
      
      // Center the image
      const x = (canvasWidth - scaledWidth) / 2;
      const y = (canvasHeight - scaledHeight) / 2;
      
      return { x, y, width: scaledWidth, height: scaledHeight };
    } else {
      // Fit/Contain: Scale to fit inside canvas (letterbox if needed)
      // Use smaller scale to fit completely
      const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
      
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;
      
      // Center the image
      const x = (canvasWidth - scaledWidth) / 2;
      const y = (canvasHeight - scaledHeight) / 2;
      
      return { x, y, width: scaledWidth, height: scaledHeight };
    }
  }
}
