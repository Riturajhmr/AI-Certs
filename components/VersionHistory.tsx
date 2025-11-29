'use client';

/**
 * Version History Component
 * Displays the audit trail of all saved versions
 */

import { VersionEntry } from '@/app/page';

interface VersionHistoryProps {
  versions: VersionEntry[];
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="h-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Version History
        </h2>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No versions saved yet. Start editing and save your first version!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Version History ({versions.length})
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Version Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                  {version.id.substring(0, 8)}...
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {version.timestamp}
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">Old Length: </span>
                <span className="font-semibold">{version.oldLength}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-gray-600">New Length: </span>
                <span className="font-semibold text-green-600">{version.newLength}</span>
              </div>
            </div>

            {/* Added Words */}
            {version.addedWords.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-green-700 uppercase">
                  Added Words ({version.addedWords.length}):
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {version.addedWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      +{word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Removed Words */}
            {version.removedWords.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-red-700 uppercase">
                  Removed Words ({version.removedWords.length}):
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {version.removedWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                    >
                      -{word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* No Changes Message */}
            {version.addedWords.length === 0 && version.removedWords.length === 0 && (
              <p className="text-sm text-gray-500 italic">No word changes detected</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

