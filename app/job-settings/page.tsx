'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Profile {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[];
  locations: string[];
  matchThreshold: number;
}

export default function JobSettings() {
  const [email, setEmail] = useState('');
  const [matchThreshold, setMatchThreshold] = useState(80);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [cronStatus, setCronStatus] = useState<'active' | 'inactive'>('inactive');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string>('it-developer');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadProfiles();
    checkCronStatus();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setEmail(data.notificationEmail || '');
        setMatchThreshold(data.matchThreshold || 80);
        setSearchKeywords(data.searchKeywords || []);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
        setActiveProfile(data.activeProfile || 'it-developer');

        // Load keywords from active profile
        const active = data.profiles.find((p: Profile) => p.id === data.activeProfile);
        if (active) {
          setSearchKeywords(active.keywords);
          setMatchThreshold(active.matchThreshold);
        }
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const selectProfile = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    setActiveProfile(profileId);
    setSearchKeywords(profile.keywords);
    setMatchThreshold(profile.matchThreshold);

    // Save active profile
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeProfile: profileId }),
      });
      setMessage(`✅ Skiftede til profil: ${profile.name}`);
    } catch {
      setMessage('❌ Kunne ikke skifte profil');
    }
  };

  const checkCronStatus = async () => {
    try {
      const response = await fetch('/api/cron/start');
      if (response.ok) {
        const data = await response.json();
        setCronStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to check cron status:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationEmail: email,
          matchThreshold,
          searchKeywords,
        }),
      });

      if (response.ok) {
        setMessage('✅ Indstillinger gemt!');
      } else {
        setMessage('❌ Kunne ikke gemme indstillinger');
      }
    } catch (error) {
      setMessage('❌ Fejl: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !searchKeywords.includes(newKeyword.trim())) {
      setSearchKeywords([...searchKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSearchKeywords(searchKeywords.filter(k => k !== keyword));
  };

  const startCron = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/start', { method: 'POST' });
      if (response.ok) {
        setCronStatus('active');
        setMessage('✅ Automatisk job tjek startet!');
      } else {
        setMessage('❌ Kunne ikke starte automatisk tjek');
      }
    } catch (error) {
      setMessage('❌ Fejl: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  const runManualCheck = async () => {
    setLoading(true);
    setMessage('🔍 Søger efter nye jobs...');

    try {
      const response = await fetch('/api/auto-check-jobs');
      if (response.ok) {
        const result = await response.json();
        setMessage(
          `✅ Fandt ${result.newJobs} nye jobs! (${result.highMatchJobs} med høj match)`
        );
      } else {
        setMessage('❌ Kunne ikke søge efter jobs');
      }
    } catch (error) {
      setMessage('❌ Fejl: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('❌ Indtast din email først!');
      return;
    }

    setLoading(true);
    setMessage('📧 Sender test email...');

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('✅ Test email sendt! Tjek din indbakke (og spam folder).');
      } else {
        setMessage('❌ Kunne ikke sende email: ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Fejl ved afsendelse af email: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/jobs" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Tilbage til job søgning
          </Link>
          <h1 className="text-4xl font-bold mb-2">Indstillinger</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Konfigurer automatisk job søgning og notifikationer
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Profile Selector */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Vælg Job Profil</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Hver profil har forskellige keywords og indstillinger optimeret til forskellige job typer
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => selectProfile(profile.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  activeProfile === profile.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{profile.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    {activeProfile === profile.id && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        ✓ Aktiv
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{profile.description}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {profile.keywords.length} keywords • {profile.matchThreshold}% threshold
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Email Notifikationer</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Din Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din-email@example.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
            <p className="text-sm text-slate-500 mt-2">
              Du får email når der findes jobs med høj match score
            </p>
            <button
              onClick={sendTestEmail}
              disabled={loading || !email}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
            >
              📧 Send Test Email
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Match Score Grænse: {matchThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-slate-500 mt-2">
              Kun jobs med ≥{matchThreshold}% match trigger notifikationer
            </p>
          </div>
        </div>

        {/* Search Keywords */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Søgeord</h2>
            <span className="text-sm text-slate-500">
              Fra profil: {profiles.find(p => p.id === activeProfile)?.name}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {activeProfile === 'custom'
              ? 'Tilpas dine egne søgeord for den tilpassede profil'
              : 'Disse søgeord kommer fra din valgte profil. Skift til "Tilpasset Profil" for at tilføje egne keywords.'
            }
          </p>

          {activeProfile === 'custom' && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Tilføj søgeord (f.eks. 'python', 'react')"
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              />
              <button
                onClick={addKeyword}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Tilføj
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {searchKeywords.map((keyword) => (
              <div
                key={keyword}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full flex items-center gap-2"
              >
                <span>{keyword}</span>
                {activeProfile === 'custom' && (
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {searchKeywords.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Ingen keywords endnu. {activeProfile === 'custom' ? 'Tilføj nogle ovenfor!' : 'Vælg en profil for at få keywords.'}
            </p>
          )}
        </div>

        {/* Cron Job Controls */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Automatisk Job Tjek</h2>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cronStatus === 'active'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                }`}
              >
                {cronStatus === 'active' ? '✅ Aktiv' : '⏸️ Inaktiv'}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Programmet tjekker automatisk for nye jobs hver 6. time og sender email notifikationer for høj-match jobs.
            </p>

            <div className="flex gap-3">
              <button
                onClick={startCron}
                disabled={loading || cronStatus === 'active'}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
              >
                Start Automatisk Tjek
              </button>

              <button
                onClick={runManualCheck}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
              >
                {loading ? 'Søger...' : 'Søg Nu (Manuelt)'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium text-lg"
        >
          {loading ? 'Gemmer...' : 'Gem Indstillinger'}
        </button>

        {/* Email Configuration Help */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h3 className="font-bold mb-2">⚙️ Email Konfiguration</h3>
          <p className="text-sm mb-2">
            For at modtage email notifikationer skal du oprette en <code>.env.local</code> fil i projektets rod med:
          </p>
          <pre className="bg-slate-800 text-white p-3 rounded text-xs overflow-x-auto">
{`EMAIL_USER=din-email@gmail.com
EMAIL_PASSWORD=din-app-password`}
          </pre>
          <p className="text-sm mt-2">
            Gmail brugere: Opret et &quot;App Password&quot; på{' '}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              myaccount.google.com/apppasswords
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
