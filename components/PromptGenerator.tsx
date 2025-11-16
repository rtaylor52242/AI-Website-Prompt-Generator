
import React, { useState, useCallback } from 'react';
import { generateWebsitePrompt, businessPlanText } from '../services/geminiService';
import { ClipboardIcon, CheckIcon, SparklesIcon, LoadingIcon } from './Icons';

const PromptGenerator: React.FC = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const prompt = await generateWebsitePrompt();
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [generatedPrompt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Business Plan */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">Business Plan Source</h2>
        <p className="text-slate-600 mb-4">
          This content is used to generate a detailed prompt for building a website with Google AI Studio.
        </p>
        <div className="bg-slate-50 p-4 rounded-md max-h-96 overflow-y-auto border border-slate-200">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{businessPlanText}</pre>
        </div>
      </div>

      {/* Right Column: Prompt Generation */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">Generated Prompt</h2>
        <div className="flex-grow flex flex-col">
          {!generatedPrompt && !isLoading && !error && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-md border-2 border-dashed border-slate-300">
                <SparklesIcon className="w-12 h-12 text-blue-500 mb-2"/>
                <p className="text-slate-500">Click the button below to generate your prompt.</p>
            </div>
          )}

          <div className="relative mt-4 flex-grow">
            <textarea
              readOnly
              value={isLoading ? 'Generating your prompt, please wait...' : error || generatedPrompt}
              className={`w-full h-full min-h-[300px] p-4 pr-12 rounded-md border transition-colors duration-200 text-sm font-mono resize-none ${
                error
                  ? 'bg-red-50 border-red-300 text-red-700 focus:ring-red-500'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
              placeholder="Your generated prompt will appear here..."
            />
            {generatedPrompt && !error && (
               <button
                 onClick={handleCopyToClipboard}
                 className="absolute top-3 right-3 p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 transition-all duration-200"
                 aria-label="Copy to clipboard"
               >
                 {isCopied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <ClipboardIcon className="w-5 h-5" />}
               </button>
            )}
          </div>
        </div>

        <button
          onClick={handleGeneratePrompt}
          disabled={isLoading}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2"/>
              Generate Prompt
            </>
          )}
        </button>
        {isCopied && <div className="text-center text-green-600 mt-2 text-sm">Copied to clipboard!</div>}
      </div>
    </div>
  );
};

export default PromptGenerator;
