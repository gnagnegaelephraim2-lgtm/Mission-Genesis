
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
  Moon,
  Lock,
  UserPlus
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

  const userXp = useMemo(() => {
    const base = 2450;
    const earned = completedMissions.reduce((total, id) => {
      const mission = MISSIONS.find(m => m.id === id);
      return total + (mission?.xp || 0);
    }, 0);
    return base + earned;
  }, [completedMissions]);

  const userLevel = Math.floor(userXp / 1000) + 1;

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
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
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
        return <LeaderboardScreen userXp={userXp} userProfile={userProfile} />;
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
    <div className={`flex justify-center h-screen w-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'} transition-colors duration-500`}>
      <div className={`fixed inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] ${theme === 'light' ? 'invert' : ''}`}></div>
      
      {/* Container is fixed to viewport height (h-screen) to allow internal main area to scroll correctly */}
      <div className={`w-full max-w-screen-xl h-screen flex flex-col relative md:shadow-[0_0_100px_rgba(0,0,0,0.4)] overflow-hidden border-x ${theme === 'dark' ? 'bg-slate-950 border-slate-800/50' : 'bg-white border-slate-200'}`}>
        
        <header className={`px-4 md:px-10 pt-10 pb-4 flex items-center justify-between z-50 sticky top-0 transition-all shrink-0 ${theme === 'dark' ? 'bg-slate-950/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
          {isLoggedIn ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                {navigationStack.length > 0 && (
                  <button 
                    onClick={popScreen}
                    className={`p-2 border rounded-xl transition-all shadow-lg shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-amber-500 hover:bg-slate-700' : 'bg-white border-slate-200 text-amber-600 hover:bg-slate-100'}`}
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                )}
                <div className={`px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg group overflow-hidden border truncate shrink min-w-0 ${theme === 'dark' ? 'bg-slate-900 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-white border-amber-200'}`}>
                  <Zap size={16} className="text-amber-500 fill-amber-500 animate-pulse shrink-0" />
                  <span className={`font-tactical text-xs md:text-sm font-black tracking-tighter truncate ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`}>
                    {userXp.toLocaleString()} XP • LVL {userLevel}
                  </span>
                  <div className="absolute inset-0 shimmer opacity-20 group-hover:opacity-40 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <button 
                  onClick={toggleTheme}
                  className={`p-2.5 border rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative group hidden sm:block">
                  <div className={`p-2.5 border rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-100'}`}>
                    <Bell size={20} className={theme === 'dark' ? 'text-slate-400 group-hover:text-amber-500' : 'text-slate-500'} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-slate-950 animate-bounce"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Lock size={16} className="text-slate-950" strokeWidth={3} />
                 </div>
                 <h1 className="font-tactical font-black text-amber-500 text-lg tracking-tighter uppercase hidden xs:block">GENESIS</h1>
               </div>
               
               <div className="flex items-center gap-4">
                 <button 
                   onClick={toggleTheme}
                   className={`p-2.5 border rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                 >
                   {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                 </button>

                 {!showAuth && (
                   <button 
                     onClick={() => setShowAuth(true)}
                     className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-[10px] sm:text-xs px-6 py-2.5 rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center gap-2 group"
                   >
                     <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                     LOGIN / SIGNUP
                   </button>
                 )}
               </div>
            </div>
          )}
        </header>

        {/* The internal area now has overflow-y-auto to allow scrolling within the fixed-height container */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar relative`}>
          <div className={`${isLoggedIn ? 'pb-32' : 'pb-10'}`}>
            {renderScreen()}
          </div>
        </main>

        {isLoggedIn && (
          <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md md:max-w-lg backdrop-blur-2xl border rounded-3xl px-6 py-4 flex justify-between items-center z-50 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200/50'}`}>
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
                  className={`flex flex-col items-center gap-1 transition-all duration-300 relative group flex-1`}
                >
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.6)] -translate-y-3' 
                      : `${theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`
                  }`}>
                    <tab.icon size={24} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span className={`text-[10px] uppercase font-tactical font-black tracking-[0.2em] transition-opacity duration-300 whitespace-nowrap ${
                    isActive ? 'opacity-100 text-amber-500' : 'opacity-0'
                  }`}>
                    {tab.label}
                  </span>
                  {isActive && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_amber]"></div>}
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
