import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { TabType, World, Chapter, Mission, Player, NeuralSignal, GlobalMesh } from './types';
import HomeScreen from './screens/HomeScreen';
import OpportunitiesScreen from './screens/OpportunitiesScreen';
import CommunityScreen from './screens/CommunityScreen';
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
  VolumeX,
  Music4,
  Users,
  Volume2,
  Headphones
} from 'lucide-react';

const SYNC_ENDPOINT = `https://jsonblob.com/api/jsonBlob/1344400262145327104`;

// Audio Utils
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [navigationStack, setNavigationStack] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [globalMesh, setGlobalMesh] = useState<GlobalMesh>({ commanders: [], signals: [] });
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [trackId, setTrackId] = useState(1); 
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequencerIntervalRef = useRef<number | null>(null);
  const trackTimerRef = useRef<number | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const welcomePlayedRef = useRef(false);

  const formatTrackNum = (num: number) => {
    if (num < 10) return `000${num}`;
    if (num < 100) return `00${num}`;
    if (num < 1000) return `0${num}`;
    return `${num}`;
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('mission_genesis_profile');
    return saved ? JSON.parse(saved) : {
      username: 'Command' + Math.floor(Math.random() * 900 + 100),
      avatar: '🦅',
      id: crypto.randomUUID(),
      communityStatus: 'Member'
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mission_genesis_logged_in') === 'true';
  });

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  }, []);

  const playInteractionSFX = useCallback((freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.05) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    if (type === 'square') {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || target.closest('a') || target.getAttribute('role') === 'button';
      if (clickable) {
        playInteractionSFX(600, 'sine', 0.08, 0.03);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [playInteractionSFX]);

  const stopAudio = useCallback(() => {
    if (sequencerIntervalRef.current) clearInterval(sequencerIntervalRef.current);
    if (trackTimerRef.current) window.clearTimeout(trackTimerRef.current);
    sequencerIntervalRef.current = null;
    trackTimerRef.current = null;
    activeNodesRef.current.forEach(node => { try { (node as any).stop(); } catch (e) {} });
    activeNodesRef.current = [];
  }, []);

  const playWelcomeVoice = useCallback(async () => {
    if (welcomePlayedRef.current) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: 'Welcome to Mission Genesis. Neural uplink established.' }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        welcomePlayedRef.current = true;
      }
    } catch (e) {
      console.warn("TTS Welcome failed", e);
    }
  }, [getAudioContext]);

  const startProceduralRap = useCallback((seed: number) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    activeNodesRef.current.forEach(node => { try { (node as any).stop(); } catch (e) {} });
    activeNodesRef.current = [];
    if (sequencerIntervalRef.current) clearInterval(sequencerIntervalRef.current);

    const bpm = 92 + (seed % 10); // Standard chill rap BPM
    const secondsPerBeat = 60 / bpm;
    const subdivision = secondsPerBeat / 4; // 16th notes
    let currentStep = 0;

    // Harmonic Minor / Phrygian for dark rap vibes
    const scales = [
      [32.70, 34.65, 38.89, 43.65], // C Phrygian Low
      [36.71, 38.89, 43.65, 48.99], // D Phrygian Low
      [41.20, 43.65, 48.99, 55.00], // E Phrygian Low
    ];
    const bassScale = scales[seed % scales.length];
    
    const playKick = (time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.2);
    };

    const playSnare = (time: number) => {
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, time);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.15);
    };

    const playHiHat = (time: number, accent = false) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(10000, time);
      gain.gain.setValueAtTime(accent ? 0.04 : 0.02, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    };

    const playSubBass = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + secondsPerBeat * 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + secondsPerBeat);
      activeNodesRef.current.push(osc);
    };

    sequencerIntervalRef.current = window.setInterval(() => {
      const startTime = ctx.currentTime + 0.05;
      
      // Drum Pattern (Boom Bap / Trap hybrid)
      if (currentStep % 16 === 0 || currentStep % 16 === 10) playKick(startTime);
      if (currentStep % 16 === 8) playSnare(startTime);
      if (currentStep % 2 === 0) playHiHat(startTime, currentStep % 4 === 0);

      // Bassline logic
      if (currentStep % 8 === 0) {
        const note = bassScale[Math.floor((seed + currentStep) % 4)];
        playSubBass(startTime, note);
      }
      
      currentStep++;
    }, subdivision * 1000);
  }, [getAudioContext]);

  const cycleTrack = useCallback(() => {
    const nextTrack = (trackId % 1000) + 1;
    setTrackId(nextTrack);
    startProceduralRap(nextTrack - 1); 
    notify(`RAP ROTATION: BEAT #${formatTrackNum(nextTrack)}`, "info");

    const nextInterval = 20000; 
    if (trackTimerRef.current) window.clearTimeout(trackTimerRef.current);
    trackTimerRef.current = window.setTimeout(cycleTrack, nextInterval);
  }, [trackId, startProceduralRap]);

  const toggleAudio = () => {
    if (isAudioActive) {
      stopAudio();
      setIsAudioActive(false);
      playInteractionSFX(300, 'sine', 0.2, 0.04);
    } else {
      setIsAudioActive(true);
      startProceduralRap(trackId - 1);
      notify(`RAP UPLINK: BEAT #${formatTrackNum(trackId)}`, "info");
      
      const nextInterval = 20000; 
      if (trackTimerRef.current) window.clearTimeout(trackTimerRef.current);
      trackTimerRef.current = window.setTimeout(cycleTrack, nextInterval);

      playInteractionSFX(800, 'square', 0.15, 0.04);
    }
  };

  const userXp = useMemo(() => {
    return completedMissions.reduce((total, id) => {
      const mission = MISSIONS.find(m => m.id === id);
      const communityBonus = activeTab === 'community' ? 1.5 : 1.0; 
      return total + Math.floor((mission?.xp || 0) * communityBonus);
    }, 0);
  }, [completedMissions, activeTab]);

  const userLevel = Math.floor(userXp / 1000);

  const notify = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const shareNeuralLink = async () => {
    const cleanUrl = window.location.origin + window.location.pathname + '?ref=' + userProfile.id;
    const inviteText = `Commander ${userProfile.username} has initiated a Collaborative Neural Mesh. Join for 2x XP boost: ${cleanUrl}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Join Mission Genesis', text: inviteText, url: cleanUrl });
      else { await navigator.clipboard.writeText(inviteText); notify("COLLAB LINK COPIED", "success"); }
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
      if (userIndex === -1 || userXp > updatedMesh.commanders[userIndex].xp || forcePush) {
        if (userIndex === -1) updatedMesh.commanders.push(userEntry);
        else updatedMesh.commanders[userIndex] = userEntry;
        await fetch(SYNC_ENDPOINT, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedMesh) });
      }
      setGlobalMesh(updatedMesh);
    } catch (e) {} finally { setIsSyncing(false); }
  }, [isLoggedIn, userXp, userProfile]);

  const broadcastSignal = async (action: string) => {
    try {
      const res = await fetch(SYNC_ENDPOINT);
      const data: GlobalMesh = await res.json();
      data.signals = [...(data.signals || []), { id: crypto.randomUUID(), commander: userProfile.username, action, timestamp: Date.now() }].slice(-20);
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
    const saved = localStorage.getItem('mission_genesis_completed');
    if (saved) setCompletedMissions(JSON.parse(saved));
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ref')) {
      notify("UPLINK VIA REFERRAL: COMMUNITY BOOST ACTIVE", "success");
    }
  }, []);

  useEffect(() => { 
    localStorage.setItem('mission_genesis_completed', JSON.stringify(completedMissions)); 
    localStorage.setItem('mission_genesis_profile', JSON.stringify(userProfile));
  }, [completedMissions, userProfile]);

  const handleMissionComplete = (missionId: number, worldId: string) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
      broadcastSignal(`secured Sector ${worldId.toUpperCase()} Node`);
      notify(`NODE SECURED: +${MISSIONS.find(m => m.id === missionId)?.xp} XP`, "success");
      playInteractionSFX(1200, 'square', 0.3, 0.04); 
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
    localStorage.setItem('mission_genesis_logged_in', 'true');
    broadcastSignal(`established Neural Protocol`);
    syncWithMesh(true);
    playInteractionSFX(880, 'sine', 0.2, 0.05);
  };

  const handleLogout = () => {
    stopAudio();
    setIsLoggedIn(false);
    localStorage.removeItem('mission_genesis_logged_in');
    setNavigationStack([]);
    setActiveTab('home');
    playInteractionSFX(220, 'sine', 0.3, 0.05);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      return showAuth ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <LandingScreen 
          onGetStarted={() => {
            setShowAuth(true);
            playWelcomeVoice();
          }} 
        />
      );
    }
    
    if (navigationStack.length > 0) {
      const current = navigationStack[navigationStack.length - 1];
      switch (current.screen) {
        case 'challenges': return <ChallengeScreen world={current.props.world} completedMissions={completedMissions} onBack={() => { playInteractionSFX(300, 'sine', 0.1, 0.05); setNavigationStack(navigationStack.slice(0, -1)); }} onSelectChapter={(chapter) => { playInteractionSFX(800, 'sine', 0.1, 0.05); setNavigationStack([...navigationStack, { screen: 'missions', props: { chapter } }]); }} />;
        case 'missions': return < MissionsScreen chapter={current.props.chapter} completedMissions={completedMissions} onBack={() => { playInteractionSFX(300, 'sine', 0.1, 0.05); setNavigationStack(navigationStack.slice(0, -1)); }} onSelectMission={(mission) => { playInteractionSFX(900, 'sine', 0.1, 0.05); setNavigationStack([...navigationStack, { screen: 'missionDetail', props: { mission } }]); }} />;
        case 'missionDetail': return <MissionDetailScreen mission={current.props.mission} isCompleted={completedMissions.includes(current.props.mission.id)} onComplete={(id, worldId) => handleMissionComplete(id, worldId)} onBack={() => { playInteractionSFX(300, 'sine', 0.1, 0.05); setNavigationStack(navigationStack.slice(0, -1)); }} onReturnToOps={() => { playInteractionSFX(400, 'sine', 0.1, 0.05); setNavigationStack([]); }} />;
        default: return null;
      }
    }

    switch (activeTab) {
      case 'home': return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => { playInteractionSFX(700, 'sine', 0.1, 0.05); setNavigationStack([{ screen: 'challenges', props: { world } }]); }} isSyncing={isSyncing} />;
      case 'opportunities': return <OpportunitiesScreen />;
      case 'community': return <CommunityScreen userProfile={userProfile} userLevel={userLevel} onShareInvite={shareNeuralLink} />;
      case 'leaderboard': return <LeaderboardScreen userXp={userXp} userProfile={userProfile} meshCommanders={globalMesh.commanders} isSyncing={isSyncing} onRefresh={() => { playInteractionSFX(500, 'sine', 0.1, 0.05); syncWithMesh(true); }} onShareInvite={shareNeuralLink} />;
      case 'profile': return <ProfileScreen userXp={userXp} userLevel={userLevel} userProfile={userProfile} onUpdateProfile={(p) => setUserProfile({ ...userProfile, ...p })} completedMissions={completedMissions} onLogout={handleLogout} onShareInvite={shareNeuralLink} />;
      default: return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => { playInteractionSFX(700, 'sine', 0.1, 0.05); setNavigationStack([{ screen: 'challenges', props: { world } }]); }} isSyncing={isSyncing} />;
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
                  <button onClick={() => { playInteractionSFX(300, 'sine', 0.1, 0.05); setNavigationStack(navigationStack.slice(0, -1)); }} className="p-2 border rounded-xl bg-slate-900/60 border-slate-700 text-amber-500 active:scale-95 transition-all">
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div className="px-4 py-2 rounded-2xl border border-amber-500/40 bg-slate-900/60 flex items-center gap-3 shadow-md">
                  <Zap size={16} className={`text-amber-500 fill-amber-500 ${isSyncing ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span className="font-tactical text-xs font-black text-amber-500">{userXp.toLocaleString()} XP • LVL {userLevel}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleAudio}
                  className={`p-2.5 border rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95 ${isAudioActive ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-900/60 border-slate-700 text-slate-500'}`}
                >
                  {isAudioActive ? <Headphones size={20} className="animate-pulse" /> : <VolumeX size={20} />}
                  <span className="hidden lg:inline text-[9px] font-tactical font-black uppercase tracking-widest">{isAudioActive ? `RAP #${formatTrackNum(trackId)}` : 'UPLINK OFF'}</span>
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-tactical font-black uppercase tracking-widest">
                   <Cpu size={10} className={isSyncing ? 'animate-spin' : ''} />
                   SECURE LINK: STABLE
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <h1 className="text-2xl font-tactical font-black text-amber-500 tracking-[0.2em]">MISSION GENESIS</h1>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={isLoggedIn ? 'pb-32' : 'pb-10'}>
            {renderScreen()}
          </div>
        </main>

        {isLoggedIn && (
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg backdrop-blur-3xl border border-slate-700/50 bg-slate-950/80 rounded-3xl px-4 py-4 flex justify-between items-center z-50 shadow-3xl">
            {[
              { id: 'home', icon: Home, label: 'Ops' },
              { id: 'opportunities', icon: Briefcase, label: 'Growth' },
              { id: 'community', icon: Users, label: 'Mesh' },
              { id: 'leaderboard', icon: Trophy, label: 'Elite' },
              { id: 'profile', icon: User, label: 'ID' }
            ].map((tab) => {
              const isActive = activeTab === tab.id && navigationStack.length === 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    if (!isActive) {
                      playInteractionSFX(500 + (['home','opportunities','community','leaderboard','profile'].indexOf(tab.id) * 100), 'sine', 0.1, 0.04);
                      setNavigationStack([]); 
                      setActiveTab(tab.id as TabType); 
                    }
                  }}
                  className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-amber-500' : 'text-slate-500'}`}
                >
                  <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] -translate-y-2' : 'hover:bg-slate-900/40'}`}>
                    <tab.icon size={22} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span className={`text-[8px] uppercase font-tactical font-black tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border backdrop-blur-xl z-[100] animate-in slide-in-from-top-4 ${notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-500'}`}>
           <span className="font-tactical font-black text-xs uppercase tracking-widest">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
