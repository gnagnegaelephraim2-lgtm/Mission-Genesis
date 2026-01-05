
import React, { useState, useEffect } from 'react';
import { Mission } from '../types';
import { Zap, ShieldAlert, Target, MapPin, ChevronRight, Play, Trophy, CheckCircle2, RotateCcw, Share2, Sparkles, Activity, Award } from 'lucide-react';

interface MissionDetailScreenProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: (id: number, worldId: string) => void;
  onBack: () => void;
  onReturnToOps?: () => void;
}

const MissionDetailScreen: React.FC<MissionDetailScreenProps> = ({ mission, isCompleted, onComplete, onBack, onReturnToOps }) => {
  const [status, setStatus] = useState<'idle' | 'executing' | 'flash' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleStartMission = () => {
    setStatus('executing');
    setProgress(0);
  };

  useEffect(() => {
    if (status === 'executing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('flash');
            setTimeout(() => {
              setStatus('success');
              onComplete(mission.id, mission.worldId); 
            }, 150);
            return 100;
          }
          return prev + 2;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [status, onComplete, mission]);

  useEffect(() => {
    if (status === 'success') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.1) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
          gain.gain.setValueAtTime(0, audioCtx.currentTime + start);
          gain.gain.linearRampToValueAtTime(gainVal, audioCtx.currentTime + start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + start);
          osc.stop(audioCtx.currentTime + start + duration);
        };
        playNote(261.63, 0.0, 0.4, 'sine', 0.2);
        playNote(392.00, 0.15, 0.4, 'sine', 0.2);
        playNote(523.25, 0.3, 0.4, 'sine', 0.2);
        playNote(659.25, 0.45, 0.4, 'sine', 0.2);
        playNote(783.99, 0.6, 1.2, 'sawtooth', 0.1);
        playNote(50, 0.6, 0.8, 'sine', 0.4);
        playNote(1046.50, 0.7, 1.5, 'sine', 0.05);
      } catch (e) {
        console.warn("Audio Context playback failed", e);
      }
    }
  }, [status]);

  return (
    <div className={`flex flex-col min-h-full relative overflow-hidden transition-all duration-500 ${status !== 'idle' ? 'scale-105' : ''}`}>
      {/* Header Image/Scene - Fluid height on desktop */}
      <div className="relative h-64 md:h-96 w-full bg-slate-800 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${mission.id + 100}/1200/800`} 
          alt={mission.title}
          className="w-full h-full object-cover opacity-60 scale-110 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(245,158,11,0.05),rgba(0,0,0,0),rgba(245,158,11,0.05))] bg-[length:100%_4px,10%_100%] pointer-events-none"></div>

        <div className="absolute bottom-10 left-6 md:left-12 right-6 text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-4 py-1 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'} text-slate-950 font-tactical font-black text-[11px] rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.4)]`}>
              {isCompleted ? 'Completed' : 'Active Deployment'}
            </span>
            <span className="text-xs font-bold text-white/60 tracking-[0.3em] uppercase font-tactical">Node: {mission.id}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-tactical font-black text-white leading-tight uppercase tracking-tighter italic drop-shadow-2xl">
            {mission.title}
          </h1>
        </div>
      </div>

      {/* Mission Details - Responsive Padding */}
      <div className="p-6 md:p-12 flex-1 bg-slate-950 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-5xl">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl hover:border-amber-500/30 transition-all group">
             <Zap size={24} className={`${isCompleted ? 'text-green-500' : 'text-amber-500'} fill-current group-hover:scale-125 transition-transform`} />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sector Reward</span>
             <span className="text-lg font-tactical font-black text-white leading-none">+{mission.xp} XP</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl hover:border-amber-500/30 transition-all group">
             <ShieldAlert size={24} className="text-amber-500 group-hover:rotate-12 transition-transform" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threat Level</span>
             <span className="text-lg font-tactical font-black text-white leading-none uppercase">{mission.difficulty}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl hover:border-amber-500/30 transition-all group">
             <MapPin size={24} className="text-amber-500 group-hover:bounce transition-all" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grid ID</span>
             <span className="text-lg font-tactical font-black text-white leading-none uppercase tracking-tighter">AFR-01-{mission.id}</span>
          </div>
        </div>

        <div className="space-y-10 max-w-5xl">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1.5 h-5 ${isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'}`}></div>
              <h3 className={`text-sm font-tactical font-black uppercase tracking-[0.3em] italic ${isCompleted ? 'text-green-500' : 'text-amber-500'}`}>Tactical Intel Briefing</h3>
            </div>
            <div className="relative">
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium bg-slate-900/40 p-8 rounded-[2rem] border-l-4 border-amber-500/30 italic shadow-xl">
                "{mission.story}"
              </p>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/50"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/50"></div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1.5 h-5 ${isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'}`}></div>
              <h3 className={`text-sm font-tactical font-black uppercase tracking-[0.3em] italic ${isCompleted ? 'text-green-500' : 'text-amber-500'}`}>Environment Analysis</h3>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-[2rem] flex items-center gap-6 group hover:border-amber-500/20 transition-all shadow-xl">
               <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/50 transition-colors shadow-inner flex-shrink-0">
                  <Target size={32} className={`${isCompleted ? 'text-green-500' : 'text-amber-500'} group-hover:scale-110 transition-transform`} />
               </div>
               <p className="text-sm md:text-base text-slate-400 font-bold leading-relaxed flex-1">
                 {mission.environment}
               </p>
            </div>
          </section>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={handleStartMission}
              disabled={status !== 'idle'}
              className={`w-full max-w-xl ${isCompleted ? 'bg-slate-800 text-white' : 'bg-amber-500 text-slate-950'} hover:opacity-90 font-tactical font-black text-2xl py-6 rounded-3xl transition-all active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 group overflow-hidden relative ${status !== 'idle' ? 'opacity-0 scale-90 pointer-events-none' : ''}`}
            >
               {isCompleted ? <RotateCcw size={28} /> : <Play size={28} className="fill-slate-950" />}
               {isCompleted ? 'REDEPLOY MISSION' : 'START DEPLOYMENT'}
               <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
               <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTION OVERLAY - Responsive Sizing */}
      {status === 'executing' && (
        <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="w-full max-w-md px-10 space-y-10">
              <div className="flex items-center justify-between">
                 <span className="text-amber-500 font-tactical font-black text-sm tracking-[0.4em] flex items-center gap-3">
                    <Activity size={20} className="animate-pulse" />
                    LINKING TO GRID...
                 </span>
                 <span className="text-white font-tactical font-bold text-xl">{progress}%</span>
              </div>
              <div className="h-5 w-full bg-slate-900 rounded-full border border-slate-800 p-1.5 shadow-inner relative overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.8)] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                 ></div>
              </div>
              <div className="flex flex-col gap-4 font-mono text-xs text-slate-500 text-left">
                <div className="flex justify-between items-center bg-slate-900/60 px-4 py-2 rounded-xl">
                   <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> CORE SYSTEMS</span>
                   <span className="text-green-500">STABLE</span>
                </div>
                {progress > 50 && (
                  <div className="flex justify-between items-center bg-slate-900/60 px-4 py-2 rounded-xl animate-in slide-in-from-left duration-500">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> NEURAL NODES</span>
                     <span className="text-green-500">SYNCED</span>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* FLASH TRANSITION */}
      {status === 'flash' && (
        <div className="absolute inset-0 z-[120] bg-white animate-out fade-out duration-300 fill-mode-forwards"></div>
      )}

      {/* VICTORY OVERLAY - Fully Responsive Dashboard View */}
      {status === 'success' && (
        <div className="absolute inset-0 z-[130] flex flex-col items-center justify-center bg-slate-950/98 backdrop-blur-3xl overflow-hidden py-10 md:py-20">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
             <div className="w-[200%] aspect-square border-[10px] border-amber-500/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute w-[150%] aspect-square border-4 border-dashed border-emerald-500/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

          <div className="relative z-10 text-center px-6 flex flex-col items-center w-full max-w-4xl overflow-y-auto no-scrollbar max-h-full">
            <div className="relative mb-10 animate-in zoom-in-50 fade-in duration-1000 cubic-bezier(0.175, 0.885, 0.32, 1.275)">
               <div className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 rounded-[4rem] flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.5)] rotate-3 animate-[victory-float_5s_infinite_ease-in-out] relative">
                  <Trophy size={110} className="text-slate-950 drop-shadow-2xl" />
                  <div className="absolute -inset-10 border-2 border-dashed border-white/20 rounded-[5rem] animate-[spin_20s_linear_infinite]"></div>
                  <Award size={40} className="absolute -top-6 -right-6 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-bounce" />
                  <Sparkles size={40} className="absolute -bottom-6 -left-6 text-white animate-pulse" />
               </div>
            </div>

            <div className="mb-10 animate-in slide-in-from-bottom-8 duration-800 delay-300">
              <h2 className="text-5xl md:text-7xl font-tactical font-black text-amber-500 italic tracking-tighter uppercase leading-none mb-3 drop-shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                MISSION<br/><span className="text-7xl md:text-9xl text-white">COMPLETE</span>
              </h2>
              <p className="text-slate-400 font-tactical font-black text-xs md:text-sm tracking-[0.5em] uppercase">Sector Secured // Records Synchronized</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] mb-12 w-full max-w-2xl relative shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-600">
               <div className="flex flex-col sm:flex-row items-center justify-around gap-10">
                  <div className="flex flex-col items-center">
                     <span className="text-[11px] font-tactical font-black text-amber-500 tracking-[0.3em] uppercase mb-3">Rewards Earned</span>
                     <div className="flex items-center gap-3">
                        <Zap size={28} className="text-amber-500 fill-amber-500" />
                        <span className="text-5xl md:text-6xl font-tactical font-black text-white leading-none">+{mission.xp}</span>
                     </div>
                  </div>
                  <div className="hidden sm:block w-[1.5px] h-16 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                     <span className="text-[11px] font-tactical font-black text-emerald-500 tracking-[0.3em] uppercase mb-3">Efficiency Grade</span>
                     <span className="text-5xl md:text-6xl font-tactical font-black text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">S-RANK</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-1000">
              <button 
                onClick={onReturnToOps || onBack}
                className="group relative flex-1 flex items-center justify-center gap-4 py-6 rounded-[2.5rem] bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.4)] transition-all active:scale-95"
              >
                RETURN TO OPS
                <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes victory-float {
          0%, 100% { transform: translateY(0) rotate(3deg) scale(1); }
          50% { transform: translateY(-20px) rotate(-2deg) scale(1.04); }
        }
      `}</style>
    </div>
  );
};

export default MissionDetailScreen;
