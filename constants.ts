
import { World, Chapter, Mission, Opportunity, Player, SkillProgress } from './types';

export const WORLDS: World[] = [
  { id: 'env-science', subject: 'ENVIRON', title: "Gaia's Shield", progress: 0, gradient: 'from-teal-400 to-emerald-900', icon: '🌍', color: '#14b8a6' },
  { id: 'computer-science', subject: 'CS', title: 'Neural Mesh', progress: 0, gradient: 'from-blue-600 to-indigo-950', icon: '💻', color: '#3b82f6' },
  { id: 'physics', subject: 'PHYSICS', title: 'Kinetic Pulse', progress: 0, gradient: 'from-cyan-600 to-blue-900', icon: '⚡', color: '#06b6d4' },
  { id: 'biology', subject: 'BIOLOGY', title: 'Bio-Sustain Grid', progress: 0, gradient: 'from-emerald-600 to-teal-900', icon: '🌿', color: '#10b981' },
  { id: 'mathematics', subject: 'MATH', title: 'Prime Logic', progress: 0, gradient: 'from-purple-600 to-indigo-900', icon: '∞', color: '#a855f7' },
  { id: 'chemistry', subject: 'CHEMISTRY', title: 'Molecular Forge', progress: 0, gradient: 'from-amber-400 to-orange-700', icon: '🧪', color: '#f59e0b' },
  { id: 'agriculture', subject: 'AGRI', title: 'Verdant Sahel', progress: 0, gradient: 'from-lime-500 to-green-800', icon: '🌾', color: '#84cc16' },
  { id: 'engineering', subject: 'ENG', title: "Titan's Forge", progress: 0, gradient: 'from-slate-600 to-slate-900', icon: '🏗️', color: '#64748b' },
  { id: 'health-science', subject: 'HEALTH', title: "Pulse Nexus", progress: 0, gradient: 'from-rose-500 to-rose-950', icon: '🧬', color: '#f43f5e' },
  { id: 'robotics', subject: 'BOTX', title: "Automata Grid", progress: 0, gradient: 'from-violet-600 to-purple-950', icon: '🤖', color: '#8b5cf6' },
  { id: 'architecture', subject: 'ARCHI', title: "Skyline Lattice", progress: 0, gradient: 'from-indigo-500 to-slate-900', icon: '🏛️', color: '#6366f1' },
];

export const CHAPTERS: Record<string, Chapter[]> = WORLDS.reduce((acc, world) => {
  acc[world.id] = [{ id: `${world.id}-c1`, title: `${world.title} Phase 1`, status: 'Active', missionsCompleted: 0, totalMissions: 10, locked: false }];
  return acc;
}, {} as Record<string, Chapter[]>);

const REAL_WORLD_SCENARIOS: Record<string, string[]> = {
  'env-science': [
    "Deploy IoT flood-warning sensors in the Limpopo basin to prevent seasonal devastation.",
    "Develop a carbon-credit verification mesh for community-led reforestation in the Congo Basin.",
    "Expert Protocol: Design a decentralized desalination grid for drought-stricken coastal regions."
  ],
  'computer-science': [
    "Audit the smart-contract logic for a cross-border mobile money insurance protocol.",
    "Scale a low-bandwidth NLP model for localized African languages in remote educational hubs.",
    "Expert Protocol: Engineer a quantum-resistant encryption layer for the pan-African central bank mesh."
  ],
  'physics': [
    "Optimize solar-thermal concentrated power yields in the Karoo semi-desert grid.",
    "Calculate the fluid dynamics for a modular micro-hydro generator in rural river systems.",
    "Expert Protocol: Develop a plasma-based waste-to-energy conversion system for mega-cities."
  ],
  'agriculture': [
    "Deploy multi-spectral drone analysis to detect locust breeding grounds in the Horn of Africa.",
    "Design an automated hydroponic system utilizing recycled wastewater for urban vertical farms.",
    "Expert Protocol: Architect a climate-resilient seed bank using deep-freeze thermal logic."
  ]
};

export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  return Array.from({ length: 10 }).map((_, mIdx) => {
    const difficulty = mIdx < 4 ? 'Medium' : mIdx < 7 ? 'Hard' : 'Expert';
    const xp = (difficulty === 'Medium' ? 800 : difficulty === 'Hard' ? 1600 : 2500) + (mIdx * 50);

    const worldScenarios = REAL_WORLD_SCENARIOS[world.id];
    let story = `Simulating Sector ${world.subject} challenge ${mIdx + 1}. Resolve regional technical bottlenecks.`;
    let title = `${world.title} // Mod 0${mIdx + 1}`;

    if (worldScenarios) {
      const scenarioIdx = difficulty === 'Medium' ? 0 : difficulty === 'Hard' ? 1 : 2;
      story = worldScenarios[scenarioIdx];
      title = ["Alpha Sync", "Beta Logic", "Gamma Mesh", "Delta Protocol", "Epsilon Core", "Zeta Uplink", "Eta Node", "Theta Pulse", "Iota Stream", "Sigma Secure"][mIdx];
    }

    return {
      id: (wIdx * 1000) + mIdx + 1,
      worldId: world.id,
      title,
      story,
      difficulty: difficulty as 'Medium' | 'Hard' | 'Expert',
      xp,
      locked: mIdx > 0, 
      bgGradient: world.gradient,
      completed: false,
      environment: `High-fidelity ${world.subject} tactical simulation.`,
      type: (mIdx % 2 === 0) ? 'Rhythm' : 'Data-Stream'
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
  { id: 1, name: "ALU", category: 'University', description: "African Leadership University - Innovative leadership training in STEM and social impact.", logo: "🎓", recommended: true, url: "https://www.alueducation.com/" },
  { id: 2, name: "ALX Africa", category: 'Training', description: "Elite software engineering and data science training for Africa's top talent.", logo: "💻", recommended: true, url: "https://www.alxafrica.com/" },
  { id: 3, name: "ALCHE", category: 'University', description: "African Leadership College - Specialized undergraduate programmes for global leaders.", logo: "🏛️", recommended: true, url: "https://alcheducation.com/undergraduate-programmes/" },
  { id: 4, name: "UCT Program", category: 'University', description: "University of Cape Town - Consistently ranked as the top university on the continent.", logo: "🏗️", recommended: true, url: "https://www.uct.ac.za/" },
  { id: 5, name: "YYAS", category: 'Fellowship', description: "Yale Young African Scholars - Intensive academic and mentorship program.", logo: "🏫", recommended: false, url: "https://africanscholars.yale.edu/" },
  { id: 6, name: "Ashesi University", category: 'University', description: "Cultivating ethical leadership and critical thinking in West Africa.", logo: "🦁", recommended: true, url: "https://www.ashesi.edu.gh/" },
  { id: 7, name: "AIMS", category: 'University', description: "African Institute for Mathematical Sciences - Post-graduate excellence in math/physics.", logo: "∞", recommended: true, url: "https://nexteinstein.org/" },
  { id: 8, name: "MEST Africa", category: 'Training', description: "Pan-African tech entrepreneurship training and seed funding hub.", logo: "🚀", recommended: true, url: "https://meltwater.org/" },
  { id: 9, name: "AkiraChix", category: 'Training', description: "CodeHive: Empowering young African women with high-end tech skills.", logo: "♀️", recommended: false, url: "https://akirachix.com/" },
  { id: 10, name: "Mandela Rhodes", category: 'Fellowship', description: "Elite leadership development and postgraduate scholarships for African talent.", logo: "🇿🇦", recommended: true, url: "https://mandelarhodes.org/" },
  { id: 11, name: "Kibo School", category: 'University', description: "Future-forward online computer science degrees designed for Africans.", logo: "🖥️", recommended: false, url: "https://kibo.school/" },
  { id: 12, name: "YALI RLC", category: 'Fellowship', description: "Young African Leaders Initiative - Regional Leadership Centers across the continent.", logo: "🤝", recommended: false, url: "https://yali.state.gov/" }
];

export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
