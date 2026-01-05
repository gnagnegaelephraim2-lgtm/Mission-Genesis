
import React from 'react';
import { WORLDS, MISSIONS } from '../constants';
import { World } from '../types';

interface HomeScreenProps {
  completedMissions: number[];
  onSelectWorld: (world: World) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ completedMissions, onSelectWorld }) => {
  const getProgress = (worldId: string) => {
    const worldMissions = MISSIONS.filter(m => m.worldId === worldId);
    if (worldMissions.length === 0) return 0;
    const completedInWorld = worldMissions.filter(m => completedMissions.includes(m.id));
    return (completedInWorld.length / worldMissions.length) * 100;
  };

  const getModuleCount = (worldId: string) => {
    return MISSIONS.filter(m => m.worldId === worldId).length;
  };

  const getWorldMissions = (worldId: string) => {
    return MISSIONS.filter(m => m.worldId === worldId);
  };

  return (
    <div className="p-6 md:p-10 scanlines">
      <div className="mb-10 relative text-left">
        <div className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
        <h2 className="text-4xl md:text-5xl font-tactical font-black dark:text-white text-slate-900 tracking-tighter leading-none mb-3 glitch uppercase break-words" data-text="GAME WORLDS">
          GAME WORLDS
        </h2>
        <p className="text-slate-500 text-[11px] md:text-xs font-tactical font-bold uppercase tracking-[0.3em]">Operational Readiness: Level 4 // Global Sector Grid</p>
      </div>

      {/* Grid adapts to screen size: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-20">
        {WORLDS.map((world) => {
          const derivedProgress = getProgress(world.id);
          const moduleCount = getModuleCount(world.id);
          const worldMissions = getWorldMissions(world.id);
          const isMastered = derivedProgress === 100;
          return (
            <button
              key={world.id}
              onClick={() => onSelectWorld(world)}
              className="relative w-full aspect-[18/11] rounded-[2.5rem] overflow-hidden group transition-all duration-500 active:scale-95 shadow-2xl border border-white/5"
            >
              {/* Tactical Background Layer */}
              <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-700`}></div>
              
              {/* Mastered Overlay Glow */}
              {isMastered && (
                <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none"></div>
              )}

              {/* HUD Elements */}
              <div className="absolute top-5 right-6 text-white/20 font-tactical text-[9px] tracking-[0.5em] uppercase pointer-events-none truncate max-w-[50%] text-right">
                SECURED // {world.id.slice(0,3).toUpperCase()}
              </div>

              {/* World Content */}
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="px-5 py-2 bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl inline-block max-w-full">
                      <span className="text-xs md:text-sm font-tactical font-black tracking-[0.2em] text-white/80 group-hover:text-white transition-colors truncate block">
                        {world.subject}
                      </span>
                    </div>
                    <span className="text-[10px] font-tactical font-black text-white/40 tracking-[0.1em] uppercase ml-1 truncate">
                      {moduleCount} Tactical Nodes
                    </span>
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

                  {/* Module Grid Preview - Responsive scaling */}
                  <div className="flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {worldMissions.slice(0, 24).map((m, i) => (
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

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
