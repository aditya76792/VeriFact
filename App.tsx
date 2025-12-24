
import React, { useState, useCallback } from 'react';
import { AnalysisState } from './types';
import { verifyContent } from './services/geminiService';
import VerifierInput from './components/VerifierInput';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    step: 'idle',
  });

  const handleVerify = async (text: string, imageUri?: string) => {
    setState({ 
      isAnalyzing: true, 
      result: null, 
      error: null, 
      step: 'scanning' 
    });

    try {
      // Simulate steps for UI feedback
      setTimeout(() => setState(prev => ({ ...prev, step: 'searching' })), 1500);
      setTimeout(() => setState(prev => ({ ...prev, step: 'evaluating' })), 3500);

      const result = await verifyContent(text, imageUri);
      
      setState({
        isAnalyzing: false,
        result,
        error: null,
        step: 'completed'
      });
    } catch (err: any) {
      setState({
        isAnalyzing: false,
        result: null,
        error: err.message || 'An unexpected error occurred.',
        step: 'idle'
      });
    }
  };

  const getStepMessage = () => {
    switch (state.step) {
      case 'scanning': return 'Scanning text and images...';
      case 'searching': return 'Cross-referencing with global news sources...';
      case 'evaluating': return 'Analyzing claims for misinformation patterns...';
      default: return 'Wait a moment...';
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-100 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">VeriFact</h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="hidden md:block text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
               Powered by Gemini 3 Flash
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Intro */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Stop Fake News in its Tracks
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            Forward suspicious messages, links, or screenshots to VeriFact. Get a trust score and source-backed analysis in seconds.
          </p>
        </section>

        {/* Verifier Section */}
        <div className="max-w-2xl mx-auto w-full">
          <VerifierInput onVerify={handleVerify} isLoading={state.isAnalyzing} />
          
          {state.isAnalyzing && (
             <div className="mt-4 flex flex-col items-center justify-center p-8 bg-indigo-50/50 rounded-2xl border border-indigo-100 border-dashed animate-pulse">
                <div className="flex space-x-2 mb-4">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                </div>
                <p className="text-indigo-700 font-medium text-sm">{getStepMessage()}</p>
             </div>
          )}

          {state.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{state.error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {state.result && (
          <section className="border-t border-slate-200 pt-8 mt-12">
            <div className="max-w-3xl mx-auto">
              <AnalysisResult result={state.result} />
              
              <div className="mt-12 flex flex-col items-center">
                 <button 
                  onClick={() => setState({ isAnalyzing: false, result: null, error: null, step: 'idle' })}
                  className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Start New Verification
                 </button>
              </div>
            </div>
          </section>
        )}

        {/* Educational Section - Only visible if no result yet */}
        {!state.result && !state.isAnalyzing && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Identify Red Flags</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Watch out for excessive emojis, "Forwarded many times" labels, and urgent requests for action.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Check the Source</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Misinformation often lacks a credible link. Always check if major news outlets are reporting the same story.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Verify Before You Send</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Sharing is caring, but sharing truth is better. Take 10 seconds to verify before hitting that forward button.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <p className="text-slate-400 text-xs">
          © 2024 VeriFact Misinformation Guard. All verifications are powered by Gemini 3 and Google Search. 
          Use responsibly. Accuracy may vary based on available news data.
        </p>
      </footer>
    </div>
  );
};

export default App;
