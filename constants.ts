
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
  { id: 'health-science', subject: 'HEALTH', title: "Pulse Nexus", progress: 0, gradient: 'from-rose-500 to-rose-950', icon: '🧬', color: '#f43f5e' },
  { id: 'robotics', subject: 'BOTX', title: "Automata Grid", progress: 0, gradient: 'from-violet-600 to-purple-950', icon: '🤖', color: '#8b5cf6' },
  { id: 'architecture', subject: 'ARCHI', title: "Skyline Lattice", progress: 0, gradient: 'from-indigo-500 to-slate-900', icon: '🏛️', color: '#6366f1' },
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

const HEALTH_STORIES = [
  "Calibrate the neural link for the remote diagnostic nanobots in the Rift Valley clinic.",
  "Synthesize a localized vaccine derivative using regional botanical genetic markers.",
  "Optimize the decentralized bio-bank cooling systems using Peltier cooling arrays.",
  "Program the AI triage bot to prioritize critical metabolic signals in the central hub."
];

const BOTX_STORIES = [
  "Deploy a swarm of reforestation drones to replant indigenous seedlings across the Sahel.",
  "Re-calibrate the hydraulic actuators on the automated labor units in the mining sector.",
  "Optimize the pathfinding algorithms for the water-delivery bots in urban slums.",
  "Establish a secure neural link with the orbital relay to coordinate regional bot activities."
];

const ARCHI_STORIES = [
  "Design a passive cooling ventilation system for the neo-traditional marketplace.",
  "Calculate the structural load for the suspended vertical gardens in the central megalopolis.",
  "Optimize the solar-glass transparency on the skyline lattice to reduce internal heat gain.",
  "Blueprint a modular low-cost housing unit using carbon-sequestering building materials."
];

export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  let count = 10; 
  return Array.from({ length: count }).map((_, mIdx) => {
    const isPhysics = world.id === 'physics';
    const isHealth = world.id === 'health-science';
    const isBotx = world.id === 'robotics';
    const isArchi = world.id === 'architecture';

    let story = `Deploying to Sector ${world.subject}-${mIdx + 1}. Mission objective: Secure local ${world.subject.toLowerCase()} data nodes.`;
    let title = `${world.title} // Tactical Mod ${mIdx + 1}`;

    if (isPhysics && mIdx < PHYSICS_STORIES.length) {
      title = [`Vector Synthesis`, `Thermal Grid Alpha`, `Seismic Mesh`, `Cryo-Logic`, `Kinetic Flow`, `Signal Integrity`][mIdx];
      story = PHYSICS_STORIES[mIdx];
    } else if (isHealth && mIdx < HEALTH_STORIES.length) {
      title = [`Nano-Clinic Sync`, `Botanical Synthesis`, `Bio-Bank Ops`, `Triage Logic`][mIdx];
      story = HEALTH_STORIES[mIdx];
    } else if (isBotx && mIdx < BOTX_STORIES.length) {
      title = [`Dronestrike Flora`, `Actuator Sync`, `Pathfinder Alpha`, `Orbital Link`][mIdx];
      story = BOTX_STORIES[mIdx];
    } else if (isArchi && mIdx < ARCHI_STORIES.length) {
      title = [`Passive Vent Logic`, `Vertical Gravity`, `Solar Lattice`, `Carbon Blueprint`][mIdx];
      story = ARCHI_STORIES[mIdx];
    }

    return {
      id: (wIdx * 1000) + mIdx + 1,
      worldId: world.id,
      title,
      story,
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
  { id: 3, name: "YOSA", description: "Young Scientists Academy", logo: "🔬", recommended: true, url: "https://youngscientist.academy/" }
];

// Problem solving, System thinking, and Innovation defaulted to zero
export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
