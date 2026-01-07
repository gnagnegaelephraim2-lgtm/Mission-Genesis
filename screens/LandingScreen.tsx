
import React, { useState } from 'react';
import { Target, Shield, Zap, ChevronRight, UserPlus, Cpu, Loader2 } from 'lucide-react';

interface LandingScreenProps {
  onGetStarted: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  const [isBooting, setIsBooting] = useState(false);

  const handleBoot = () => {
    setIsBooting(true);
    setTimeout(() => {
      onGetStarted();
    }, 2000);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden scanlines">
      {/* Background visual elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative z-10 text-center max-w-sm w-full animate-in zoom-in-95 duration-1000">
        <div className="mb-10 relative group inline-block">
          <div className="w-24 h-24 bg-slate-900 border-2 border-amber-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] rotate-12 group-hover:rotate-0 transition-transform duration-500">
            {isBooting ? <Loader2 size={48} className="text-amber-500 animate-spin" /> : <Target size={48} className="text-amber-500" />}
          </div>
          <div className="absolute -inset-4 bg-amber-500/10 rounded-full animate-ping opacity-20"></div>
        </div>

        <h1 className="text-4xl font-tactical font-black text-white italic tracking-tighter leading-none mb-6 uppercase">
          MISSION<br/>
          <span className="text-6xl text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">GENESIS</span>
        </h1>

        <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-10 px-4 uppercase tracking-[0.3em] font-tactical opacity-80">
          The next generation of <span className="text-amber-500">STEM excellence</span> is here. Solve real-world challenges. Secure the future.
        </p>

        <div className="space-y-4 w-full">
          <button 
            onClick={handleBoot}
            disabled={isBooting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xl py-6 rounded-2xl shadow-[0_15px_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all group overflow-hidden relative flex items-center justify-center gap-4"
          >
            <div className="absolute inset-0 shimmer opacity-30"></div>
            <span className="relative flex items-center justify-center gap-3 uppercase tracking-widest font-black">
              {isBooting ? 'SYNCING...' : 'Initiate Uplink'}
              {!isBooting && <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />}
            </span>
          </button>

          <div className="flex items-center justify-center gap-4 py-6">
            <div className="flex flex-col items-center">
              <Zap size={16} className="text-amber-500 mb-1" />
              <span className="text-[8px] font-tactical font-black text-slate-500 tracking-tighter uppercase">500k+ XP</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="flex flex-col items-center">
              <Shield size={16} className="text-amber-500 mb-1" />
              <span className="text-[8px] font-tactical font-black text-slate-500 tracking-tighter uppercase">Global Ops</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="flex flex-col items-center">
              <Cpu size={16} className="text-amber-500 mb-1" />
              <span className="text-[8px] font-tactical font-black text-slate-500 tracking-tighter uppercase">AI Mesh</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 right-0 text-center space-y-2">
        <p className="text-slate-600 font-tactical text-[9px] tracking-[0.4em] uppercase italic opacity-60">
          v2.5.8 // Regional Node: Buea-Sector
        </p>
        <div className="flex justify-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[8px] text-slate-700 font-tactical uppercase font-black">Neural Handshake Ready</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingScreen;
