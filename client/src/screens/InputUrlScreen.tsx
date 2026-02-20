import { useState, FormEvent } from 'react';

type Props = {
  onSubmit: (url: string) => void;
  error: string | null;
};

export function InputUrlScreen({ onSubmit, error }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      onSubmit(trimmed);
    } catch {
      onSubmit(trimmed);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg mx-auto text-center animate-slide-up">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-2">
          Teaser from URL
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Paste a landing page link and get a short teaser video in seconds.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full h-14 pl-5 pr-12 rounded-2xl bg-surface-900 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <LinkIcon />
            </span>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-left flex items-center gap-2">
              <ErrorIcon /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!url.trim()}
            className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
          >
            Create teaser
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-8">
          We’ll analyze the page and generate an MP4 teaser you can download.
        </p>
      </div>
    </main>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}
