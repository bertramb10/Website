'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary: string | null;
  contractType: string;
  matchScore?: number;
}

export default function JobsPage() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('københavn');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const searchJobs = async () => {
    if (!keywords.trim()) {
      setError('Indtast søgeord');
      return;
    }

    setLoading(true);
    setError('');
    setJobs([]);

    try {
      const response = await fetch('/api/fetch-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke hente jobs');
      }

      setJobs(data.jobs);
      setTotalCount(data.totalCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAllJobs = async () => {
    setAnalyzing(true);

    const analyzedJobs = await Promise.all(
      jobs.map(async (job) => {
        try {
          const response = await fetch('/api/analyze-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'text', text: job.description }),
          });

          const analysis = await response.json();
          return { ...job, matchScore: analysis.matchScore };
        } catch {
          return { ...job, matchScore: 0 };
        }
      })
    );

    // Sort by match score
    analyzedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setJobs(analyzedJobs);
    setAnalyzing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'I går';
    if (diffDays < 7) return `${diffDays} dage siden`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} uger siden`;
    return `${Math.floor(diffDays / 30)} måneder siden`;
  };

  const getMatchColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Tilbage til portfolio
            </Link>
            <Link
              href="/job-settings"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              ⚙️ Indstillinger
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Job Søgning</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Søg efter jobs og få automatisk match score baseret på dit CV
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Søgeord</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
                placeholder="f.eks. software udvikler, frontend, .NET"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lokation</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
                placeholder="f.eks. københavn"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={searchJobs}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Søger...' : 'Søg Jobs'}
            </button>

            {jobs.length > 0 && (
              <button
                onClick={analyzeAllJobs}
                disabled={analyzing}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
              >
                {analyzing ? 'Analyserer...' : 'Analyser Alle Jobs'}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Results Count */}
        {totalCount > 0 && (
          <div className="mb-4 text-slate-600 dark:text-slate-400">
            Fundet {totalCount.toLocaleString()} jobs
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{job.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {job.company} • {job.location}
                  </p>
                </div>
                {job.matchScore !== undefined && (
                  <div className={`px-3 py-1 rounded-lg font-bold text-lg ${getMatchBadge(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </div>
                )}
              </div>

              <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                <span>{formatDate(job.postedDate)}</span>
                {job.salary && <span>💰 {job.salary}</span>}
                <span>📄 {job.contractType}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                {job.description.replace(/<[^>]*>/g, '').substring(0, 300)}...
              </p>

              <div className="flex gap-3">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Se Job Opslag →
                </a>
                <Link
                  href={`/job-analyzer?url=${encodeURIComponent(job.url)}`}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-600 rounded-lg font-medium transition-colors"
                >
                  Analyser & Lav Ansøgning
                </Link>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            Søg efter jobs for at komme i gang
          </div>
        )}
      </div>
    </div>
  );
}
