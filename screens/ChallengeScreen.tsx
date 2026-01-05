
import React from 'react';
import { World, Chapter } from '../types';
import { CHAPTERS, CHAPTER_MISSION_IDS } from '../constants';
import { Lock, Play, CheckCircle2, Target, Zap, Activity } from 'lucide-react';

interface ChallengeScreenProps {
  world: World;
  completedMissions: number[];
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ world, completedMissions, onSelectChapter }) => {
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
        
        {/* Sector Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md max-w-4xl">
           <div className="flex flex-col items-center sm:border-r border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</span>
              <span className="text-xs font-tactical font-black text-emerald-500 tracking-[0.2em]">OPERATIONAL</span>
           </div>
           <div className="flex flex-col items-center sm:border-r border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Node Level</span>
              <span className="text-xs font-tactical font-black text-white">GEN-0{world.id.length % 5 + 1}</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Priority</span>
              <span className="text-xs font-tactical font-black text-amber-500 tracking-[0.2em]">ALPHA-LEVEL</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-4 bg-amber-500"></div>
         <span className="text-xs font-tactical font-black text-white uppercase tracking-[0.4em]">Operational Phases</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
        {chapters.map((chapter, idx) => {
          const missionIds = CHAPTER_MISSION_IDS[chapter.id] || [];
          const completedInChapter = missionIds.filter(id => completedMissions.includes(id));
          const progress = missionIds.length > 0 ? (completedInChapter.length / missionIds.length) * 100 : 0;
          const isFullyCompleted = progress === 100 && missionIds.length > 0;

          return (
            <button
              key={chapter.id}
              disabled={chapter.locked && !isFullyCompleted}
              onClick={() => onSelectChapter(chapter)}
              className={`relative w-full rounded-[3rem] p-8 text-left transition-all duration-300 group overflow-hidden border shadow-3xl ${
                chapter.locked 
                ? 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed' 
                : 'bg-slate-900/60 border-white/5 active:scale-95 hover:border-amber-500/40 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-tactical font-black tracking-[0.3em] uppercase px-3 py-1 rounded-lg ${isFullyCompleted ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      PHASE 0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl font-tactical font-black text-white leading-tight uppercase italic tracking-tighter">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Target size={16} />
                      <span className="text-[10px] font-tactical font-black uppercase tracking-widest">{missionIds.length} Objectives</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Zap size={16} />
                      <span className="text-[10px] font-tactical font-black uppercase tracking-widest">+{missionIds.length * 650} XP</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                  isFullyCompleted
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_40px_rgba(34,197,94,0.3)]'
                  : chapter.locked 
                    ? 'bg-slate-800 text-slate-600' 
                    : 'bg-amber-500 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:scale-110 group-hover:rotate-12'
                }`}>
                  {isFullyCompleted ? <CheckCircle2 size={40} /> : chapter.locked ? <Lock size={32} /> : <Play size={40} className="fill-slate-950 ml-1" />}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-[11px] font-tactical font-black tracking-[0.2em] uppercase px-1">
                  <span className={isFullyCompleted ? 'text-green-500' : 'text-slate-500'}>{isFullyCompleted ? 'SECTOR SECURED' : 'SYNC PROGRESS'}</span>
                  <span className="text-white/60">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full p-[2px] border border-white/5 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full relative ${isFullyCompleted ? 'bg-green-500 shadow-[0_0_20px_green]' : 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]'}`}
                    style={{ width: `${Math.max(progress, 4)}%` }}
                  >
                    <div className="absolute inset-0 shimmer opacity-30"></div>
                  </div>
                </div>
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeScreen;
