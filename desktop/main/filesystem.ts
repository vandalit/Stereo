/**
 * Filesystem Module
 * 
 * Handles folder selection and image loading
 */

import { dialog } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];

export interface ImageFile {
  path: string;
  name: string;
  size: number;
  modified: Date;
}

export class FileSystem {
  /**
   * Open dialog to select a folder
   */
  async selectFolder(): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Image Folder',
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  }

  /**
   * Load all images from a folder
   */
  async loadImages(folderPath: string): Promise<ImageFile[]> {
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      const imageFiles: ImageFile[] = [];

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;

        const fullPath = path.join(folderPath, entry.name);
        const stats = await fs.stat(fullPath);

        imageFiles.push({
          path: fullPath,
          name: entry.name,
          size: stats.size,
          modified: stats.mtime,
        });
      }

      // Sort by name (natural sort)
      imageFiles.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      });

      return imageFiles;
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }

  /**
   * Check if a path is a valid directory
   */
  async isDirectory(folderPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(folderPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Get folder name from path
   */
  getFolderName(folderPath: string): string {
    return path.basename(folderPath);
  }
}
