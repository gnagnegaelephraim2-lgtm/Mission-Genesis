
import React, { useMemo, useState, useEffect } from 'react';
import { Player } from '../types';
import { Trophy, Zap, Medal, RefreshCw, Loader2, Radio, Info, Activity, UserPlus, Users, Timer } from 'lucide-react';

interface LeaderboardScreenProps {
  userXp: number;
  userProfile: { username: string; avatar: string; id?: string };
  meshCommanders?: Player[];
  isSyncing?: boolean;
  onRefresh?: () => void;
  onShareInvite?: () => void;
}

const SURGE_INTERVAL = 15 * 60 * 1000; // 15 minutes
const RECRUIT_INTERVAL = 20 * 1000; // 20 seconds for new recruits

const generateSimulatedUsers = (count: number): Player[] => {
  const avatars = ['🦅', '🦁', '🐆', '🐘', '🦍', '🦓', '🦒', '🦏', '🐍', '🦎', '🐃', '🐾'];
  const prefixes = ['Node', 'Cipher', 'Alpha', 'Delta', 'Command', 'Grid', 'Nexus', 'Ghost', 'Zenith', 'Vector'];
  const suffixes = ['_X', 'Prime', 'Ops', 'Core', 'Mesh', '01', 'Tactical', 'Sync', 'Uplink', 'Void'];
  
  return Array.from({ length: count }).map((_, i) => ({
    rank: 0,
    username: `${prefixes[i % prefixes.length]}${suffixes[(i * 3) % suffixes.length]}_${100 + i}`,
    xp: Math.max(500, Math.floor(15000 * Math.pow(0.95, i))),
    avatar: avatars[i % avatars.length],
    id: `sim-${i}`,
    lastActive: Date.now() - (Math.random() * 3600000)
  }));
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ 
  userXp, 
  userProfile, 
  meshCommanders = [], 
  isSyncing = false,
  onRefresh,
  onShareInvite
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [simulatedPlayers, setSimulatedPlayers] = useState<Player[]>(() => generateSimulatedUsers(50));
  const [sessionRecruits, setSessionRecruits] = useState<Player[]>([]);
  const [nextSurgeTime, setNextSurgeTime] = useState(Date.now() + SURGE_INTERVAL);

  // Automated XP Growth Effect
  useEffect(() => {
    const surgeInterval = setInterval(() => {
      setSimulatedPlayers(prev => prev.map(p => ({
        ...p,
        xp: p.xp + Math.floor(Math.random() * 600) + 200,
        lastActive: Date.now()
      })));
      setNextSurgeTime(Date.now() + SURGE_INTERVAL);
    }, SURGE_INTERVAL);

    // 20-Second New User Recruitment
    const recruitmentInterval = setInterval(() => {
      const avatars = ['🐣', '🔥', '🛡️', '⚡', '🤖', '👾'];
      const prefixes = ['Newbie', 'Recruit', 'Agent', 'Static', 'Ghost'];
      const suffixes = ['99', '00', 'Alpha', 'Beta', 'X'];
      
      const newRecruit: Player = {
        rank: 0,
        username: `${prefixes[Math.floor(Math.random() * prefixes.length)]}_${suffixes[Math.floor(Math.random() * suffixes.length)]}_${Math.floor(Math.random() * 999)}`,
        xp: Math.floor(Math.random() * 500),
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        id: `rec-${Date.now()}`,
        lastActive: Date.now()
      };

      setSessionRecruits(prev => [newRecruit, ...prev].slice(0, 20));
    }, RECRUIT_INTERVAL);

    const clockInterval = setInterval(() => setCurrentTime(Date.now()), 1000);

    return () => {
      clearInterval(surgeInterval);
      clearInterval(recruitmentInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const formatTimeRemaining = (targetTime: number) => {
    const diff = Math.max(0, targetTime - currentTime);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dynamicPlayers = useMemo(() => {
    let pool = [...meshCommanders, ...simulatedPlayers, ...sessionRecruits];
    const uniquePoolMap = new Map<string, Player>();
    
    pool.forEach(p => { 
      if (p.id && p.id !== userProfile.id) {
        uniquePoolMap.set(p.id, p); 
      }
    });

    // Inject User (Strictly User Props, no auto-increase)
    uniquePoolMap.set(userProfile.id || 'current-user', {
      rank: 0, 
      username: userProfile.username, 
      xp: userXp, 
      avatar: userProfile.avatar, 
      isUser: true, 
      id: userProfile.id || 'current-user', 
      lastActive: Date.now()
    });

    return Array.from(uniquePoolMap.values())
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [userXp, userProfile, meshCommanders, simulatedPlayers, sessionRecruits]);

  const currentUser = dynamicPlayers.find(p => p.isUser);
  const userRank = currentUser?.rank || '-';
  const totalUsers = dynamicPlayers.length;

  return (
    <div className="p-4 sm:p-6 md:p-10 relative">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-left">
          <div className="flex items-center gap-3">
             <h2 className="text-4xl font-tactical font-black text-white tracking-tighter italic uppercase">Neural Ranks</h2>
             <div className={`px-3 py-1 rounded-lg border font-tactical font-black text-[10px] tracking-widest flex items-center gap-2 transition-colors duration-500 ${
               isSyncing ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
             }`}>
                <Radio size={12} className={isSyncing ? 'animate-pulse' : ''} />
                {isSyncing ? 'UPLINKING...' : 'MESH LIVE'}
             </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-500 text-xs font-tactical font-bold uppercase tracking-[0.2em] italic">
              Standing: <span className="text-white font-black italic">#{userRank} / {totalUsers}</span>
            </p>
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
               <Timer size={10} className="text-amber-500" />
               <span className="text-[9px] font-tactical font-black text-slate-400 uppercase tracking-widest">Next Surge: {formatTimeRemaining(nextSurgeTime)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={onShareInvite} className="flex-1 sm:flex-none bg-amber-500 text-slate-950 px-6 py-3 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] group">
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-tactical font-black uppercase tracking-widest">Recruit Squad</span>
          </button>
          <button onClick={onRefresh} disabled={isSyncing} className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group">
            {isSyncing ? <Loader2 size={18} className="animate-spin text-amber-500" /> : <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />}
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 overflow-hidden shadow-inner">
         <div className="flex items-center gap-2 shrink-0 border-r border-slate-800 pr-4">
            <Users size={16} className="text-amber-500" />
            <span className="text-[9px] font-tactical font-black text-amber-500 uppercase tracking-widest">Recruit Log</span>
         </div>
         <div className="flex gap-10 animate-[ticker-scroll_30s_linear_infinite] whitespace-nowrap">
            {sessionRecruits.map((p, i) => (
              <span key={i} className="text-[10px] font-mono text-slate-400">
                &gt; <span className="text-white font-black">{p.username}</span> ESTABLISHED UPLINK: <span className="text-emerald-500">LVL 0 [{p.xp} XP]</span>
              </span>
            ))}
         </div>
      </div>

      <div className="space-y-4 pb-24 relative max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        {dynamicPlayers.map((player) => {
          const isLive = player.lastActive && (Date.now() - (player.lastActive as number) < 600000);
          return (
            <div 
              key={player.id || player.username} 
              className={`flex items-center p-5 rounded-[2rem] border transition-all duration-500 group ${
                player.isUser 
                ? 'bg-amber-500/10 border-amber-500 shadow-xl scale-[1.01] z-10' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <div className="w-12 flex flex-col items-center shrink-0">
                {player.rank <= 3 ? (
                  <Medal size={28} className={`${
                    player.rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]' : 
                    player.rank === 2 ? 'text-slate-400' : 'text-amber-600'
                  } animate-pulse`} />
                ) : (
                  <span className="font-tactical font-black text-slate-600 text-lg">#{player.rank}</span>
                )}
              </div>
              <div className="relative mx-4 shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2 transition-all ${player.isUser ? 'bg-slate-950 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-slate-900 border-slate-800 group-hover:border-slate-500'}`}>
                  {player.avatar}
                </div>
                {isLive && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-tactical font-black text-base uppercase truncate ${player.isUser ? 'text-amber-500' : 'text-white'}`}>{player.username}</h3>
                  {player.isUser && <span className="text-[8px] px-2 py-0.5 bg-amber-500 text-slate-950 rounded-lg font-black uppercase tracking-tighter">ME</span>}
                  {player.xp === 0 && <span className="text-[8px] px-2 py-0.5 border border-emerald-500/40 text-emerald-500 rounded-lg font-black uppercase tracking-tighter animate-pulse">RECRUIT</span>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Zap size={12} className="text-amber-500 fill-amber-500" />
                  <span className={`text-[10px] font-bold ${player.isUser ? 'text-amber-600' : 'text-slate-400'} tracking-widest uppercase`}>{player.xp.toLocaleString()} XP ACHIEVED</span>
                </div>
              </div>
              <div className="hidden xs:block px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[9px] font-tactical font-black text-amber-500 tracking-widest uppercase shadow-inner">
                {player.isUser ? 'MANUAL' : 'AUTO-SYNC'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 border border-slate-800 rounded-[2rem] flex flex-col items-center gap-4 text-center bg-slate-900/40 shadow-sm">
         <Info size={24} className="text-slate-500" />
         <p className="text-[10px] font-tactical font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm">
           The <span className="text-amber-600 underline">Dynamic Grid</span> updates real-time. New recruits join every 20 seconds. Secure your lead through tactical missions.
         </p>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
