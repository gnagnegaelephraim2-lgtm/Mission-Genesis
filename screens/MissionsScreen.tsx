
import React from 'react';
import { Chapter, Mission } from '../types';
import { MISSIONS, CHAPTER_MISSION_IDS } from '../constants';
import { Lock, Zap, ShieldAlert, ChevronRight, CheckCircle2, Target } from 'lucide-react';

interface MissionsScreenProps {
  chapter: Chapter;
  completedMissions: number[];
  onBack: () => void;
  onSelectMission: (mission: Mission) => void;
}

const MissionsScreen: React.FC<MissionsScreenProps> = ({ chapter, completedMissions, onSelectMission }) => {
  const chapterMissionIds = CHAPTER_MISSION_IDS[chapter.id] || [];
  const filteredMissions = MISSIONS.filter(m => chapterMissionIds.includes(m.id));
  
  const completedInChapter = filteredMissions.filter(m => completedMissions.includes(m.id)).length;
  const progressPercent = filteredMissions.length > 0 ? (completedInChapter / filteredMissions.length) * 100 : 0;

  return (
    <div className="p-6 md:p-10">
      {/* Immersive Chapter Header */}
      <div className="mb-12 text-left max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
           <span className="text-amber-500 font-tactical font-black text-xs tracking-[0.4em] uppercase italic">Operational Directives</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-tactical font-black text-white leading-none uppercase tracking-tighter italic mb-6">
          {chapter.title}
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
             <div 
               className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
               style={{ width: `${progressPercent}%` }}
             ></div>
          </div>
          <span className="text-xs font-black text-white/60 uppercase tracking-[0.3em] font-tactical whitespace-nowrap">
            {Math.round(progressPercent)}% SECURED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {filteredMissions.map((mission, idx) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isUnlocked = idx === 0 || completedMissions.includes(filteredMissions[idx - 1].id);
          const isLocked = !isUnlocked && !isCompleted;

          if (isLocked) {
            return (
              <div key={mission.id} className="w-full relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 flex items-center p-6 gap-6 transition-opacity opacity-60">
                <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-slate-800/60 flex items-center justify-center font-tactical font-black text-3xl text-slate-700">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-[80%] bg-slate-800 rounded-full"></div>
                  <div className="h-2.5 w-[50%] bg-slate-900/80 rounded-full"></div>
                </div>
                <Lock size={24} className="text-slate-700 mr-2" />
              </div>
            );
          }

          return (
            <button
              key={mission.id}
              onClick={() => onSelectMission(mission)}
              className={`w-full relative overflow-hidden rounded-[2.5rem] border transition-all duration-300 flex flex-col p-6 md:p-8 text-left group ${
                isCompleted 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]' 
                : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/80 active:scale-[0.98] shadow-2xl'
              }`}
            >
              <div className="flex items-center gap-6 mb-5">
                <div className={`w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center font-tactical font-black text-2xl transition-all ${
                  isCompleted 
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-105'
                }`}>
                  {isCompleted ? <CheckCircle2 size={32} strokeWidth={3} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-tactical text-lg md:text-xl font-black uppercase truncate tracking-tight mb-1 ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                    {mission.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className={isCompleted ? 'text-emerald-500' : 'text-amber-500'} fill="currentColor" />
                      <span className="text-[10px] font-black text-slate-400 font-tactical uppercase tracking-widest">{isCompleted ? 'SECURED' : `+${mission.xp} XP`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} className={mission.difficulty === 'Expert' ? 'text-rose-500' : 'text-slate-500'} />
                      <span className={`text-[10px] font-black font-tactical tracking-widest ${mission.difficulty === 'Expert' ? 'text-rose-500' : 'text-slate-500'}`}>{mission.difficulty.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={24} className={`${isCompleted ? 'text-emerald-500' : 'text-slate-600'} opacity-40 group-hover:translate-x-2 group-hover:opacity-100 transition-all`} strokeWidth={3} />
              </div>

              <div className="pl-20 relative">
                 <div className="absolute left-16 top-0 bottom-0 w-[1.5px] bg-slate-800"></div>
                 <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium italic group-hover:text-slate-300 transition-colors">
                   "{mission.story}"
                 </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MissionsScreen;
