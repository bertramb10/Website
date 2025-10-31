'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Hero {
  name: string;
  teamfight: number;
  initiate: number;
  saveHeal: number;
  stunDisable: number;
  pushing: number;
  escape: number;
  laneDominance: number;
  scaling: number;
  nuke: number;
  frontline: number;
  bkbCancel: number;
  roles: string[];
}

interface RecommendedHero extends Hero {
  score: number;
  reasons: string[];
}

export default function DotaPicker() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [alliedPicks, setAlliedPicks] = useState<string[]>([]);
  const [enemyPicks, setEnemyPicks] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedHero[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pickingFor, setPickingFor] = useState<'ally' | 'enemy'>('ally');

  const roles = ['carry', 'mid', 'offlane', 'support'];

  useEffect(() => {
    fetch('/data/heroes.json')
      .then(res => res.json())
      .then(data => setHeroes(data));
  }, []);

  const addPick = (heroName: string) => {
    if (pickingFor === 'ally' && !alliedPicks.includes(heroName) && alliedPicks.length < 4) {
      setAlliedPicks([...alliedPicks, heroName]);
    } else if (pickingFor === 'enemy' && !enemyPicks.includes(heroName) && enemyPicks.length < 5) {
      setEnemyPicks([...enemyPicks, heroName]);
    }
    setSearchTerm('');
  };

  const removePick = (heroName: string, from: 'ally' | 'enemy') => {
    if (from === 'ally') {
      setAlliedPicks(alliedPicks.filter(h => h !== heroName));
    } else {
      setEnemyPicks(enemyPicks.filter(h => h !== heroName));
    }
  };

  const analyzeTeamNeeds = () => {
    if (!selectedRole) return;

    const alliedHeroes = heroes.filter(h => alliedPicks.includes(h.name));
    const enemyHeroes = heroes.filter(h => enemyPicks.includes(h.name));

    // Calculate team needs
    const alliedTeamfight = alliedHeroes.reduce((sum, h) => sum + h.teamfight, 0);
    const alliedStun = alliedHeroes.reduce((sum, h) => sum + h.stunDisable, 0);
    const alliedSave = alliedHeroes.reduce((sum, h) => sum + h.saveHeal, 0);
    const alliedInitiate = alliedHeroes.reduce((sum, h) => sum + h.initiate, 0);
    const alliedPushing = alliedHeroes.reduce((sum, h) => sum + h.pushing, 0);
    const alliedFrontline = alliedHeroes.reduce((sum, h) => sum + h.frontline, 0);

    // Calculate enemy strengths
    const enemyTeamfight = enemyHeroes.reduce((sum, h) => sum + h.teamfight, 0);
    const enemyInitiate = enemyHeroes.reduce((sum, h) => sum + h.initiate, 0);
    const enemyPushing = enemyHeroes.reduce((sum, h) => sum + h.pushing, 0);

    // Score each hero
    const scoredHeroes = heroes
      .filter(hero =>
        !alliedPicks.includes(hero.name) &&
        !enemyPicks.includes(hero.name) &&
        hero.roles.includes(selectedRole)
      )
      .map(hero => {
        let score = 0;
        const reasons: string[] = [];

        // Role fit (base score)
        score += 20;

        // Team needs
        if (alliedStun < 4) {
          score += hero.stunDisable * 8;
          if (hero.stunDisable >= 2) reasons.push(`Good stun/disable (${hero.stunDisable}/3)`);
        }

        if (alliedInitiate < 5) {
          score += hero.initiate * 7;
          if (hero.initiate >= 2) reasons.push(`Strong initiation (${hero.initiate}/3)`);
        }

        if (alliedSave < 4 && selectedRole === 'support') {
          score += hero.saveHeal * 6;
          if (hero.saveHeal >= 2) reasons.push(`Good save/heal (${hero.saveHeal}/3)`);
        }

        if (alliedPushing < 8) {
          score += hero.pushing * 5;
          if (hero.pushing >= 3) reasons.push(`Excellent pusher (${hero.pushing}/3)`);
        }

        if (alliedFrontline < 6) {
          score += hero.frontline * 6;
          if (hero.frontline >= 2) reasons.push(`Tanky frontline (${hero.frontline}/3)`);
        }

        if (alliedTeamfight < 6) {
          score += hero.teamfight * 7;
          if (hero.teamfight >= 2) reasons.push(`Strong teamfight (${hero.teamfight}/3)`);
        }

        // Counter enemy team
        if (enemyInitiate >= 8 && hero.escape >= 2) {
          score += hero.escape * 6;
          reasons.push(`Good escape vs enemy initiation (${hero.escape}/3)`);
        }

        if (enemyTeamfight >= 8 && hero.stunDisable >= 2) {
          score += hero.stunDisable * 5;
          reasons.push(`Disables counter their teamfight`);
        }

        if (enemyPushing >= 10 && hero.teamfight >= 2) {
          score += hero.teamfight * 5;
          reasons.push(`Teamfight stops their push`);
        }

        // BKB piercing is always valuable
        if (hero.bkbCancel >= 1) {
          score += 10;
          reasons.push('BKB-piercing ability');
        }

        // Scaling for cores
        if (['carry', 'mid'].includes(selectedRole) && hero.scaling >= 3) {
          score += 8;
          reasons.push(`Scales well (${hero.scaling}/3)`);
        }

        // Lane dominance
        if (hero.laneDominance >= 3) {
          score += 5;
          reasons.push(`Dominates lane (${hero.laneDominance}/3)`);
        }

        return { ...hero, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setRecommendations(scoredHeroes);
  };

  useEffect(() => {
    if (selectedRole) {
      analyzeTeamNeeds();
    }
  }, [alliedPicks, enemyPicks, selectedRole, heroes]);

  const filteredHeroes = heroes.filter(hero =>
    hero.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !alliedPicks.includes(hero.name) &&
    !enemyPicks.includes(hero.name)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Dota 2 Hero Picker
          </Link>
          <Link href="/" className="text-sm hover:text-red-600 transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Dota 2 Hero Picker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Get smart hero recommendations based on team synergy and enemy counters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Team Picks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                      selectedRole === role
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Picks */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Team Picks</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPickingFor('ally')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pickingFor === 'ally'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    Allies ({alliedPicks.length}/4)
                  </button>
                  <button
                    onClick={() => setPickingFor('enemy')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pickingFor === 'enemy'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    Enemies ({enemyPicks.length}/5)
                  </button>
                </div>
              </div>

              {/* Allied Team */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Your Team</h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {alliedPicks.length === 0 ? (
                    <p className="text-sm text-slate-400">No allies picked yet...</p>
                  ) : (
                    alliedPicks.map(hero => (
                      <div
                        key={hero}
                        className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg"
                      >
                        <span className="text-sm font-medium">{hero}</span>
                        <button
                          onClick={() => removePick(hero, 'ally')}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Enemy Team */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Enemy Team</h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {enemyPicks.length === 0 ? (
                    <p className="text-sm text-slate-400">No enemies picked yet...</p>
                  ) : (
                    enemyPicks.map(hero => (
                      <div
                        key={hero}
                        className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg"
                      >
                        <span className="text-sm font-medium">{hero}</span>
                        <button
                          onClick={() => removePick(hero, 'enemy')}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Hero Search */}
              <div className="mt-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search heroes..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                {searchTerm && (
                  <div className="mt-2 max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {filteredHeroes.slice(0, 10).map(hero => (
                      <button
                        key={hero.name}
                        onClick={() => addPick(hero.name)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        {hero.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Recommended Picks</h2>
              {!selectedRole ? (
                <p className="text-slate-500 text-center py-8">Select your role to get recommendations</p>
              ) : recommendations.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Loading recommendations...</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recommendations.map((hero, idx) => (
                    <div
                      key={hero.name}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-slate-400">#{idx + 1}</span>
                            <span className="font-bold">{hero.name}</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {hero.roles.map(role => (
                              <span
                                key={role}
                                className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded capitalize"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className={`text-2xl font-bold ${getScoreColor(hero.score)}`}>
                          {Math.round(hero.score)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {hero.reasons.slice(0, 3).map((reason, i) => (
                          <p key={i} className="text-xs text-slate-600 dark:text-slate-300">
                            • {reason}
                          </p>
                        ))}
                      </div>
                      <button
                        onClick={() => addPick(hero.name)}
                        className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                      >
                        Pick {hero.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
