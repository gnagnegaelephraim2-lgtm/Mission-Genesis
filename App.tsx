
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
  Users,
  SkipForward,
  Headphones,
  VolumeX,
  Music
} from 'lucide-react';

const SYNC_ENDPOINT = `https://jsonblob.com/api/jsonBlob/1344400262145327104`;

// Audio Encoding/Decoding Utils
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
  const [claimedAchievements, setClaimedAchievements] = useState<number[]>([]);
  const [achievementBonusXp, setAchievementBonusXp] = useState<number>(0);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [globalMesh, setGlobalMesh] = useState<GlobalMesh>({ commanders: [], signals: [] });
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [trackId, setTrackId] = useState(1); 
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequencerIntervalRef = useRef<number | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const welcomePlayedRef = useRef(false);

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

  const playWelcomeMessage = useCallback(async () => {
    if (welcomePlayedRef.current) return;
    welcomePlayedRef.current = true;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: 'Welcome to Mission Genesis. The mesh is active. Good luck, Commander.' }] }],
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
        const ctx = getAudioContext();
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Welcome message failed", e);
    }
  }, [getAudioContext]);

  useEffect(() => {
    if (isLoggedIn) {
      // Trigger the welcome message exactly 2 seconds after the user gets in the app
      const timer = setTimeout(() => {
        playWelcomeMessage();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, playWelcomeMessage]);

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

  const stopAudio = useCallback(() => {
    if (sequencerIntervalRef.current) clearInterval(sequencerIntervalRef.current);
    sequencerIntervalRef.current = null;
    activeNodesRef.current.forEach(node => { try { (node as any).stop(); } catch (e) {} });
    activeNodesRef.current = [];
  }, []);

  const startProceduralRap = useCallback((seed: number) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    stopAudio();

    // UPGRADED VARIETY: Use seed to significantly shift musicality
    const bpm = 70 + ((seed * 17) % 55); 
    const secondsPerBeat = 60 / bpm;
    const subdivision = secondsPerBeat / 4; 
    let currentStep = 0;

    const rootFreqs = [32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 48.99, 51.91, 55.00, 58.27, 61.74];
    const root = rootFreqs[(seed * 7) % rootFreqs.length];
    
    // Different scales: Major, Minor, Phrygian, Dorian, Lydian, Blues
    const scaleTypes = [
      [1, 1.12, 1.26, 1.5, 1.68, 1.88, 2],
      [1, 1.12, 1.18, 1.5, 1.58, 1.78, 2],
      [1, 1.05, 1.18, 1.5, 1.58, 1.78, 2],
      [1, 1.12, 1.18, 1.5, 1.68, 1.78, 2],
      [1, 1.12, 1.26, 1.68, 1.5, 1.88, 2],
      [1, 1.2, 1.33, 1.41, 1.5, 1.78, 2]
    ];
    const baseScale = scaleTypes[seed % scaleTypes.length].map(v => root * v);

    const playKick = (time: number, accent = 1.0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150 + (seed % 50), time);
      osc.frequency.exponentialRampToValueAtTime(35 + (seed % 10), time + 0.2);
      gain.gain.setValueAtTime(0.5 * accent, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    };

    const playSnare = (time: number, accent = 1.0) => {
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * accent;
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000 + (seed * 10 % 1500), time);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2 * accent, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.25);
    };

    const playHiHat = (time: number, accent = false) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(10000 + (seed * 100 % 6000), time);
      gain.gain.setValueAtTime(accent ? 0.04 : 0.015, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    };

    const playSubBass = (time: number, freq: number, length: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = seed % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + length);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + length);
      activeNodesRef.current.push(osc);
    };

    sequencerIntervalRef.current = window.setInterval(() => {
      const startTime = ctx.currentTime + 0.05;
      
      // Seed-based rhythmic patterns
      const kickPattern = (seed % 3 === 0) 
        ? [1,0,0,1, 0,0,0,0, 1,0,1,0, 0,0,0,1]
        : (seed % 3 === 1)
          ? [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,1,0]
          : [1,0,1,0, 0,0,0,1, 0,1,0,0, 0,0,1,0];

      const snarePattern = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];

      if (kickPattern[currentStep % 16]) playKick(startTime, currentStep % 16 === 0 ? 1.3 : 0.8);
      if (snarePattern[currentStep % 16]) playSnare(startTime, 1.2);
      
      // Varied Hi-Hat patterns
      const hatMod = (seed % 4) + 1;
      if (currentStep % hatMod === 0) playHiHat(startTime, currentStep % (hatMod * 2) === 0);
      
      const bassTriggers = (seed % 2 === 0) ? [0, 6, 12] : [0, 4, 8, 12];
      if (bassTriggers.includes(currentStep % 16)) {
        const noteIdx = (Math.floor(currentStep / 16) + (seed % 5)) % baseScale.length;
        playSubBass(startTime, baseScale[noteIdx], secondsPerBeat * 0.9);
      }
      currentStep++;
    }, subdivision * 1000);
  }, [getAudioContext, stopAudio]);

  const toggleAudio = () => {
    if (isAudioActive) {
      stopAudio();
      setIsAudioActive(false);
      playInteractionSFX(300, 'sine', 0.2, 0.04);
    } else {
      setIsAudioActive(true);
      startProceduralRap(trackId);
      playInteractionSFX(800, 'square', 0.15, 0.04);
    }
  };

  const skipTrack = () => {
    // Cycle through 100 different procedural tracks
    const nextId = trackId >= 100 ? 1 : trackId + 1;
    setTrackId(nextId);
    if (isAudioActive) {
      startProceduralRap(nextId);
    }
    playInteractionSFX(1200, 'sine', 0.05, 0.03);
  };

  const userXp = useMemo(() => {
    const missionXp = completedMissions.reduce((total, id) => {
      const mission = MISSIONS.find(m => m.id === id);
      return total + (mission?.xp || 0);
    }, 0);
    return missionXp + achievementBonusXp;
  }, [completedMissions, achievementBonusXp]);

  const userLevel = Math.floor(userXp / 1000);

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

  useEffect(() => {
    const savedMissions = localStorage.getItem('mission_genesis_completed');
    if (savedMissions) setCompletedMissions(JSON.parse(savedMissions));
    
    const savedAchieved = localStorage.getItem('mission_genesis_claimed_achievements');
    if (savedAchieved) setClaimedAchievements(JSON.parse(savedAchieved));
    
    const savedBonus = localStorage.getItem('mission_genesis_achievement_bonus');
    if (savedBonus) setAchievementBonusXp(parseInt(savedBonus));
  }, []);

  useEffect(() => { 
    localStorage.setItem('mission_genesis_completed', JSON.stringify(completedMissions)); 
    localStorage.setItem('mission_genesis_claimed_achievements', JSON.stringify(claimedAchievements));
    localStorage.setItem('mission_genesis_achievement_bonus', achievementBonusXp.toString());
    localStorage.setItem('mission_genesis_profile', JSON.stringify(userProfile));
  }, [completedMissions, claimedAchievements, achievementBonusXp, userProfile]);

  const handleMissionComplete = (missionId: number, worldId: string) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
      syncWithMesh(true);
      playInteractionSFX(1200, 'square', 0.3, 0.04); 
    }
  };

  const handleClaimAchievement = (id: number, xpReward: number) => {
    if (!claimedAchievements.includes(id)) {
      setClaimedAchievements(prev => [...prev, id]);
      setAchievementBonusXp(prev => prev + xpReward);
      playInteractionSFX(1500, 'square', 0.5, 0.1);
      syncWithMesh(true);
      setNotification({ message: `Tactical Reward Claimed: +${xpReward} XP!`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleNextMission = useCallback((currentMissionId: number) => {
    const currentIndex = MISSIONS.findIndex(m => m.id === currentMissionId);
    const nextMission = MISSIONS[currentIndex + 1];
    if (nextMission) {
      setNavigationStack(prev => [...prev.slice(0, -1), { screen: 'missionDetail', props: { mission: nextMission } }]);
    } else {
      setNavigationStack([]); 
    }
  }, []);

  const renderScreen = () => {
    if (!isLoggedIn) {
      return showAuth ? <AuthScreen onLogin={() => { setIsLoggedIn(true); setShowAuth(false); localStorage.setItem('mission_genesis_logged_in', 'true'); }} /> : <LandingScreen onGetStarted={() => setShowAuth(true)} />;
    }
    
    if (navigationStack.length > 0) {
      const current = navigationStack[navigationStack.length - 1];
      switch (current.screen) {
        case 'challenges': return <ChallengeScreen world={current.props.world} completedMissions={completedMissions} onBack={() => { setNavigationStack(navigationStack.slice(0, -1)); }} onSelectChapter={(chapter) => { setNavigationStack([...navigationStack, { screen: 'missions', props: { chapter } }]); }} />;
        case 'missions': return < MissionsScreen chapter={current.props.chapter} completedMissions={completedMissions} onBack={() => { setNavigationStack(navigationStack.slice(0, -1)); }} onSelectMission={(mission) => { setNavigationStack([...navigationStack, { screen: 'missionDetail', props: { mission } }]); }} />;
        case 'missionDetail': return (
          <MissionDetailScreen 
            mission={current.props.mission} 
            isCompleted={completedMissions.includes(current.props.mission.id)} 
            onComplete={(id, worldId) => handleMissionComplete(id, worldId)} 
            onBack={() => { setNavigationStack(navigationStack.slice(0, -1)); }} 
            onReturnToOps={() => { setNavigationStack([]); }} 
            onNextMission={() => handleNextMission(current.props.mission.id)}
          />
        );
        default: return null;
      }
    }

    switch (activeTab) {
      case 'home': return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => { setNavigationStack([{ screen: 'challenges', props: { world } }]); }} isSyncing={isSyncing} />;
      case 'opportunities': return <OpportunitiesScreen />;
      case 'community': return <CommunityScreen userProfile={userProfile} userLevel={userLevel} onShareInvite={() => {}} />;
      case 'leaderboard': return <LeaderboardScreen userXp={userXp} userProfile={userProfile} meshCommanders={globalMesh.commanders} isSyncing={isSyncing} onRefresh={() => syncWithMesh(true)} onShareInvite={() => {}} />;
      case 'profile': return <ProfileScreen userXp={userXp} userLevel={userLevel} userProfile={userProfile} onUpdateProfile={(p) => setUserProfile({ ...userProfile, ...p })} completedMissions={completedMissions} claimedAchievements={claimedAchievements} onClaimAchievement={handleClaimAchievement} onLogout={() => { setIsLoggedIn(false); localStorage.removeItem('mission_genesis_logged_in'); }} onShareInvite={() => {}} />;
      default: return <HomeScreen completedMissions={completedMissions} signals={globalMesh.signals} onSelectWorld={(world) => { setNavigationStack([{ screen: 'challenges', props: { world } }]); }} isSyncing={isSyncing} />;
    }
  };

  return (
    <div className="flex justify-center h-screen w-screen overflow-hidden bg-[#010409] text-white font-inter">
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl bg-slate-900 border border-amber-500 text-amber-500 font-tactical font-black text-xs uppercase tracking-widest animate-in slide-in-from-top-4 shadow-2xl">
          {notification.message}
        </div>
      )}
      <div className="w-full h-screen flex flex-col relative bg-[#020617]/50 max-w-screen-2xl mx-auto border-x border-slate-800/40">
        <header className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-10 pb-4 flex items-center justify-between z-50 shrink-0">
          {isLoggedIn ? (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                {navigationStack.length > 0 && (
                  <button onClick={() => { setNavigationStack(navigationStack.slice(0, -1)); }} className="p-2 border rounded-xl bg-slate-900/60 border-slate-700 text-amber-500 active:scale-95 transition-all">
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                )}
                <div className="px-3 sm:px-4 py-2 rounded-2xl border border-amber-500/40 bg-slate-900/60 flex items-center gap-2 sm:gap-3 shadow-md whitespace-nowrap">
                  <Zap size={14} className={`text-amber-500 fill-amber-500 sm:w-4 sm:h-4 ${isSyncing ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span className="font-tactical text-[10px] sm:text-xs font-black text-amber-500">{userXp.toLocaleString()} XP • LVL {userLevel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleAudio} 
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 transition-all flex items-center gap-2 border rounded-xl shadow-lg active:scale-95 ${
                    isAudioActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-amber-500/20' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {isAudioActive ? <Headphones size={18} className="animate-pulse" /> : <Music size={18} />}
                  <span className="text-[9px] sm:text-[10px] font-tactical font-black uppercase tracking-widest hidden xs:inline">
                    {isAudioActive ? `BEAT #${trackId}` : 'RADIO OFF'}
                  </span>
                </button>
                {isAudioActive && (
                   <button 
                    onClick={skipTrack}
                    className="p-2 sm:p-2.5 bg-slate-900/80 border border-slate-800 text-amber-500 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                    title="Next Track"
                   >
                     <SkipForward size={18} />
                   </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center"><h1 className="text-xl sm:text-2xl font-tactical font-black text-amber-500 tracking-[0.2em]">MISSION GENESIS</h1></div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={isLoggedIn ? 'pb-32' : 'pb-10'}>{renderScreen()}</div>
        </main>

        {isLoggedIn && (
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg backdrop-blur-3xl border border-slate-700/50 bg-slate-950/80 rounded-3xl px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center z-50 shadow-3xl">
            {[ { id: 'home', icon: Home, label: 'Ops' }, { id: 'opportunities', icon: Briefcase, label: 'Growth' }, { id: 'community', icon: Users, label: 'Mesh' }, { id: 'leaderboard', icon: Trophy, label: 'Elite' }, { id: 'profile', icon: User, label: 'ID' } ].map((tab) => {
              const isActive = activeTab === tab.id && navigationStack.length === 0;
              return (
                <button key={tab.id} onClick={() => { setNavigationStack([]); setActiveTab(tab.id as TabType); }} className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>
                  <div className={`p-2 sm:p-3 rounded-2xl transition-all ${isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] -translate-y-1.5 sm:-translate-y-2' : 'hover:bg-slate-900/40'}`}><tab.icon size={20} strokeWidth={isActive ? 3 : 2} className="sm:w-5.5 sm:h-5.5" /></div>
                  <span className={`text-[7px] sm:text-[8px] uppercase font-tactical font-black tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
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
