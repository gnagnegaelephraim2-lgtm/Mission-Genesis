
import { World, Chapter, Mission, Opportunity, Player, SkillProgress } from './types';

export const WORLDS: World[] = [
  { id: 'physics', subject: 'PHYSICS', title: 'Power the Future', progress: 30, gradient: 'from-cyan-600 to-blue-900', icon: '⚡', color: '#06b6d4' },
  { id: 'biology', subject: 'BIOLOGY', title: 'Life Sustained', progress: 15, gradient: 'from-emerald-600 to-teal-900', icon: '🌿', color: '#10b981' },
  { id: 'mathematics', subject: 'MATH', title: 'Logic Gates', progress: 0, gradient: 'from-purple-600 to-indigo-900', icon: '∞', color: '#a855f7' },
  { id: 'chemistry', subject: 'CHEMISTRY', title: 'Molecular Purge', progress: 0, gradient: 'from-amber-500 to-orange-800', icon: '🧪', color: '#f59e0b' },
  { id: 'agriculture', subject: 'AGRI', title: 'Green Revolution', progress: 0, gradient: 'from-lime-600 to-green-900', icon: '🌾', color: '#84cc16' },
  { id: 'computer-science', subject: 'CS', title: 'Digital Frontiers', progress: 0, gradient: 'from-blue-500 to-indigo-900', icon: '💻', color: '#3b82f6' },
  { id: 'engineering', subject: 'ENG', title: 'Structure City', progress: 0, gradient: 'from-slate-500 to-slate-900', icon: '🏗️', color: '#64748b' },
  { id: 'robotics', subject: 'ROBOTICS', title: 'Mechanical Pulse', progress: 0, gradient: 'from-red-600 to-rose-900', icon: '🤖', color: '#e11d48' },
  { id: 'aerospace', subject: 'AERO', title: 'Beyond Clouds', progress: 0, gradient: 'from-sky-500 to-indigo-800', icon: '🚀', color: '#0ea5e9' },
  { id: 'medicine', subject: 'MEDICINE', title: 'Nano Healing', progress: 0, gradient: 'from-pink-500 to-rose-900', icon: '⚕️', color: '#f43f5e' },
  { id: 'creative-tech', subject: 'CREATIVE', title: 'Holo Arts', progress: 0, gradient: 'from-violet-600 to-fuchsia-900', icon: '🎨', color: '#8b5cf6' },
  { id: 'ecology', subject: 'ECOLOGY', title: 'Climate Guard', progress: 0, gradient: 'from-teal-500 to-emerald-900', icon: '🌍', color: '#14b8a6' },
  { id: 'economics', subject: 'ECON', title: 'Market Logic', progress: 0, gradient: 'from-emerald-400 to-cyan-800', icon: '📈', color: '#34d399' },
  { id: 'data-science', subject: 'DATA', title: 'Insight Engine', progress: 0, gradient: 'from-indigo-400 to-blue-900', icon: '📊', color: '#818cf8' },
  { id: 'ai', subject: 'AI', title: 'Neural Network', progress: 0, gradient: 'from-fuchsia-500 to-purple-950', icon: '🧠', color: '#d946ef' },
  { id: 'renewables', subject: 'ENERGY', title: 'Solar Harvest', progress: 0, gradient: 'from-yellow-400 to-orange-700', icon: '☀️', color: '#facc15' },
  { id: 'water', subject: 'WATER', title: 'Fluid Dynamics', progress: 0, gradient: 'from-blue-400 to-indigo-800', icon: '💧', color: '#60a5fa' },
  { id: 'urban', subject: 'URBAN', title: 'Metro Flow', progress: 0, gradient: 'from-zinc-500 to-slate-900', icon: '🏙️', color: '#a1a1aa' },
  { id: 'fintech', subject: 'FINTECH', title: 'Block Ledger', progress: 0, gradient: 'from-cyan-400 to-blue-950', icon: '💎', color: '#22d3ee' },
  { id: 'biotech', subject: 'BIOTECH', title: 'Gene Splice', progress: 0, gradient: 'from-emerald-500 to-teal-950', icon: '🧬', color: '#10b981' },
  { id: 'logistics', subject: 'LOGISTICS', title: 'Chain Link', progress: 0, gradient: 'from-orange-500 to-amber-900', icon: '📦', color: '#f97316' },
  { id: 'education', subject: 'EDTECH', title: 'Brain Uplink', progress: 0, gradient: 'from-blue-600 to-purple-800', icon: '📖', color: '#2563eb' },
  { id: 'telecom', subject: 'TELECOM', title: 'Signal Sky', progress: 0, gradient: 'from-rose-500 to-purple-900', icon: '📡', color: '#f43f5e' },
  { id: 'mining', subject: 'MINING', title: 'Deep Extract', progress: 0, gradient: 'from-amber-700 to-yellow-950', icon: '⛏️', color: '#b45309' },
  { id: 'marine', subject: 'MARINE', title: 'Abyssal Tech', progress: 0, gradient: 'from-blue-800 to-indigo-950', icon: '⚓', color: '#1e40af' },
  { id: 'sociology', subject: 'SOCIAL', title: 'Civic Mesh', progress: 0, gradient: 'from-pink-400 to-rose-900', icon: '🤝', color: '#f472b6' },
];

export const CHAPTERS: Record<string, Chapter[]> = WORLDS.reduce((acc, world) => {
  acc[world.id] = [{ id: `${world.id}-c1`, title: `${world.title} Phase 1`, status: 'Active', missionsCompleted: 0, totalMissions: 10, locked: false }];
  return acc;
}, {} as Record<string, Chapter[]>);

// Generate missions with varying counts per world
export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  // Varying mission counts: 1, 26, 54, and then cycling or using a default
  let count = 10;
  if (wIdx === 0) count = 1;
  else if (wIdx === 1) count = 26;
  else if (wIdx === 2) count = 54;
  else count = 15;

  return Array.from({ length: count }).map((_, mIdx) => ({
    id: (wIdx * 100) + mIdx + 1, // Unique ID across all worlds
    worldId: world.id,
    title: `${world.title} Module ${mIdx + 1}`,
    story: `Objective: Deploy STEM solutions in the ${world.subject} sector. Tactical analysis indicates critical needs in Sector ${mIdx + 1}.`,
    difficulty: mIdx % 3 === 0 ? 'Medium' : mIdx % 3 === 1 ? 'Hard' : 'Expert',
    xp: 650 + (mIdx * 100),
    locked: mIdx > 0, // In a real app, this logic would depend on completion
    bgGradient: world.gradient,
    completed: false,
    environment: `High-fidelity 3D simulation of ${world.subject} challenges.`
  }));
});

export const CHAPTER_MISSION_IDS: Record<string, number[]> = MISSIONS.reduce((acc, mission) => {
  const chapterId = `${mission.worldId}-c1`;
  if (!acc[chapterId]) acc[chapterId] = [];
  acc[chapterId].push(mission.id);
  return acc;
}, {} as Record<string, number[]>);

export const OPPORTUNITIES: Opportunity[] = [
  { id: 1, name: "YYAS", description: "Yale Young African Scholars Program", logo: "🎓", recommended: true, url: "https://africanscholars.yale.edu/" },
  { id: 2, name: "RISE Fellowship", description: "Global talent development program", logo: "🚀", recommended: true, url: "https://www.risefortheworld.org/" },
  { id: 3, name: "TechGirls", description: "Tech leadership for young women", logo: "💻", recommended: false, url: "https://www.techgirlsglobal.org/" },
  { id: 4, name: "YOSA", description: "Young Scientists Academy", logo: "🔬", recommended: true, url: "https://youngscientistsacademy.org/" },
  { id: 5, name: "African Science Academy", description: "Excellence in STEM education in Ghana", logo: "🌍", recommended: false, url: "https://www.africanscienceacademy.org/" }
];

export const TOP_PLAYERS: Player[] = [
  { rank: 1, username: "ChiemekaT", xp: 15420, avatar: "🦁" },
  { rank: 2, username: "AmaniK", xp: 14850, avatar: "🐘" },
  { rank: 3, username: "KoffiM", xp: 13900, avatar: "🐆" },
  { rank: 4, username: "ZuriA", xp: 12750, avatar: "🦓" },
  { rank: 5, username: "YouPlayer", xp: 11200, avatar: "🦅", isUser: true }
];

export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 62, badge: "Silver", icon: "🎯" },
  { skill: "Systems Thinker", progress: 40, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 12, badge: "Bronze", icon: "💡" }
];
