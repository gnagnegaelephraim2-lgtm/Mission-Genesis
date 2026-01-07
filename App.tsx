
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TabType, World, Chapter, Mission, Player, NeuralSignal, GlobalMesh } from './types';
import HomeScreen from './screens/HomeScreen';
import OpportunitiesScreen from './screens/OpportunitiesScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import MissionsScreen from './screens/MissionsScreen';
import MissionDetailScreen from './screens/MissionDetailScreen';
import AuthScreen from './screens/AuthScreen';
import LandingScreen from './screens/LandingScreen';
import { MISSIONS } from './constants';
import { 
  Home, 
  Briefcase, 
  Trophy, 
  User, 
  Zap, 
  ChevronLeft,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Activity,
  Share2,
  CheckCircle2
} from 'lucide-react';

// GLOBAL MESH ENDPOINT - Shared registry for all link users
const SYNC_ENDPOINT = `https://jsonblob.com/api/jsonBlob/1344400262145327104`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [navigationStack, setNavigationStack] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [globalMesh, setGlobalMesh] = useState<GlobalMesh>({ commanders: [], signals: [] });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const syncRetryRef = useRef(0);
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('mission_genesis_profile');
    return saved ? JSON.parse(saved) : {
      username: 'Command' + Math.floor(Math.random() * 900 + 100),
      avatar: '🦅',
      id: crypto.randomUUID()
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mission_genesis_logged_in') === 'true';
  });

  const userXp = useMemo(() => {
    return completedMissions.reduce((total, id) => {
      const mission = MISSIONS.find(m => m.id === id);
      return total + (mission?.xp || 0);
    }, 0);
  }, [completedMissions]);

  const userLevel = Math.floor(userXp / 1000);

  const notify = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const shareNeuralLink = async () => {
    // Normalize URL to strip session garbage and ensure friends land on the same mesh
    const cleanUrl = window.location.origin + window.location.pathname;
    const inviteText = `Commander ${userProfile.username} has initiated a Neural Uplink. Join the Genesis Mesh and secure your sector: ${cleanUrl}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mission Genesis: Neural Uplink',
          text: inviteText,
          url: cleanUrl,
        });
      } else {
        await navigator.clipboard.writeText(inviteText);
        notify("UPLINK LINK COPIED TO CLIPBOARD", "success");
      }
      broadcastSignal("generated a Recruitment Uplink");
    } catch (err) {
      notify("LINK SHARING INTERRUPTED", "info");
    }
  };

  const syncWithMesh = useCallback(async (forcePush = false) => {
    if (!isLoggedIn) return;
    setIsSyncing(true);
    
    try {
      const res = await fetch(SYNC_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
      });
      
      let data: GlobalMesh;
      if (res.status === 404 || !res.ok) {
        // Fallback for first-time initialization
        data = { commanders: [], signals: [] };
      } else {
        data = await res.json();
      }
      
      let updatedMesh = { ...data };
      if (!updatedMesh.commanders) updatedMesh.commanders = [];
      if (!updatedMesh.signals) updatedMesh.signals = [];
      
      const userIndex = updatedMesh.commanders.findIndex(c => c.id === userProfile.id);
      const userEntry: Player = {
        rank: 0, 
        username: userProfile.username,
        xp: userXp,
        avatar: userProfile.avatar,
        id: userProfile.id,
        lastActive: Date.now()
      };

      let shouldPush = forcePush;
      if (userIndex === -1) {
        updatedMesh.commanders.push(userEntry);
        shouldPush = true;
      } else {
        // Only push if local progress is ahead of global mesh
        if (userXp > updatedMesh.commanders[userIndex].xp || updatedMesh.commanders[userIndex].username !== userProfile.username) {
          updatedMesh.commanders[userIndex] = userEntry;
          shouldPush = true;
        }
      }

      if (shouldPush) {
        await fetch(SYNC_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMesh)
        });
      }

      setGlobalMesh(updatedMesh);
      setSyncError(false);
      syncRetryRef.current = 0;
    } catch (e) {
      syncRetryRef.current += 1;
      if (syncRetryRef.current > 3) setSyncError(true);
    } finally {
      setIsSyncing(false);
    }
  }, [isLoggedIn, userXp, userProfile]);

  const broadcastSignal = async (action: string) => {
    try {
      const res = await fetch(SYNC_ENDPOINT);
      const data: GlobalMesh = await res.json();
      const signal: NeuralSignal = {
        id: crypto.randomUUID(),
        commander: userProfile.username,
        action,
        timestamp: Date.now()
      };
      data.signals = [...(data.signals || []), signal].slice(-20);
      await fetch(SYNC_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setGlobalMesh(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (isLoggedIn) {
      syncWithMesh();
      const interval = setInterval(() => syncWithMesh(false), 20000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, syncWithMesh]);

  useEffect(() => {
    if (isLoggedIn && userXp > 0) {
      const timer = setTimeout(() => syncWithMesh(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [userXp, isLoggedIn, syncWithMesh]);

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [theme]);

  useEffect(() => {
    const savedMissions = localStorage.getItem('mission_genesis_completed');
    if (savedMissions) {
      try { setCompletedMissions(JSON.parse(savedMissions)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mission_genesis_completed', JSON.stringify(completedMissions));
  }, [completedMissions]);
  
  useEffect(() => {
    localStorage.setItem('mission_genesis_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleMissionComplete = (missionId: number, worldId: string) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
      broadcastSignal(`secured Sector ${worldId.toUpperCase()} Node`);
      notify(`NODE SECURED: +${MISSIONS.find(m => m.id === missionId)?.xp} XP`, "success");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
    localStorage.setItem('mission_genesis_logged_in', 'true');
    broadcastSignal(`established Neural Protocol`);
    syncWithMesh(true);
    notify("IDENTITY VERIFIED. MESH SYNCING...", "success");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('mission_genesis_logged_in');
    setNavigationStack([]);
    setActiveTab('home');
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (showAuth) return <AuthScreen onLogin={handleLogin} />;
      return <LandingScreen onGetStarted={() => setShowAuth(true)} />;
    }

    if (navigationStack.length > 0) {
      const current = navigationStack[navigationStack.length - 1];
      switch (current.screen) {
        case 'challenges':
          return <ChallengeScreen world={current.props.world} completedMissions={completedMissions} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onSelectChapter={(chapter) => setNavigationStack([...navigationStack, { screen: 'missions', props: { chapter } }])} />;
        case 'missions':
          return < MissionsScreen chapter={current.props.chapter} completedMissions={completedMissions} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onSelectMission={(mission) => setNavigationStack([...navigationStack, { screen: 'missionDetail', props: { mission } }])} theme={theme} />;
        case 'missionDetail':
          return <MissionDetailScreen mission={current.props.mission} isCompleted={completedMissions.includes(current.props.mission.id)} onComplete={(id, worldId) => handleMissionComplete(id, worldId)} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onReturnToOps={() => setNavigationStack([])} />;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => setNavigationStack([{ screen: 'challenges', props: { world } }])} isSyncing={isSyncing} theme={theme} />;
      case 'opportunities':
        return <OpportunitiesScreen />;
      case 'leaderboard':
        return <LeaderboardScreen userXp={userXp} userProfile={userProfile} meshCommanders={globalMesh.commanders} isSyncing={isSyncing} onRefresh={() => syncWithMesh(true)} onShareInvite={shareNeuralLink} />;
      case 'profile':
        return <ProfileScreen userXp={userXp} userLevel={userLevel} userProfile={userProfile} onUpdateProfile={(p) => setUserProfile({ ...userProfile, ...p })} completedMissions={completedMissions} onLogout={handleLogout} onShareInvite={shareNeuralLink} />;
      default:
        return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => setNavigationStack([{ screen: 'challenges', props: { world } }])} isSyncing={isSyncing} theme={theme} />;
    }
  };

  return (
    <div className={`flex justify-center h-screen w-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-300 text-slate-950'} transition-colors duration-500`}>
      <div className={`w-full max-w-screen-xl h-screen flex flex-col relative border-x ${theme === 'dark' ? 'bg-slate-950 border-slate-800/50' : 'bg-slate-200 border-slate-400 shadow-2xl'}`}>
        
        <header className="px-6 pt-10 pb-4 flex items-center justify-between z-50 shrink-0">
          {isLoggedIn ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                {navigationStack.length > 0 && (
                  <button onClick={() => setNavigationStack(navigationStack.slice(0, -1))} className={`p-2 border rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-amber-500' : 'bg-white border-slate-300 text-amber-600'}`}>
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 shadow-lg group relative ${theme === 'dark' ? 'bg-slate-900 border-amber-500/40' : 'bg-white border-amber-500/60'}`}>
                  <Zap size={16} className={`text-amber-500 fill-amber-500 ${isSyncing ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span className={`font-tactical text-xs md:text-sm font-black tracking-tighter ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>
                    {userXp.toLocaleString()} XP • LVL {userLevel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={shareNeuralLink}
                  className={`hidden md:flex items-center gap-2 p-2.5 border rounded-xl transition-all shadow-lg active:scale-95 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-amber-500' : 'bg-white border-slate-300 text-amber-600'}`}
                  title="Invite Squad"
                >
                  <Share2 size={20} />
                </button>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-tactical font-black uppercase tracking-widest transition-all duration-500 ${
                  syncError 
                  ? 'text-rose-500 border-rose-500/30 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                  : isSyncing 
                    ? 'text-amber-500 border-amber-500/30 bg-amber-500/5 animate-pulse' 
                    : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                }`}>
                  {syncError ? <WifiOff size={10} /> : <Wifi size={10} className={isSyncing ? 'animate-pulse' : ''} />}
                  SUB-SPACE LINK: {syncError ? 'OFFLINE' : isSyncing ? 'SYNCING...' : 'ONLINE'}
                </div>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2.5 border rounded-xl transition-all shadow-md ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-600'}`}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <h1 className="text-2xl font-tactical font-black text-amber-500 italic tracking-[0.2em]">MISSION GENESIS</h1>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={`${isLoggedIn ? 'pb-32' : 'pb-10'}`}>
            {renderScreen()}
          </div>
        </main>

        {notification && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-400">
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-tactical font-black text-[10px] tracking-widest uppercase ${
              notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-pulse" />}
              {notification.message}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg backdrop-blur-2xl border rounded-3xl px-6 py-4 flex justify-between items-center z-50 shadow-3xl ${theme === 'dark' ? 'border-slate-700/50 bg-slate-900/80' : 'border-slate-300 bg-white/90'}`}>
            {[
              { id: 'home', icon: Home, label: 'Ops' },
              { id: 'opportunities', icon: Briefcase, label: 'Growth' },
              { id: 'leaderboard', icon: Trophy, label: 'Elite' },
              { id: 'profile', icon: User, label: 'ID' }
            ].map((tab) => {
              const isActive = activeTab === tab.id && navigationStack.length === 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setNavigationStack([]); setActiveTab(tab.id as TabType); }}
                  className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-amber-500' : 'text-slate-500'}`}
                >
                  <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.6)] -translate-y-2' : theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
                    <tab.icon size={24} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span className={`text-[10px] uppercase font-tactical font-black tracking-[0.2em] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;
