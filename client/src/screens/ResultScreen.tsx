import type { ResultState } from '../App';

type Props = {
  result: ResultState;
  onReset: () => void;
};

export function ResultScreen({ result, onReset }: Props) {
  const { videoUrl, pageData } = result;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `teaser-${new URL(pageData.url).hostname.replace(/\./g, '-')}.mp4`;
    a.click();
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto animate-slide-up">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white text-center mb-2">
          Your teaser is ready
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {pageData.title || pageData.url}
        </p>

        <div className="rounded-2xl overflow-hidden bg-surface-900 border border-gray-700/60 shadow-xl mb-6">
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video"
            poster={pageData.image}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition shadow-lg shadow-brand-500/20"
          >
            Download MP4
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-surface-850 hover:bg-surface-900 border border-gray-700 text-gray-300 font-medium transition"
          >
            Create another
          </button>
        </div>
      </div>
    </main>
  );
}
