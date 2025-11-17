
import React from 'react';
import PromptGenerator from './components/PromptGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-slate-900">Robo AI - Business Plan to Webpage Prompt Generator</span>
            </div>
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700"
              aria-label="Google AI Studio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </a>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PromptGenerator />
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Built with React, TypeScript, and Gemini</p>
      </footer>
    </div>
  );
};

export default App;
