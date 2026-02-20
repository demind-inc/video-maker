import { useState } from 'react';
import { InputUrlScreen } from './screens/InputUrlScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ResultScreen } from './screens/ResultScreen';

export type Step = 'input' | 'progress' | 'result';

export type ProgressStep = 'analyzing' | 'creating';

export type PageData = {
  url: string;
  title: string;
  description: string;
  markdown?: string;
  image?: string;
};

export type ResultState = {
  videoUrl: string;
  pageData: PageData;
};

function App() {
  const [step, setStep] = useState<Step>('input');
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitUrl = (url: string) => {
    setError(null);
    setPageData({ url, title: '', description: '' });
    setStep('progress');
  };

  const handleAnalyzeDone = (data: PageData) => {
    setPageData(data);
  };

  const handleRenderDone = (videoUrl: string) => {
    if (pageData) setResult({ videoUrl, pageData });
    setStep('result');
  };

  const handleError = (message: string) => {
    setError(message);
    setStep('input');
  };

  const handleReset = () => {
    setStep('input');
    setPageData(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {step === 'input' && (
        <InputUrlScreen onSubmit={handleSubmitUrl} error={error} />
      )}
      {step === 'progress' && pageData && (
        <ProgressScreen
          url={pageData.url}
          onAnalyzeDone={handleAnalyzeDone}
          onRenderDone={handleRenderDone}
          onError={handleError}
        />
      )}
      {step === 'result' && result && (
        <ResultScreen result={result} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
