
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
    <div className="p-6 scanlines">
      <div className="mb-8 relative text-left">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
        <h2 className="text-4xl font-tactical font-black dark:text-white text-slate-900 tracking-tighter leading-none mb-2 glitch uppercase" data-text="GAME WORLDS">
          GAME WORLDS
        </h2>
        <p className="text-slate-500 text-[10px] font-tactical font-bold uppercase tracking-[0.3em]">Operational Readiness: Level 4</p>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {WORLDS.map((world) => {
          const derivedProgress = getProgress(world.id);
          const moduleCount = getModuleCount(world.id);
          const worldMissions = getWorldMissions(world.id);
          const isMastered = derivedProgress === 100;
          return (
            <button
              key={world.id}
              onClick={() => onSelectWorld(world)}
              className="relative w-full aspect-[18/11] rounded-[2rem] overflow-hidden group transition-all duration-500 active:scale-95 shadow-xl border border-white/5"
            >
              {/* Tactical Background Layer */}
              <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-700`}></div>
              
              {/* Mastered Overlay Glow */}
              {isMastered && (
                <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none"></div>
              )}

              {/* HUD Elements */}
              <div className="absolute top-4 right-4 text-white/20 font-tactical text-[8px] tracking-[0.5em] uppercase pointer-events-none">
                ENCRYPTED // {world.id.slice(0,3).toUpperCase()}-SEC
              </div>

              {/* World Content */}
              <div className="relative h-full p-6 flex flex-col justify-between z-10 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-1.5 bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl inline-block">
                      <span className="text-[11px] font-tactical font-black tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                        {world.subject}
                      </span>
                    </div>
                    <span className="text-[9px] font-tactical font-black text-white/40 tracking-[0.1em] uppercase ml-1">
                      {moduleCount} Modules Active
                    </span>
                  </div>
                  <div className={`text-4xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform duration-500 ease-out ${isMastered ? 'scale-110' : 'group-hover:scale-125'}`}>
                    {isMastered ? '🏆' : world.icon}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className={`text-2xl font-tactical font-black text-white leading-tight mb-2 uppercase tracking-tighter italic ${isMastered ? 'text-green-400' : ''}`}>
                      {world.title}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[9px] font-tactical font-black text-white/50 tracking-[0.2em] uppercase">Sector Sync</span>
                        <span className={`text-sm font-tactical font-black ${isMastered ? 'text-green-400' : 'text-white'}`}>
                          {isMastered ? 'SECURED' : `${Math.round(derivedProgress)}%`}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full p-[2px] border border-white/5 overflow-hidden">
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

                  {/* Module Grid Preview */}
                  <div className="flex flex-wrap gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {worldMissions.slice(0, 18).map((m, i) => (
                      <div 
                        key={m.id} 
                        className={`w-2 h-2 rounded-sm transition-all duration-300 ${
                          completedMissions.includes(m.id) 
                          ? 'bg-white scale-110 shadow-[0_0_5px_white]' 
                          : 'bg-white/20 border border-white/5'
                        }`}
                      ></div>
                    ))}
                    {moduleCount > 18 && (
                      <span className="text-[7px] font-tactical font-black text-white/40 self-center ml-1">+{moduleCount - 18} MORE</span>
                    )}
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
