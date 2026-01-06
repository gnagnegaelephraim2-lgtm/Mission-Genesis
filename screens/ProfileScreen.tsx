
import React, { useState } from 'react';
import { SKILLS } from '../constants';
import { Zap, Award, BarChart3, Star, ShieldCheck, LogOut, Edit3, Save, X, Share2, Users } from 'lucide-react';

interface ProfileScreenProps {
  completedMissions: number[];
  userXp: number;
  userLevel: number;
  userProfile: { username: string; avatar: string };
  onUpdateProfile: (p: { username: string; avatar: string }) => void;
  onLogout: () => void;
  onShareInvite?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ completedMissions, userXp, userLevel, userProfile, onUpdateProfile, onLogout, onShareInvite }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(userProfile.username);
  const [editedAvatar, setEditedAvatar] = useState(userProfile.avatar);

  const handleSave = () => {
    onUpdateProfile({ username: editedUsername, avatar: editedAvatar });
    setIsEditing(false);
  };

  const achievements = [
    { id: 1, label: 'Protocol Established', milestone: 1 },
    { id: 2, label: 'Sector Secure', milestone: 5 },
    { id: 3, label: 'Master Commander', milestone: 10 },
    { id: 4, label: 'Neural Pioneer', milestone: 15 },
    { id: 5, label: 'Elite Problem Solver', milestone: 25 },
    { id: 6, label: 'System Architect', milestone: 40 },
    { id: 7, label: 'Innovation Lead', milestone: 60 },
    { id: 8, label: 'Genesis Legend', milestone: 100 },
  ];

  return (
    <div className="flex flex-col">
      <div className="bg-slate-900/40 px-6 py-10 border-b border-amber-500/20 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-slate-800/50 border border-slate-700 hover:text-amber-500 text-slate-500 rounded-lg transition-all">
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>
          <button onClick={onLogout} className="p-2 bg-slate-800/50 border border-slate-700 hover:text-red-500 text-slate-500 rounded-lg transition-all">
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
               <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-6xl border-4 border-slate-950 shadow-inner">
                  {isEditing ? (
                    <select value={editedAvatar} onChange={(e) => setEditedAvatar(e.target.value)} className="bg-transparent border-none text-center outline-none">
                      <option value="🦅">🦅</option>
                      <option value="🦁">🦁</option>
                      <option value="🐆">🐆</option>
                      <option value="🐘">🐘</option>
                    </select>
                  ) : userProfile.avatar}
               </div>
            </div>
            <div className="absolute -bottom-2 right-2 bg-amber-500 text-slate-950 font-tactical font-black text-[10px] px-3 py-1 rounded-full border-2 border-slate-950 shadow-lg tracking-widest italic">
              LVL {userLevel}
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-center font-tactical font-black uppercase text-xl text-white outline-none" />
              <button onClick={handleSave} className="p-2 bg-green-500 rounded-lg text-white"><Save size={18}/></button>
            </div>
          ) : (
            <h2 className="text-3xl font-tactical font-black text-white tracking-tighter uppercase italic mb-1">{userProfile.username}</h2>
          )}
          
          <div className="flex items-center gap-6 mt-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">XP SCORE</span>
                <div className="flex items-center gap-1 text-amber-500">
                   <Zap size={16} className="fill-amber-500" />
                   <span className="text-xl font-tactical font-black">{userXp.toLocaleString()}</span>
                </div>
             </div>
             <div className="w-[1px] h-10 bg-slate-800"></div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">MESH RANK</span>
                <div className="flex items-center gap-1 text-white">
                   <BarChart3 size={16} className="text-amber-500" />
                   <span className="text-xl font-tactical font-black">SYNCED</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 pb-32">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-amber-500" />
            <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-widest italic">Recruitment Protocol</h3>
          </div>
          <button 
            onClick={onShareInvite}
            className="w-full bg-slate-900/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col items-center gap-3 group hover:border-amber-500/50 transition-all shadow-xl active:scale-[0.98]"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Share2 size={24} />
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-tactical font-black text-white uppercase tracking-widest mb-1">Copy Neural Link</span>
              <span className="block text-[9px] font-medium text-slate-500 uppercase tracking-tighter">Bring your squad into the shared Genesis mesh</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Award size={20} className="text-amber-500" />
          <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-widest italic">Skill Passport</h3>
        </div>

        <div className="space-y-6">
          {SKILLS.map((skill) => {
            const dynamicProgress = Math.min(Math.floor((completedMissions.length / 50) * 100), 100);
            return (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                     <span className="text-xl">{skill.icon}</span>
                     <span className="text-sm font-tactical font-black text-white uppercase">{skill.skill}</span>
                  </div>
                  <span className="text-xs font-tactical font-bold text-slate-400">{dynamicProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${dynamicProgress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-amber-500" />
            <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-widest italic">Tactical Achievements</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {achievements.map((ach) => {
               const isUnlocked = completedMissions.length >= ach.milestone;
               return (
                 <div key={ach.id} className={`aspect-square rounded-xl p-0.5 transition-all ${isUnlocked ? 'bg-amber-500 shadow-lg scale-100' : 'bg-slate-900 opacity-20 scale-95'}`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <ShieldCheck size={24} className={isUnlocked ? 'text-amber-500' : 'text-slate-600'} />
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
