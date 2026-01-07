
import React, { useMemo } from 'react';
import { Player } from '../types';
import { Trophy, Zap, Medal, RefreshCw, Loader2, Radio, Info, Activity, UserPlus } from 'lucide-react';

interface LeaderboardScreenProps {
  userXp: number;
  userProfile: { username: string; avatar: string; id?: string };
  meshCommanders?: Player[];
  isSyncing?: boolean;
  onRefresh?: () => void;
  onShareInvite?: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ 
  userXp, 
  userProfile, 
  meshCommanders = [], 
  isSyncing = false,
  onRefresh,
  onShareInvite
}) => {
  const dynamicPlayers = useMemo(() => {
    const shadows: Player[] = [
      { rank: 0, username: 'Elite_Aria', xp: 12450, avatar: '🐆', id: 'shadow-1' },
      { rank: 0, username: 'Node_X', xp: 9800, avatar: '🐘', id: 'shadow-2' },
      { rank: 0, username: 'Cipher_01', xp: 7250, avatar: '🦁', id: 'shadow-3' }
    ];

    let pool = [...meshCommanders];
    const uniquePoolMap = new Map<string, Player>();
    pool.forEach(p => { if (p.id) uniquePoolMap.set(p.id, p); });

    uniquePoolMap.set(userProfile.id || 'current-user', {
      rank: 0, username: userProfile.username, xp: userXp, avatar: userProfile.avatar, isUser: true, id: userProfile.id || 'current-user', lastActive: Date.now()
    });

    shadows.forEach(s => { if (!uniquePoolMap.has(s.id!)) uniquePoolMap.set(s.id!, s); });
    return Array.from(uniquePoolMap.values()).sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));
  }, [userXp, userProfile, meshCommanders]);

  const currentUser = dynamicPlayers.find(p => p.isUser);
  const userRank = currentUser?.rank || '-';

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
          <p className="text-slate-500 text-xs font-tactical font-bold uppercase tracking-[0.2em] mt-2 italic">
            Global Standing: <span className="text-white font-black italic">Sector Rank #{userRank}</span>
          </p>
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

      <div className="space-y-4 pb-24 relative">
        {dynamicPlayers.map((player) => {
          const isShadow = player.id?.startsWith('shadow');
          const isLive = player.lastActive && (Date.now() - player.lastActive < 600000);
          return (
            <div 
              key={player.id || player.username} 
              className={`flex items-center p-5 rounded-[2rem] border transition-all duration-500 group ${
                player.isUser 
                ? 'bg-amber-500/10 border-amber-500 shadow-xl scale-[1.02] z-10' 
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
                {isLive && !isShadow && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-tactical font-black text-base uppercase truncate ${player.isUser ? 'text-amber-500' : 'text-white'}`}>{player.username}</h3>
                  {player.isUser && <span className="text-[8px] px-2 py-0.5 bg-amber-500 text-slate-950 rounded-lg font-black uppercase tracking-tighter">ME</span>}
                  {isShadow && <span className="text-[8px] px-2 py-0.5 border border-slate-700 text-slate-500 rounded-lg font-black uppercase tracking-tighter opacity-50">ELITE CORE</span>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Zap size={12} className="text-amber-500 fill-amber-500" />
                  <span className={`text-[10px] font-bold ${player.isUser ? 'text-amber-600' : 'text-slate-400'} tracking-widest uppercase`}>{player.xp.toLocaleString()} XP ACHIEVED</span>
                </div>
              </div>
              <div className="hidden xs:block px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[9px] font-tactical font-black text-slate-500 tracking-widest uppercase shadow-inner">
                {player.rank === 1 ? 'SUPREME' : player.rank <= 5 ? 'COMMAND' : 'TACTICAL'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 border border-slate-800 rounded-[2rem] flex flex-col items-center gap-4 text-center bg-slate-900/40 shadow-sm">
         <Info size={24} className="text-slate-500" />
         <p className="text-[10px] font-tactical font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm">
           Share your <span className="text-amber-600 underline">Neural Link</span> to bring your squad into the mesh. Compete real-time across global sectors.
         </p>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
