import { DataStructure } from '../types';

export function parseDataStructure(jsonString: string): DataStructure {
  return JSON.parse(jsonString) as DataStructure;
}

export function formatBytes(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let magnitude = 0;

  while (bytes >= 1024 && magnitude < units.length - 1) {
    bytes /= 1024;
    magnitude++;
  }

  return `${bytes.toFixed(1)} ${units[magnitude]}`;
}
