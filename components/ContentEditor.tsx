'use client';

/**
 * Content Editor Component
 * Provides a text area for editing content and a save button
 */

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function ContentEditor({
  value,
  onChange,
  onSave,
  isLoading,
}: ContentEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Content Editor
      </h2>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter or edit your text here..."
        className="flex-1 w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
        rows={12}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Characters: {value.length} | Words: {value.trim().split(/\s+/).filter(w => w).length}
        </p>
        
        <button
          onClick={onSave}
          disabled={isLoading || !value.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          {isLoading ? 'Saving...' : 'Save Version'}
        </button>
      </div>
    </div>
  );
}

