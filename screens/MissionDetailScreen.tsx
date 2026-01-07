
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mission } from '../types';
import { 
  Zap, 
  ShieldAlert, 
  Target, 
  MapPin, 
  ChevronRight, 
  Play, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Award, 
  Music,
  Disc,
  Info,
  Waves
} from 'lucide-react';

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
  const [rhythmNodes, setRhythmNodes] = useState<{ id: number, x: number, y: number, life: number, type: 'beat' | 'pulse' }[]>([]);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);
  
  const handleStartMission = () => {
    setStatus('executing');
    setProgress(0);
    setScore(0);
    setCombo(0);
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSFX = useCallback((freq: number, type: OscillatorType = 'sine', duration: number = 0.2, volume: number = 0.1) => {
    if (!audioRef.current) return;
    const osc = audioRef.current.createOscillator();
    const gain = audioRef.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioRef.current.currentTime);
    gain.gain.setValueAtTime(volume, audioRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioRef.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioRef.current.destination);
    osc.start();
    osc.stop(audioRef.current.currentTime + duration);
  }, []);

  useEffect(() => {
    if (status === 'executing') {
      const spawnInterval = setInterval(() => {
        // Fix: Explicitly cast type to prevent string widening error
        setRhythmNodes(prev => [
          ...prev,
          { 
            id: Math.random(), 
            x: 15 + Math.random() * 70, 
            y: 15 + Math.random() * 70, 
            life: 1,
            type: (Math.random() > 0.8 ? 'pulse' : 'beat') as 'pulse' | 'beat'
          }
        ].slice(-10));
        // Subtle rhythmic tick
        playSFX(150, 'sine', 0.05, 0.02);
      }, 700);

      const lifeInterval = setInterval(() => {
        setRhythmNodes(prev => prev.map(n => ({ ...n, life: n.life - 0.015 })).filter(n => n.life > 0));
        setProgress(prev => {
          const next = prev + 0.4;
          if (next >= 100) {
            clearInterval(spawnInterval);
            clearInterval(lifeInterval);
            setStatus('flash');
            setTimeout(() => setStatus('success'), 200);
            return 100;
          }
          return next;
        });
      }, 50);

      return () => {
        clearInterval(spawnInterval);
        clearInterval(lifeInterval);
      };
    }
  }, [status, playSFX]);

  const handleNodeTap = (nodeId: number, type: string) => {
    setRhythmNodes(prev => prev.filter(n => n.id !== nodeId));
    setCombo(c => c + 1);
    const bonus = type === 'pulse' ? 50 : 20;
    setScore(s => s + bonus + (combo * 5));
    setProgress(p => Math.min(p + 2.5, 100)); 
    
    // Play "Musical" progression
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const note = frequencies[combo % frequencies.length];
    playSFX(note, 'triangle', 0.25, 0.15);
  };

  const getRankData = () => {
    const finalScore = mission.xp + score;
    if (finalScore >= 3500) return { label: 'S-RANK', color: 'text-emerald-400', glow: 'rgba(52,211,153,0.5)', icon: Sparkles };
    if (finalScore >= 2500) return { label: 'A-RANK', color: 'text-amber-500', glow: 'rgba(245,158,11,0.5)', icon: Trophy };
    return { label: 'B-RANK', color: 'text-cyan-400', glow: 'rgba(34,211,238,0.5)', icon: Activity };
  };

  const rank = getRankData();

  useEffect(() => {
    if (status === 'success') {
      onComplete(mission.id, mission.worldId);
      playSFX(523.25, 'sawtooth', 0.6, 0.1);
      setTimeout(() => playSFX(659.25, 'sawtooth', 0.6, 0.1), 150);
      setTimeout(() => playSFX(783.99, 'sawtooth', 1.0, 0.15), 300);
    }
  }, [status, mission.id, mission.worldId, onComplete, playSFX]);

  return (
    <div className="flex flex-col min-h-full relative overflow-x-hidden bg-[#010409] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Visual */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden border-b border-slate-800">
        <img 
          src={`https://picsum.photos/seed/${mission.id + 101}/1200/800`} 
          alt={mission.title}
          className="w-full h-full object-cover opacity-20 scale-105 transition-transform duration-[10s] hover:scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010409] to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8">
           <div className="flex items-center gap-3 mb-3">
              <div className={`px-4 py-1.5 rounded-xl font-tactical font-black text-[10px] tracking-widest uppercase border ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                {isCompleted ? 'Node Secured' : 'Tactical Brief'}
              </div>
              <div className="px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-lg text-[10px] text-slate-500 font-tactical font-black flex items-center gap-2">
                <Music size={10} className="animate-bounce" />
                {mission.type === 'Rhythm' ? 'NEURAL SYNC REQD' : 'STANDARD UPLINK'}
              </div>
           </div>
           <h1 className="text-4xl md:text-6xl font-tactical font-black text-white italic uppercase tracking-tighter leading-none">{mission.title}</h1>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-32">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Rewards', val: `+${mission.xp} XP`, icon: Zap, color: 'text-amber-500' },
             { label: 'Danger', val: mission.difficulty, icon: ShieldAlert, color: 'text-rose-500' },
             { label: 'Target', val: mission.worldId.split('-')[0].toUpperCase(), icon: Target, color: 'text-blue-500' },
             { label: 'Protocol', val: mission.type || 'Standard', icon: Music, color: 'text-purple-500' }
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl flex flex-col items-center gap-2 hover:border-amber-500/20 transition-all group cursor-default">
                <stat.icon size={20} className={`${stat.color} group-hover:scale-125 transition-transform`} />
                <span className="text-[9px] font-tactical font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-sm font-tactical font-black text-white uppercase">{stat.val}</span>
             </div>
           ))}
        </div>

        {/* Intelligence Brief */}
        <section className="bg-slate-950/60 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
           <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-4 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <h3 className="text-xs font-tactical font-black text-white tracking-widest uppercase italic">Sector Mission Intel</h3>
           </div>
           <p className="text-lg md:text-2xl text-slate-300 font-medium italic leading-relaxed">"{mission.story}"</p>
           <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-2xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase">
                <MapPin size={12} /> Grid: SEC-1-{mission.id}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-2xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase">
                <Waves size={12} className="text-amber-500 animate-pulse" /> Freq: 440Hz Sync
              </div>
           </div>
        </section>

        {/* Start Button */}
        {status === 'idle' && (
          <div className="flex justify-center pt-8">
            <button 
              onClick={handleStartMission}
              className="w-full max-w-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-2xl py-7 rounded-[2.5rem] shadow-[0_20px_60px_rgba(245,158,11,0.3)] flex items-center justify-center gap-4 transition-all group active:scale-95 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
              {isCompleted ? <RotateCcw size={28} /> : <Play size={28} className="fill-slate-950" />}
              {isCompleted ? 'REPLAY UPLINK' : 'INITIATE NEURAL SYNC'}
              <ChevronRight size={28} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* RHYTHM GAME MODAL */}
      {status === 'executing' && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#010409] p-8 scanlines overflow-hidden">
          <div className="w-full max-w-2xl relative h-[500px] border border-slate-800 rounded-[4rem] bg-slate-950/60 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            
            {/* Pulsing Visual Rhythm Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-80 h-80 border-4 border-amber-500/10 rounded-full animate-[ping_3s_infinite]"></div>
               <div className="w-64 h-64 border-2 border-amber-500/20 rounded-full animate-[ping_2s_infinite]"></div>
               <div className="w-48 h-48 border border-amber-500/30 rounded-full animate-[ping_1.5s_infinite]"></div>
            </div>

            {/* Tap Targets */}
            {rhythmNodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeTap(node.id, node.type)}
                style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: node.life }}
                className={`absolute w-16 h-16 rounded-full border-4 ${node.type === 'pulse' ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : 'border-amber-500 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)]'} flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-90`}
              >
                {node.type === 'pulse' ? <Activity size={20} className="text-emerald-500 animate-pulse" /> : <Disc size={20} className="text-amber-500 animate-spin" />}
              </button>
            ))}

            <div className="relative z-10 text-center pointer-events-none">
              <div className="text-amber-500 font-tactical font-black text-xs tracking-[0.5em] uppercase mb-4 animate-pulse flex items-center justify-center gap-2">
                <Music size={14} /> HARMONIC ALIGNMENT
              </div>
              <div className="text-8xl font-tactical font-black text-white italic drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                {Math.floor(progress)}%
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">
                 <div className="flex gap-8">
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">COMBO</span>
                     <span className="text-3xl font-tactical font-black text-amber-500">{combo}</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">SCORE</span>
                     <span className="text-3xl font-tactical font-black text-white">{score}</span>
                   </div>
                 </div>
                 <div className="h-2.5 w-64 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center opacity-40">
               <p className="text-[10px] font-tactical font-black text-slate-500 uppercase tracking-widest px-12">Tap nodes to maintain neural resonance and finalize the sector secure.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {status === 'success' && (
        <div className="fixed inset-0 z-[250] flex flex-col bg-[#010409]/98 backdrop-blur-3xl overflow-y-auto custom-scrollbar animate-in zoom-in-105 duration-700">
           <div className="max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center justify-center min-h-full">
              
              <div className="relative mb-20">
                 <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20"></div>
                 <div className="w-48 h-48 sm:w-72 sm:h-72 rounded-[4rem] border-2 border-white/10 bg-slate-900 flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.2)] transform rotate-12 animate-[victory-float_6s_infinite_ease-in-out] relative z-10">
                    <Trophy size={100} className="text-amber-500 sm:w-40 sm:h-40" />
                    <div className="absolute -inset-12 border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                    <rank.icon size={40} className={`absolute -top-6 -right-6 text-white drop-shadow-[0_0_30px_white] animate-bounce`} />
                 </div>
              </div>

              <div className="text-center mb-16">
                 <h2 className="text-6xl sm:text-8xl md:text-[10rem] font-tactical font-black text-white tracking-tighter uppercase italic leading-[0.75]">
                    SECTOR <br/><span className="text-amber-500 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">STABLE</span>
                 </h2>
                 <p className="mt-8 text-[12px] sm:text-sm font-tactical font-black text-slate-500 tracking-[0.8em] uppercase italic opacity-60">Mission Finalized // Node AFR-SY-0{mission.id % 9}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl mb-16">
                 <div className="bg-slate-900/80 border border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center shadow-3xl hover:border-amber-500/20 transition-all">
                    <span className="text-[10px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase mb-4">Uplink XP Yield</span>
                    <div className="flex items-center gap-4">
                       <Zap size={32} className="text-amber-500 fill-amber-500 animate-pulse" />
                       <span className="text-5xl sm:text-7xl font-tactical font-black text-white leading-none">+{mission.xp + score}</span>
                    </div>
                 </div>
                 <div className="bg-slate-900/80 border border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center shadow-3xl hover:border-emerald-500/20 transition-all">
                    <span className="text-[10px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase mb-4">Execution Grade</span>
                    <span className={`text-5xl sm:text-7xl font-tactical font-black italic ${rank.color} drop-shadow-[0_0_30px_${rank.glow}]`}>
                       {rank.label}
                    </span>
                 </div>
              </div>

              <button 
                onClick={onReturnToOps || onBack}
                className="w-full max-w-lg py-7 rounded-[3rem] bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-2xl uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center justify-center gap-5 group"
              >
                RETURN TO OPS
                <ChevronRight size={32} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes victory-float {
          0%, 100% { transform: rotate(12deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(-25px); }
        }
      `}</style>
    </div>
  );
};

export default MissionDetailScreen;
