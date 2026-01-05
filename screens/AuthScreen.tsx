
import React, { useState, useEffect } from 'react';
import { Target, Mail, Chrome, Facebook, Instagram, Hash, MessageSquare, ShieldCheck, Activity, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

type AuthProvider = 'Google' | 'Facebook' | 'Instagram' | 'Discord' | 'Genesis';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false); // Defaulting to Signup as seen in screenshot
  const [syncing, setSyncing] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const startSocialAuth = (provider: AuthProvider) => {
    setActiveProvider(provider);
    setSyncing(true);
    setSyncProgress(0);
    setLogs([`INITIALIZING ${provider.toUpperCase()} UPLINK...`]);
  };

  useEffect(() => {
    if (syncing) {
      const logOptions = [
        "BYPASSING FIREWALLS...",
        "DECRYPTING AUTH TOKEN...",
        "SYNCING BIOMETRIC DATA...",
        "ESTABLISHING SECURE HANDSHAKE...",
        "VERIFYING OPERATIONAL STATUS...",
        "PROTOCOLS SYNCHRONIZED.",
      ];

      const interval = setInterval(() => {
        setSyncProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          
          if (prev < 20 && next >= 20) setLogs(l => [...l, logOptions[0]]);
          if (prev < 40 && next >= 40) setLogs(l => [...l, logOptions[1]]);
          if (prev < 60 && next >= 60) setLogs(l => [...l, logOptions[2]]);
          if (prev < 80 && next >= 80) setLogs(l => [...l, logOptions[3]]);
          if (prev < 95 && next >= 95) setLogs(l => [...l, logOptions[4]]);

          if (next >= 100) {
            clearInterval(interval);
            setLogs(l => [...l, logOptions[5]]);
            setTimeout(() => onLogin(), 600);
            return 100;
          }
          return next;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [syncing, onLogin]);

  if (syncing) {
    return (
      <div className="min-h-full flex flex-col bg-slate-950 items-center justify-center p-8 scanlines relative">
        <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none"></div>
        
        <div className="w-full max-w-xs space-y-8 relative z-10 text-center">
          <div className="relative inline-block">
             <div className="w-24 h-24 bg-slate-900 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
               <Loader2 size={40} className="text-amber-500 animate-spin" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-tactical font-black text-amber-500 text-xs">{syncProgress}%</span>
             </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-tactical font-black text-white italic tracking-tighter uppercase">
              {isLogin ? 'Linking' : 'Registering'} Account
            </h2>
            <p className="text-amber-500 font-tactical text-[10px] tracking-[0.3em] uppercase animate-pulse">
              SYNCING WITH {activeProvider?.toUpperCase()}...
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-left h-40 overflow-hidden relative">
             <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-300">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="font-mono text-[9px] text-slate-400 tracking-tight uppercase">{log}</span>
                  </div>
                ))}
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
          </div>

          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-300"
               style={{ width: `${syncProgress}%` }}
             ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-950 relative overflow-hidden p-8 justify-center scanlines">
      {/* Tactical Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none"></div>
      
      <div className="relative z-10 text-center mb-10 animate-in zoom-in fade-in duration-700">
        <h1 className="text-5xl font-tactical font-black text-amber-500 italic tracking-tighter leading-none mb-2 uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
          GENESIS
        </h1>
        <div className="flex items-center justify-center gap-2">
           <div className="h-[1px] w-12 bg-slate-800"></div>
           <p className="text-slate-500 font-tactical text-[9px] tracking-[0.4em] uppercase">Tactical Node V2.0.4</p>
           <div className="h-[1px] w-12 bg-slate-800"></div>
        </div>
      </div>

      <div className="w-full max-w-[360px] mx-auto space-y-6 relative z-10">
        {/* Tab Switcher */}
        <div className="bg-slate-900/40 border border-slate-800 p-1.5 rounded-2xl flex backdrop-blur-sm">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-tactical font-black text-[10px] tracking-widest transition-all duration-300 ${isLogin ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            UPLINK (LOGIN)
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-tactical font-black text-[10px] tracking-widest transition-all duration-300 ${!isLogin ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            PROTOCOL (SIGNUP)
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-tactical font-black text-slate-500 tracking-[0.2em] uppercase">OP-IDENTITY</label>
              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <input 
              type="email" 
              placeholder="commander@genesis.hub"
              className="w-full bg-slate-950/90 border border-slate-800/80 rounded-xl px-5 py-4 text-xs font-medium text-white/80 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner placeholder:text-slate-700"
            />
          </div>
          
          <div className="space-y-2 text-left">
             <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-tactical font-black text-slate-500 tracking-[0.2em] uppercase">ACCESS-HASH</label>
              <ShieldCheck size={12} className="text-slate-700" />
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-slate-950/90 border border-slate-800/80 rounded-xl px-5 py-4 text-xs font-medium text-white/80 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner placeholder:text-slate-700"
            />
          </div>
        </div>

        {/* Main Action Button */}
        <button 
          onClick={() => startSocialAuth('Genesis')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xl py-5 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer opacity-20 pointer-events-none"></div>
          <span className="relative uppercase tracking-widest">{isLogin ? 'INITIATE UPLINK' : 'ESTABLISH PROTOCOL'}</span>
        </button>

        {/* Social Sync Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-3 py-1 text-slate-500 font-tactical text-[9px] tracking-[0.3em] font-black uppercase border border-slate-800 rounded-lg">SOCIAL SYNC</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { id: 'Google', icon: Chrome },
            { id: 'Facebook', icon: Facebook },
            { id: 'Instagram', icon: Instagram },
            { id: 'Discord', icon: MessageSquare }
          ].map((provider) => (
            <button 
              key={provider.id}
              onClick={() => startSocialAuth(provider.id as AuthProvider)} 
              className="aspect-square bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-center hover:border-amber-500/40 hover:bg-slate-800/60 transition-all group shadow-lg active:scale-90"
              title={`Connect with ${provider.id}`}
            >
              <provider.icon size={22} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-slate-700 text-[10px] font-tactical font-bold leading-relaxed tracking-[0.3em] uppercase italic opacity-40">
        GENESIS OPERATIONAL DIRECTIVE
      </p>
    </div>
  );
};

export default AuthScreen;
