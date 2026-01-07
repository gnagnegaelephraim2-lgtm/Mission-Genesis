
import React, { useMemo } from 'react';
import { WORLDS, MISSIONS } from '../constants';
import { World, NeuralSignal } from '../types';
import { Radio, Activity, Loader2 } from 'lucide-react';

interface HomeScreenProps {
  completedMissions: number[];
  signals?: NeuralSignal[];
  onSelectWorld: (world: World) => void;
  isSyncing?: boolean;
  theme?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ completedMissions, signals = [], onSelectWorld, isSyncing = false, theme = 'dark' }) => {
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
      { id: 'st3', commander: 'Echo Node', action: 'New opportunities identified in Bio-Sustain.', timestamp: Date.now() },
      { id: 'st4', commander: 'System', action: 'Operational readiness maintained at Level 4.', timestamp: Date.now() }
    ];
    return [...signals, ...fallbacks].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [signals]);

  return (
    <div className="p-4 sm:p-6 md:p-10 scanlines">
      <div className={`mb-8 relative overflow-hidden border-y py-2 sm:py-3 group shadow-lg ${theme === 'dark' ? 'bg-slate-900/40 border-amber-500/20' : 'bg-slate-100 border-slate-400/50'}`}>
         <div className={`flex items-center absolute left-0 top-0 bottom-0 z-20 px-3 md:px-6 border-r ${theme === 'dark' ? 'bg-slate-950 border-amber-500/30' : 'bg-slate-200 border-slate-400'}`}>
            {isSyncing ? (
              <Loader2 size={14} className="text-amber-500 animate-spin mr-2" />
            ) : (
              <Radio size={14} className="text-amber-500 animate-pulse mr-2" />
            )}
            <span className="text-[9px] font-tactical font-black text-amber-500 uppercase tracking-widest whitespace-nowrap italic">Neural Mesh Live</span>
         </div>
         <div className="flex gap-16 animate-[ticker-scroll_40s_linear_infinite] whitespace-nowrap pl-[150px] md:pl-[220px]">
            {displaySignals.map((sig) => (
              <div key={sig.id} className={`flex items-center gap-3 font-mono text-[10px] uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                 <Activity size={10} className="text-emerald-500" />
                 <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold group-hover:text-amber-500 transition-colors`}>{sig.commander}</span>
                 <span className="opacity-60">{sig.action}</span>
                 <span className="text-[8px] text-slate-500 font-bold">[{new Date(sig.timestamp).toLocaleTimeString()}]</span>
              </div>
            ))}
         </div>
      </div>

      <div className="mb-10 relative text-left">
        <div className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
        <h2 className={`text-4xl md:text-5xl font-tactical font-black tracking-tighter leading-none mb-3 glitch uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} data-text="GAME WORLDS">
          GAME WORLDS
        </h2>
        <p className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-700'} text-[11px] md:text-xs font-tactical font-bold uppercase tracking-[0.3em] italic`}>Operational Readiness: Level 4 // Global Sector Grid</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-20">
        {WORLDS.map((world) => {
          const derivedProgress = getProgress(world.id);
          const worldMissions = getWorldMissions(world.id);
          const isMastered = derivedProgress === 100;
          return (
            <button
              key={world.id}
              onClick={() => onSelectWorld(world)}
              className="relative w-full aspect-[18/11] rounded-[2.5rem] overflow-hidden group transition-all duration-500 active:scale-95 shadow-2xl border border-white/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-700`}></div>
              
              <div className="absolute top-5 right-6 text-white/20 font-tactical text-[9px] tracking-[0.5em] uppercase pointer-events-none truncate max-w-[50%] text-right">
                SECURED // {world.id.slice(0,3).toUpperCase()}
              </div>

              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="px-5 py-2 bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl inline-block max-w-full">
                      <span className="text-xs md:text-sm font-tactical font-black tracking-[0.2em] text-white/80 group-hover:text-white transition-colors truncate block">
                        {world.subject}
                      </span>
                    </div>
                  </div>
                  <div className={`text-5xl md:text-6xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-transform duration-500 ease-out shrink-0 ml-3 ${isMastered ? 'scale-110' : 'group-hover:scale-125'}`}>
                    {isMastered ? '🏆' : world.icon}
                  </div>
                </div>

                <div className="space-y-5 min-w-0">
                  <div className="min-w-0">
                    <h3 className={`text-2xl md:text-3xl font-tactical font-black text-white leading-tight mb-2 uppercase tracking-tighter italic truncate ${isMastered ? 'text-green-400' : ''}`}>
                      {world.title}
                    </h3>
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-end px-1 gap-2">
                        <span className="text-[10px] font-tactical font-black text-white/50 tracking-[0.2em] uppercase truncate">Sector Sync</span>
                        <span className={`text-base font-tactical font-black shrink-0 ${isMastered ? 'text-green-400' : 'text-white'}`}>
                          {isMastered ? 'SECURED' : `${Math.round(derivedProgress)}%`}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-black/40 rounded-full p-[2px] border border-white/5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                            isMastered 
                            ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]' 
                            : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                          }`}
                          style={{ width: `${derivedProgress}%` }}
                        >
                           <div className="absolute inset-0 shimmer opacity-50"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {worldMissions.slice(0, 15).map((m) => (
                      <div 
                        key={m.id} 
                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm transition-all duration-300 ${
                          completedMissions.includes(m.id) 
                          ? 'bg-white scale-110 shadow-[0_0_8px_white]' 
                          : 'bg-white/20 border border-white/5'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
