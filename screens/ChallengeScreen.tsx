
import React from 'react';
import { World, Chapter } from '../types';
import { CHAPTERS, CHAPTER_MISSION_IDS } from '../constants';
import { Lock, Play, CheckCircle2, Target, Zap, ChevronRight } from 'lucide-react';

interface ChallengeScreenProps {
  world: World;
  completedMissions: number[];
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ world, completedMissions, onBack, onSelectChapter }) => {
  const chapters = CHAPTERS[world.id] || [];

  return (
    <div className="p-6 md:p-10 relative">
      <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${world.gradient} opacity-20 blur-[100px] -z-10`}></div>

      <div className="mb-12 text-left">
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-3xl relative group overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <span className="relative z-10">{world.icon}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="text-amber-500 font-tactical font-black text-[11px] tracking-[0.4em] uppercase mb-2 block">Sector Tactical Profile</span>
            <h2 className="text-5xl font-tactical font-black text-white tracking-tighter uppercase italic leading-none">{world.title}</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md max-w-4xl shadow-sm">
           <div className="flex flex-col items-center sm:border-r border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</span>
              <span className="text-xs font-tactical font-black text-emerald-600 tracking-[0.2em]">OPERATIONAL</span>
           </div>
           <div className="flex flex-col items-center sm:border-r border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phase Grid</span>
              <span className="text-xs font-tactical font-black text-white">15 TACTICAL TIERS</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Priority</span>
              <span className="text-xs font-tactical font-black text-amber-600 tracking-[0.2em]">ALPHA-LEVEL</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-4 bg-amber-500"></div>
         <span className="text-xs font-tactical font-black text-white uppercase tracking-[0.4em]">Operational Phases (1-15)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {chapters.map((chapter, idx) => {
          const missionIds = CHAPTER_MISSION_IDS[chapter.id] || [];
          const completedInChapter = missionIds.filter(id => completedMissions.includes(id));
          const progress = missionIds.length > 0 ? (completedInChapter.length / missionIds.length) * 100 : 0;
          const isFullyCompleted = progress === 100 && missionIds.length > 0;
          
          // Logic to unlock phases: Phase 1 is always unlocked, others unlock if previous is finished
          const prevChapterId = idx > 0 ? chapters[idx - 1].id : null;
          const prevMissionIds = prevChapterId ? (CHAPTER_MISSION_IDS[prevChapterId] || []) : [];
          const isPrevCompleted = idx === 0 || (prevMissionIds.length > 0 && prevMissionIds.every(id => completedMissions.includes(id)));
          const isLocked = !isPrevCompleted && !isFullyCompleted;

          return (
            <button
              key={chapter.id}
              disabled={isLocked}
              onClick={() => onSelectChapter(chapter)}
              className={`relative w-full rounded-[2.5rem] p-6 text-left transition-all duration-300 group overflow-hidden border shadow-3xl flex flex-col justify-between ${
                isLocked 
                ? 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed' 
                : isFullyCompleted 
                  ? 'bg-emerald-500/10 border-emerald-500/30 active:scale-[0.98]' 
                  : `bg-slate-900 border-white/5 hover:border-white/20 active:scale-[0.98] shadow-2xl`
              }`}
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex-1">
                  <span className={`text-[9px] font-tactical font-black tracking-[0.3em] uppercase mb-2 block ${isFullyCompleted ? 'text-emerald-500' : 'text-slate-500'}`}>
                    PHASE 0{idx + 1}
                  </span>
                  <h3 className={`text-xl font-tactical font-black leading-tight uppercase italic tracking-tighter transition-colors ${isLocked ? 'text-slate-700' : 'text-white'}`}>
                    {chapter.title}
                  </h3>
                </div>
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ml-4 relative ${
                  isFullyCompleted
                  ? 'bg-emerald-500 text-slate-950'
                  : isLocked 
                    ? 'bg-slate-800 text-slate-600' 
                    : 'bg-amber-500 text-slate-950 group-hover:scale-110'
                }`}>
                  {isFullyCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={20} /> : <Play size={24} className="fill-slate-950 ml-1" />}
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[9px] font-tactical font-black tracking-[0.2em] uppercase px-1">
                  <span className="text-slate-500">{isFullyCompleted ? 'SECURED' : isLocked ? 'ENCRYPTED' : 'SYNCING'}</span>
                  <span className={isFullyCompleted ? 'text-emerald-500' : 'text-white'}>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full p-[1px] border border-white/5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full relative ${isFullyCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.max(progress, 0)}%` }}
                  >
                    <div className="absolute inset-0 shimmer opacity-20"></div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeScreen;
