
import React, { useMemo, useState } from 'react';
import { WORLDS, MISSIONS } from '../constants';
import { World, NeuralSignal } from '../types';
import { Radio, Activity, Loader2, Zap, ArrowUpRight, Music, Search, X } from 'lucide-react';

interface HomeScreenProps {
  completedMissions: number[];
  signals?: NeuralSignal[];
  onSelectWorld: (world: World) => void;
  isSyncing?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ completedMissions, signals = [], onSelectWorld, isSyncing = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getProgress = (worldId: string) => {
    const worldMissions = MISSIONS.filter(m => m.worldId === worldId);
    if (worldMissions.length === 0) return 0;
    const completedInWorld = worldMissions.filter(m => completedMissions.includes(m.id));
    return (completedInWorld.length / worldMissions.length) * 100;
  };

  const getWorldMissions = (worldId: string) => {
    return MISSIONS.filter(m => m.worldId === worldId);
  };

  const filteredWorlds = useMemo(() => {
    if (!searchQuery.trim()) return WORLDS;
    const query = searchQuery.toLowerCase();
    return WORLDS.filter(w => 
      w.title.toLowerCase().includes(query) || 
      w.subject.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const displaySignals = useMemo(() => {
    const fallbacks: NeuralSignal[] = [
      { id: 'st1', commander: 'Genesis HQ', action: 'Analyzing sector data nodes...', timestamp: Date.now() },
      { id: 'st2', commander: 'Global Grid', action: 'Optimizing regional sub-links...', timestamp: Date.now() },
      { id: 'st3', commander: 'Beat Core', action: 'Rap harmonics calibrated at 92 BPM.', timestamp: Date.now() },
      { id: 'st4', commander: 'System', action: 'Operational readiness maintained at Level 4.', timestamp: Date.now() },
      { id: 'st5', commander: 'Satellite-09', action: 'Tactical playlist updated to Rap Instrumentals.', timestamp: Date.now() }
    ];
    return [...signals, ...fallbacks].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [signals]);

  return (
    <div className="p-4 sm:p-6 md:p-10 scanlines animate-in fade-in duration-700">
      <div className="mb-8 relative overflow-hidden border-y border-amber-500/10 py-3 sm:py-4 group shadow-lg bg-slate-950/40 backdrop-blur-md">
         <div className="flex items-center absolute left-0 top-0 bottom-0 z-20 px-4 md:px-8 border-r bg-slate-950 border-amber-500/20">
            {isSyncing ? (
              <Loader2 size={16} className="text-amber-500 animate-spin mr-3" />
            ) : (
              <Radio size={16} className="text-amber-500 animate-pulse mr-3" />
            )}
            <span className="text-[10px] font-tactical font-black text-amber-500 uppercase tracking-widest whitespace-nowrap italic drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">Neural Mesh Live</span>
         </div>
         <div className="flex gap-20 animate-[ticker-scroll_60s_linear_infinite] whitespace-nowrap pl-[160px] md:pl-[240px]">
            {displaySignals.concat(displaySignals).map((sig, idx) => (
              <div key={`${sig.id}-${idx}`} className="flex items-center gap-4 font-mono text-[11px] uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                 {sig.commander === 'Beat Core' ? <Music size={10} className="text-amber-500 animate-spin" /> : <Zap size={10} className="text-emerald-500 animate-pulse" />}
                 <span className="text-white font-black">{sig.commander}</span>
                 <span className="opacity-60">{sig.action}</span>
                 <span className="text-[9px] text-slate-600 font-bold">[{new Date(sig.timestamp).toLocaleTimeString()}]</span>
              </div>
            ))}
         </div>
      </div>

      <div className="mb-12 relative text-left w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="relative">
          {/* Animated Dashed Selection Box */}
          <div className="absolute -inset-x-6 -inset-y-4 border-2 border-dashed border-blue-500/30 rounded-lg animate-[pulse_3s_infinite] pointer-events-none hidden md:block"></div>
          
          <div className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-2 h-20 bg-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.3)] rounded-full animate-pulse"></div>
          
          <h2 className="text-5xl md:text-7xl font-tactical font-black tracking-tighter leading-none mb-4 glitch uppercase text-white animate-tracking-in-expand" data-text="GAME WORLDS">
            GAME WORLDS
          </h2>
          
          <div className="flex items-center gap-3">
            <p className="text-slate-500 text-[11px] md:text-xs font-tactical font-bold uppercase tracking-[0.5em] italic opacity-60">Global Sector Grid // Operational Status: Normal</p>
            <div className="flex-1 h-[1px] bg-slate-800/40"></div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-2xl group-focus-within:bg-amber-500/10 transition-all"></div>
          <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-4 backdrop-blur-xl group-focus-within:border-amber-500/50 transition-all shadow-2xl">
             <Search size={18} className="text-slate-500 group-focus-within:text-amber-500 transition-colors" />
             <input 
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="SEARCH SECTORS..."
               className="bg-transparent border-none outline-none flex-1 ml-4 text-xs font-tactical font-black text-white placeholder:text-slate-600 tracking-[0.2em] uppercase"
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                 <X size={16} className="text-slate-500 hover:text-white" />
               </button>
             )}
          </div>
          <div className="absolute -top-3 right-4 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md">
             <span className="text-[7px] font-tactical font-black text-slate-500 uppercase tracking-widest">Target Filter</span>
          </div>
        </div>
      </div>

      {filteredWorlds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-24">
          {filteredWorlds.map((world, idx) => {
            const derivedProgress = getProgress(world.id);
            const worldMissions = getWorldMissions(world.id);
            const isMastered = derivedProgress === 100;
            const isPulseNexus = world.id === 'health-science';

            return (
              <button
                key={world.id}
                onClick={() => onSelectWorld(world)}
                className={`relative w-full aspect-[18/12] rounded-[3.5rem] overflow-hidden group transition-all duration-700 active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 animate-in slide-up world-card-float ${isPulseNexus ? 'hover:shadow-[0_0_50px_rgba(244,63,94,0.3)] ring-2 ring-transparent hover:ring-rose-500/50' : 'hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]'}`}
                style={{ 
                  animationDelay: `${idx * 150}ms`,
                  '--float-offset': `${idx % 2 === 0 ? '-18px' : '18px'}`
                } as React.CSSProperties}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} ${isPulseNexus ? 'opacity-90' : 'opacity-80'} group-hover:opacity-100 transition-opacity duration-1000`}></div>
                
                <div className="absolute top-6 right-8 text-white/20 font-tactical text-[10px] tracking-[0.6em] uppercase pointer-events-none truncate max-w-[50%] text-right font-black italic">
                  GRID // {world.id.slice(0,3).toUpperCase()}
                </div>

                <div className="relative h-full p-8 md:p-10 flex flex-col justify-between z-10 text-left">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="px-6 py-2.5 bg-black/40 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl inline-block max-w-full transform group-hover:-translate-y-1 transition-transform">
                        <span className="text-xs md:text-sm font-tactical font-black tracking-[0.25em] text-white/90 group-hover:text-white transition-colors truncate block">
                          {world.subject}
                        </span>
                      </div>
                    </div>
                    <div className={`text-6xl md:text-7xl filter drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-700 ease-out shrink-0 ml-4 ${
                      isMastered ? 'scale-110 rotate-12 animate-bounce' : 
                      isPulseNexus ? 'animate-[pulse_2s_infinite] scale-110' :
                      'group-hover:scale-125 group-hover:-rotate-6 animate-pulse-glow'
                    }`}>
                      {isMastered ? '🏆' : world.icon}
                    </div>
                  </div>

                  <div className="space-y-6 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`text-3xl md:text-4xl font-tactical font-black text-white leading-tight uppercase tracking-tighter italic truncate group-hover:translate-x-1 transition-transform ${isMastered ? 'text-emerald-400' : ''}`}>
                          {world.title}
                        </h3>
                        <ArrowUpRight size={24} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-end px-1 gap-2">
                          <span className="text-[11px] font-tactical font-black text-white/50 tracking-[0.3em] uppercase truncate">Neural Resonance</span>
                          <span className={`text-lg font-tactical font-black shrink-0 ${isMastered ? 'text-emerald-400' : 'text-white'} drop-shadow-[0_0_10px_currentColor]`}>
                            {isMastered ? 'SECURED' : `${Math.round(derivedProgress)}%`}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-black/50 rounded-full p-[2px] border border-white/5 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                              isMastered 
                              ? 'bg-emerald-500 shadow-[0_0_25px_rgba(52,211,153,0.8)]' 
                              : 'bg-white shadow-[0_0_20px_white]'
                            }`}
                            style={{ width: `${derivedProgress}%` }}
                          >
                             <div className="absolute inset-0 shimmer opacity-60"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 opacity-50 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-2">
                      {worldMissions.slice(0, 10).map((m) => (
                        <div 
                          key={m.id} 
                          className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-md transition-all duration-500 ${
                            completedMissions.includes(m.id) 
                            ? 'bg-white scale-110 shadow-[0_0_12px_white]' 
                            : 'bg-white/10 border border-white/5'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-950/20">
           <Search size={48} className="text-slate-700 mb-6 animate-pulse" />
           <h3 className="text-xl font-tactical font-black text-slate-500 uppercase tracking-widest italic mb-2">No Matching Sectors Found</h3>
           <p className="text-xs text-slate-600 font-medium uppercase tracking-[0.2em]">Adjust your target filter parameters</p>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(var(--float-offset, -10px)); }
        }
        .world-card-float {
          animation: float 4s ease-in-out infinite;
        }
        .world-card-float:hover {
          animation-play-state: paused;
          transform: scale(1.05) translateY(-18px);
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(255,255,255,0.2)); }
          50% { filter: drop-shadow(0 0 45px rgba(255,255,255,0.6)); transform: scale(1.1) rotate(5deg); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }

        /* Glitch Animation */
        .glitch {
          position: relative;
        }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #010409;
        }
        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
          animation: glitch-anim2 1s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip: rect(41px, 9999px, 86px, 0); transform: skew(0.35deg); }
          5% { clip: rect(65px, 9999px, 81px, 0); transform: skew(0.15deg); }
          10% { clip: rect(47px, 9999px, 34px, 0); transform: skew(0.4deg); }
          15% { clip: rect(10px, 9999px, 12px, 0); transform: skew(0.8deg); }
          20% { clip: rect(32px, 9999px, 7px, 0); transform: skew(0.4deg); }
          100% { clip: rect(41px, 9999px, 86px, 0); transform: skew(0.35deg); }
        }

        @keyframes glitch-anim2 {
          0% { clip: rect(2px, 9999px, 20px, 0); transform: skew(0.4deg); }
          50% { clip: rect(10px, 9999px, 15px, 0); transform: skew(-0.1deg); }
          100% { clip: rect(2px, 9999px, 20px, 0); transform: skew(0.4deg); }
        }

        @keyframes tracking-in-expand {
          0% { letter-spacing: -0.5em; opacity: 0; transform: scale(1.15); }
          40% { opacity: 0.6; }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-tracking-in-expand {
          animation: tracking-in-expand 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
