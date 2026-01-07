
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
  Activity,
  Share2,
  CheckCircle2,
  Cpu,
  Volume2,
  VolumeX,
  Music4
} from 'lucide-react';

const SYNC_ENDPOINT = `https://jsonblob.com/api/jsonBlob/1344400262145327104`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [navigationStack, setNavigationStack] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [globalMesh, setGlobalMesh] = useState<GlobalMesh>({ commanders: [], signals: [] });
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequencerIntervalRef = useRef<number | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);

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

  const stopAudio = useCallback(() => {
    if (sequencerIntervalRef.current) {
      clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
    activeNodesRef.current.forEach(node => {
      try { (node as any).stop(); } catch (e) {}
    });
    activeNodesRef.current = [];
  }, []);

  const startPunkInstrumental = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const bpm = 165;
    const secondsPerBeat = 60 / bpm;
    const subdivision = secondsPerBeat / 2; // 8th notes
    let currentStep = 0;

    const bassScale = [41.20, 41.20, 48.99, 55.00, 36.71, 36.71, 43.65, 48.99]; // E1, B1, A1, D1 roughly
    const pattern = [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0];

    const playBassNote = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, time);
      filter.frequency.exponentialRampToValueAtTime(1000, time + 0.1);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + subdivision * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + subdivision);
      activeNodesRef.current.push(osc);
    };

    const playSnareHiss = (time: number) => {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(time);
      activeNodesRef.current.push(source);
    };

    sequencerIntervalRef.current = window.setInterval(() => {
      const startTime = ctx.currentTime + 0.1;
      if (pattern[currentStep % pattern.length]) {
        playBassNote(startTime, bassScale[Math.floor(currentStep / 4) % bassScale.length]);
      }
      if (currentStep % 2 === 0) {
        playSnareHiss(startTime);
      }
      currentStep++;
    }, subdivision * 1000);
  }, []);

  const toggleAudio = () => {
    if (isAudioActive) {
      stopAudio();
      setIsAudioActive(false);
    } else {
      startPunkInstrumental();
      setIsAudioActive(true);
      notify("PUNK PROTOCOL ENGAGED", "info");
    }
  };

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
    const cleanUrl = window.location.origin + window.location.pathname;
    const inviteText = `Commander ${userProfile.username} has initiated a Neural Uplink. Join the Genesis Mesh: ${cleanUrl}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mission Genesis: Neural Uplink', text: inviteText, url: cleanUrl });
      } else {
        await navigator.clipboard.writeText(inviteText);
        notify("UPLINK LINK COPIED TO CLIPBOARD", "success");
      }
    } catch (err) {}
  };

  const syncWithMesh = useCallback(async (forcePush = false) => {
    if (!isLoggedIn) return;
    setIsSyncing(true);
    try {
      const res = await fetch(SYNC_ENDPOINT);
      let data: GlobalMesh = res.ok ? await res.json() : { commanders: [], signals: [] };
      
      let updatedMesh = { ...data };
      const userIndex = updatedMesh.commanders.findIndex(c => c.id === userProfile.id);
      const userEntry: Player = { rank: 0, username: userProfile.username, xp: userXp, avatar: userProfile.avatar, id: userProfile.id, lastActive: Date.now() };

      let shouldPush = forcePush;
      if (userIndex === -1) { updatedMesh.commanders.push(userEntry); shouldPush = true; }
      else if (userXp > updatedMesh.commanders[userIndex].xp || updatedMesh.commanders[userIndex].username !== userProfile.username) {
        updatedMesh.commanders[userIndex] = userEntry; shouldPush = true;
      }

      if (shouldPush) {
        await fetch(SYNC_ENDPOINT, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedMesh) });
      }
      setGlobalMesh(updatedMesh);
    } catch (e) {} finally { setIsSyncing(false); }
  }, [isLoggedIn, userXp, userProfile]);

  const broadcastSignal = async (action: string) => {
    try {
      const res = await fetch(SYNC_ENDPOINT);
      const data: GlobalMesh = await res.json();
      const signal: NeuralSignal = { id: crypto.randomUUID(), commander: userProfile.username, action, timestamp: Date.now() };
      data.signals = [...(data.signals || []), signal].slice(-20);
      await fetch(SYNC_ENDPOINT, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
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
    const savedMissions = localStorage.getItem('mission_genesis_completed');
    if (savedMissions) { try { setCompletedMissions(JSON.parse(savedMissions)); } catch (e) {} }
  }, []);

  useEffect(() => { localStorage.setItem('mission_genesis_completed', JSON.stringify(completedMissions)); }, [completedMissions]);
  useEffect(() => { localStorage.setItem('mission_genesis_profile', JSON.stringify(userProfile)); }, [userProfile]);

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
    if (isAudioActive) stopAudio();
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
        case 'challenges': return <ChallengeScreen world={current.props.world} completedMissions={completedMissions} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onSelectChapter={(chapter) => setNavigationStack([...navigationStack, { screen: 'missions', props: { chapter } }])} />;
        case 'missions': return < MissionsScreen chapter={current.props.chapter} completedMissions={completedMissions} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onSelectMission={(mission) => setNavigationStack([...navigationStack, { screen: 'missionDetail', props: { mission } }])} />;
        case 'missionDetail': return <MissionDetailScreen mission={current.props.mission} isCompleted={completedMissions.includes(current.props.mission.id)} onComplete={(id, worldId) => handleMissionComplete(id, worldId)} onBack={() => setNavigationStack(navigationStack.slice(0, -1))} onReturnToOps={() => setNavigationStack([])} />;
        default: return null;
      }
    }

    switch (activeTab) {
      case 'home': return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => setNavigationStack([{ screen: 'challenges', props: { world } }])} isSyncing={isSyncing} />;
      case 'opportunities': return <OpportunitiesScreen />;
      case 'leaderboard': return <LeaderboardScreen userXp={userXp} userProfile={userProfile} meshCommanders={globalMesh.commanders} isSyncing={isSyncing} onRefresh={() => syncWithMesh(true)} onShareInvite={shareNeuralLink} />;
      case 'profile': return <ProfileScreen userXp={userXp} userLevel={userLevel} userProfile={userProfile} onUpdateProfile={(p) => setUserProfile({ ...userProfile, ...p })} completedMissions={completedMissions} onLogout={handleLogout} onShareInvite={shareNeuralLink} />;
      default: return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => setNavigationStack([{ screen: 'challenges', props: { world } }])} isSyncing={isSyncing} />;
    }
  };

  return (
    <div className="flex justify-center h-screen w-screen overflow-hidden bg-[#010409] text-white">
      <div className="w-full max-w-screen-xl h-screen flex flex-col relative border-x border-slate-800/40 bg-[#020617]/50">
        
        <header className="px-6 pt-10 pb-4 flex items-center justify-between z-50 shrink-0">
          {isLoggedIn ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                {navigationStack.length > 0 && (
                  <button onClick={() => setNavigationStack(navigationStack.slice(0, -1))} className="p-2 border rounded-xl transition-all bg-slate-900/60 border-slate-700 text-amber-500">
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div className="px-4 py-2 rounded-2xl border border-amber-500/40 bg-slate-900/60 flex items-center gap-3 shadow-lg">
                  <Zap size={16} className={`text-amber-500 fill-amber-500 ${isSyncing ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span className="font-tactical text-xs md:text-sm font-black tracking-tighter text-amber-500">
                    {userXp.toLocaleString()} XP • LVL {userLevel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleAudio}
                  className={`p-2.5 border rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 ${isAudioActive ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-900/60 border-slate-700 text-slate-500'}`}
                  title="Punk Uplink Instrumental"
                >
                  {isAudioActive ? <Music4 size={20} className="animate-spin" /> : <VolumeX size={20} />}
                  <span className="hidden sm:inline text-[9px] font-tactical font-black uppercase tracking-widest">{isAudioActive ? 'PUNK ON' : 'PUNK OFF'}</span>
                </button>
                <button 
                  onClick={shareNeuralLink}
                  className="hidden md:flex items-center gap-2 p-2.5 border rounded-xl transition-all shadow-lg active:scale-95 bg-slate-900/60 border-slate-700 text-amber-500"
                >
                  <Share2 size={20} />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-tactical font-black uppercase tracking-widest shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                   <Cpu size={10} className={isSyncing ? 'animate-spin' : ''} />
                   ENCRYPTED LINK: STABLE
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <h1 className="text-2xl font-tactical font-black text-amber-500 italic tracking-[0.2em]">MISSION GENESIS</h1>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={isLoggedIn ? 'pb-32' : 'pb-10'}>
            {renderScreen()}
          </div>
        </main>

        {notification && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-400">
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-tactical font-black text-[10px] tracking-widest uppercase ${
              notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-pulse" />}
              {notification.message}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg backdrop-blur-3xl border border-slate-700/50 bg-slate-950/80 rounded-3xl px-6 py-4 flex justify-between items-center z-50 shadow-3xl">
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
                  <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.6)] -translate-y-2' : 'hover:bg-slate-900/40'}`}>
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
