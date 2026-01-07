
import React, { useState, useMemo } from 'react';
import { CommunitySquad } from '../types';
import { Users, UserPlus, MessageSquare, Zap, Shield, Target, Activity, Share2, Info, ChevronRight, Hash, Flame } from 'lucide-react';

interface CommunityScreenProps {
  userProfile: { username: string; avatar: string };
  userLevel: number;
  onShareInvite?: () => void;
}

const DEFAULT_SQUADS: CommunitySquad[] = [
  { id: 's1', name: 'Nairobi Nexus', members: 124, goalXp: 500000, currentXp: 342000, icon: '🦁', status: 'Active' },
  { id: 's2', name: 'Lagos Logic', members: 89, goalXp: 400000, currentXp: 120000, icon: '🦅', status: 'Active' },
  { id: 's3', name: 'Cape Town Core', members: 212, goalXp: 1000000, currentXp: 890000, icon: '🐋', status: 'Active' },
  { id: 's4', name: 'Addis Automata', members: 45, goalXp: 300000, currentXp: 280000, icon: '🇪🇹', status: 'Active' },
  { id: 's5', name: 'Dakar Data', members: 0, goalXp: 500000, currentXp: 0, icon: '🇸🇳', status: 'Locked' },
];

const CommunityScreen: React.FC<CommunityScreenProps> = ({ userProfile, userLevel, onShareInvite }) => {
  const [activeSquad, setActiveSquad] = useState<string | null>(null);
  const [messages] = useState([
    { id: 1, user: 'Cipher_99', text: 'Joined the Nairobi Mesh. Ready for co-op logic nodes!', time: '2m' },
    { id: 2, user: 'Zenith_Ops', text: 'If you click my link in the Feed, you get a 2x Level Up multiplier.', time: '5m' },
    { id: 3, user: 'Node_X', text: 'Welcome new recruits! Solving challenges together boosts points by 1.5x.', time: '10m' },
  ]);

  return (
    <div className="p-4 sm:p-10 scanlines animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             <h2 className="text-3xl font-tactical font-black text-white tracking-tighter uppercase italic">Community Mesh Hub</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Collaborative Challenges & Discord-like Networking.</p>
        </div>

        <button 
          onClick={onShareInvite}
          className="flex items-center gap-3 bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-tactical font-black text-[10px] tracking-widest uppercase hover:bg-emerald-400 active:scale-95 transition-all shadow-xl"
        >
          <UserPlus size={16} />
          RECRUIT TO SQUAD (2X XP)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-32">
        {/* DISCORD-LIKE CHANNELS */}
        <div className="hidden lg:block space-y-4">
           <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-[10px] font-tactical font-black text-slate-500 uppercase tracking-widest mb-6">Neural Channels</h3>
              <div className="space-y-4">
                 {[
                   { icon: Hash, label: 'general-ops', active: true },
                   { icon: Hash, label: 'co-op-challenges', active: false },
                   { icon: Hash, label: 'scholarship-intel', active: false },
                   { icon: Hash, label: 'dev-logs', active: false },
                   { icon: Flame, label: 'high-tier-tactics', active: false },
                 ].map(ch => (
                   <div key={ch.label} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${ch.active ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}>
                      <ch.icon size={16} />
                      <span className="text-[11px] font-medium font-inter tracking-tight">#{ch.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* MAIN FEED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <Target size={18} className="text-amber-500" />
             <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-[0.3em]">Collaborative Challenges</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {DEFAULT_SQUADS.slice(0, 3).map((s) => (
              <div 
                key={s.id}
                className="p-6 rounded-[2.5rem] border bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 cursor-pointer shadow-xl transition-all group relative overflow-hidden"
                onClick={() => setActiveSquad(s.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <div>
                       <h4 className="text-xl font-tactical font-black text-white uppercase italic tracking-tighter">{s.name} Mission</h4>
                       <span className="text-[9px] font-tactical font-black text-emerald-500 uppercase tracking-widest">JOIN TO UPGRADE POINTS Faster</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
                    <Users size={12} className="text-slate-500" />
                    <span className="text-[10px] font-tactical font-black text-white">{s.members} OPS</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-tactical font-black text-slate-500 tracking-widest uppercase">
                    <span>GRID XP SYNC (1.5x ACTIVE)</span>
                    <span className="text-emerald-500">{Math.round((s.currentXp / s.goalXp) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(s.currentXp / s.goalXp) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR CHAT */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <MessageSquare size={18} className="text-amber-500" />
             <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-[0.3em]">Live Feed</h3>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-[2.5rem] flex flex-col h-[600px] shadow-inner relative overflow-hidden">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {messages.map(m => (
                <div key={m.id} className="animate-in slide-up fade-in duration-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">🤖</div>
                    <span className="text-[10px] font-tactical font-black text-amber-500 uppercase tracking-widest">{m.user}</span>
                  </div>
                  <div className="ml-7 text-[11px] text-slate-300 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 italic leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Broadcast Signal..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] text-white outline-none focus:border-amber-500 transition-all font-tactical uppercase tracking-widest"
              />
              <button className="p-3 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 active:scale-95 transition-all">
                <Zap size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityScreen;
