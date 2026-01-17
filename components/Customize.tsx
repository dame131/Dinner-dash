
import React, { useState } from 'react';
import { editKitchenImage } from '../services/geminiService';
import { CustomizeProps } from '../types';

const Customize: React.FC<CustomizeProps> = ({ onBack, onSaveTheme }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    
    const baseImageUrl = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920';
    
    try {
      const response = await fetch(baseImageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const result = await editKitchenImage(base64, prompt, blob.type);
          if (result) {
            setPreview(result);
          }
        } catch (error: any) {
          if (error.message === "API_KEY_INVALID") {
            if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
              await window.aistudio.openSelectKey();
            }
          } else {
            console.error("Image generation failed:", error);
          }
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Fetch error:", e);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 pt-24 z-10 overflow-y-auto bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="text-cyan-500 hover:text-cyan-400 mb-8 uppercase text-sm font-bold tracking-widest flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Return to Command Center</span>
        </button>
        
        <div className="mb-12">
          <h2 className="text-6xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            NEURAL SKINNING
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl border-l-2 border-cyan-500/30 pl-6">
            Leverage the Gemini 3 Pro processing core to architect your kitchen's visual identity. 
            Describe any aesthetic from "Cyberpunk Neon Rain" to "Hyper-Minimalist Marble".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/80 border border-cyan-500/20 p-8 rounded-3xl shadow-2xl">
              <label className="block text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em] mb-3">Architectural Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A high-tech kitchen in a rainy Tokyo skyscraper with pink neon lights..."
                className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-cyan-500/50 min-h-[160px] text-lg transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full mt-6 py-5 rounded-2xl font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)]'}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Neural Map...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Design</span>
                    <span className="text-xl">⚡</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                <span>System Specs</span>
              </h3>
              <ul className="text-xs text-slate-500 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Instant Processing:</strong> Neural wait timers have been bypassed using Flash-Image logic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Fidelity:</strong> Output optimized for QHD+ 4K Ultra-Wide displays.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full aspect-video bg-slate-900 rounded-3xl border-2 border-cyan-500/20 flex items-center justify-center overflow-hidden relative group shadow-2xl">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Theme preview" />
              ) : (
                <div className="text-slate-700 text-center p-8 flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-20">
                    <span className="text-5xl">🖼️</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest opacity-20">Waiting for Data Input</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-6 text-cyan-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Reconstructing Reality</p>
                </div>
              )}
            </div>

            {preview && !loading && (
              <button 
                onClick={() => {
                  onSaveTheme(preview);
                  onBack();
                }}
                className="mt-8 px-16 py-4 bg-white text-slate-950 font-black rounded-full hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
              >
                COMMIT INTERFACE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
