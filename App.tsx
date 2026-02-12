
import React, { useState, useEffect, useCallback } from 'react';
import { fetchBundesligaResults } from './geminiService';
import { MatchdayData, LoadingStatus } from './types';
import MatchCard from './components/MatchCard';
import ExportSection from './components/ExportSection';

const App: React.FC = () => {
  const [data, setData] = useState<MatchdayData[]>([]);
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [activeMatchday, setActiveMatchday] = useState<number>(1);

  const loadData = useCallback(async () => {
    setStatus(LoadingStatus.LOADING);
    try {
      // We fetch "alle bisherigen" matchdays to populate the UI
      const results = await fetchBundesligaResults("alle gespielten Spieltage der Saison 24/25");
      if (results && results.length > 0) {
        // Sort by matchday descending
        const sorted = results.sort((a, b) => b.matchday - a.matchday);
        setData(sorted);
        setActiveMatchday(sorted[0].matchday);
        setStatus(LoadingStatus.SUCCESS);
      } else {
        setStatus(LoadingStatus.ERROR);
      }
    } catch (error) {
      console.error(error);
      setStatus(LoadingStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentResults = data.find(d => d.matchday === activeMatchday);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-lg rotate-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Bundesliga <span className="text-red-500">Live</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Ergebnisse & Statistiken 2024/25</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#" className="text-sm font-bold uppercase hover:text-red-500 transition-colors">Ergebnisse</a>
              <a href="#" className="text-sm font-bold uppercase text-slate-400 cursor-not-allowed">Tabelle</a>
              <a href="#" className="text-sm font-bold uppercase text-slate-400 cursor-not-allowed">Statistiken</a>
            </nav>
            
            <button 
              onClick={() => loadData()}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-95"
              title="Aktualisieren"
            >
              <svg className={`w-6 h-6 ${status === LoadingStatus.LOADING ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {status === LoadingStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Rufe aktuelle Bundesliga-Daten ab...</p>
          </div>
        )}

        {status === LoadingStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hoppla! Daten konnten nicht geladen werden.</h2>
            <p className="text-slate-600 mb-8">Es gab ein Problem bei der Verbindung zum Live-Ticker. Bitte versuchen Sie es in Kürze erneut.</p>
            <button 
              onClick={loadData}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl"
            >
              Nochmal versuchen
            </button>
          </div>
        )}

        {status === LoadingStatus.SUCCESS && (
          <>
            {/* Matchday Selector */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-slate-900">Spieltage</h2>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1 rounded-full">Saison 2024/2025</div>
              </div>
              <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                {data.map(md => (
                  <button
                    key={md.matchday}
                    onClick={() => setActiveMatchday(md.matchday)}
                    className={`flex-none px-6 py-4 rounded-2xl border transition-all duration-300 ${
                      activeMatchday === md.matchday
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl transform scale-105'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 shadow-sm'
                    }`}
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Spieltag</span>
                    <span className="text-2xl font-black">{md.matchday}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Match Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentResults?.matches.map(match => (
                <MatchCard key={match.id || `${match.homeTeam}-${match.awayTeam}`} match={match} />
              ))}
            </div>

            {/* Export Section */}
            <ExportSection data={data} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2025 Bundesliga Live-Ergebnisse Portal. Alle Rechte vorbehalten.</p>
          <p className="text-slate-300 text-xs mt-2">Präsentiert mit Gemini AI Technologie</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
