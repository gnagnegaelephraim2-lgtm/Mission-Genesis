
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
  acc[world.id] = [{ id: `${world.id}-c1`, title: `${world.title} Phase 1`, status: 'Active', missionsCompleted: 0, totalMissions: 10, locked: false }];
  return acc;
}, {} as Record<string, Chapter[]>);

const REAL_WORLD_SCENARIOS: Record<string, string[]> = {
  'env-science': [
    "Deploy IoT flood-warning sensors in the Limpopo basin.",
    "Develop a carbon-credit verification mesh for community reforestation.",
    "Expert Protocol: Design a decentralized desalination grid for coastal regions."
  ],
  'computer-science': [
    "Audit smart-contract logic for cross-border mobile money insurance.",
    "Scale low-bandwidth NLP models for localized African languages.",
    "Expert Protocol: Engineer a quantum-resistant encryption layer for the CBDC mesh."
  ],
  'physics': [
    "Optimize solar-thermal power yields in the Karoo semi-desert.",
    "Calculate fluid dynamics for modular micro-hydro generators.",
    "Expert Protocol: Develop plasma-based waste-to-energy conversion systems."
  ],
  'agriculture': [
    "Deploy multi-spectral drones to detect locust breeding grounds.",
    "Design automated hydroponic systems using recycled wastewater.",
    "Expert Protocol: Architect a climate-resilient seed bank for the Sahel."
  ],
  'health-science': [
    "Model predictive spread of malaria using satellite telemetry across tropical sectors.",
    "Engineer cold-chain logistics trackers for drone-based vaccine distribution.",
    "Expert Protocol: Design AI-driven portable diagnostic scanners for remote village clinics."
  ],
  'robotics': [
    "Calibrate aquatic bots to monitor river pollution.",
    "Develop kinematic logic for modular 3D-printed prosthetic limbs.",
    "Expert Protocol: Design autonomous drone-grids for last-mile medical delivery."
  ],
  'astronomy': [
    "Optimize radio-telescope array positioning in the Karoo for deep-space signals.",
    "Analyze orbital debris trajectories to protect African cubesats.",
    "Expert Protocol: Design a lunar-based relay for inter-continental solar research."
  ],
  'economics': [
    "Simulate the impact of Pan-African digital currency on intra-continental trade.",
    "Architect a micro-insurance mesh for small-holder farmers using blockchain.",
    "Expert Protocol: Design a decentralized liquidity pool for urban infrastructure bonds."
  ],
  'energy': [
    "Scale modular molten-salt batteries for off-grid industrial zones.",
    "Develop AI dispatchers for national smart-grids handling intermittent wind power.",
    "Expert Protocol: Engineer a fusion-lite experimental reactor for a regional hub."
  ],
  'marine-bio': [
    "Deploy bio-acoustic sensors to track humpback whale migration off Gabon.",
    "Design automated coral-restoration bots for the Indian Ocean reefs.",
    "Expert Protocol: Map deep-sea hydrothermal vents for sustainable geothermal potential."
  ],
  'cyber-ops': [
    "Neutralize a brute-force assault on the Ethiopian power grid nodes.",
    "Implement zero-trust architecture for rural e-government portals.",
    "Expert Protocol: Deploy an AI-sentinel to monitor sub-sea cable integrity."
  ],
  'nanotech': [
    "Engineer nano-coatings to protect Sahelian solar arrays from sand abrasion.",
    "Develop molecular filters for heavy-metal extraction in artisanal mining zones.",
    "Expert Protocol: Synthesize graphene-based membranes for low-energy water purification."
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
