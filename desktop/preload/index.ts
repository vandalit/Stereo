/**
 * Preload Script
 * 
 * Exposes safe IPC channels to renderer processes
 */

import { contextBridge, ipcRenderer } from 'electron';

// Define the API surface
export interface StereoAPI {
  // Filesystem
  selectFolder: () => Promise<string | null>;
  loadImages: (folderPath: string) => Promise<any[]>;

  // Window management
  openPlayer: (images: string[]) => Promise<void>;
  closePlayer: () => Promise<void>;

  // Player controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  setFps: (fps: number) => void;
  setHold: (hold: number) => void;

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
}

// Expose protected methods in the renderer process
const api: StereoAPI = {
  // Filesystem
  selectFolder: () => ipcRenderer.invoke('fs:selectFolder'),
  loadImages: (folderPath: string) => ipcRenderer.invoke('fs:loadImages', folderPath),

  // Window management
  openPlayer: (images: string[]) => ipcRenderer.invoke('window:openPlayer', images),
  closePlayer: () => ipcRenderer.invoke('window:closePlayer'),

  // Player controls
  play: () => ipcRenderer.send('player:play'),
  pause: () => ipcRenderer.send('player:pause'),
  stop: () => ipcRenderer.send('player:stop'),
  setFps: (fps: number) => ipcRenderer.send('player:setFps', fps),
  setHold: (hold: number) => ipcRenderer.send('player:setHold', hold),

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

contextBridge.exposeInMainWorld('stereoAPI', api);

// Type declaration for TypeScript
declare global {
  interface Window {
    stereoAPI: StereoAPI;
  }
}
