
import { World, Chapter, Mission, Opportunity, Player, SkillProgress } from './types';

export const WORLDS: World[] = [
  { id: 'health-science', subject: 'HEALTH', title: "Pulse Nexus", progress: 0, gradient: 'from-rose-500 to-rose-950', icon: '🧬', color: '#f43f5e' },
  { id: 'env-science', subject: 'ENVIRON', title: "Gaia's Shield", progress: 0, gradient: 'from-teal-400 to-emerald-900', icon: '🌍', color: '#14b8a6' },
  { id: 'computer-science', subject: 'CS', title: 'Neural Mesh', progress: 0, gradient: 'from-blue-600 to-indigo-950', icon: '💻', color: '#3b82f6' },
  { id: 'physics', subject: 'PHYSICS', title: 'Kinetic Pulse', progress: 0, gradient: 'from-cyan-600 to-blue-900', icon: '⚡', color: '#06b6d4' },
  { id: 'biology', subject: 'BIOLOGY', title: 'Bio-Sustain Grid', progress: 0, gradient: 'from-emerald-600 to-teal-900', icon: '🌿', color: '#10b981' },
  { id: 'mathematics', subject: 'MATH', title: 'Prime Logic', progress: 0, gradient: 'from-purple-600 to-indigo-900', icon: '∞', color: '#a855f7' },
  { id: 'chemistry', subject: 'CHEMISTRY', title: 'Molecular Forge', progress: 0, gradient: 'from-amber-400 to-orange-700', icon: '🧪', color: '#f59e0b' },
  { id: 'agriculture', subject: 'AGRI', title: 'Verdant Sahel', progress: 0, gradient: 'from-lime-500 to-green-800', icon: '🌾', color: '#84cc16' },
  { id: 'engineering', subject: 'ENG', title: "Titan's Forge", progress: 0, gradient: 'from-slate-600 to-slate-900', icon: '🏗️', color: '#64748b' },
  { id: 'robotics', subject: 'BOTX', title: "Automata Grid", progress: 0, gradient: 'from-violet-600 to-purple-950', icon: '🤖', color: '#8b5cf6' },
  { id: 'architecture', subject: 'ARCHI', title: "Skyline Lattice", progress: 0, gradient: 'from-indigo-500 to-slate-900', icon: '🏛️', color: '#6366f1' },
  { id: 'astronomy', subject: 'SPACE', title: "Cosmic Grid", progress: 0, gradient: 'from-violet-900 to-slate-950', icon: '🔭', color: '#7c3aed' },
  { id: 'economics', subject: 'ECON', title: "Wealth Flow", progress: 0, gradient: 'from-emerald-500 to-teal-800', icon: '📊', color: '#10b981' },
  { id: 'energy', subject: 'ENERGY', title: "Volt Pulse", progress: 0, gradient: 'from-yellow-400 to-orange-900', icon: '🔋', color: '#fbbf24' },
  { id: 'marine-bio', subject: 'MARINE', title: "Abyssal Reef", progress: 0, gradient: 'from-blue-400 to-indigo-900', icon: '🐙', color: '#38bdf8' },
  { id: 'cyber-ops', subject: 'CYBER', title: "Sentinel Mesh", progress: 0, gradient: 'from-red-600 to-slate-950', icon: '🛡️', color: '#dc2626' },
  { id: 'nanotech', subject: 'NANO', title: "Atomic Sahel", progress: 0, gradient: 'from-fuchsia-600 to-purple-900', icon: '💎', color: '#d946ef' },
];

export const CHAPTERS: Record<string, Chapter[]> = WORLDS.reduce((acc, world) => {
  acc[world.id] = Array.from({ length: 15 }).map((_, i) => ({
    id: `${world.id}-p${i + 1}`,
    title: `${world.title} Phase ${i + 1}`,
    status: i === 0 ? 'Active' : 'Locked',
    missionsCompleted: 0,
    totalMissions: 5,
    locked: i > 0
  }));
  return acc;
}, {} as Record<string, Chapter[]>);

const MISSION_TITLES = ["Alpha Sync", "Beta Logic", "Gamma Mesh", "Delta Protocol", "Epsilon Core", "Zeta Uplink", "Eta Node", "Theta Pulse", "Iota Stream", "Sigma Secure"];

// Generate 5 missions for each of the 15 phases for all 17 worlds
// Total missions = 17 * 15 * 5 = 1275 missions
export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  return Array.from({ length: 15 }).flatMap((_, pIdx) => {
    return Array.from({ length: 5 }).map((__, mIdx) => {
      const globalMissionIdx = (pIdx * 5) + mIdx;
      const difficulty = pIdx < 5 ? 'Medium' : pIdx < 10 ? 'Hard' : 'Expert';
      const xpBase = difficulty === 'Medium' ? 800 : difficulty === 'Hard' ? 1600 : 2500;
      
      return {
        id: (wIdx * 10000) + (pIdx * 100) + mIdx + 1,
        worldId: world.id,
        title: `${MISSION_TITLES[globalMissionIdx % 10]} Mod-0${mIdx + 1}`,
        story: `Sector intelligence indicates tactical bottleneck at Phase ${pIdx + 1}, Tier ${mIdx + 1}. Resolve the ${world.subject} anomaly to ensure regional mesh stability.`,
        difficulty: difficulty as 'Medium' | 'Hard' | 'Expert',
        xp: xpBase + (pIdx * 100) + (mIdx * 50),
        locked: pIdx > 0 || mIdx > 0,
        bgGradient: world.gradient,
        completed: false,
        environment: `High-fidelity ${world.subject} tactical simulation Phase ${pIdx + 1}.`,
        type: (mIdx % 2 === 0) ? 'Rhythm' : 'Data-Stream'
      };
    });
  });
});

export const CHAPTER_MISSION_IDS: Record<string, number[]> = MISSIONS.reduce((acc, mission) => {
  // Determine which phase this mission belongs to
  const phaseIdx = Math.floor((mission.id % 10000) / 100);
  const chapterId = `${mission.worldId}-p${phaseIdx + 1}`;
  if (!acc[chapterId]) acc[chapterId] = [];
  acc[chapterId].push(mission.id);
  return acc;
}, {} as Record<string, number[]>);

export const OPPORTUNITIES: Opportunity[] = [
  { id: 1, name: "ALU", category: 'University', description: "African Leadership University - Leadership training in STEM and social impact.", logo: "🎓", recommended: true, url: "https://www.alueducation.com/" },
  { id: 2, name: "ALX Africa", category: 'Training', description: "Software engineering and data science training for Africa's top talent.", logo: "💻", recommended: true, url: "https://www.alxafrica.com/" },
  { id: 3, name: "Dell Young Leaders", category: 'Fellowship', description: "Support for high-potential students from low-income backgrounds.", logo: "💻", recommended: true, url: "https://www.dellyoungleaders.org/" },
  { id: 4, name: "Fulbright Africa", category: 'Fellowship', description: "Educational exchange program between Africa and the USA.", logo: "🗽", recommended: true, url: "https://fulbrightscholars.org/what-fulbright/opportunities" },
  { id: 5, name: "UCT Program", category: 'University', description: "University of Cape Town - Africa's highest-ranked research university.", logo: "🏗️", recommended: true, url: "https://www.uct.ac.za/" },
  { id: 101, name: "Makerere University", category: 'University', description: "Uganda's historical giant in medicine and social research.", logo: "🇺🇬", recommended: true, url: "https://www.mak.ac.ug/" },
  { id: 102, name: "University of Lagos", category: 'University', description: "Nigeria's hub for creative and tech-enabled business.", logo: "🇳🇬", recommended: true, url: "https://unilag.edu.ng/" },
  { id: 103, name: "University of Nairobi", category: 'University', description: "Kenya's leading institution for architectural and medical research.", logo: "🇰🇪", recommended: true, url: "https://uonbi.ac.ke/" },
  { id: 104, name: "Wits University", category: 'University', description: "Global leader in deep-level mining and tech innovation.", logo: "💎", recommended: true, url: "https://www.wits.ac.za/" },
  { id: 105, name: "Ashesi University", category: 'University', description: "Cultivating ethical leadership and critical thinking in Ghana.", logo: "🦁", recommended: true, url: "https://www.ashesi.edu.gh/" },
  { id: 201, name: "Mandela Rhodes", category: 'Fellowship', description: "Building exceptional leadership capacity in African graduates.", logo: "🦁", recommended: true, url: "https://mandelarhodes.org/" },
  { id: 202, name: "Mastercard Scholars", category: 'Fellowship', description: "Full scholarships for transformative leaders across Africa.", logo: "🤝", recommended: true, url: "https://mastercardfdn.org/" },
  { id: 301, name: "Moringa School", category: 'Training', description: "Market-aligned software engineering training in Kenya.", logo: "🌳", recommended: true, url: "https://moringaschool.com/" },
  { id: 330, name: "Zindi AI", category: 'Training', description: "The leading AI competition platform for Africa.", logo: "🏁", recommended: true, url: "https://zindi.africa/" },
  { id: 331, name: "Data Science Nigeria", category: 'Training', description: "Building a world-class AI ecosystem for impact.", logo: "🤖", recommended: true, url: "https://www.datasciencenigeria.org/" }
];

export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
