
import React from 'react';
import { Chapter, Mission } from '../types';
import { MISSIONS, CHAPTER_MISSION_IDS } from '../constants';
import { Lock, Zap, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';

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
    <div className="p-6">
      {/* Subheader with Sync Progress as seen in screenshot */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-slate-700 dark:bg-slate-200 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest font-tactical whitespace-nowrap">CHAPTER SYNC: {Math.round(progressPercent)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMissions.map((mission, idx) => {
          const isCompleted = completedMissions.includes(mission.id);
          // Unlock logic: First is always unlocked, or previous is completed
          const isUnlocked = idx === 0 || completedMissions.includes(filteredMissions[idx - 1].id);
          const isLocked = !isUnlocked && !isCompleted;

          if (isLocked) {
            return (
              <div key={mission.id} className="w-full relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center p-4 gap-4 transition-opacity">
                <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800/60 flex items-center justify-center font-tactical font-black text-2xl text-slate-400 dark:text-slate-600">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-[70%] bg-slate-200 dark:bg-slate-800/80 rounded-full"></div>
                  <div className="h-2 w-[40%] bg-slate-100 dark:bg-slate-900/80 rounded-full"></div>
                </div>
                <Lock size={18} className="text-slate-300 dark:text-slate-700 mr-2" />
              </div>
            );
          }

          return (
            <button
              key={mission.id}
              onClick={() => onSelectMission(mission)}
              className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 flex items-center p-4 gap-4 text-left group ${
                isCompleted 
                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'bg-slate-900 dark:bg-slate-900 border-slate-800 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 active:scale-[0.98] shadow-lg'
              }`}
            >
              <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center font-tactical font-black text-2xl transition-all ${
                isCompleted 
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110'
              }`}>
                {isCompleted ? <CheckCircle2 size={28} strokeWidth={3} /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-tactical text-[13px] font-black uppercase truncate tracking-tight mb-1 ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                  {mission.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className={isCompleted ? 'text-emerald-500' : 'text-amber-500'} strokeWidth={3} />
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-tactical">{isCompleted ? 'SECURED' : `+${mission.xp} XP`}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={12} className={mission.difficulty === 'Expert' ? 'text-rose-500' : 'text-slate-400'} strokeWidth={2.5} />
                    <span className={`text-[10px] font-black font-tactical ${mission.difficulty === 'Expert' ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>{mission.difficulty.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <ChevronRight size={18} className={`${isCompleted ? 'text-emerald-500' : 'text-slate-600'} opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all`} strokeWidth={3} />
            </button>
          );
        })}

        {/* Fill up the rest with dummy locked states if there aren't many missions */}
        {filteredMissions.length < 8 && Array.from({ length: 8 - filteredMissions.length }).map((_, i) => (
           <div key={`dummy-${i}`} className="w-full relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center p-4 gap-4 opacity-30">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-tactical font-black text-2xl text-slate-400 dark:text-slate-600">
                {filteredMissions.length + i + 1}
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-[60%] bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="h-2 w-[35%] bg-slate-100 dark:bg-slate-900 rounded-full"></div>
              </div>
              <Lock size={18} className="text-slate-300 dark:text-slate-700 mr-2" />
           </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsScreen;
