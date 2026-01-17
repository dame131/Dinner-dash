
import React from 'react';
import { LEVELS } from '../constants';
import { LevelSelectProps } from '../types';

const LevelSelect: React.FC<LevelSelectProps> = ({ onBack, onLevelSelect, onCustomize, currency }) => {
  return (
    <div className="w-full h-full p-8 pt-24 overflow-y-auto z-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <button 
              onClick={onBack}
              className="text-cyan-500 hover:text-cyan-400 flex items-center gap-2 mb-4 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span className="uppercase tracking-widest text-sm font-bold">Main Menu</span>
            </button>
            <h2 className="text-5xl font-black text-white italic tracking-tighter">MISSION DEPLOYMENT</h2>
          </div>

          <button 
            onClick={onCustomize}
            className="px-6 py-3 bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-400 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <span className="text-xl">🎨</span>
            <span>CUSTOMIZE KITCHEN</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onLevelSelect(level)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all group
                ${level.id % 2 === 0 ? 'bg-slate-900 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'bg-slate-900/50 border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
              `}
            >
              <span className="text-2xl font-black text-white/50 group-hover:text-white transition-colors">
                {String(level.id).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold mt-1 text-slate-600 group-hover:text-cyan-500">
                Active
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LevelSelect;
