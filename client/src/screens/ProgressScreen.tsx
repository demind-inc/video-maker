import { useEffect, useRef, useState } from 'react';
import type { PageData } from '../App';

type Props = {
  url: string;
  onAnalyzeDone: (data: PageData) => void;
  onRenderDone: (videoUrl: string) => void;
  onError: (message: string) => void;
};

type ProgressPhase = 'analyzing' | 'creating';

export function ProgressScreen({ url, onAnalyzeDone, onRenderDone, onError }: Props) {
  const [phase, setPhase] = useState<ProgressPhase>('analyzing');
  const [status, setStatus] = useState<string>('Connecting…');
  const onAnalyzeDoneRef = useRef(onAnalyzeDone);
  const onRenderDoneRef = useRef(onRenderDone);
  const onErrorRef = useRef(onError);
  onAnalyzeDoneRef.current = onAnalyzeDone;
  onRenderDoneRef.current = onRenderDone;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus('Analyzing website…');
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        if (cancelled) return;
        if (!analyzeRes.ok) {
          const err = await analyzeRes.json().catch(() => ({}));
          onErrorRef.current(err.message || analyzeRes.statusText || 'Analysis failed');
          return;
        }
        const pageData: PageData = await analyzeRes.json();
        onAnalyzeDoneRef.current(pageData);

        setPhase('creating');
        setStatus('Creating video…');
        const renderRes = await fetch('/api/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: pageData.title || new URL(url).hostname,
            description: pageData.description || '',
            image: pageData.image,
          }),
        });
        if (cancelled) return;
        if (!renderRes.ok) {
          const err = await renderRes.json().catch(() => ({}));
          onErrorRef.current(err.message || renderRes.statusText || 'Render failed');
          return;
        }
        const { videoUrl } = await renderRes.json();
        onRenderDoneRef.current(videoUrl);
      } catch (e) {
        if (!cancelled) onErrorRef.current(e instanceof Error ? e.message : 'Something went wrong');
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center animate-slide-up">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-900 border border-gray-700/60 mb-6">
            <Spinner />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            {phase === 'analyzing' ? 'Step 1: Analyzing website' : 'Step 2: Creating video'}
          </h2>
          <p className="text-gray-400">{status}</p>
        </div>

        <ol className="text-left space-y-4">
          <StepItem
            step={1}
            label="Analyzing website"
            done={phase !== 'analyzing'}
            active={phase === 'analyzing'}
          />
          <StepItem
            step={2}
            label="Creating video"
            done={phase === 'creating' && status !== 'Creating video…'}
            active={phase === 'creating'}
          />
        </ol>

        <p className="text-gray-500 text-sm mt-8 truncate max-w-full" title={url}>
          {url}
        </p>
      </div>
    </main>
  );
}

function StepItem({
  step,
  label,
  done,
  active,
}: {
  step: number;
  label: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition ${
          done
            ? 'bg-brand-500 text-white'
            : active
              ? 'bg-brand-500/20 text-brand-400 ring-2 ring-brand-500/50'
              : 'bg-surface-850 text-gray-500'
        }`}
      >
        {done ? <CheckIcon /> : active ? <Spinner small /> : step}
      </span>
      <span className={done ? 'text-gray-400' : active ? 'text-white' : 'text-gray-500'}>
        {label}
      </span>
    </li>
  );
}

function Spinner({ small }: { small?: boolean }) {
  return (
    <svg
      className={`animate-spin text-brand-500 ${small ? 'w-4 h-4' : 'w-10 h-10'}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
