
import React from 'react';
import { World, Chapter } from '../types';
import { CHAPTERS, CHAPTER_MISSION_IDS } from '../constants';
import { Lock, Play, CheckCircle2 } from 'lucide-react';

interface ChallengeScreenProps {
  world: World;
  completedMissions: number[];
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ world, completedMissions, onSelectChapter }) => {
  const chapters = CHAPTERS[world.id] || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{world.icon}</span>
          <h2 className="text-2xl font-tactical font-black text-white tracking-tighter uppercase italic">{world.id} Missions</h2>
        </div>
        <p className="text-slate-500 text-[10px] font-tactical font-bold uppercase tracking-[0.2em]">Operational Depth: Sector {world.id.toUpperCase()}-X</p>
      </div>

      <div className="space-y-6">
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
              className={`relative w-full rounded-[2rem] p-6 text-left transition-all duration-300 group overflow-hidden ${
                chapter.locked 
                ? 'bg-slate-900 border border-slate-800 opacity-50 cursor-not-allowed' 
                : 'bg-slate-900 border border-amber-500/20 active:scale-95 hover:border-amber-500/50 hover:bg-slate-800/80 shadow-2xl'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[10px] font-tactical font-black mb-1 block tracking-[0.2em] ${isFullyCompleted ? 'text-green-500' : 'text-amber-500'}`}>
                    CHAPTER 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-tactical font-black text-white leading-tight uppercase italic">
                    {chapter.title}
                  </h3>
                </div>
                <div className={`p-3 rounded-2xl transition-all duration-500 ${
                  isFullyCompleted
                  ? 'bg-green-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : chapter.locked 
                    ? 'bg-slate-800 text-slate-500' 
                    : 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110'
                }`}>
                  {isFullyCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : chapter.locked ? (
                    <Lock size={24} className="text-slate-500" />
                  ) : (
                    <Play size={24} className="text-slate-950 fill-slate-950" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-tactical font-black tracking-widest uppercase">
                  <span className={isFullyCompleted ? 'text-green-500' : 'text-slate-500'}>Status: {isFullyCompleted ? 'SECURED' : 'ACTIVE'}</span>
                  <span className="text-white/60">{completedInChapter.length}/{Math.max(missionIds.length, 10)} MISSIONS</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full p-[2px] border border-white/5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full ${isFullyCompleted ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-amber-500 shadow-[0_0_10px_amber]'}`}
                    style={{ width: `${Math.max(progress, 5)}%` }}
                  ></div>
                </div>
              </div>

              {chapter.locked && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-900 border border-slate-700 px-5 py-2 rounded-full flex items-center gap-3 shadow-2xl">
                    <Lock size={14} className="text-amber-500" />
                    <span className="text-[10px] font-tactical font-black text-white tracking-widest uppercase italic">Operational Lock</span>
                  </div>
                </div>
              )}
              
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeScreen;
