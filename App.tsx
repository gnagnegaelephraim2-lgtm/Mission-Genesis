
import React, { useState, useEffect, useMemo } from 'react';
import { TabType, World, Chapter, Mission } from './types';
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
  Bell, 
  Zap, 
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [navigationStack, setNavigationStack] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState({
    username: 'YouPlayer',
    avatar: '🦅'
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mission_genesis_logged_in') === 'true';
  });

  // Theme Sync
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Calculate current user XP dynamically based on actual mission values
  const userXp = useMemo(() => {
    const base = 2450;
    const earned = completedMissions.reduce((total, id) => {
      const mission = MISSIONS.find(m => m.id === id);
      return total + (mission?.xp || 0);
    }, 0);
    return base + earned;
  }, [completedMissions]);

  const userLevel = Math.floor(userXp / 1000) + 1;

  // Load state from localStorage on mount
  useEffect(() => {
    const savedMissions = localStorage.getItem('mission_genesis_completed');
    if (savedMissions) {
      try { setCompletedMissions(JSON.parse(savedMissions)); } catch (e) {}
    }
    const savedProfile = localStorage.getItem('mission_genesis_profile');
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } catch (e) {}
    }
    const savedTheme = localStorage.getItem('mission_genesis_theme');
    if (savedTheme) setTheme(savedTheme as 'dark' | 'light');
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('mission_genesis_completed', JSON.stringify(completedMissions));
  }, [completedMissions]);
  useEffect(() => {
    localStorage.setItem('mission_genesis_profile', JSON.stringify(userProfile));
  }, [userProfile]);
  useEffect(() => {
    localStorage.setItem('mission_genesis_theme', theme);
  }, [theme]);

  const handleMissionComplete = (missionId: number, worldId: string) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
    }
  };

  const pushScreen = (screen: string, props: any = {}) => {
    setNavigationStack([...navigationStack, { screen, props }]);
  };

  const popScreen = () => {
    setNavigationStack(navigationStack.slice(0, -1));
  };

  const returnToOps = () => {
    setNavigationStack([]);
    setActiveTab('home');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
    localStorage.setItem('mission_genesis_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAuth(false);
    localStorage.removeItem('mission_genesis_logged_in');
    setNavigationStack([]);
    setActiveTab('home');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (showAuth) {
        return <AuthScreen onLogin={handleLogin} />;
      }
      return <LandingScreen onGetStarted={() => setShowAuth(true)} />;
    }

    if (navigationStack.length > 0) {
      const current = navigationStack[navigationStack.length - 1];
      switch (current.screen) {
        case 'challenges':
          return <ChallengeScreen 
            world={current.props.world} 
            completedMissions={completedMissions}
            onBack={popScreen} 
            onSelectChapter={(chapter) => pushScreen('missions', { chapter })} 
          />;
        case 'missions':
          return <MissionsScreen 
            chapter={current.props.chapter} 
            completedMissions={completedMissions}
            onBack={popScreen} 
            onSelectMission={(mission) => pushScreen('missionDetail', { mission })} 
          />;
        case 'missionDetail':
          return <MissionDetailScreen 
            mission={current.props.mission} 
            isCompleted={completedMissions.includes(current.props.mission.id)}
            onComplete={(id, worldId) => handleMissionComplete(id, worldId)}
            onBack={popScreen} 
            onReturnToOps={returnToOps}
          />;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen 
          completedMissions={completedMissions}
          onSelectWorld={(world) => pushScreen('challenges', { world })} 
        />;
      case 'opportunities':
        return <OpportunitiesScreen />;
      case 'leaderboard':
        return <LeaderboardScreen userXp={userXp} />;
      case 'profile':
        return <ProfileScreen 
          userXp={userXp} 
          userLevel={userLevel}
          userProfile={userProfile}
          onUpdateProfile={(p) => setUserProfile(p)}
          completedMissions={completedMissions} 
          onLogout={handleLogout} 
        />;
      default:
        return <HomeScreen completedMissions={completedMissions} onSelectWorld={(world) => pushScreen('challenges', { world })} />;
    }
  };

  return (
    <div className={`flex justify-center min-h-screen ${theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-100'}`}>
      <div className={`fixed inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] ${theme === 'light' ? 'invert' : ''}`}></div>
      
      <div className={`w-full max-w-[448px] h-screen flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-x ${theme === 'dark' ? 'bg-slate-950 border-slate-800/50' : 'bg-white border-slate-200'}`}>
        
        {isLoggedIn && (
          <header className={`px-4 pt-10 pb-4 flex items-center justify-between z-50 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-transparent' : 'bg-gradient-to-b from-white via-slate-50 to-transparent'}`}>
            <div className="flex items-center gap-2">
              {navigationStack.length > 0 && (
                <button 
                  onClick={popScreen}
                  className={`p-1.5 border rounded-lg transition-all shadow-lg ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-amber-500 hover:bg-slate-700' : 'bg-white border-slate-200 text-amber-600 hover:bg-slate-100'}`}
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
              )}
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg group overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-white border-amber-200'}`}>
                <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                <span className={`font-tactical text-[11px] font-black tracking-tighter ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>
                  {userXp.toLocaleString()} XP • LVL {userLevel}
                </span>
                <div className="absolute inset-0 shimmer opacity-20 group-hover:opacity-40 pointer-events-none"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={`p-2 border rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative group">
                <div className={`p-2 border rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-100'}`}>
                  <Bell size={20} className={theme === 'dark' ? 'text-slate-400 group-hover:text-amber-500' : 'text-slate-500'} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-slate-950 animate-bounce"></span>
              </div>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto custom-scrollbar ${isLoggedIn ? 'pb-28' : ''} relative`}>
          {renderScreen()}
        </main>

        {isLoggedIn && (
          <nav className={`absolute bottom-6 left-6 right-6 backdrop-blur-2xl border rounded-2xl px-6 py-4 flex justify-between items-center z-50 shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200/50'}`}>
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
                  onClick={() => {
                    setNavigationStack([]);
                    setActiveTab(tab.id as TabType);
                  }}
                  className={`flex flex-col items-center gap-1 transition-all duration-300 relative group`}
                >
                  <div className={`p-2.5 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] -translate-y-2' 
                      : `${theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`
                  }`}>
                    <tab.icon size={22} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span className={`text-[9px] uppercase font-tactical font-black tracking-[0.2em] transition-opacity duration-300 ${
                    isActive ? 'opacity-100 text-amber-500' : 'opacity-0'
                  }`}>
                    {tab.label}
                  </span>
                  {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_5px_amber] text-amber-500"></div>}
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
