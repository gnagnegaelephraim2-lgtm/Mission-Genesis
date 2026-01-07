
import React, { useMemo } from 'react';
import { WORLDS, MISSIONS } from '../constants';
import { World, NeuralSignal } from '../types';
import { Radio, Activity, Loader2, Zap, ArrowUpRight } from 'lucide-react';

interface HomeScreenProps {
  completedMissions: number[];
  signals?: NeuralSignal[];
  onSelectWorld: (world: World) => void;
  isSyncing?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ completedMissions, signals = [], onSelectWorld, isSyncing = false }) => {
  const getProgress = (worldId: string) => {
    const worldMissions = MISSIONS.filter(m => m.worldId === worldId);
    if (worldMissions.length === 0) return 0;
    const completedInWorld = worldMissions.filter(m => completedMissions.includes(m.id));
    return (completedInWorld.length / worldMissions.length) * 100;
  };

  const getWorldMissions = (worldId: string) => {
    return MISSIONS.filter(m => m.worldId === worldId);
  };

  const displaySignals = useMemo(() => {
    const fallbacks: NeuralSignal[] = [
      { id: 'st1', commander: 'Genesis HQ', action: 'Analyzing sector data nodes...', timestamp: Date.now() },
      { id: 'st2', commander: 'Global Grid', action: 'Optimizing regional sub-links...', timestamp: Date.now() },
      { id: 'st3', commander: 'Echo Node', action: 'New opportunities identified at ALU and UCT.', timestamp: Date.now() },
      { id: 'st4', commander: 'System', action: 'Operational readiness maintained at Level 4.', timestamp: Date.now() },
      { id: 'st5', commander: 'Satellite-09', action: 'Weather patterns over Sahel normalized.', timestamp: Date.now() }
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
                 <Zap size={10} className="text-emerald-500 animate-pulse" />
                 <span className="text-white font-black">{sig.commander}</span>
                 <span className="opacity-60">{sig.action}</span>
                 <span className="text-[9px] text-slate-600 font-bold">[{new Date(sig.timestamp).toLocaleTimeString()}]</span>
              </div>
            ))}
         </div>
      </div>

      <div className="mb-12 relative text-left">
        <div className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-2 h-20 bg-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.3)] rounded-full animate-pulse"></div>
        <h2 className="text-5xl md:text-7xl font-tactical font-black tracking-tighter leading-none mb-4 glitch uppercase text-white" data-text="GAME WORLDS">
          GAME WORLDS
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-slate-500 text-[11px] md:text-xs font-tactical font-bold uppercase tracking-[0.5em] italic opacity-60">Global Sector Grid // Operational Status: Normal</p>
          <div className="flex-1 h-[1px] bg-slate-800/40"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-24">
        {WORLDS.map((world, idx) => {
          const derivedProgress = getProgress(world.id);
          const worldMissions = getWorldMissions(world.id);
          const isMastered = derivedProgress === 100;
          return (
            <button
              key={world.id}
              onClick={() => onSelectWorld(world)}
              className={`relative w-full aspect-[18/12] rounded-[3.5rem] overflow-hidden group transition-all duration-700 active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 animate-in slide-up world-card-float`}
              style={{ 
                animationDelay: `${idx * 150}ms`,
                '--float-offset': `${idx % 2 === 0 ? '-10px' : '10px'}`
              } as React.CSSProperties}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-1000`}></div>
              
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
                  <div className={`text-6xl md:text-7xl filter drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-700 ease-out shrink-0 ml-4 ${isMastered ? 'scale-110 rotate-12 animate-bounce' : 'group-hover:scale-125 group-hover:-rotate-6 animate-pulse'}`}>
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(var(--float-offset, -10px)); }
        }
        .world-card-float {
          animation: float 6s ease-in-out infinite;
        }
        .world-card-float:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
