/**
 * Electron Main Process Entry Point
 * 
 * Manages application lifecycle and window creation
 */

import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';
import { WindowManager } from './windows';
import { FileSystem } from './filesystem';

let windowManager: WindowManager;
let filesystem: FileSystem;

async function initialize() {
  // Create singletons
  filesystem = new FileSystem();
  windowManager = new WindowManager();

  // Set up IPC handlers
  setupIPC();

  // Register global shortcuts
  registerShortcuts();

  // Create initial window (Explorer)
  await windowManager.createExplorer();
}

function setupIPC() {
  // Filesystem operations
  ipcMain.handle('fs:selectFolder', async () => {
    return await filesystem.selectFolder();
  });

  ipcMain.handle('fs:loadImages', async (_event, folderPath: string) => {
    return await filesystem.loadImages(folderPath);
  });

  // Window management
  ipcMain.handle('window:openPlayer', async (_event, images: string[]) => {
    await windowManager.createPlayer(images);
  });

  ipcMain.handle('window:closePlayer', async () => {
    windowManager.closePlayer();
  });

  // Player controls
  ipcMain.on('player:play', () => {
    windowManager.getPlayerWindow()?.webContents.send('player:play');
  });

  ipcMain.on('player:pause', () => {
    windowManager.getPlayerWindow()?.webContents.send('player:pause');
  });

  ipcMain.on('player:stop', () => {
    windowManager.getPlayerWindow()?.webContents.send('player:stop');
  });

  ipcMain.on('player:setFps', (_event, fps: number) => {
    windowManager.getPlayerWindow()?.webContents.send('player:setFps', fps);
  });

  ipcMain.on('player:setHold', (_event, hold: number) => {
    windowManager.getPlayerWindow()?.webContents.send('player:setHold', hold);
  });
}

function registerShortcuts() {
  // Global shortcuts for player control
  globalShortcut.register('Space', () => {
    const player = windowManager.getPlayerWindow();
    if (player && player.isFocused()) {
      player.webContents.send('player:togglePlayPause');
    }
  });

  globalShortcut.register('Escape', () => {
    const player = windowManager.getPlayerWindow();
    if (player && player.isFocused()) {
      windowManager.closePlayer();
    }
  });

  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  });
}

// App lifecycle
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initialize();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
