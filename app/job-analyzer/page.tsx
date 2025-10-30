'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Keywords {
  technical?: string[];
  soft?: string[];
}

// Helper function to highlight keywords in text
function highlightKeywords(text: string, keywords: Keywords) {
  if (!keywords || !text) return text;

  const allKeywords = [
    ...(keywords.technical || []),
    ...(keywords.soft || []),
  ];

  // Split text into lines to preserve formatting
  const lines = text.split('\n');
  let globalCounter = 0; // Unique key counter

  return lines.map((line, lineIdx) => {
    let parts: (string | JSX.Element)[] = [line];

    // For each keyword, split and highlight
    allKeywords.forEach((keyword: string) => {
      const newParts: (string | JSX.Element)[] = [];
      parts.forEach((part) => {
        if (typeof part === 'string') {
          // Case-insensitive split
          const regex = new RegExp(`(\\b${keyword}\\b)`, 'gi');
          const splitParts = part.split(regex);

          splitParts.forEach((splitPart) => {
            if (regex.test(splitPart)) {
              const isTechnical = keywords.technical?.includes(keyword);
              newParts.push(
                <span
                  key={`highlight-${globalCounter++}`}
                  className={`${
                    isTechnical
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                      : 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100'
                  } px-1 rounded font-medium`}
                >
                  {splitPart}
                </span>
              );
            } else if (splitPart) {
              newParts.push(splitPart);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return (
      <div key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 && <br />}
      </div>
    );
  });
}

interface AnalysisResult {
  keywords: Keywords;
  requirements: string[];
  matchScore: number;
  coverLetter: string;
}

export default function JobAnalyzer() {
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Check for prefilled data from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefillUrl = params.get('url');
    const prefillText = params.get('prefill');

    if (prefillUrl) {
      setJobUrl(decodeURIComponent(prefillUrl));
      setInputMode('url');
    } else if (prefillText) {
      setJobText(decodeURIComponent(prefillText));
      setInputMode('text');
    }
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: inputMode,
          url: inputMode === 'url' ? jobUrl : undefined,
          text: inputMode === 'text' ? jobText : undefined,
        }),
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze job posting. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BB
          </Link>
          <Link href="/" className="text-sm hover:text-blue-600 transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart Job Application Analyzer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Analyze job postings and generate tailored cover letters based on your resume
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputMode('url')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Job URL
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Paste Text
              </button>
            </div>

            {inputMode === 'url' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Job Posting URL</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://www.jobindex.dk/jobannonce/..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Supports: JobIndex, Jobcenter.dk, LinkedIn, and more
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Job Posting Text</label>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputMode === 'url' ? !jobUrl : !jobText)}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Job & Generate Application'}
          </button>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Match Score - Move to top */}
            {analysisResult.matchScore !== undefined && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Match Score</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-10 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-green-600 h-full flex items-center justify-center text-white font-bold text-lg transition-all duration-500"
                      style={{ width: `${analysisResult.matchScore}%` }}
                    >
                      {analysisResult.matchScore}%
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-slate-700 dark:text-slate-300 min-w-[80px]">
                    {analysisResult.matchScore}%
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Based on your resume and the job requirements
                </p>
              </div>
            )}

            {/* Keywords & Requirements */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Extracted Keywords & Requirements</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords?.technical?.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-600">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords?.soft?.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    {analysisResult.requirements?.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Generated Cover Letter with Highlighting */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Generated Cover Letter</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(analysisResult.coverLetter)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
                <div className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
                  {highlightKeywords(analysisResult.coverLetter, analysisResult.keywords)}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  🔵 Technical Skills from Resume
                </span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  🟣 Soft Skills
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysisResult && !isAnalyzing && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Enter a job posting URL or paste the job description to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
