
import React, { useState, useEffect } from 'react';
import { GameState, Level } from './types';
import Home from './components/Home';
import LevelSelect from './components/LevelSelect';
import Kitchen from './components/Kitchen';
import Customize from './components/Customize';
import { PREMIUM_CURRENCY } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currency, setCurrency] = useState(PREMIUM_CURRENCY);
  const [kitchenTheme, setKitchenTheme] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const startLevel = (level: Level) => {
    setSelectedLevel(level);
    setGameState(GameState.PLAYING);
  };

  const quitLevel = () => {
    setGameState(GameState.LEVEL_SELECT);
    setSelectedLevel(null);
  };

  if (!hasApiKey) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-[#020617] flex flex-col items-center justify-center text-slate-100 p-8 text-center z-50">
        <div className="max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
          <h1 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 italic uppercase">
            Access Restricted
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Cyber-Chef 4K Neural Skinning requires a paid API key from a Google Cloud Project with billing enabled.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleOpenKey}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-black tracking-widest text-white transition-all shadow-lg active:scale-95"
            >
              INITIALIZE API KEY
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest"
            >
              Billing Documentation →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020617] flex flex-col items-center justify-center text-slate-100">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 animate-[scanline_8s_linear_infinite]"></div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {gameState === GameState.HOME && (
        <Home onStart={() => setGameState(GameState.LEVEL_SELECT)} />
      )}

      {gameState === GameState.LEVEL_SELECT && (
        <LevelSelect 
          onBack={() => setGameState(GameState.HOME)} 
          onLevelSelect={startLevel}
          onCustomize={() => setGameState(GameState.CUSTOMIZE)}
          currency={currency}
        />
      )}

      {gameState === GameState.PLAYING && selectedLevel && (
        <Kitchen 
          level={selectedLevel} 
          onQuit={quitLevel} 
          onWin={(reward) => setCurrency(prev => prev + reward)}
          theme={kitchenTheme}
        />
      )}

      {gameState === GameState.CUSTOMIZE && (
        <Customize 
          onBack={() => setGameState(GameState.LEVEL_SELECT)} 
          onSaveTheme={(url) => setKitchenTheme(url)}
        />
      )}

      {gameState !== GameState.HOME && (
        <div className="absolute top-6 right-6 flex items-center space-x-4 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-cyan-500/40 z-50 shadow-[0_0_20px_rgba(34,211,238,0.2)] group transition-all hover:border-cyan-400">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Premium Assets</span>
            <span className="mono text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {currency.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
            <span className="text-xl">💎</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
