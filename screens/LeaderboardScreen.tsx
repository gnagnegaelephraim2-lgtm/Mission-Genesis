
import React, { useMemo } from 'react';
import { TOP_PLAYERS } from '../constants';
import { Trophy, Zap, Medal } from 'lucide-react';

interface LeaderboardScreenProps {
  userXp: number;
  userProfile: { username: string; avatar: string };
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ userXp, userProfile }) => {
  const dynamicPlayers = useMemo(() => {
    return [...TOP_PLAYERS]
      .map(p => p.isUser ? { ...p, xp: userXp, username: userProfile.username, avatar: userProfile.avatar } : p)
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [userXp, userProfile]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
           <h2 className="text-3xl font-tactical font-black text-white tracking-tighter italic uppercase truncate">Ranks</h2>
           <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] shrink-0">
              <Trophy size={14} />
              <span className="text-[10px] font-tactical font-black tracking-widest whitespace-nowrap">SEASON 1</span>
           </div>
        </div>
        <p className="text-slate-400 text-sm font-medium mt-2 break-words">Elite tactical performers in the region.</p>
      </div>

      <div className="space-y-3 pb-24">
        {dynamicPlayers.map((player) => (
          <div 
            key={player.username} 
            className={`flex items-center p-4 rounded-2xl border transition-all ${
              player.isUser 
              ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50' 
              : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="w-10 flex flex-col items-center shrink-0">
              {player.rank <= 3 ? (
                <Medal size={24} className={
                  player.rank === 1 ? 'text-yellow-400 fill-yellow-400/20' : 
                  player.rank === 2 ? 'text-slate-300 fill-slate-300/20' : 
                  'text-amber-600 fill-amber-600/20'
                } />
              ) : (
                <span className="font-tactical font-black text-slate-500">{player.rank}</span>
              )}
            </div>

            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl mx-3 shrink-0 border border-slate-700 shadow-inner">
              {player.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-tactical font-black text-sm uppercase truncate ${player.isUser ? 'text-amber-500' : 'text-white'}`}>
                {player.username}
                {player.isUser && <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded font-bold italic inline-block">YOU</span>}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap size={10} className="text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{player.xp.toLocaleString()} XP</span>
              </div>
            </div>

            <div className={`text-right ml-2 shrink-0 ${player.rank <= 3 ? 'scale-110' : ''}`}>
               <span className={`text-[10px] font-tactical font-black tracking-widest ${
                 player.rank === 1 ? 'text-yellow-400' :
                 player.rank === 2 ? 'text-slate-300' :
                 player.rank === 3 ? 'text-amber-600' :
                 'text-slate-600'
               }`}>
                 {player.rank === 1 ? 'ELITE-I' : player.rank === 2 ? 'ELITE-II' : player.rank === 3 ? 'ELITE-III' : 'RANKED'}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
