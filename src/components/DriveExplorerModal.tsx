import React, { useState } from 'react';
import { DriveItem } from '../services/driveService';

interface DriveExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: DriveItem[];
  selectedFileIds: Set<string>;
  onToggleFile: (fileId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isScanning: boolean;
  onRescanDrive: () => void;
  onCustomSearch: (query: string) => void;
  fileQuestionCounts: Record<string, number>;
  onImportFile?: (file: File) => void;
  userEmail?: string | null;
  hasDriveToken?: boolean;
  onSignIn?: () => void;
  onConnectDrive?: () => void;
}

export const DriveExplorerModal: React.FC<DriveExplorerModalProps> = ({
  isOpen,
  onClose,
  files,
  selectedFileIds,
  onToggleFile,
  onSelectAll,
  onDeselectAll,
  isScanning,
  onRescanDrive,
  onCustomSearch,
  fileQuestionCounts,
  onImportFile,
  userEmail,
  hasDriveToken,
  onSignIn,
  onConnectDrive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'matched'>('matched');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImportFile) {
      onImportFile(e.target.files[0]);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        (f.matchedSubject && f.matchedSubject.toLowerCase().includes(q))
      );
    }
    if (activeTab === 'matched') {
      return Boolean(f.matchedSubject);
    }
    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onCustomSearch(searchQuery.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080e1c]">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Google Drive Files & Folders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Files scanned from your Google Drive for Economics, Mechanics 1 & 2, EE Laws, PM, and Communication.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Account & Access Status Banner */}
        <div className="px-6 py-2.5 bg-[#080e1c]/90 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                hasDriveToken ? 'bg-emerald-400' : userEmail ? 'bg-amber-400' : 'bg-slate-500'
              }`}
            ></span>
            <span className="text-slate-300">
              {hasDriveToken ? (
                <>
                  Google Drive connected (<span className="text-slate-100 font-mono">{userEmail}</span>).
                </>
              ) : userEmail ? (
                <>
                  Signed in as <span className="text-slate-100 font-mono">{userEmail}</span>. All Google accounts can access board questions.
                </>
              ) : (
                <>
                  Public Guest Mode. All built-in board exam questions and pasted questions are ready.
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!userEmail && onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Sign In with Google
              </button>
            )}
            {userEmail && !hasDriveToken && onConnectDrive && (
              <button
                type="button"
                onClick={onConnectDrive}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                Connect Google Drive Files
              </button>
            )}
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-800 bg-[#080e1c] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
            <input
              type="text"
              placeholder="Filter or search Drive files (e.g. 'Economics', 'Mechanics', 'RA 7920')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Search Drive
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onImportFile && (
              <label className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition-colors">
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".zip,.docx,.txt,.csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
            <button
              type="button"
              disabled={isScanning}
              onClick={onRescanDrive}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isScanning
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-wait'
                  : 'bg-slate-100 text-slate-950 border-slate-200 hover:bg-white shadow-xs'
              }`}
            >
              {isScanning ? 'Scanning Drive...' : 'Rescan Entire Drive'}
            </button>
          </div>
        </div>

        {/* Filters and Selection info */}
        <div className="px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('matched')}
              className={`pb-1 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'matched'
                  ? 'border-slate-200 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Subject Matched ({files.filter((f) => f.matchedSubject).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`pb-1 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'border-slate-200 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              All Scanned Files ({files.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-slate-300 hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-800">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              {isScanning ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin"></div>
                  <span>Searching your Google Drive files and folders...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span>No matching files found. Click "Rescan Entire Drive" or search specific terms.</span>
                </div>
              )}
            </div>
          ) : (
            filteredFiles.map((file, fileIdx) => {
              const isSelected = selectedFileIds.has(file.id);
              const qCount = fileQuestionCounts[file.id];

              return (
                <div
                  key={`${file.id}-${fileIdx}`}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleFile(file.id)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-slate-100 accent-slate-200 cursor-pointer"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200 truncate">
                          {file.name}
                        </span>
                        {file.matchedSubject && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                            {file.matchedSubject}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                        <span>
                          {file.mimeType.includes('document')
                            ? 'Google Doc'
                            : file.mimeType.includes('spreadsheet')
                            ? 'Google Sheet'
                            : file.name.endsWith('.docx')
                            ? 'Word Document'
                            : file.mimeType}
                        </span>
                        {file.modifiedTime && (
                          <span>
                            Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {qCount !== undefined && (
                      <span className="font-mono text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {qCount} {qCount === 1 ? 'question' : 'questions'}
                      </span>
                    )}

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-200 border border-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Open in Drive
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#080e1c] flex items-center justify-between text-xs text-slate-400">
          <span>
            {selectedFileIds.size} of {files.length} files selected for flashcard study
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-950 font-medium rounded-lg hover:bg-white text-xs transition-colors cursor-pointer shadow-xs"
          >
            Done & Load Questions
          </button>
        </div>
      </div>
    </div>
  );
};
