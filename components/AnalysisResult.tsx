
import React from 'react';
import { VerificationResult } from '../types';
import TrustMeter from './TrustMeter';

interface AnalysisResultProps {
  result: VerificationResult;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const getVerdictStyle = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'reliable': return 'bg-green-100 text-green-700 border-green-200';
      case 'partially true': return 'bg-lime-100 text-lime-700 border-lime-200';
      case 'misleading': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'fake': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TrustMeter score={result.score} />
        </div>
        
        <div className="md:col-span-2 flex flex-col justify-center space-y-3">
          <div className={`inline-flex items-center px-4 py-1 rounded-full border text-sm font-bold uppercase tracking-wide w-fit ${getVerdictStyle(result.verdict)}`}>
            Verdict: {result.verdict}
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            {result.summary}
          </h3>
          <p className="text-slate-500 text-sm">
            Analysis completed on {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h4 className="font-bold text-slate-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Verification Details
        </h4>
        <div className="prose prose-slate max-w-none">
          <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
            {result.details}
          </div>
        </div>
      </div>

      {result.sources.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Evidence & Sources
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {result.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600">{source.title}</p>
                  <p className="text-xs text-slate-400 truncate">{source.uri}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
