'use client';

/**
 * Main Page Component
 * Mini Audit Trail Generator - Full Stack Application
 * 
 * This component implements:
 * - Text editor for content input
 * - Save Version functionality
 * - Version history display with audit trail
 */

import { useState, useEffect } from 'react';
import VersionHistory from '@/components/VersionHistory';
import ContentEditor from '@/components/ContentEditor';

export interface VersionEntry {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
}

export default function Home() {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState('');

  // Fetch version history on component mount
  useEffect(() => {
    fetchVersions();
  }, []);

  /**
   * Fetches all version history from the API
   */
  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/versions');
      const data = await response.json();
      if (data.success) {
        setVersions(data.versions);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  /**
   * Handles saving a new version
   * Sends the current text to the backend for diff calculation
   */
  const handleSaveVersion = async () => {
    if (!currentText.trim()) {
      alert('Please enter some text before saving a version.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/save-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentText }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh version history
        await fetchVersions();
        // Show success message
        alert('Version saved successfully!');
      } else {
        alert('Error saving version: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving version:', error);
      alert('Error saving version. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mini Audit Trail Generator
          </h1>
          <p className="text-gray-600">
            Track every change with automatic version history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Content Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContentEditor
              value={currentText}
              onChange={setCurrentText}
              onSave={handleSaveVersion}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Version History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <VersionHistory versions={versions} />
          </div>
        </div>
      </div>
    </main>
  );
}

