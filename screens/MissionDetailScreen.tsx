
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
  Music,
  Disc,
  Waves,
  Check,
  ClipboardList,
  Star,
  Terminal,
  BrainCircuit,
  AlertCircle
} from 'lucide-react';

interface MissionDetailScreenProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: (id: number, worldId: string) => void;
  onBack: () => void;
  onReturnToOps?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

const MissionDetailScreen: React.FC<MissionDetailScreenProps> = ({ mission, isCompleted, onComplete, onBack, onReturnToOps }) => {
  const [status, setStatus] = useState<'idle' | 'decryption' | 'executing' | 'flash' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [rhythmNodes, setRhythmNodes] = useState<{ id: number, x: number, y: number, life: number, type: 'beat' | 'pulse' }[]>([]);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [decryptionFeedback, setDecryptionFeedback] = useState<{ correct: boolean, revealed: boolean } | null>(null);
  
  const audioRef = useRef<AudioContext | null>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  
  const handleStartMission = () => {
    setStatus('decryption');
    setDecryptionFeedback(null);
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    playSFX(800, 'square', 0.1, 0.05);
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

  const handleAnswer = (index: number) => {
    if (decryptionFeedback?.revealed) return;
    const isCorrect = index === mission.challenge?.correctIndex;
    setDecryptionFeedback({ correct: isCorrect, revealed: true });
    
    if (isCorrect) {
      playSFX(1200, 'sine', 0.4, 0.1);
      setScore(s => s + 500); // Decryption bonus
      setTimeout(() => setStatus('executing'), 2000);
    } else {
      playSFX(200, 'sawtooth', 0.5, 0.1);
      setTimeout(() => setStatus('executing'), 2000);
    }
  };

  const createParticleBurst = useCallback(() => {
    const newParticles: Particle[] = [];
    const colors = ['#f59e0b', '#10b981', '#ffffff', '#fbbf24'];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      newParticles.push({
        id: Math.random(),
        x: 50, y: 40, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 6, life: 1.0
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (particles.length > 0) {
      const frame = requestAnimationFrame(() => {
        setParticles(prev => prev.map(p => ({
          ...p, x: p.x + p.vx * 0.1, y: p.y + p.vy * 0.1, vy: p.vy + 0.1, life: p.life - 0.015
        })).filter(p => p.life > 0));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [particles]);

  useEffect(() => {
    if (status === 'executing') {
      const spawnInterval = setInterval(() => {
        setRhythmNodes(prev => [
          ...prev,
          { id: Math.random(), x: 15 + Math.random() * 70, y: 15 + Math.random() * 70, life: 1, type: (Math.random() > 0.8 ? 'pulse' : 'beat') }
        ].slice(-8));
        playSFX(150, 'sine', 0.05, 0.02);
      }, 800);

      const lifeInterval = setInterval(() => {
        setRhythmNodes(prev => prev.map(n => ({ ...n, life: n.life - 0.015 })).filter(n => n.life > 0));
        setProgress(prev => {
          const next = prev + 0.45;
          if (next >= 100) {
            clearInterval(spawnInterval);
            clearInterval(lifeInterval);
            setStatus('flash');
            setTimeout(() => {
              setStatus('success');
              createParticleBurst();
            }, 200);
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
  }, [status, playSFX, createParticleBurst]);

  const handleNodeTap = (nodeId: number, type: string) => {
    setRhythmNodes(prev => prev.filter(n => n.id !== nodeId));
    setCombo(c => c + 1);
    const bonus = type === 'pulse' ? 50 : 20;
    setScore(s => s + bonus + (combo * 5));
    setProgress(p => Math.min(p + 3, 100)); 
    
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
      playSFX(261.63, 'sawtooth', 0.4, 0.08); 
      playSFX(329.63, 'sawtooth', 0.4, 0.08); 
      playSFX(392.00, 'sawtooth', 0.4, 0.08); 
      setTimeout(() => {
        playSFX(523.25, 'square', 0.6, 0.12); 
        playSFX(659.25, 'square', 0.6, 0.12); 
        playSFX(783.99, 'square', 0.8, 0.12); 
      }, 400);
      setTimeout(() => playSFX(1046.50, 'sawtooth', 1.2, 0.15), 800);
    }
  }, [status, mission.id, mission.worldId, onComplete, playSFX]);

  const objectives = mission.objectives || [
    `Authenticate Phase ${Math.floor(mission.id / 100) + 1} Credentials`,
    `Analyze Sector Intelligence Nodes`,
    `Synchronize Tactical Frequencies`,
    `Broadcast Secure Mesh Signal`
  ];

  return (
    <div className="flex flex-col min-h-full relative overflow-x-hidden bg-[#010409] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden border-b border-slate-800">
        <img 
          src={`https://picsum.photos/seed/${mission.id + 101}/1200/800`} 
          alt={mission.title}
          className="w-full h-full object-cover opacity-20 scale-105 transition-transform duration-[10s] hover:scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010409] to-transparent"></div>
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
           <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
              <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl font-tactical font-black text-[8px] sm:text-[10px] tracking-widest uppercase border ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                {isCompleted ? 'Node Secured' : 'Tactical Brief'}
              </div>
              <div className="px-2 py-1 bg-slate-900/60 border border-slate-800 rounded-lg text-[8px] sm:text-[10px] text-slate-500 font-tactical font-black flex items-center gap-2">
                <BrainCircuit size={10} className="animate-pulse text-amber-500" />
                NEURAL ASSESSMENT READY
              </div>
           </div>
           <h1 className="text-3xl sm:text-5xl md:text-6xl font-tactical font-black text-white italic uppercase tracking-tighter leading-none break-words">
             {mission.title}
           </h1>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 sm:space-y-12 pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
           {[
             { label: 'Rewards', val: `+${mission.xp} XP`, icon: Zap, color: 'text-amber-500' },
             { label: 'Danger', val: mission.difficulty, icon: ShieldAlert, color: 'text-rose-500' },
             { label: 'Target', val: mission.worldId.split('-')[0].toUpperCase(), icon: Target, color: 'text-blue-500' },
             { label: 'Protocol', val: mission.type || 'Standard', icon: Music, color: 'text-purple-500' }
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center gap-1 sm:gap-2 hover:border-amber-500/20 transition-all group cursor-default shadow-lg">
                <stat.icon size={18} className={`${stat.color} group-hover:scale-125 transition-transform`} />
                <span className="text-[8px] sm:text-[9px] font-tactical font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-[10px] sm:text-sm font-tactical font-black text-white uppercase">{stat.val}</span>
             </div>
           ))}
        </div>

        <section className="bg-slate-950/60 border border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
           <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-1.5 h-4 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <h3 className="text-[10px] sm:text-xs font-tactical font-black text-white tracking-widest uppercase italic">Sector Mission Intel</h3>
           </div>
           <p className="text-base sm:text-xl md:text-2xl text-slate-300 font-medium italic leading-relaxed">"{mission.story}"</p>
        </section>

        {status === 'idle' && (
          <div className="flex justify-center pt-4 sm:pt-8">
            <button 
              onClick={handleStartMission}
              className="w-full max-w-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-lg sm:text-2xl py-5 sm:py-7 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(245,158,11,0.3)] flex items-center justify-center gap-3 sm:gap-4 transition-all group active:scale-95 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
              {isCompleted ? <RotateCcw size={24} className="sm:w-7 sm:h-7" /> : <Play size={24} className="fill-slate-950 sm:w-7 sm:h-7" />}
              {isCompleted ? 'RE-ENGAGE NODE' : 'INITIATE NEURAL UPLINK'}
              <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform sm:w-7 sm:h-7" />
            </button>
          </div>
        )}
      </div>

      {/* DECRYPTION ASSESSMENT OVERLAY */}
      {status === 'decryption' && mission.challenge && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#010409]/95 backdrop-blur-3xl p-4 sm:p-8 scanlines overflow-hidden animate-in fade-in duration-500">
           <div className="w-full max-w-3xl relative p-6 sm:p-12 border border-slate-800 rounded-[2rem] sm:rounded-[4rem] bg-slate-950 shadow-3xl overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <Terminal size={20} className="text-amber-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-tactical font-black text-slate-500 tracking-[0.4em] uppercase">Neural Decryption Protocol</span>
              </div>
              
              <h3 className="text-xl sm:text-3xl font-tactical font-black text-white leading-tight uppercase italic tracking-tighter mb-10">
                {mission.challenge.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mission.challenge.options.map((option, i) => {
                  const isCorrect = i === mission.challenge?.correctIndex;
                  const isRevealed = decryptionFeedback?.revealed;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={isRevealed}
                      className={`p-6 rounded-2xl border text-left font-tactical font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all ${
                        isRevealed
                        ? isCorrect 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-500 opacity-50'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-500 hover:bg-slate-800 text-slate-400 hover:text-white active:scale-95'
                      }`}
                    >
                      <span className="opacity-50 mr-2">OP-0{i+1}:</span> {option}
                    </button>
                  );
                })}
              </div>

              {decryptionFeedback?.revealed && (
                <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-in slide-in-from-bottom-4 duration-500 flex gap-4">
                  <div className={`p-3 rounded-xl shrink-0 h-fit ${decryptionFeedback.correct ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-slate-950'}`}>
                    {decryptionFeedback.correct ? <Check size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-tactical font-black uppercase mb-1 ${decryptionFeedback.correct ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {decryptionFeedback.correct ? 'Synapse Linked' : 'Interference Detected'}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium italic">
                      {mission.challenge.explanation}
                    </p>
                  </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* RHYTHM GAME MODAL */}
      {status === 'executing' && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#010409] p-4 sm:p-8 scanlines overflow-hidden">
          <div className="w-full max-w-2xl relative h-full max-h-[80vh] sm:h-[500px] border border-slate-800 rounded-[2rem] sm:rounded-[4rem] bg-slate-950/60 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-64 h-64 sm:w-80 sm:h-80 border-4 border-amber-500/10 rounded-full animate-[ping_3s_infinite]"></div>
               <div className="w-32 h-32 sm:w-48 sm:h-48 border border-amber-500/30 rounded-full animate-[ping_1.5s_infinite]"></div>
            </div>
            {rhythmNodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeTap(node.id, node.type)}
                style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: node.life }}
                className={`absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 ${node.type === 'pulse' ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : 'border-amber-500 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)]'} flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-90`}
              >
                {node.type === 'pulse' ? <Activity size={18} className="text-emerald-500 animate-pulse" /> : <Disc size={18} className="text-amber-500 animate-spin" />}
              </button>
            ))}
            <div className="relative z-10 text-center pointer-events-none p-4">
              <div className="text-6xl sm:text-8xl font-tactical font-black text-white italic drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                {Math.floor(progress)}%
              </div>
              <div className="mt-4 sm:mt-8 flex flex-col items-center gap-3">
                 <div className="flex gap-8">
                   <div className="flex flex-col items-center">
                     <span className="text-[8px] sm:text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">COMBO</span>
                     <span className="text-xl sm:text-3xl font-tactical font-black text-amber-500">{combo}</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[8px] sm:text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">SCORE</span>
                     <span className="text-xl sm:text-3xl font-tactical font-black text-white">{score}</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {status === 'success' && (
        <div className="fixed inset-0 z-[250] flex flex-col bg-[#010409]/98 backdrop-blur-3xl overflow-y-auto custom-scrollbar animate-in zoom-in-105 duration-700">
           <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map(p => (
                <div key={p.id} className="absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, opacity: p.life, boxShadow: `0 0 10px ${p.color}` }} />
              ))}
           </div>
           <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-full">
              <div className="relative mb-12 sm:mb-20">
                 <div className="w-40 h-40 sm:w-56 md:w-72 aspect-square rounded-[2rem] sm:rounded-[4rem] border-2 border-white/10 bg-slate-900 flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.3)] transform rotate-12 animate-[victory-float_6s_infinite_ease-in-out] relative z-10">
                    <Trophy size={60} className="text-amber-500 sm:w-40 sm:h-40" />
                 </div>
              </div>
              <div className="text-center mb-10 sm:mb-16">
                 <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-tactical font-black text-white tracking-tighter uppercase italic leading-[0.85] sm:leading-[0.75]">
                    SECTOR <br/><span className="text-amber-500 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">STABLE</span>
                 </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-3xl mb-12 sm:mb-16 px-4">
                 <div className="bg-slate-900/80 border border-white/5 p-6 sm:p-10 rounded-2xl sm:rounded-[3.5rem] flex flex-col items-center shadow-3xl">
                    <span className="text-[8px] sm:text-[10px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase mb-2">Uplink XP Yield</span>
                    <div className="flex items-center gap-3">
                       <Zap size={24} className="text-amber-500 fill-amber-500 animate-pulse" />
                       <span className="text-4xl sm:text-7xl font-tactical font-black text-white leading-none">+{mission.xp + score}</span>
                    </div>
                 </div>
                 <div className="bg-slate-900/80 border border-white/5 p-6 sm:p-10 rounded-2xl sm:rounded-[3.5rem] flex flex-col items-center shadow-3xl">
                    <span className="text-[8px] sm:text-[10px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase mb-2">Execution Grade</span>
                    <span className={`text-4xl sm:text-7xl font-tactical font-black italic ${rank.color}`}>
                       {rank.label}
                    </span>
                 </div>
              </div>
              <div className="w-full max-w-2xl px-4 mb-16 sm:mb-20">
                <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8 sm:mb-10">
                    <div className="w-2 h-6 bg-emerald-500"></div>
                    <h3 className="text-[11px] sm:text-sm font-tactical font-black text-white tracking-[0.3em] uppercase italic">Operational Debrief</h3>
                  </div>
                  <div className="space-y-6">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-4 sm:gap-8 group/item animate-in slide-in-from-left-6 duration-700" style={{ animationDelay: `${1200 + (i * 200)}ms` }}>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                          <Check size={20} strokeWidth={4} />
                        </div>
                        <span className="text-sm sm:text-xl font-tactical font-black text-slate-300 uppercase italic tracking-tighter group-hover/item:text-white transition-colors block">
                          {obj}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={onReturnToOps || onBack}
                className="w-full max-w-lg py-6 sm:py-9 rounded-2xl sm:rounded-[4rem] bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xl sm:text-3xl uppercase tracking-[0.2em] shadow-[0_30px_70px_rgba(245,158,11,0.4)] transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                RETURN TO OPS
                <ChevronRight size={32} strokeWidth={4} className="group-hover:translate-x-4 transition-transform" />
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes victory-float {
          0%, 100% { transform: rotate(12deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default MissionDetailScreen;
