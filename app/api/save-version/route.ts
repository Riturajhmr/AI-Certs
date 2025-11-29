/**
 * API Route: POST /api/save-version
 * Saves a new version of the text and calculates the diff
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { calculateTextDiff, formatTimestamp } from '@/lib/diff-utils';
import { addVersion, getCurrentText, saveCurrentText, VersionEntry } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    // Validate input
    if (typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text must be a string' },
        { status: 400 }
      );
    }

    // Get the previous text from storage
    const previousText = getCurrentText();

    // Calculate differences between previous and new text
    const diff = calculateTextDiff(previousText, text);

    // Create new version entry with UUID and timestamp
    const versionEntry: VersionEntry = {
      id: uuidv4(),
      timestamp: formatTimestamp(new Date()),
      addedWords: diff.addedWords,
      removedWords: diff.removedWords,
      oldLength: diff.oldLength,
      newLength: diff.newLength,
    };

    // Save the version to history
    addVersion(versionEntry);

    // Save the current text for next comparison
    saveCurrentText(text);

    return NextResponse.json({
      success: true,
      version: versionEntry,
    });
  } catch (error) {
    console.error('Error saving version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

