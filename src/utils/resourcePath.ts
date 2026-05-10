// Utility to get the correct path for resources in both dev and production
import { resourceDir } from '@tauri-apps/api/path';
import { isTauri } from './constants';

/**
 * Get the base path for courses directory
 * In development: returns './courses'
 * In production (Tauri): returns the resource directory path + '/courses'
 */
export async function getCoursesPath(): Promise<string> {
  if (isTauri()) {
    // In production, courses are bundled as resources
    const resourceDirPath = await resourceDir();
    return `${resourceDirPath}courses`;
  }
  // In development
  return './courses';
}

/**
 * Get the full path for a specific course file
 */
export async function getCourseFilePath(
  mode: 'coding' | 'typing',
  filename: string
): Promise<string> {
  const basePath = await getCoursesPath();
  return `${basePath}/${mode}/${filename}`;
}
