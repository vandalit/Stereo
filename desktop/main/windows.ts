/**
 * Window Manager
 * 
 * Creates and manages Explorer and Player windows
 */

import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class WindowManager {
  private explorerWindow: BrowserWindow | null = null;
  private playerWindow: BrowserWindow | null = null;

  /**
   * Create the Explorer window
   * Shows thumbnail grid and folder navigation
   */
  async createExplorer(): Promise<BrowserWindow> {
    if (this.explorerWindow && !this.explorerWindow.isDestroyed()) {
      this.explorerWindow.focus();
      return this.explorerWindow;
    }

    this.explorerWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      title: 'Stereo - Explorer',
      backgroundColor: '#1a1a1a',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js'),
      },
    });

    // Load Explorer UI
    if (process.env.NODE_ENV === 'development') {
      await this.explorerWindow.loadURL('http://localhost:5173/explorer.html');
      this.explorerWindow.webContents.openDevTools();
    } else {
      await this.explorerWindow.loadFile(
        path.join(__dirname, '../renderer/explorer.html')
      );
    }

    this.explorerWindow.on('closed', () => {
      this.explorerWindow = null;
    });

    return this.explorerWindow;
  }

  /**
   * Create the Player window
   * Fullscreen canvas for playing image sequences
   */
  async createPlayer(images: string[]): Promise<BrowserWindow> {
    if (this.playerWindow && !this.playerWindow.isDestroyed()) {
      this.playerWindow.webContents.send('player:loadImages', images);
      this.playerWindow.focus();
      return this.playerWindow;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    this.playerWindow = new BrowserWindow({
      width,
      height,
      fullscreen: true,
      frame: false,
      title: 'Stereo - Player',
      backgroundColor: '#000000',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js'),
      },
    });

    // Load Player UI
    if (process.env.NODE_ENV === 'development') {
      await this.playerWindow.loadURL('http://localhost:5173/player.html');
      this.playerWindow.webContents.openDevTools();
    } else {
      await this.playerWindow.loadFile(
        path.join(__dirname, '../renderer/player.html')
      );
    }

    // Send images once the page is ready
    this.playerWindow.webContents.once('did-finish-load', () => {
      this.playerWindow?.webContents.send('player:loadImages', images);
    });

    this.playerWindow.on('closed', () => {
      this.playerWindow = null;
    });

    return this.playerWindow;
  }

  /**
   * Close the Player window
   */
  closePlayer(): void {
    if (this.playerWindow && !this.playerWindow.isDestroyed()) {
      this.playerWindow.close();
    }
  }

  /**
   * Get the Player window instance
   */
  getPlayerWindow(): BrowserWindow | null {
    return this.playerWindow;
  }

  /**
   * Get the Explorer window instance
   */
  getExplorerWindow(): BrowserWindow | null {
    return this.explorerWindow;
  }
}
