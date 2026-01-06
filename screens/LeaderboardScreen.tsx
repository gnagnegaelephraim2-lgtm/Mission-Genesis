
import React, { useMemo } from 'react';
import { Player } from '../types';
// Added Radio to the imports from lucide-react
import { Trophy, Zap, Medal, RefreshCw, Loader2, Radio } from 'lucide-react';

interface LeaderboardScreenProps {
  userXp: number;
  userProfile: { username: string; avatar: string; id?: string };
  meshCommanders?: Player[];
  isSyncing?: boolean;
  onRefresh?: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ 
  userXp, 
  userProfile, 
  meshCommanders = [], 
  isSyncing = false,
  onRefresh
}) => {
  const dynamicPlayers = useMemo(() => {
    // Merge global commanders with the current user's latest stats
    const pool = [...meshCommanders];
    const userInMesh = pool.findIndex(c => c.id === userProfile.id);
    
    if (userInMesh === -1) {
      pool.push({
        rank: 0,
        username: userProfile.username,
        xp: userXp,
        avatar: userProfile.avatar,
        isUser: true,
        id: userProfile.id
      });
    } else {
      pool[userInMesh] = {
        ...pool[userInMesh],
        username: userProfile.username,
        xp: Math.max(pool[userInMesh].xp, userXp),
        avatar: userProfile.avatar,
        isUser: true
      };
    }

    return pool
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [userXp, userProfile, meshCommanders]);

  return (
    <div className="p-4 sm:p-6 md:p-10 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center justify-between gap-4">
             <h2 className="text-4xl font-tactical font-black text-white tracking-tighter italic uppercase truncate">Neural Ranks</h2>
             <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] shrink-0">
                <Trophy size={16} />
                <span className="text-[11px] font-tactical font-black tracking-widest whitespace-nowrap">GLOBAL NODE</span>
             </div>
          </div>
          <p className="text-slate-500 text-xs font-tactical font-bold uppercase tracking-[0.2em] mt-2 italic">Syncing with all Commanders on the Mesh.</p>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={isSyncing}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-white p-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-xl"
        >
          {isSyncing ? <Loader2 size={18} className="animate-spin text-amber-500" /> : <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />}
          <span className="text-[10px] font-tactical font-black uppercase tracking-widest">Manual Sync</span>
        </button>
      </div>

      <div className="space-y-4 pb-24 relative">
        {isSyncing && dynamicPlayers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-60">
             <Loader2 size={48} className="text-amber-500 animate-spin" />
             <span className="text-xs font-tactical font-black text-slate-500 tracking-[0.4em] uppercase">Intercepting Mesh Signals...</span>
          </div>
        )}

        {dynamicPlayers.map((player) => (
          <div 
            key={player.id || player.username} 
            className={`flex items-center p-5 rounded-[2rem] border transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in ${
              player.isUser 
              ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/50 scale-[1.02]' 
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-12 flex flex-col items-center shrink-0">
              {player.rank <= 3 ? (
                <Medal size={30} className={
                  player.rank === 1 ? 'text-yellow-400 fill-yellow-400/20 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 
                  player.rank === 2 ? 'text-slate-300 fill-slate-300/20' : 
                  'text-amber-600 fill-amber-600/20'
                } />
              ) : (
                <span className="font-tactical font-black text-slate-500 text-lg">{player.rank}</span>
              )}
            </div>

            <div className={`w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-3xl mx-4 shrink-0 border-2 shadow-inner transition-transform duration-500 ${player.isUser ? 'border-amber-500' : 'border-slate-700'}`}>
              {player.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-tactical font-black text-base sm:text-lg uppercase truncate ${player.isUser ? 'text-amber-500' : 'text-white'}`}>
                {player.username}
                {player.isUser && <span className="ml-2 text-[9px] px-2 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold italic inline-block">NODE: YOU</span>}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Zap size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap tracking-widest">{player.xp.toLocaleString()} XP DETECTED</span>
              </div>
            </div>

            <div className={`text-right ml-4 shrink-0 hidden xs:block`}>
               <div className={`px-4 py-2 rounded-xl border font-tactical font-black text-[9px] tracking-widest uppercase italic transition-colors ${
                 player.rank === 1 ? 'border-yellow-500/40 text-yellow-400 bg-yellow-400/5' :
                 player.rank === 2 ? 'border-slate-400/40 text-slate-400 bg-slate-400/5' :
                 player.rank === 3 ? 'border-amber-700/40 text-amber-600 bg-amber-600/5' :
                 'border-slate-800 text-slate-600'
               }`}>
                 {player.rank === 1 ? 'SUPREME' : player.rank === 2 ? 'ELITE-II' : player.rank === 3 ? 'ELITE-III' : 'STABLE'}
               </div>
            </div>
          </div>
        ))}
        
        {dynamicPlayers.length === 0 && !isSyncing && (
           <div className="text-center py-20 opacity-30">
              <Radio size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="font-tactical font-black text-xs uppercase tracking-widest">No Active Neural Signals Detected</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
