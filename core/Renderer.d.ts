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
export declare class Renderer {
    private canvas;
    private ctx;
    private config;
    /**
     * Create a new Renderer
     * @param canvas - Canvas element to render to
     * @param config - Optional rendering configuration
     */
    constructor(canvas: HTMLCanvasElement, config?: Partial<RendererConfig>);
    /**
     * Render an ImageBitmap to the canvas
     * @param bitmap - ImageBitmap to render
     * @param mode - Optional render mode override
     */
    render(bitmap: ImageBitmap, mode?: RenderMode): void;
    /**
     * Clear the canvas
     */
    clear(): void;
    /**
     * Resize the canvas
     * Accounts for devicePixelRatio for HiDPI displays
     * @param width - New width in CSS pixels
     * @param height - New height in CSS pixels
     */
    resize(width: number, height: number): void;
    /**
     * Get the canvas element
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Update render mode
     * @param mode - New render mode
     */
    setMode(mode: RenderMode): void;
    /**
     * Calculate image layout for rendering
     * @param canvasWidth - Canvas width
     * @param canvasHeight - Canvas height
     * @param imageWidth - Image width
     * @param imageHeight - Image height
     * @param mode - Render mode
     * @returns Position and size for drawImage
     */
    private calculateLayout;
}
//# sourceMappingURL=Renderer.d.ts.map