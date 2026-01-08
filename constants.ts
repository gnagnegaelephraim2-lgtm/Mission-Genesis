
import { World, Chapter, Mission, Opportunity, Challenge } from './types';

export const WORLDS: World[] = [
  { id: 'astronomy', subject: 'SPACE', title: "Cosmic Grid", progress: 0, gradient: 'from-violet-900 to-slate-950', icon: '🔭', color: '#7c3aed' },
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
  { id: 'economics', subject: 'ECON', title: "Wealth Flow", progress: 0, gradient: 'from-emerald-500 to-teal-800', icon: '📊', color: '#10b981' },
  { id: 'energy', subject: 'ENERGY', title: "Volt Pulse", progress: 0, gradient: 'from-yellow-400 to-orange-900', icon: '🔋', color: '#fbbf24' },
  { id: 'marine-bio', subject: 'MARINE', title: "Abyssal Reef", progress: 0, gradient: 'from-blue-400 to-indigo-900', icon: '🐙', color: '#38bdf8' },
  { id: 'cyber-ops', subject: 'CYBER', title: "Sentinel Mesh", progress: 0, gradient: 'from-red-600 to-slate-950', icon: '🛡️', color: '#dc2626' },
  { id: 'nanotech', subject: 'NANO', title: "Atomic Sahel", progress: 0, gradient: 'from-fuchsia-600 to-purple-900', icon: '💎', color: '#d946ef' },
];

const KNOWLEDGE_BASE: Record<string, { topics: string[], problemContexts: string[], solutions: string[] }> = {
  'astronomy': {
    topics: ['Orbital Resonance Calibration', 'Spectroscopic Data Filtering', 'Gravitational Lensing Analysis', 'Star Tracker Alignment', 'Pulsar Timing Arrays'],
    problemContexts: ['detecting exoplanets in noisy stellar fields', 'stabilizing deep-space communication relays', 'mapping dark matter distributions in the Sahel sector'],
    solutions: ['Bayesian Phase Folding', 'Fourier Signal Extraction', 'Adaptive Optics Correction']
  },
  'computer-science': {
    topics: ['Distributed Hash Tables', 'Consensus Algorithms', 'Neural Weight Quantization', 'Memory Leak Profiling', 'Load Balancing', 'Asymmetric Encryption'],
    problemContexts: ['rural edge server synchronization', 'minimizing latency in mesh networks', 'optimizing mobile AI inferencing', 'preventing stack overflows in real-time kernels'],
    solutions: ['RAFT Consensus', 'Consistent Hashing', 'Integer Quantization', 'Buffer Overflow Protection']
  },
  'health-science': {
    topics: ['CRISPR-Cas9 Gene Editing', 'Pathogen Sequence Analysis', 'Telemedicine Latency Optimization', 'Biometric Signal Filtering', 'Epidemiological Modeling'],
    problemContexts: ['identifying viral mutation origins', 'designing resilient remote surgery robots', 'deploying low-cost diagnostic arrays in drylands'],
    solutions: ['Reverse Transcriptase Analysis', 'Haptic Feedback Buffering', 'Point-of-Care Microfluidics']
  },
  'physics': {
    topics: ['Fluid Dynamics in Urban Heat Islands', 'Quantum Tunneling in Nanocircuits', 'Thermodynamic Efficiency of Solar Concentrators', 'Electromagnetic Shielding'],
    problemContexts: ['cooling mega-city skyscrapers sustainably', 'harvesting solar energy in hazy regions', 'stabilizing local micro-grids against EMP interference'],
    solutions: ['Passive Radiative Cooling', 'Photovoltaic Concentration', 'Faraday Cage Integration']
  },
  'agriculture': {
    topics: ['Hydroponic Nutrient Balancing', 'Precision Irrigation Algos', 'Mycorrhizal Fungal Inoculation', 'Automated Pest Identification via CV'],
    problemContexts: ['increasing yield in saline soils', 'optimizing water use in arid semi-desert zones', 'managing nitrogen cycles in vertical farms'],
    solutions: ['Drip Osmosis Systems', 'Edge-AI Spectral Imaging', 'Carbon Sequestration via Soil Microbes']
  }
};

const generateFallbackChallenge = (subject: string, pIdx: number, mIdx: number): Challenge => {
  return {
    question: `Phase ${pIdx + 1} Assessment: How would you optimize the ${subject} efficiency for a Tier ${mIdx + 1} deployment?`,
    options: ['Resource Sharding', 'Parallel Synchronization', 'Adaptive Filtering', 'Direct Neural Link'],
    correctIndex: (pIdx + mIdx) % 4,
    explanation: 'Optimization requires balancing latency with reliability in a high-fidelity tactical environment.'
  };
};

const generateChallenge = (worldId: string, pIdx: number, mIdx: number): Challenge => {
  const base = KNOWLEDGE_BASE[worldId];
  if (!base) return generateFallbackChallenge(worldId, pIdx, mIdx);

  const topic = base.topics[(pIdx * 5 + mIdx) % base.topics.length];
  const context = base.problemContexts[(pIdx + mIdx) % base.problemContexts.length];
  const correctOption = base.solutions[(pIdx * 2 + mIdx) % base.solutions.length];
  
  const options = [correctOption, 'Legacy Batch Processing', 'Basic Linear Scaling', 'Manual Intervention'];
  const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
  const correctIndex = shuffledOptions.indexOf(correctOption);

  return {
    question: `In a ${context} scenario, which ${topic} implementation strategy yields the highest operational stability for advanced users?`,
    options: shuffledOptions,
    correctIndex,
    explanation: `Advanced ${topic} utilizes ${correctOption} to resolve traditional bottlenecks in ${context}.`
  };
};

const MISSION_PREFIXES = ["Nova", "Apex", "Prime", "Void", "Titan", "Zenith", "Omega", "Flux", "Core", "Vector"];

export const MISSIONS: Mission[] = WORLDS.flatMap((world, wIdx) => {
  return Array.from({ length: 15 }).flatMap((_, pIdx) => {
    return Array.from({ length: 5 }).map((__, mIdx) => {
      const globalId = (wIdx * 10000) + (pIdx * 100) + mIdx + 1;
      const difficulty = pIdx < 5 ? 'Medium' : pIdx < 10 ? 'Hard' : 'Expert';
      const xpBase = difficulty === 'Medium' ? 800 : difficulty === 'Hard' ? 1600 : 2500;
      
      return {
        id: globalId,
        worldId: world.id,
        title: `${MISSION_PREFIXES[(pIdx + mIdx) % 10]} Tact-0${mIdx + 1}`,
        story: `Intelligence report: A critical bottleneck has been detected in the ${world.subject} sector during Phase ${pIdx + 1}. Regional mesh stability is compromised by a complex problem-solving anomaly. You must apply advanced practical knowledge to secure this node.`,
        difficulty: difficulty as 'Medium' | 'Hard' | 'Expert',
        xp: xpBase + (pIdx * 100) + (mIdx * 50),
        locked: pIdx > 0 || mIdx > 0,
        bgGradient: world.gradient,
        completed: false,
        environment: `High-fidelity ${world.subject} practical environment Phase ${pIdx + 1}.`,
        type: (mIdx % 2 === 0) ? 'Rhythm' : 'Data-Stream',
        objectives: [
          `Authenticate Phase ${pIdx + 1} Tactical Credentials`,
          `Analyze Sector Problem-Solving Constraints`,
          `Implement Advanced ${world.subject} Solution`,
          `Synchronize Neural Result with Global Mesh`
        ],
        challenge: generateChallenge(world.id, pIdx, mIdx)
      };
    });
  });
});

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

export const CHAPTER_MISSION_IDS: Record<string, number[]> = MISSIONS.reduce((acc, mission) => {
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
  { id: 330, name: "Zindi AI", category: 'Training', description: "The leading AI competition platform for Africa.", logo: "🏁", recommended: true, url: "https://zindi.africa/" }
];

export const SKILLS = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
