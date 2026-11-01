/**
 * Shared TypeScript types for Stereo core engine
 */

/**
 * Render mode for canvas display
 */
export type RenderMode = 'fill' | 'fit' | 'contain';

/**
 * Sort order for image sequences
 */
export type SortOrder = 'alphabetical' | 'dateModified' | 'dateCreated' | 'size';

/**
 * Image source types supported by the loader
 */
export type ImageSource = string | Blob | File;

/**
 * Engine playback state
 */
export type PlaybackState = 'idle' | 'loading' | 'loaded' | 'playing' | 'paused' | 'stopped';

/**
 * Complete engine state
 */
export interface EngineState {
  state: PlaybackState;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  hold: number;
  effectiveFrequency: number;
}

/**
 * Timer callback function
 */
export type TimerCallback = (frameCount: number) => void;

/**
 * Image metadata
 */
export interface ImageMetadata {
  path: string;
  name: string;
  size: number;
  dateModified: Date;
  dateCreated: Date;
  width?: number;
  height?: number;
}

/**
 * Loader configuration
 */
export interface LoaderConfig {
  preloadCount: number;
  maxCacheSize: number;
}

/**
 * Renderer configuration
 */
export interface RendererConfig {
  mode: RenderMode;
  alpha: boolean;
  desynchronized: boolean;
}

/**
 * Event payloads for FrameEngine events
 */
export interface FrameEngineEvents {
  'framechange': { index: number; total: number };
  'play': {};
  'pause': {};
  'stop': {};
  'ended': {};
  'loaded': { totalFrames: number };
  'error': { message: string; error: Error };
}
