
import React from 'react';
import { HomeProps } from '../types';

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center z-10 text-center">
      <div className="relative mb-12 animate-float">
        <h1 className="text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
          CYBER-CHEF
        </h1>
        <div className="absolute -bottom-2 right-0 bg-pink-500 px-3 py-1 skew-x-[-20deg] border-2 border-white shadow-lg">
          <span className="text-xs font-bold text-white uppercase tracking-widest block skew-x-[20deg]">DASH & DESIGN</span>
        </div>
      </div>

      <p className="text-slate-400 mb-12 max-w-md text-lg">
        High-fidelity culinary management in the neon-soaked future. 
        50 sectors unlocked. Zero upgrade costs. Infinite possibilities.
      </p>

      <button 
        onClick={onStart}
        className="group relative px-12 py-5 bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className="relative text-2xl font-black tracking-[0.2em] text-white">INITIALIZE GAME</span>
      </button>

      <div className="mt-16 flex gap-8 opacity-50">
        <div className="flex flex-col items-center">
          <span className="text-cyan-400 font-bold text-xl uppercase">50</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Levels</span>
        </div>
        <div className="w-[1px] h-10 bg-slate-800"></div>
        <div className="flex flex-col items-center">
          <span className="text-cyan-400 font-bold text-xl uppercase">AI</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Powered</span>
        </div>
        <div className="w-[1px] h-10 bg-slate-800"></div>
        <div className="flex flex-col items-center">
          <span className="text-cyan-400 font-bold text-xl uppercase">4K</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Visuals</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
