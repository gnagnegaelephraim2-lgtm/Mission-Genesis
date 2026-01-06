
import { World, Chapter, Mission, Opportunity, Player, SkillProgress } from './types';

export const WORLDS: World[] = [
  { id: 'computer-science', subject: 'CS', title: 'Neural Mesh', progress: 0, gradient: 'from-blue-600 to-indigo-950', icon: '💻', color: '#3b82f6' },
  { id: 'physics', subject: 'PHYSICS', title: 'Kinetic Pulse', progress: 0, gradient: 'from-cyan-600 to-blue-900', icon: '⚡', color: '#06b6d4' },
  { id: 'biology', subject: 'BIOLOGY', title: 'Bio-Sustain Grid', progress: 0, gradient: 'from-emerald-600 to-teal-900', icon: '🌿', color: '#10b981' },
  { id: 'mathematics', subject: 'MATH', title: 'Prime Logic', progress: 0, gradient: 'from-purple-600 to-indigo-900', icon: '∞', color: '#a855f7' },
  { id: 'chemistry', subject: 'CHEMISTRY', title: 'Molecular Forge', progress: 0, gradient: 'from-amber-400 to-orange-700', icon: '🧪', color: '#f59e0b' },
  { id: 'agriculture', subject: 'AGRI', title: 'Verdant Sahel', progress: 0, gradient: 'from-lime-500 to-green-800', icon: '🌾', color: '#84cc16' },
  { id: 'engineering', subject: 'ENG', title: "Titan's Forge", progress: 0, gradient: 'from-slate-600 to-slate-900', icon: '🏗️', color: '#64748b' },
  { id: 'env-science', subject: 'ENVIRON', title: "Gaia's Shield", progress: 0, gradient: 'from-teal-400 to-emerald-900', icon: '🌍', color: '#14b8a6' },
];

export const CHAPTERS: Record<string, Chapter[]> = WORLDS.reduce((acc, world) => {
  acc[world.id] = [{ id: `${world.id}-c1`, title: `${world.title} Phase 1`, status: 'Active', missionsCompleted: 0, totalMissions: 10, locked: false }];
  return acc;
}, {} as Record<string, Chapter[]>);

const PHYSICS_STORIES = [
  "Calculate the trajectory of a community water pump lever to maximize efficiency using torque principles.",
  "Optimize the solar array tilt for a village grid using thermal radiation and photon flux analysis.",
  "Deploy seismic sensors across the Rift Valley and interpret wave propagation to predict structural stress.",
  "Design a low-cost refrigeration unit using the Joule-Thomson effect for vaccine storage in remote zones.",
  "Stabilize the Kinetic Energy Recovery System (KERS) on local transport vehicles to reduce fuel drain.",
  "Analyze the electromagnetic interference patterns disrupting the regional education broadcasts."
];

export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  let count = 10; 
  return Array.from({ length: count }).map((_, mIdx) => {
    const isPhysics = world.id === 'physics';
    return {
      id: (wIdx * 1000) + mIdx + 1,
      worldId: world.id,
      title: isPhysics && mIdx < PHYSICS_STORIES.length 
        ? [`Vector Synthesis`, `Thermal Grid Alpha`, `Seismic Mesh`, `Cryo-Logic`, `Kinetic Flow`, `Signal Integrity`][mIdx] 
        : `${world.title} // Tactical Mod ${mIdx + 1}`,
      story: isPhysics && mIdx < PHYSICS_STORIES.length 
        ? PHYSICS_STORIES[mIdx] 
        : `Deploying to Sector ${world.subject}-${mIdx + 1}. Mission objective: Secure local ${world.subject.toLowerCase()} data nodes.`,
      difficulty: mIdx % 3 === 0 ? 'Medium' : mIdx % 3 === 1 ? 'Hard' : 'Expert',
      xp: 650 + (mIdx * 50),
      locked: mIdx > 0, 
      bgGradient: world.gradient,
      completed: false,
      environment: `Simulated high-fidelity ${world.subject} combat environment.`
    };
  });
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
  { id: 3, name: "YOSA", description: "Young Scientists Academy", logo: "🔬", recommended: true, url: "https://youngscientistsacademy.org/" }
];

// Problem solving, System thinking, and Innovation defaulted to zero
export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
