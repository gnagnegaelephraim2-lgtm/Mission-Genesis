
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
  Cpu,
  VolumeX,
  Music4,
  Users,
  SkipForward,
  SkipBack,
  Headphones,
  ListMusic,
  X
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
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequencerIntervalRef = useRef<number | null>(null);
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
    sequencerIntervalRef.current = null;
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

  /**
   * Procedural Rap Instrumentals
   * Each seed generates a unique BPM, Drum Pattern, Bassline, and Hi-Hat Groove.
   */
  const startProceduralRap = useCallback((seed: number) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Kill existing nodes
    activeNodesRef.current.forEach(node => { try { (node as any).stop(); } catch (e) {} });
    activeNodesRef.current = [];
    if (sequencerIntervalRef.current) clearInterval(sequencerIntervalRef.current);

    // BPM varies between 85 and 130 depending on seed
    const bpm = 85 + ((seed * 7) % 45); 
    const secondsPerBeat = 60 / bpm;
    const subdivision = secondsPerBeat / 4; // 16th notes
    let currentStep = 0;

    // Define unique scales per seed
    const rootFreqs = [32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 48.99, 51.91];
    const root = rootFreqs[seed % rootFreqs.length];
    const scaleTypes = [
      [1, 1.25, 1.5, 1.75], // Majorish
      [1, 1.18, 1.5, 1.68], // Minorish
      [1, 1.06, 1.41, 1.58], // Phrygian/Dark
      [1, 1.33, 1.5, 2.0],   // Suspended
    ];
    const baseScale = scaleTypes[seed % scaleTypes.length].map(v => root * v);
    
    // Drum Style: 0 = Boom Bap (Lazy), 1 = Trap (Fast), 2 = Industrial (Hard), 3 = Lo-fi (Soft)
    const drumStyle = seed % 4;
    const hiHatSwing = (seed % 10) / 100; // Micro-variation for groove

    const playKick = (time: number, accent = 1.0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
      gain.gain.setValueAtTime(0.4 * accent, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.2);
    };

    const playSnare = (time: number, accent = 1.0) => {
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * accent;
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(drumStyle === 3 ? 1800 : 1200, time);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(drumStyle === 3 ? 0.1 : 0.2, time);
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
      osc.type = drumStyle === 2 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(12000, time);
      gain.gain.setValueAtTime(accent ? 0.05 : 0.02, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    };

    const playSubBass = (time: number, freq: number, length: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + length);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + length);
      activeNodesRef.current.push(osc);
    };

    sequencerIntervalRef.current = window.setInterval(() => {
      const startTime = ctx.currentTime + 0.05;
      
      // Kick Patterns
      const kickPattern = seed % 3 === 0 ? [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0] : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0];
      if (kickPattern[currentStep % 16]) playKick(startTime, currentStep % 16 === 0 ? 1.2 : 1.0);

      // Snare Patterns
      if (currentStep % 16 === 8) playSnare(startTime);
      if (drumStyle === 1 && currentStep % 16 === 14 && (seed % 5 === 0)) playSnare(startTime, 0.5); // Ghost snare for Trap

      // Hi-Hat Logic
      const hiHatDensity = (seed % 4) === 0 ? 2 : (seed % 4) === 1 ? 4 : 1; 
      if (currentStep % hiHatDensity === 0) {
        const swungTime = startTime + (currentStep % 2 === 1 ? hiHatSwing : 0);
        playHiHat(swungTime, currentStep % 4 === 0);
      }

      // Bassline Logic - Randomized but seed-consistent
      const bassTriggers = [0, 6, 10, 13];
      if (bassTriggers.includes(currentStep % 16)) {
        const noteIdx = (Math.floor(currentStep / 16) + (seed % 4)) % baseScale.length;
        const note = baseScale[noteIdx];
        playSubBass(startTime, note, secondsPerBeat * (seed % 2 === 0 ? 1 : 0.5));
      }
      
      currentStep++;
    }, subdivision * 1000);
  }, [getAudioContext]);

  const handleNextBeat = useCallback(() => {
    const nextTrack = (trackId % 1000) + 1;
    setTrackId(nextTrack);
    playInteractionSFX(1000, 'square', 0.1, 0.03);
    if (isAudioActive) {
      startProceduralRap(nextTrack - 1);
      notify(`UPLINK ADVANCED: BEAT #${formatTrackNum(nextTrack)}`, "info");
    } else {
      notify(`QUEUE UPDATED: BEAT #${formatTrackNum(nextTrack)}`, "info");
    }
  }, [trackId, isAudioActive, startProceduralRap, playInteractionSFX]);

  const handlePrevBeat = useCallback(() => {
    const prevTrack = trackId === 1 ? 1000 : trackId - 1;
    setTrackId(prevTrack);
    playInteractionSFX(600, 'square', 0.1, 0.03);
    if (isAudioActive) {
      startProceduralRap(prevTrack - 1);
      notify(`UPLINK REVERSED: BEAT #${formatTrackNum(prevTrack)}`, "info");
    } else {
      notify(`QUEUE UPDATED: BEAT #${formatTrackNum(prevTrack)}`, "info");
    }
  }, [trackId, isAudioActive, startProceduralRap, playInteractionSFX]);

  const jumpToTrack = useCallback((id: number) => {
    setTrackId(id);
    setShowPlaylist(false);
    playInteractionSFX(1200, 'sine', 0.2, 0.05);
    if (isAudioActive) {
      startProceduralRap(id - 1);
      notify(`SYNCED TO BEAT #${formatTrackNum(id)}`, "info");
    } else {
      notify(`TRACK QUEUED: BEAT #${formatTrackNum(id)}`, "info");
    }
  }, [isAudioActive, startProceduralRap, playInteractionSFX]);

  const toggleAudio = () => {
    if (isAudioActive) {
      stopAudio();
      setIsAudioActive(false);
      playInteractionSFX(300, 'sine', 0.2, 0.04);
    } else {
      setIsAudioActive(true);
      startProceduralRap(trackId - 1);
      notify(`RAP UPLINK: BEAT #${formatTrackNum(trackId)}`, "info");
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
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                  <button 
                    onClick={handlePrevBeat}
                    className="p-2.5 text-slate-500 hover:text-amber-500 transition-all active:scale-95 border-r border-slate-800"
                    title="Previous Beat"
                  >
                    <SkipBack size={20} />
                  </button>
                  <button 
                    onClick={toggleAudio}
                    className={`p-2.5 transition-all flex items-center gap-2 active:scale-95 ${isAudioActive ? 'bg-amber-500 text-slate-950 border-x border-amber-600' : 'text-slate-500 hover:text-slate-300 border-x border-slate-800'}`}
                  >
                    {isAudioActive ? <Headphones size={20} className="animate-pulse" /> : <VolumeX size={20} />}
                    <span className="hidden lg:inline text-[9px] font-tactical font-black uppercase tracking-widest">{isAudioActive ? `BEAT #${formatTrackNum(trackId)}` : 'OFF'}</span>
                  </button>
                  <button 
                    onClick={handleNextBeat}
                    className="p-2.5 text-slate-500 hover:text-amber-500 transition-all active:scale-95 border-r border-slate-800"
                    title="Next Beat"
                  >
                    <SkipForward size={20} />
                  </button>
                  <button 
                    onClick={() => { setShowPlaylist(true); playInteractionSFX(800, 'sine', 0.1, 0.03); }}
                    className={`p-2.5 transition-all active:scale-95 ${showPlaylist ? 'text-amber-500' : 'text-slate-500 hover:text-white'}`}
                    title="Open Playlist"
                  >
                    <ListMusic size={20} />
                  </button>
                </div>

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

      {/* BEAT PLAYLIST DRAWER */}
      {showPlaylist && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowPlaylist(false)}></div>
           <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
                 <div className="flex items-center gap-4">
                    <Music4 size={28} className="text-amber-500" />
                    <div className="text-left">
                       <h3 className="text-2xl font-tactical font-black text-white italic uppercase tracking-tighter">BEAT GRID</h3>
                       <p className="text-[9px] font-tactical font-black text-slate-500 tracking-widest uppercase italic">1000 Procedural Uplinks</p>
                    </div>
                 </div>
                 <button onClick={() => setShowPlaylist(false)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-95">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 gap-3 custom-scrollbar">
                 {Array.from({ length: 1000 }).map((_, i) => {
                   const id = i + 1;
                   const isCurrent = id === trackId;
                   return (
                     <button
                       key={id}
                       onClick={() => jumpToTrack(id)}
                       className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all group ${
                         isCurrent 
                         ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                         : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-amber-500/40 hover:text-white'
                       }`}
                     >
                       <span className="text-[8px] font-tactical font-black uppercase opacity-60">BT</span>
                       <span className="text-sm font-tactical font-black italic">{id}</span>
                     </button>
                   );
                 })}
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950 text-center">
                 <p className="text-[10px] font-tactical font-black text-slate-600 uppercase tracking-widest leading-relaxed italic">
                    Sequential neural sync initialized. Select any node to immediately recalibrate the procedural uplift.
                 </p>
              </div>
           </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border backdrop-blur-xl z-[100] animate-in slide-in-from-top-4 ${notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-500'}`}>
           <span className="font-tactical font-black text-xs uppercase tracking-widest">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
