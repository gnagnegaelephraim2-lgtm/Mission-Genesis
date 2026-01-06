
import React, { useState } from 'react';
import { SKILLS } from '../constants';
import { Zap, Award, BarChart3, Star, ShieldCheck, LogOut, Edit3, Save, X } from 'lucide-react';

interface ProfileScreenProps {
  completedMissions: number[];
  userXp: number;
  userLevel: number;
  userProfile: { username: string; avatar: string };
  onUpdateProfile: (p: { username: string; avatar: string }) => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ completedMissions, userXp, userLevel, userProfile, onUpdateProfile, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(userProfile.username);
  const [editedAvatar, setEditedAvatar] = useState(userProfile.avatar);

  const handleSave = () => {
    onUpdateProfile({ username: editedUsername, avatar: editedAvatar });
    setIsEditing(false);
  };

  // Milestone mapping for badges
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
      {/* Header Profile Section */}
      <div className="dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 bg-slate-50 px-6 py-10 border-b dark:border-amber-500/20 border-slate-200 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 dark:bg-slate-800/50 bg-white border border-slate-200 dark:border-slate-700 hover:text-amber-500 text-slate-500 rounded-lg transition-all"
            title="Edit Profile"
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>
          <button 
            onClick={onLogout}
            className="p-2 dark:bg-slate-800/50 bg-white border border-slate-200 dark:border-slate-700 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
               <div className="w-full h-full rounded-full dark:bg-slate-900 bg-white flex items-center justify-center text-6xl border-4 dark:border-slate-950 border-white shadow-inner">
                  {isEditing ? (
                    <select 
                      value={editedAvatar} 
                      onChange={(e) => setEditedAvatar(e.target.value)}
                      className="bg-transparent border-none text-center cursor-pointer outline-none"
                    >
                      <option value="🦅">🦅</option>
                      <option value="🦁">🦁</option>
                      <option value="🐆">🐆</option>
                      <option value="🐘">🐘</option>
                      <option value="🦓">🦓</option>
                      <option value="🦒">🦒</option>
                    </select>
                  ) : userProfile.avatar}
               </div>
            </div>
            <div className="absolute -bottom-2 right-2 bg-purple-600 text-white font-tactical font-black text-[10px] px-3 py-1 rounded-full border-2 dark:border-slate-950 border-white shadow-lg tracking-widest italic">
              LEVEL {userLevel}
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <input 
                type="text" 
                value={editedUsername} 
                onChange={(e) => setEditedUsername(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-center font-tactical font-black uppercase text-xl text-white outline-none"
              />
              <button onClick={handleSave} className="p-2 bg-green-500 rounded-lg text-white shadow-lg"><Save size={18}/></button>
            </div>
          ) : (
            <h2 className="text-3xl font-tactical font-black dark:text-white text-slate-900 tracking-tighter uppercase italic mb-1">{userProfile.username}</h2>
          )}
          
          <div className="flex items-center gap-6 mt-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">XP SCORE</span>
                <div className="flex items-center gap-1 text-amber-500">
                   <Zap size={16} className="fill-amber-500" />
                   <span className="text-xl font-tactical font-black">
                     {userXp.toLocaleString()}
                   </span>
                </div>
             </div>
             <div className="w-[1px] h-10 bg-slate-800/20 dark:bg-slate-800"></div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-tactical font-black text-slate-500 tracking-widest uppercase">RANKING</span>
                <div className="flex items-center gap-1 dark:text-white text-slate-900">
                   <BarChart3 size={16} className="text-amber-500" />
                   <span className="text-xl font-tactical font-black">MESH</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Skill Passport Section */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award size={20} className="text-amber-500" />
          <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-widest italic">Skill Passport</h3>
        </div>

        <div className="space-y-6">
          {SKILLS.map((skill) => {
            // Dynamic progress based on missions (for demo purposes)
            const dynamicProgress = Math.min(Math.floor((completedMissions.length / 100) * 100), 100);
            return (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                     <span className="text-xl">{skill.icon}</span>
                     <span className="text-sm font-tactical font-black dark:text-white text-slate-700 uppercase">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className={`text-[9px] font-tactical font-black px-2 py-0.5 rounded border ${
                       dynamicProgress > 50 ? 'bg-amber-600/10 text-amber-600 border-amber-600/30' : 'bg-slate-300/10 text-slate-500 dark:text-slate-300 border-slate-300/30'
                     }`}>
                       {dynamicProgress > 80 ? 'Gold' : dynamicProgress > 40 ? 'Silver' : 'Bronze'}
                     </span>
                     <span className="text-xs font-tactical font-bold text-slate-400">{dynamicProgress}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      dynamicProgress > 50 ? 'bg-amber-600' : 'bg-slate-400 dark:bg-slate-300'
                    }`}
                    style={{ width: `${dynamicProgress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-10">
           <div className="dark:bg-slate-900 bg-slate-50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
              <div className="text-2xl font-tactical font-black dark:text-white text-slate-900">{completedMissions.length}</div>
              <div className="text-[9px] font-tactical font-black text-slate-500 tracking-widest uppercase mt-1">Missions Secured</div>
           </div>
           <div className="dark:bg-slate-900 bg-slate-50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
              <div className="text-2xl font-tactical font-black dark:text-white text-slate-900">{userLevel}</div>
              <div className="text-[9px] font-tactical font-black text-slate-500 tracking-widest uppercase mt-1">Tier Level</div>
           </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-10 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-amber-500" />
            <h3 className="text-xs font-tactical font-black text-amber-500 uppercase tracking-widest italic">Tactical Achievements</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {achievements.map((ach) => {
               const isUnlocked = completedMissions.length >= ach.milestone;
               return (
                 <div 
                   key={ach.id} 
                   title={ach.label + (isUnlocked ? '' : ` (Locked: Complete ${ach.milestone} Missions)`)}
                   className={`aspect-square rounded-xl p-0.5 transition-all duration-500 ${
                     isUnlocked 
                     ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg scale-100 hover:scale-110' 
                     : 'dark:bg-slate-900 bg-slate-100 border border-slate-200 dark:border-slate-800 opacity-30 grayscale scale-95'
                   }`}
                 >
                    <div className="w-full h-full dark:bg-slate-900 bg-white rounded-[10px] flex items-center justify-center">
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
