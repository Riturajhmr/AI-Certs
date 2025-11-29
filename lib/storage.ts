/**
 * Data storage utility for version history
 * Uses in-memory storage for Vercel/serverless compatibility
 * Falls back to JSON file for local development
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

// Check if we're in a serverless environment (Vercel)
// Vercel sets VERCEL=1 environment variable
const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// In-memory storage for serverless environments
let inMemoryVersions: VersionEntry[] = [];
let inMemoryCurrentText: string = '';

// File-based storage paths (for local development)
const DATA_DIR = path.join(process.cwd(), 'data');
const VERSIONS_FILE = path.join(DATA_DIR, 'versions.json');
const CURRENT_TEXT_FILE = path.join(DATA_DIR, 'current-text.json');

/**
 * Ensures the data directory exists (only for local development)
 */
function ensureDataDir(): void {
  if (isServerless) return;
  
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    // If we can't create directory, we're likely in serverless - use in-memory
    console.warn('Cannot create data directory, using in-memory storage');
  }
}

/**
 * Reads all version entries from storage
 * Uses in-memory for serverless, file system for local
 */
export function readVersions(): VersionEntry[] {
  // Use in-memory storage for serverless environments
  if (isServerless) {
    return [...inMemoryVersions];
  }
  
  // Try file system for local development
  ensureDataDir();
  
  if (!fs.existsSync(VERSIONS_FILE)) {
    return [];
  }
  
  try {
    const fileContent = fs.readFileSync(VERSIONS_FILE, 'utf-8');
    return JSON.parse(fileContent) as VersionEntry[];
  } catch (error) {
    console.error('Error reading versions file:', error);
    // Fallback to in-memory if file read fails
    return [...inMemoryVersions];
  }
}

/**
 * Writes version entries to storage
 * Uses in-memory for serverless, file system for local
 */
export function writeVersions(versions: VersionEntry[]): void {
  // Use in-memory storage for serverless environments
  if (isServerless) {
    inMemoryVersions = [...versions];
    return;
  }
  
  // Try file system for local development
  ensureDataDir();
  
  try {
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(versions, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing versions file, using in-memory storage:', error);
    // Fallback to in-memory if file write fails
    inMemoryVersions = [...versions];
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
 * Uses in-memory for serverless, file system for local
 */
export function getCurrentText(): string {
  // Use in-memory storage for serverless environments
  if (isServerless) {
    return inMemoryCurrentText;
  }
  
  // Try file system for local development
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
    // Fallback to in-memory if file read fails
    return inMemoryCurrentText;
  }
}

/**
 * Saves the current text for next comparison
 * Uses in-memory for serverless, file system for local
 */
export function saveCurrentText(text: string): void {
  // Use in-memory storage for serverless environments
  if (isServerless) {
    inMemoryCurrentText = text;
    return;
  }
  
  // Try file system for local development
  ensureDataDir();
  
  try {
    fs.writeFileSync(
      CURRENT_TEXT_FILE,
      JSON.stringify({ text }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error writing current text file, using in-memory storage:', error);
    // Fallback to in-memory if file write fails
    inMemoryCurrentText = text;
  }
}

