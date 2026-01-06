
import React, { useState, useEffect } from 'react';
import { Mail, Facebook, Instagram, MessageSquare, ShieldCheck, Activity, Loader2, ChevronRight, Target, Lock } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

type AuthProvider = 'Gmail' | 'Facebook' | 'Instagram' | 'Discord' | 'Genesis';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startSocialAuth = (provider: AuthProvider) => {
    setError(null);
    setActiveProvider(provider);
    setSyncing(true);
    setSyncProgress(0);
    setLogs([`INITIALIZING ${provider.toUpperCase()} SECURE GATEWAY...`]);
  };

  useEffect(() => {
    if (syncing) {
      const logOptions = [
        `ESTABLISHING HANDSHAKE WITH ${activeProvider?.toUpperCase()}...`,
        "DECRYPTING SECURITY TOKEN...",
        "SYNCING USER PARAMETERS...",
        "VALIDATING ACCESS HASH...",
        "BYPASSING REGIONAL FIREWALLS...",
        "ACCESS GRANTED. UPLINK STABLE.",
      ];

      const interval = setInterval(() => {
        setSyncProgress(prev => {
          const next = prev + Math.floor(Math.random() * 12) + 4;
          
          if (prev < 15 && next >= 15) setLogs(l => [...l, logOptions[0]]);
          if (prev < 35 && next >= 35) setLogs(l => [...l, logOptions[1]]);
          if (prev < 55 && next >= 55) setLogs(l => [...l, logOptions[2]]);
          if (prev < 75 && next >= 75) setLogs(l => [...l, logOptions[3]]);
          if (prev < 90 && next >= 90) setLogs(l => [...l, logOptions[4]]);

          if (next >= 100) {
            clearInterval(interval);
            setLogs(l => [...l, logOptions[5]]);
            setTimeout(() => onLogin(), 800);
            return 100;
          }
          return next;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [syncing, onLogin, activeProvider]);

  if (syncing) {
    return (
      <div className="min-h-full flex flex-col bg-slate-950 items-center justify-center p-8 scanlines relative">
        <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none"></div>
        
        <div className="w-full max-w-sm space-y-10 relative z-10 text-center">
          <div className="relative inline-block">
             <div className="w-28 h-28 bg-slate-900 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]">
               <Loader2 size={48} className="text-amber-500 animate-spin" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-tactical font-black text-amber-500 text-sm tracking-tighter">{syncProgress}%</span>
             </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-tactical font-black text-white italic tracking-tighter uppercase">
              {isLogin ? 'AUTHENTICATING' : 'ESTABLISHING'}
            </h2>
            <p className="text-amber-500 font-tactical text-[11px] tracking-[0.4em] uppercase animate-pulse font-black">
              SECURE SYNC: {activeProvider?.toUpperCase()}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-left h-48 overflow-hidden relative shadow-3xl backdrop-blur-xl">
             <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-4 fade-in duration-400">
                    <Activity size={12} className="text-amber-500" />
                    <span className="font-mono text-[10px] text-slate-300 tracking-tight uppercase leading-none">{log}</span>
                  </div>
                ))}
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
          </div>

          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
             <div 
               className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all duration-300 rounded-full"
               style={{ width: `${syncProgress}%` }}
             ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-950 relative overflow-hidden p-6 sm:p-12 justify-center scanlines">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 text-center mb-12 animate-in zoom-in-95 fade-in duration-1000">
        <h1 className="text-6xl sm:text-8xl font-tactical font-black text-amber-500 italic tracking-tighter leading-none mb-4 uppercase drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]">
          GENESIS
        </h1>
        <div className="flex items-center justify-center gap-6">
           <div className="h-[1px] w-12 sm:w-24 bg-slate-800"></div>
           <p className="text-slate-500 font-tactical text-[10px] sm:text-xs font-bold tracking-[0.7em] uppercase whitespace-nowrap">TACTICAL NODE V2.0.4</p>
           <div className="h-[1px] w-12 sm:w-24 bg-slate-800"></div>
        </div>
      </div>

      <div className="w-full max-w-[420px] mx-auto space-y-10 relative z-10 px-4">
        <div className="bg-slate-900/50 border border-slate-800/80 p-1.5 rounded-full flex backdrop-blur-xl shadow-3xl">
          <button 
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-4 rounded-full font-tactical font-black text-[11px] sm:text-xs tracking-[0.2em] transition-all duration-500 ${isLogin ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            UPLINK (LOGIN)
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-4 rounded-full font-tactical font-black text-[11px] sm:text-xs tracking-[0.2em] transition-all duration-500 ${!isLogin ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            PROTOCOL (SIGNUP)
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-3 text-left group">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase transition-colors group-focus-within:text-amber-500">OP-IDENTITY</label>
              <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,1)]"></div>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="commander@genesis.hub"
                className="w-full bg-slate-950/80 border border-slate-800/60 rounded-2xl px-8 py-6 text-base font-medium text-white/90 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-3xl placeholder:text-slate-800/60 font-inter"
              />
            </div>
          </div>
          
          <div className="space-y-3 text-left group">
             <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-tactical font-black text-slate-500 tracking-[0.4em] uppercase transition-colors group-focus-within:text-amber-500">ACCESS-HASH</label>
              <ShieldCheck size={18} className="text-slate-700 group-focus-within:text-amber-500/60 transition-colors" />
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800/60 rounded-2xl px-8 py-6 text-base font-medium text-white/90 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-3xl placeholder:text-slate-800/60 font-inter"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Lock size={16} className="text-red-500" />
            <span className="text-[10px] font-tactical font-black text-red-500 uppercase tracking-widest">{error}</span>
          </div>
        )}

        <button 
          onClick={() => startSocialAuth('Genesis')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-2xl py-7 rounded-2xl shadow-[0_25px_60px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all group relative overflow-hidden flex items-center justify-center gap-4"
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
          <span className="relative uppercase tracking-widest font-black">
            {isLogin ? 'ESTABLISH UPLINK' : 'ESTABLISH PROTOCOL'}
          </span>
          <ChevronRight size={32} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
        </button>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/60"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-slate-950 border border-slate-800 px-8 py-2.5 rounded-full shadow-2xl backdrop-blur-md">
              <span className="text-slate-500 font-tactical text-[11px] tracking-[0.5em] font-black uppercase">SOCIAL SYNC</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 sm:gap-6 pb-2">
          {[
            { id: 'Gmail', icon: Mail, label: 'GML' },
            { id: 'Facebook', icon: Facebook, label: 'FBK' },
            { id: 'Instagram', icon: Instagram, label: 'IGM' },
            { id: 'Discord', icon: MessageSquare, label: 'DSC' }
          ].map((provider) => (
            <button 
              key={provider.id}
              onClick={() => startSocialAuth(provider.id as AuthProvider)} 
              className="relative aspect-square bg-slate-900/40 border border-slate-800/80 rounded-[2rem] flex flex-col items-center justify-center hover:border-amber-500 hover:bg-slate-800/80 transition-all group shadow-2xl active:scale-90 overflow-hidden"
            >
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-slate-800 rounded-full group-hover:bg-amber-500 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <provider.icon size={32} className="text-slate-400 group-hover:text-white transition-all mb-2 group-hover:scale-110" />
              <span className="text-[10px] font-tactical font-black text-slate-600 group-hover:text-amber-500 tracking-[0.1em] uppercase transition-colors">
                {provider.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-16 flex flex-col items-center gap-4">
         <div className="flex items-center gap-3 opacity-30">
            <ShieldCheck size={16} className="text-slate-500" />
            <span className="text-[9px] font-tactical font-bold text-slate-500 tracking-[0.3em] uppercase italic">SECURE GATEWAY ENCRYPTED</span>
         </div>
         <p className="text-center text-slate-800 text-[10px] sm:text-xs font-tactical font-bold leading-relaxed tracking-[0.5em] uppercase italic opacity-40">
           GENESIS OPERATIONAL DIRECTIVE // NO AUTHENTICATION NO ACCESS
         </p>
      </div>
    </div>
  );
};

export default AuthScreen;
