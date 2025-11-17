
import React, { useState, useCallback, useRef } from 'react';
import { generateWebsitePrompt, businessPlanText } from '../services/geminiService';
import { ClipboardIcon, CheckIcon, SparklesIcon, LoadingIcon, UploadIcon } from './Icons';

const PromptGenerator: React.FC = () => {
  const [businessPlan, setBusinessPlan] = useState<string>(businessPlanText);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setFileError('Invalid file type. Please upload a .txt file.');
      setTimeout(() => setFileError(null), 3000);
      return;
    }
    
    setFileError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setBusinessPlan(text);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read the file.');
      setTimeout(() => setFileError(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGeneratePrompt = useCallback(async () => {
    if (!businessPlan.trim()) {
      setError("Business plan cannot be empty. Please upload or enter a business plan.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const prompt = await generateWebsitePrompt(businessPlan);
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [businessPlan]);

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
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">Your Business Plan</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <p className="text-slate-600 text-sm flex-grow">
                Upload a document (.txt) or edit the content below.
            </p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,text/plain"
            />
            <button
                onClick={handleUploadClick}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Upload business plan file"
            >
                <UploadIcon className="w-5 h-5" />
                <span>Upload File</span>
            </button>
        </div>
        {fileError && <p className="text-red-500 text-xs mb-2">{fileError}</p>}
        <div className="flex-grow">
          <textarea
              value={businessPlan}
              onChange={(e) => setBusinessPlan(e.target.value)}
              className="w-full h-full min-h-[350px] p-4 rounded-md border border-slate-300 text-sm font-sans resize-y bg-slate-50 focus:ring-blue-500 focus:outline-none focus:ring-2"
              placeholder="Enter your business plan here..."
              aria-label="Business Plan Text Area"
          />
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
