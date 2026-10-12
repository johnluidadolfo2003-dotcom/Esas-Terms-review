import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { SubjectCategory, FlashcardQuestion } from '../services/questionParser';
import {
  generateShareableUrl,
  copyToClipboard,
  isWebShareSupported,
  shareViaNavigator,
  getBaseShareUrl,
  SHARED_PUBLIC_URL,
  DEV_APP_URL,
  getSavedRenderUrl,
  saveRenderUrl,
} from '../services/shareService';
import { exportStandaloneReviewerHtml } from '../services/exportHtmlService';
import { formatQuestionsAsTypeScriptCode } from '../services/storageService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: SubjectCategory | 'All';
  customQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
  customQuestions,
  allQuestions = [],
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectCategory | 'All'>(
    currentSubject
  );
  // Default to TRUE whenever there are custom questions so they are never omitted on share!
  const [includeCustomQuestions, setIncludeCustomQuestions] = useState<boolean>(
    customQuestions.length > 0
  );
  const [linkType, setLinkType] = useState<'render' | 'public' | 'dev'>('render');
  const [renderCustomUrl, setRenderCustomUrl] = useState<string>(() => {
    const saved = getSavedRenderUrl();
    return saved || 'https://drive-terms-reviewer.onrender.com';
  });
  const [copied, setCopied] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const exportQuestionsList = allQuestions.length > 0 ? allQuestions : customQuestions;

  // Keep selected subject in sync when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedSubjectFilter(currentSubject);
      if (customQuestions.length > 0) {
        setIncludeCustomQuestions(true);
      }
    }
  }, [isOpen, currentSubject, customQuestions.length]);

  // Compute the current share URL based on selections
  const shareUrl = useMemo(() => {
    return generateShareableUrl({
      subject: selectedSubjectFilter,
      customQuestions,
      includeCustomQuestions: includeCustomQuestions && customQuestions.length > 0,
      usePublicUrl: linkType === 'public',
      customBaseUrl: linkType === 'render' ? renderCustomUrl : undefined,
    });
  }, [selectedSubjectFilter, includeCustomQuestions, customQuestions, linkType, renderCustomUrl]);

  // Generate QR code whenever the share URL changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(shareUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [shareUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDevLink = async () => {
    const devUrl = generateShareableUrl({
      subject: selectedSubjectFilter,
      customQuestions,
      includeCustomQuestions: includeCustomQuestions && customQuestions.length > 0,
      usePublicUrl: false,
    });
    const success = await copyToClipboard(devUrl);
    if (success) {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    }
  };

  const handleCopySubjectLink = async (subj: SubjectCategory) => {
    const link = generateShareableUrl({
      subject: subj,
      customQuestions,
      includeCustomQuestions: includeCustomQuestions && customQuestions.length > 0,
      usePublicUrl: linkType === 'public',
      customBaseUrl: linkType === 'render' ? renderCustomUrl : undefined,
    });
    const success = await copyToClipboard(link);
    if (success) {
      setCopiedSubject(subj);
      setTimeout(() => setCopiedSubject(null), 1800);
    }
  };

  const handleCopyCodeSnippet = async () => {
    if (customQuestions.length === 0) return;
    const snippet = formatQuestionsAsTypeScriptCode(customQuestions);
    const success = await copyToClipboard(snippet);
    if (success) {
      setCopiedCodeSnippet(true);
      setTimeout(() => setCopiedCodeSnippet(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const title = 'ESAS TERMS';
    const text =
      selectedSubjectFilter === 'All'
        ? 'Engineering Board Exam Flashcard Reviewer with questions from Google Drive.'
        : `${selectedSubjectFilter} Flashcard Reviewer for Engineering Board Exam.`;

    await shareViaNavigator({
      title,
      text,
      url: shareUrl,
    });
  };

  const canShareNatively = isWebShareSupported();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              ↗
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Share Flashcard Reviewer
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Share with classmates, reviewees, or friends to study on any device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Link Type Selector */}
          <div className="flex rounded-lg border border-zinc-800 p-1 bg-zinc-950">
            <button
              type="button"
              onClick={() => setLinkType('render')}
              className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-colors ${
                linkType === 'render'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Render Live Link
            </button>
            <button
              type="button"
              onClick={() => setLinkType('public')}
              className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-colors ${
                linkType === 'public'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              AI Studio Public (ais-pre)
            </button>
            <button
              type="button"
              onClick={() => setLinkType('dev')}
              className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-colors ${
                linkType === 'dev'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Direct Dev Session
            </button>
          </div>

          {/* Render Domain Input when Render Link is selected */}
          {linkType === 'render' && (
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-300">
                  Your Render Web Service URL
                </label>
                <span className="text-[10px] text-zinc-400">
                  From your dashboard.render.com Static Site
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={renderCustomUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRenderCustomUrl(val);
                    saveRenderUrl(val);
                  }}
                  placeholder="https://your-app-name.onrender.com"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Main Share Link Box */}
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-300">
                {linkType === 'render'
                  ? 'Render Sharable Link (Live for All Users)'
                  : linkType === 'public'
                  ? 'Public Sharable Link (ais-pre)'
                  : 'Direct Dev Session URL (ais-dev)'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                linkType === 'render'
                  ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                  : linkType === 'public'
                  ? 'text-cyan-400 bg-cyan-950 border-cyan-800'
                  : 'text-amber-400 bg-amber-950 border-amber-800'
              }`}>
                {linkType === 'render'
                  ? 'Render Cloud'
                  : linkType === 'public'
                  ? 'AI Studio Public'
                  : 'Builder Dev'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 select-all focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-md text-xs font-semibold shrink-0 transition-colors shadow ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>

            {copied && (
              <p className="text-[11px] font-medium text-emerald-400">
                Link copied to clipboard! Paste it into Messenger, WhatsApp, Telegram, or email.
              </p>
            )}
          </div>

          {/* Custom Questions Status Banner */}
          {customQuestions.length > 0 && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{customQuestions.length} Custom Question{customQuestions.length !== 1 ? 's' : ''} Included in Link</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Included in Share
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                When anyone opens this share link, your custom reviewer questions will load automatically in their study session.
              </p>
            </div>
          )}

          {/* Troubleshooting: 404 Page Not Found Notice */}
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 flex flex-col gap-2">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowTroubleshoot((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <span className="text-xs font-semibold text-amber-200">
                  Getting "Page not found" (404) when opening the link?
                </span>
              </div>
              <span className="text-xs text-amber-400">
                {showTroubleshoot ? '▲' : '▼'}
              </span>
            </div>

            {showTroubleshoot && (
              <div className="text-xs text-amber-300/90 leading-relaxed pt-1 border-t border-amber-900/40 flex flex-col gap-2">
                <p>
                  In Google AI Studio, the Public URL (<span className="font-mono text-[11px] text-amber-200">ais-pre-...</span>) is published when you click the <strong>Share</strong> button in the editor:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-zinc-300 text-[11px]">
                  <li>
                    Look at the <strong>top-right corner</strong> of your Google AI Studio screen.
                  </li>
                  <li>
                    Click the <strong>Share</strong> button (next to Export / Settings).
                  </li>
                  <li>
                    Choose <strong>Anyone with the link</strong>.
                  </li>
                </ol>
                <p className="text-[11px] text-zinc-400">
                  Google Cloud immediately deploys the live reviewer and the 404 disappears for everyone!
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      exportStandaloneReviewerHtml(
                        allQuestions.length > 0 ? allQuestions : customQuestions,
                        selectedSubjectFilter
                      )
                    }
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium transition-colors"
                  >
                    Download Offline App (.html)
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyDevLink}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-mono transition-colors"
                  >
                    {copiedDev ? 'Copied Direct Dev Link!' : 'Copy Direct Dev Link'}
                  </button>
                  <span className="text-[10px] text-zinc-500">
                    Works offline or during active session
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Options: Subject and Custom Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Share Specific Subject
              </label>
              <select
                value={selectedSubjectFilter}
                onChange={(e) =>
                  setSelectedSubjectFilter(e.target.value as SubjectCategory | 'All')
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-600"
              >
                <option value="All">All Subjects (All 177+ Questions)</option>
                <option value="Economics">Economics</option>
                <option value="Mechanics 1">Mechanics 1 (Statics)</option>
                <option value="Mechanics 2">Mechanics 2 (Dynamics)</option>
                <option value="EE Laws">EE Laws (RA 7920 & PEC)</option>
                <option value="Project Management">Project Management</option>
                <option value="Communication">Communication</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Custom Questions Bundle
              </label>
              <label
                className={`flex items-center gap-2.5 p-2 rounded-md border text-xs cursor-pointer select-none transition-colors ${
                  customQuestions.length === 0
                    ? 'border-zinc-800 bg-zinc-950 text-zinc-500 cursor-not-allowed'
                    : includeCustomQuestions
                    ? 'border-emerald-700 bg-emerald-950/40 text-emerald-200'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={customQuestions.length === 0}
                  checked={includeCustomQuestions}
                  onChange={(e) => setIncludeCustomQuestions(e.target.checked)}
                  className="rounded border-zinc-700 text-emerald-600 focus:ring-0"
                />
                <span className="truncate">
                  {customQuestions.length > 0
                    ? `Bundle ${customQuestions.length} custom question${customQuestions.length !== 1 ? 's' : ''}`
                    : 'No custom questions added yet'}
                </span>
              </label>
            </div>
          </div>

          {/* Universal Google Account Access Note */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div className="flex-1 text-xs">
              <span className="font-semibold text-zinc-200 block mb-0.5">
                Universal Google Account Access
              </span>
              <p className="text-zinc-400 leading-relaxed">
                All Google accounts (personal @gmail.com, Google Workspace, and school @edu accounts) as well as guests can open this link and access all flashcard subjects immediately.
              </p>
            </div>
          </div>

          {/* Native Share Button on Mobile / Supported Platforms */}
          {canShareNatively && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Share to Messenger, WhatsApp, or Contacts...</span>
            </button>
          )}

          {/* QR Code and Quick Scan Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            {qrDataUrl ? (
              <div className="p-2 bg-white rounded-lg shrink-0 shadow">
                <img
                  src={qrDataUrl}
                  alt="Reviewer QR Code"
                  className="w-28 h-28 object-contain"
                />
              </div>
            ) : (
              <div className="w-28 h-28 bg-zinc-900 rounded-lg animate-pulse shrink-0" />
            )}

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xs font-bold text-zinc-200 mb-1">
                Scan with Phone Camera
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                Anyone can scan this code to open the full reviewer on their mobile phone, tablet, or laptop immediately. No account or installation required.
              </p>
              <div className="text-[11px] font-mono text-zinc-400">
                Base URL: <span className="text-zinc-300">{getBaseShareUrl(linkType === 'public')}</span>
              </div>
            </div>
          </div>

          {/* Quick Subject Direct Links */}
          <div>
            <h3 className="text-xs font-mono text-zinc-400 mb-2">
              Quick Subject Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'Economics',
                  'Mechanics 1',
                  'Mechanics 2',
                  'EE Laws',
                  'Project Management',
                  'Communication',
                ] as SubjectCategory[]
              ).map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleCopySubjectLink(subj)}
                  className={`px-2.5 py-1.5 rounded border text-left text-xs transition-colors flex items-center justify-between ${
                    copiedSubject === subj
                      ? 'border-emerald-600 bg-emerald-950 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100'
                  }`}
                >
                  <span className="truncate">{subj}</span>
                  <span className="text-[10px] font-mono text-zinc-400 ml-1">
                    {copiedSubject === subj ? 'Copied' : 'Copy'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Works in all modern mobile and desktop browsers.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
