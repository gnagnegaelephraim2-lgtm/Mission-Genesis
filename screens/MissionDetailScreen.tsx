
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

  // High-Fidelity Triumphant Sound Effect Logic
  useEffect(() => {
    if (status === 'success') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
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

        // Afro-Futuristic Triumphant Sequence: G4 -> C5 -> E5 -> G5 -> C6 (Strong finish)
        playNote(392.00, 0.0, 0.3, 'sine', 0.15);  // G4
        playNote(523.25, 0.1, 0.3, 'sine', 0.15);  // C5
        playNote(659.25, 0.2, 0.3, 'sine', 0.15);  // E5
        playNote(783.99, 0.3, 0.3, 'sine', 0.15);  // G5
        
        // Final "Power Up" Chord
        playNote(1046.50, 0.5, 1.5, 'square', 0.1); // High C6 (Tactical Edge)
        playNote(523.25, 0.5, 1.5, 'sawtooth', 0.05); // Support Octave
        
        // Tribal Bass Thump
        playNote(60, 0.5, 0.8, 'sine', 0.3);
      } catch (e) {
        console.warn("Audio Context blocked or unsupported");
      }
    }
  }, [status]);

  return (
    <div className={`flex flex-col min-h-full relative overflow-hidden transition-all duration-500 ${status !== 'idle' ? 'scale-105' : ''}`}>
      {/* Header Image/Scene */}
      <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${mission.id + 100}/800/600`} 
          alt={mission.title}
          className="w-full h-full object-cover opacity-60 scale-110 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Animated Scan Line Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(245,158,11,0.05),rgba(0,0,0,0),rgba(245,158,11,0.05))] bg-[length:100%_4px,10%_100%] pointer-events-none"></div>

        <div className="absolute bottom-6 left-6 right-6 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'} text-slate-950 font-tactical font-black text-[10px] rounded uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.3)]`}>
              {isCompleted ? 'Completed' : 'Active Ops'}
            </span>
            <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase font-tactical">Mission {mission.id}</span>
          </div>
          <h1 className="text-3xl font-tactical font-black text-white leading-tight uppercase tracking-tighter italic drop-shadow-lg">
            {mission.title}
          </h1>
        </div>
      </div>

      {/* Mission Details */}
      <div className="p-6 flex-1 bg-slate-950 text-left">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center gap-1 shadow-lg hover:border-amber-500/30 transition-colors group">
             <Zap size={18} className={`${isCompleted ? 'text-green-500' : 'text-amber-500'} fill-current group-hover:scale-125 transition-transform`} />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reward</span>
             <span className="text-sm font-tactical font-black text-white leading-none">+{mission.xp} XP</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center gap-1 shadow-lg hover:border-amber-500/30 transition-colors group">
             <ShieldAlert size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threat</span>
             <span className="text-sm font-tactical font-black text-white leading-none uppercase">{mission.difficulty}</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center gap-1 shadow-lg hover:border-amber-500/30 transition-colors group">
             <MapPin size={18} className="text-amber-500 group-hover:bounce transition-all" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zone</span>
             <span className="text-sm font-tactical font-black text-white leading-none uppercase tracking-tighter">AFR-GNS-01</span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-1 h-4 ${isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`}></div>
              <h3 className={`text-xs font-tactical font-black uppercase tracking-widest italic ${isCompleted ? 'text-green-500' : 'text-amber-500'}`}>Intel Briefing</h3>
            </div>
            <div className="relative">
              <p className="text-slate-300 text-base leading-relaxed font-medium bg-slate-900/30 p-4 rounded-2xl border-l-2 border-amber-500/30 italic">
                "{mission.story}"
              </p>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/50"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/50"></div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-1 h-4 ${isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`}></div>
              <h3 className={`text-xs font-tactical font-black uppercase tracking-widest italic ${isCompleted ? 'text-green-500' : 'text-amber-500'}`}>Environment Analysis</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 group hover:border-amber-500/20 transition-all">
               <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/50 transition-colors shadow-inner">
                  <Target size={24} className={`${isCompleted ? 'text-green-500' : 'text-amber-500'} group-hover:scale-110 transition-transform`} />
               </div>
               <p className="text-xs text-slate-400 font-bold leading-tight flex-1">
                 {mission.environment}
               </p>
            </div>
          </section>

          <button 
            onClick={handleStartMission}
            disabled={status !== 'idle'}
            className={`w-full mt-4 ${isCompleted ? 'bg-slate-800 text-white' : 'bg-amber-500 text-slate-950'} hover:opacity-90 font-tactical font-black text-xl py-5 rounded-2xl transition-all active:scale-95 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 group overflow-hidden relative ${status !== 'idle' ? 'opacity-0 scale-90 pointer-events-none' : ''}`}
          >
             {isCompleted ? <RotateCcw size={24} /> : <Play size={24} className="fill-slate-950" />}
             {isCompleted ? 'REPLAY MISSION' : 'START MISSION'}
             <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
             <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
          </button>
        </div>
      </div>

      {/* EXECUTION OVERLAY */}
      {status === 'executing' && (
        <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-[300px] space-y-6">
              <div className="flex items-center justify-between">
                 <span className="text-amber-500 font-tactical font-black text-xs tracking-widest flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" />
                    LINKING TO GRID...
                 </span>
                 <span className="text-white font-tactical font-bold text-xs">{progress}%</span>
              </div>
              <div className="h-4 w-full bg-slate-900 rounded-full border border-slate-800 p-1 shadow-inner relative overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                 ></div>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[9px] text-slate-500 text-left">
                <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded">
                   <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500"></div> CORE SYSTEMS</span>
                   <span className="text-green-500">ONLINE</span>
                </div>
                {progress > 50 && (
                  <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded animate-in slide-in-from-left duration-300">
                     <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500"></div> ANALYZING NODES</span>
                     <span className="text-green-500">SUCCESS</span>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* FLASH TRANSITION */}
      {status === 'flash' && (
        <div className="absolute inset-0 z-[120] bg-white animate-out fade-out duration-150 fill-mode-forwards"></div>
      )}

      {/* VICTORY OVERLAY - ENHANCED AFRO-FUTURISTIC CELEBRATION */}
      {status === 'success' && (
        <div className="absolute inset-0 z-[130] flex flex-col items-center justify-center bg-slate-950/98 backdrop-blur-3xl overflow-hidden">
          
          {/* Pulsing Mandela / Tribal Geometric Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-[180%] aspect-square border-[8px] border-amber-500/5 rounded-full animate-[spin_60s_linear_infinite] opacity-50"></div>
             <div className="absolute w-[140%] aspect-square border-4 border-dashed border-emerald-500/5 rounded-full animate-[spin_40s_linear_infinite_reverse] opacity-40"></div>
             
             {/* Digital Tribal Totems / Rays */}
             {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-[2px] h-[300%] bg-gradient-to-t from-transparent via-amber-500/10 to-transparent"
                  style={{ transform: `rotate(${i * 22.5}deg)` }}
                ></div>
             ))}
          </div>

          {/* Celebration Particle System - Tribal Geometric Shapes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => {
              const shapes = [
                <rect width="10" height="10" fill="currentColor" />,
                <polygon points="5,0 10,10 0,10" fill="currentColor" />,
                <path d="M0 0 L10 10 M10 0 L0 10" stroke="currentColor" strokeWidth="2" />,
                <circle cx="5" cy="5" r="5" fill="currentColor" />
              ];
              const shapeIndex = i % shapes.length;
              const color = i % 3 === 0 ? 'text-amber-500' : i % 3 === 1 ? 'text-emerald-500' : 'text-white';
              
              return (
                <svg 
                  key={i}
                  viewBox="0 0 10 10"
                  className={`absolute w-3 h-3 ${color} opacity-0`}
                  style={{
                    top: '50%',
                    left: '50%',
                    animation: `tribal-burst-${i} ${2 + Math.random() * 1.5}s cubic-bezier(0.12, 0, 0.39, 0) forwards`,
                  }}
                >
                  {shapes[shapeIndex]}
                </svg>
              );
            })}
          </div>

          <div className="relative z-10 text-center px-8 flex flex-col items-center">
            
            {/* Main Trophy Reveal Animation */}
            <div className="relative mb-12 animate-in zoom-in fade-in duration-1000">
               <div className="w-56 h-56 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 rounded-[4rem] flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.6)] rotate-3 animate-[victory-float_4s_infinite_ease-in-out] relative group">
                  <Trophy size={110} className="text-slate-950 drop-shadow-2xl" />
                  
                  {/* Digital Halo */}
                  <div className="absolute -inset-6 border-4 border-dashed border-white/20 rounded-[5rem] animate-[spin_12s_linear_infinite]"></div>
                  
                  {/* Floating Tribal Elements around Trophy */}
                  <Award size={32} className="absolute -top-4 -right-4 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-bounce" />
                  <Sparkles size={32} className="absolute -bottom-4 -left-4 text-white animate-pulse" />
               </div>

               {/* "MISSION MASTERED" TACTICAL STAMP */}
               <div className="absolute -bottom-6 -right-10 bg-emerald-500 text-slate-950 font-tactical font-black px-6 py-2 rounded-xl text-xs tracking-[0.3em] uppercase rotate-12 shadow-2xl animate-in slide-in-from-right-8 duration-500 delay-500">
                  MASTERED
               </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-300">
              <h2 className="text-6xl font-tactical font-black text-amber-500 italic tracking-tighter uppercase leading-none mb-1 drop-shadow-[0_0_40px_rgba(245,158,11,0.5)]">
                MISSION<br/><span className="text-8xl text-white">COMPLETE</span>
              </h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                 <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
                 <span className="text-slate-400 font-tactical font-black text-[10px] tracking-[0.5em] uppercase">Sector Secured</span>
                 <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] mb-12 w-full max-w-sm relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700 delay-600">
               <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] font-tactical font-black text-amber-500 tracking-[0.2em] uppercase mb-2">Total Reward</span>
                     <div className="flex items-center gap-2">
                        <Zap size={20} className="text-amber-500 fill-amber-500" />
                        <span className="text-5xl font-tactical font-black text-white leading-none">+{mission.xp}</span>
                     </div>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10"></div>
                  <div className="flex flex-col items-start">
                     <span className="text-[10px] font-tactical font-black text-emerald-500 tracking-[0.2em] uppercase mb-2">Efficiency</span>
                     <span className="text-3xl font-tactical font-black text-white">A++</span>
                  </div>
               </div>
               
               {/* Progress bar visual completion */}
               <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Synchronizing Records</span>
                    <span className="text-emerald-500">Done</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] w-full"></div>
                  </div>
               </div>
               
               <div className="absolute inset-0 shimmer opacity-5 pointer-events-none"></div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs animate-in slide-in-from-bottom-8 duration-700 delay-1000">
              <button 
                onClick={onReturnToOps || onBack}
                className="group relative flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.4)] transition-all active:scale-95"
              >
                RETURN TO OPS
                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 shimmer opacity-20 pointer-events-none"></div>
              </button>
              
              <button className="flex items-center justify-center gap-3 text-slate-500 font-tactical font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all py-4 group">
                <Share2 size={16} className="group-hover:scale-125 transition-transform" />
                Broadcast Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes victory-float {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(-1deg); }
        }
        ${[...Array(50)].map((_, i) => {
          const angle = (i / 50) * 360 + (Math.random() * 30);
          const dist = 400 + Math.random() * 800;
          const rotation = Math.random() * 720;
          return `
            @keyframes tribal-burst-${i} {
              0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
              15% { opacity: 1; }
              100% { transform: translate(calc(-50% + ${Math.cos(angle * Math.PI / 180) * dist}px), calc(-50% + ${Math.sin(angle * Math.PI / 180) * dist}px)) scale(${1 + Math.random() * 2}) rotate(${rotation}deg); opacity: 0; }
            }
          `;
        }).join('')}
      `}</style>
    </div>
  );
};

export default MissionDetailScreen;
