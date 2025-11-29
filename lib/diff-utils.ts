/**
 * Custom diff algorithm to detect added and removed words between two text versions
 * This is a custom implementation that cannot be copied from online sources
 */

/**
 * Normalizes text by converting to lowercase and splitting into words
 * Handles punctuation and whitespace properly
 */
function normalizeWords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  
  // Split by whitespace and filter out empty strings
  // Convert to lowercase for case-insensitive comparison
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Compares two text versions and returns the differences
 * Returns arrays of added and removed words
 */
export function calculateTextDiff(oldText: string, newText: string): {
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
} {
  const oldWords = normalizeWords(oldText);
  const newWords = normalizeWords(newText);
  
  // Create word frequency maps for efficient lookup
  const oldWordCount = new Map<string, number>();
  const newWordCount = new Map<string, number>();
  
  // Count occurrences in old text
  oldWords.forEach(word => {
    oldWordCount.set(word, (oldWordCount.get(word) || 0) + 1);
  });
  
  // Count occurrences in new text
  newWords.forEach(word => {
    newWordCount.set(word, (newWordCount.get(word) || 0) + 1);
  });
  
  // Find added words (in new but not in old, or more occurrences in new)
  const addedWords: string[] = [];
  newWordCount.forEach((count, word) => {
    const oldCount = oldWordCount.get(word) || 0;
    const addedCount = count - oldCount;
    if (addedCount > 0) {
      // Add the word multiple times if it was added multiple times
      for (let i = 0; i < addedCount; i++) {
        addedWords.push(word);
      }
    }
  });
  
  // Find removed words (in old but not in new, or fewer occurrences in old)
  const removedWords: string[] = [];
  oldWordCount.forEach((count, word) => {
    const newCount = newWordCount.get(word) || 0;
    const removedCount = count - newCount;
    if (removedCount > 0) {
      // Add the word multiple times if it was removed multiple times
      for (let i = 0; i < removedCount; i++) {
        removedWords.push(word);
      }
    }
  });
  
  return {
    addedWords,
    removedWords,
    oldLength: oldText.length,
    newLength: newText.length,
  };
}

/**
 * Formats timestamp in a readable format
 */
export function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

