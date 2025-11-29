/**
 * Data storage utility for version history
 * Uses JSON file for persistence
 * In production, this could be replaced with a database
 */

import fs from 'fs';
import path from 'path';

export interface VersionEntry {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const VERSIONS_FILE = path.join(DATA_DIR, 'versions.json');
const CURRENT_TEXT_FILE = path.join(DATA_DIR, 'current-text.json');

/**
 * Ensures the data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Reads all version entries from the JSON file
 */
export function readVersions(): VersionEntry[] {
  ensureDataDir();
  
  if (!fs.existsSync(VERSIONS_FILE)) {
    return [];
  }
  
  try {
    const fileContent = fs.readFileSync(VERSIONS_FILE, 'utf-8');
    return JSON.parse(fileContent) as VersionEntry[];
  } catch (error) {
    console.error('Error reading versions file:', error);
    return [];
  }
}

/**
 * Writes version entries to the JSON file
 */
export function writeVersions(versions: VersionEntry[]): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(versions, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing versions file:', error);
    throw error;
  }
}

/**
 * Adds a new version entry to the storage
 */
export function addVersion(version: VersionEntry): void {
  const versions = readVersions();
  versions.push(version);
  writeVersions(versions);
}

/**
 * Gets the latest version's text length (for comparison)
 */
export function getLatestVersionLength(): number {
  const versions = readVersions();
  if (versions.length === 0) {
    return 0;
  }
  // Return the newLength of the most recent version
  return versions[versions.length - 1].newLength;
}

/**
 * Gets the current text stored in the system
 */
export function getCurrentText(): string {
  ensureDataDir();
  
  if (!fs.existsSync(CURRENT_TEXT_FILE)) {
    return '';
  }
  
  try {
    const fileContent = fs.readFileSync(CURRENT_TEXT_FILE, 'utf-8');
    const data = JSON.parse(fileContent) as { text: string };
    return data.text || '';
  } catch (error) {
    console.error('Error reading current text file:', error);
    return '';
  }
}

/**
 * Saves the current text for next comparison
 */
export function saveCurrentText(text: string): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(
      CURRENT_TEXT_FILE,
      JSON.stringify({ text }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error writing current text file:', error);
    throw error;
  }
}

