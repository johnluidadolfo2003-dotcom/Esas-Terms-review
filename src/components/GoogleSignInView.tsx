import React from 'react';

interface GoogleSignInViewProps {
  onSignIn: () => void;
  isLoading: boolean;
  error: string | null;
}

export const GoogleSignInView: React.FC<GoogleSignInViewProps> = ({
  onSignIn,
  isLoading,
  error,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Top decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-xl shadow-lg mb-4">
          EF
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          BAYOT AG MAG TUON
        </h1>
        <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
          Master authentic board exam terms and questions across Economics, Mechanics 1 & 2, EE Laws, Project Management, and Communication.
        </p>

        {/* Subjects list info */}
        <div className="w-full my-6 p-4.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left shadow-inner">
          <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-2.5">
            Target Engineering Subjects
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Economics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Mechanics 1 (Statics)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Mechanics 2 (Dynamics)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>EE Laws & Ethics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Project Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Communication</span>
            </div>
          </div>
        </div>

        {/* Official Google Sign In Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3.5 px-6 rounded-xl border border-slate-300 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 shrink-0"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span className="text-sm font-bold">
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </span>
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/90 border border-rose-700 text-rose-200 text-xs text-left w-full shadow-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-xs text-slate-400">
          Instant offline-ready reviewer preloaded with authentic questions and choices.
        </div>
      </div>
    </div>
  );
};
