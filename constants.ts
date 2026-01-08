
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
  // UNIVERSITIES (53)
  { id: 1, name: "UCT", category: 'University', description: "University of Cape Town - Africa's top-ranked research institution.", logo: "🇿🇦", recommended: true, url: "https://www.uct.ac.za/" },
  { id: 2, name: "ALU", category: 'University', description: "African Leadership University - Innovative leadership-focused STEM training.", logo: "🎓", recommended: true, url: "https://www.alueducation.com/" },
  { id: 3, name: "Wits University", category: 'University', description: "University of the Witwatersrand - Leader in deep tech and engineering.", logo: "🇿🇦", recommended: true, url: "https://www.wits.ac.za/" },
  { id: 4, name: "Makerere University", category: 'University', description: "Uganda's premier center for health, science, and research.", logo: "🇺🇬", recommended: true, url: "https://www.mak.ac.ug/" },
  { id: 5, name: "University of Nairobi", category: 'University', description: "Kenya's leading institution for computer science and innovation.", logo: "🇰🇪", recommended: true, url: "https://uonbi.ac.ke/" },
  { id: 6, name: "Ashesi University", category: 'University', description: "Ethical leadership and world-class tech education in Ghana.", logo: "🇬🇭", recommended: true, url: "https://www.ashesi.edu.gh/" },
  { id: 7, name: "AIMS", category: 'University', description: "African Institute for Mathematical Sciences - Advanced pan-African math center.", logo: "🔢", recommended: true, url: "https://nexteinstein.org/" },
  { id: 8, name: "Cairo University", category: 'University', description: "Egypt's historic center for engineering and research excellence.", logo: "🇪🇬", recommended: false, url: "https://cu.edu.eg/" },
  { id: 9, name: "University of Lagos", category: 'University', description: "Nigeria's pride in business, law, and technology.", logo: "🇳🇬", recommended: true, url: "https://unilag.edu.ng/" },
  { id: 10, name: "Stellenbosch University", category: 'University', description: "Global leader in physics, bio-tech, and viticulture.", logo: "🇿🇦", recommended: false, url: "https://www.sun.ac.za/" },
  { id: 11, name: "University of Ghana", category: 'University', description: "The premier university in Ghana for humanities and science.", logo: "🇬🇭", recommended: false, url: "https://www.ug.edu.gh/" },
  { id: 12, name: "Strathmore University", category: 'University', description: "Leading private business and tech school in Kenya.", logo: "🇰🇪", recommended: true, url: "https://strathmore.edu/" },
  { id: 13, name: "American University Cairo", category: 'University', description: "Global standard liberal arts and STEM education in Egypt.", logo: "🇪🇬", recommended: false, url: "https://www.aucegypt.edu/" },
  { id: 14, name: "University of Ibadan", category: 'University', description: "The oldest and most prestigious university in Nigeria.", logo: "🇳🇬", recommended: true, url: "https://ui.edu.ng/" },
  { id: 15, name: "Covenant University", category: 'University', description: "Top-tier private university in Nigeria for CS and Engineering.", logo: "🇳🇬", recommended: true, url: "https://covenantuniversity.edu.ng/" },
  { id: 16, name: "University of Rwanda", category: 'University', description: "Regional hub for science and technology in East Africa.", logo: "🇷🇼", recommended: false, url: "https://ur.ac.rw/" },
  { id: 17, name: "JKUAT", category: 'University', description: "Jomo Kenyatta University of Agriculture and Technology.", logo: "🇰🇪", recommended: true, url: "https://www.jkuat.ac.ke/" },
  { id: 18, name: "KNUST", category: 'University', description: "Kwame Nkrumah University of Science and Technology.", logo: "🇬🇭", recommended: true, url: "https://www.knust.edu.gh/" },
  { id: 19, name: "University of Pretoria", category: 'University', description: "Leading research-intensive university in South Africa.", logo: "🇿🇦", recommended: true, url: "https://www.up.ac.za/" },
  { id: 20, name: "University of Johannesburg", category: 'University', description: "Global excellence and stature in 4IR technology.", logo: "🇿🇦", recommended: false, url: "https://www.uj.ac.za/" },
  { id: 21, name: "UKZN", category: 'University', description: "University of KwaZulu-Natal - Excellence in health and science.", logo: "🇿🇦", recommended: false, url: "https://www.ukzn.ac.za/" },
  { id: 22, name: "North-West University", category: 'University', description: "Market-oriented university with top engineering programs.", logo: "🇿🇦", recommended: false, url: "https://www.nwu.ac.za/" },
  { id: 23, name: "University of Zimbabwe", category: 'University', description: "The premier source of higher education in Zimbabwe.", logo: "🇿🇼", recommended: false, url: "https://www.uz.ac.zw/" },
  { id: 24, name: "University of Botswana", category: 'University', description: "National center for research and training in Botswana.", logo: "🇧🇼", recommended: false, url: "https://www.ub.bw/" },
  { id: 25, name: "University of Zambia", category: 'University', description: "Zambia's flagship university for higher education.", logo: "🇿🇲", recommended: false, url: "https://www.unza.zm/" },
  { id: 26, name: "University of Dar es Salaam", category: 'University', description: "Tanzania's oldest and most prestigious university.", logo: "🇹🇿", recommended: false, url: "https://www.udsm.ac.tz/" },
  { id: 27, name: "Addis Ababa University", category: 'University', description: "Largest and oldest university in Ethiopia.", logo: "🇪🇹", recommended: true, url: "http://www.aau.edu.et/" },
  { id: 28, name: "University of Khartoum", category: 'University', description: "Sudan's top institution for medical and engineering sciences.", logo: "🇸🇩", recommended: false, url: "https://uofk.edu/" },
  { id: 29, name: "UCAD Senegal", category: 'University', description: "Université Cheikh Anta Diop - West Africa's academic hub.", logo: "🇸🇳", recommended: false, url: "https://www.ucad.sn/" },
  { id: 30, name: "University of Benin", category: 'University', description: "One of Nigeria's first-generation federal universities.", logo: "🇳🇬", recommended: false, url: "https://uniben.edu/" },
  { id: 31, name: "NUST Namibia", category: 'University', description: "Namibia University of Science and Technology.", logo: "🇳🇦", recommended: true, url: "https://www.nust.na/" },
  { id: 32, name: "Mbarara University", category: 'University', description: "MUST Uganda - Excellence in science and tech.", logo: "🇺🇬", recommended: false, url: "https://www.must.ac.ug/" },
  { id: 33, name: "Landmark University", category: 'University', description: "Driving an agrarian revolution through high-tech education.", logo: "🇳🇬", recommended: false, url: "https://lmu.edu.ng/" },
  { id: 34, name: "Pan-Atlantic University", category: 'University', description: "Elite private university in Lagos for media and tech.", logo: "🇳🇬", recommended: false, url: "https://pau.edu.ng/" },
  { id: 35, name: "American Univ. Nigeria", category: 'University', description: "Development university focused on leadership and tech.", logo: "🇳🇬", recommended: false, url: "https://www.aun.edu.ng/" },
  { id: 36, name: "Baze University", category: 'University', description: "Modern campus in Abuja providing world-class education.", logo: "🇳🇬", recommended: false, url: "https://bazeuniversity.edu.ng/" },
  { id: 37, name: "Nile University", category: 'University', description: "Private university in Nigeria focused on future-ready skills.", logo: "🇳🇬", recommended: false, url: "https://www.nileuniversity.edu.ng/" },
  { id: 38, name: "University of Mauritius", category: 'University', description: "The main university of the island nation of Mauritius.", logo: "🇲🇺", recommended: false, url: "https://www.uom.ac.mu/" },
  { id: 39, name: "Copperbelt University", category: 'University', description: "Zambia's leading tech and mining research university.", logo: "🇿🇲", recommended: false, url: "https://www.cbu.ac.zm/" },
  { id: 40, name: "University of Kinshasa", category: 'University', description: "The premier educational institution of the DR Congo.", logo: "🇨🇩", recommended: false, url: "https://unikin.ac.cd/" },
  { id: 41, name: "Botho University", category: 'University', description: "Regional private university hub in Southern Africa.", logo: "🇧🇼", recommended: false, url: "https://www.bothouniversity.com/" },
  { id: 42, name: "Sol Plaatje University", category: 'University', description: "South Africa's newest university focused on data science.", logo: "🇿🇦", recommended: true, url: "https://www.spu.ac.za/" },
  { id: 43, name: "University of Mpumalanga", category: 'University', description: "Focusing on sustainable development and agriculture.", logo: "🇿🇦", recommended: false, url: "https://www.ump.ac.za/" },
  { id: 44, name: "CPUT South Africa", category: 'University', description: "Cape Peninsula University of Technology - Hands-on STEM.", logo: "🇿🇦", recommended: false, url: "https://www.cput.ac.za/" },
  { id: 45, name: "DUT South Africa", category: 'University', description: "Durban University of Technology - Global innovation hub.", logo: "🇿🇦", recommended: false, url: "https://www.dut.ac.za/" },
  { id: 46, name: "TUT South Africa", category: 'University', description: "Tshwane University of Technology - Innovation driven.", logo: "🇿🇦", recommended: false, url: "https://www.tut.ac.za/" },
  { id: 47, name: "Rhodes University", category: 'University', description: "Prestigious liberal arts and science research in SA.", logo: "🇿🇦", recommended: false, url: "https://www.ru.ac.za/" },
  { id: 48, name: "University of Malawi", category: 'University', description: "Malawi's premier institution for training and research.", logo: "🇲🇼", recommended: false, url: "https://www.unima.ac.mw/" },
  { id: 49, name: "Sokoine University", category: 'University', description: "Tanzania's hub for agriculture and applied sciences.", logo: "🇹🇿", recommended: false, url: "https://www.sua.ac.tz/" },
  { id: 50, name: "Jimma University", category: 'University', description: "Ethiopia's leading university in community-based training.", logo: "🇪🇹", recommended: false, url: "https://www.ju.edu.et/" },
  { id: 51, name: "Univ. Yaoundé I", category: 'University', description: "Cameroon's premier research university for sciences.", logo: "🇨🇲", recommended: false, url: "https://www.uy1.uninet.cm/" },
  { id: 52, name: "Univ. Douala", category: 'University', description: "Economic heart university of Cameroon with tech focus.", logo: "🇨🇲", recommended: false, url: "https://www.univ-douala.com/" },
  { id: 53, name: "Univ. d'Abidjan", category: 'University', description: "Université Félix Houphouët-Boigny - Côte d'Ivoire flagship.", logo: "🇨🇮", recommended: false, url: "https://www.univ-fhb.edu.ci/" },

  // FELLOWSHIPS (30)
  { id: 201, name: "Mandela Washington", category: 'Fellowship', description: "Premier program for young African leaders in the USA.", logo: "🦅", recommended: true, url: "https://www.mandelawashingtonfellowship.org/" },
  { id: 202, name: "Mastercard Scholars", category: 'Fellowship', description: "Full scholarships and leadership training for African youth.", logo: "💎", recommended: true, url: "https://mastercardfdn.org/all/scholars/" },
  { id: 203, name: "YALI Regional", category: 'Fellowship', description: "Regional leadership centers across Africa for civic impact.", logo: "🇺🇸", recommended: true, url: "https://yali.state.gov/" },
  { id: 204, name: "Rhodes Scholarship", category: 'Fellowship', description: "Postgrad studies at Oxford for the top 1% of talent.", logo: "🎓", recommended: true, url: "https://www.rhodeshouse.ox.ac.uk/" },
  { id: 205, name: "Schmidt Science", category: 'Fellowship', description: "Interdisciplinary postdoctoral research for global impact.", logo: "🔬", recommended: true, url: "https://schmidtsciencefellows.org/" },
  { id: 206, name: "Obama Foundation Africa", category: 'Fellowship', description: "Developing civic leaders to scale their impact across Africa.", logo: "🌍", recommended: true, url: "https://www.obama.org/leaders/africa/" },
  { id: 207, name: "Mo Ibrahim Leadership", category: 'Fellowship', description: "Governance and leadership training at international organizations.", logo: "🌍", recommended: false, url: "https://moibrahimfoundation.org/fellowships" },
  { id: 208, name: "L’Oréal-UNESCO", category: 'Fellowship', description: "Supporting African women in life and physical sciences.", logo: "🧬", recommended: true, url: "https://www.fondationloreal.com/en/nos-programmes-pour-les-femmes-et-la-science" },
  { id: 209, name: "Tutu Leadership", category: 'Fellowship', description: "Elite fellowship for African leaders with vision and integrity.", logo: "🇿🇦", recommended: true, url: "https://alinstitute.org/tutu-leadership-fellowship" },
  { id: 210, name: "African Union Research", category: 'Fellowship', description: "Grants and fellowships for pan-African research projects.", logo: "🌍", recommended: false, url: "https://au.int/en/fellowships" },
  { id: 211, name: "Tony Elumelu Fellowship", category: 'Fellowship', description: "The premier hub for African entrepreneurship and impact.", logo: "💼", recommended: true, url: "https://www.tonyelumelufoundation.org/" },
  { id: 212, name: "Echoing Green", category: 'Fellowship', description: "Global social entrepreneurship fellowship for innovators.", logo: "🌱", recommended: false, url: "https://www.echoinggreen.org/" },
  { id: 213, name: "Skoll Fellowship", category: 'Fellowship', description: "Social impact fellowship at the University of Oxford.", logo: "🏛️", recommended: false, url: "https://www.skoll.org/" },
  { id: 214, name: "Ashoka Fellowship", category: 'Fellowship', description: "Network of world-leading social entrepreneurs and change-makers.", logo: "🤝", recommended: false, url: "https://www.ashoka.org/en-us/program/ashoka-fellowship" },
  { id: 215, name: "TED Fellowship", category: 'Fellowship', description: "Pathways for innovators to share their ideas with the world.", logo: "🎙️", recommended: true, url: "https://www.ted.com/about/programs-initiatives/ted-fellows-program" },
  { id: 216, name: "Atlas Corps", category: 'Fellowship', description: "International exchange for skilled social sector professionals.", logo: "🗺️", recommended: false, url: "https://atlascorps.org/" },
  { id: 217, name: "World Bank Fellowship", category: 'Fellowship', description: "Opportunities for African PhD students at the World Bank.", logo: "🏦", recommended: false, url: "https://www.worldbank.org/en/programs/scholarships" },
  { id: 218, name: "Chevening Scholarship", category: 'Fellowship', description: "UK government's global scholarship for future leaders.", logo: "🇬🇧", recommended: true, url: "https://www.chevening.org/" },
  { id: 219, name: "Fulbright Student", category: 'Fellowship', description: "Global exchange for postgraduate studies in the USA.", logo: "🗽", recommended: true, url: "https://foreign.fulbrightonline.org/" },
  { id: 220, name: "DAAD In-Country", category: 'Fellowship', description: "German scholarships for African students to study in Africa.", logo: "🇩🇪", recommended: false, url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
  { id: 221, name: "Einstein Fellowship", category: 'Fellowship', description: "Interdisciplinary research in the sciences and humanities.", logo: "🧠", recommended: false, url: "https://www.einsteinforum.de/en/fellowships/" },
  { id: 222, name: "VLIR-UOS Fellowship", category: 'Fellowship', description: "Study opportunities in Belgium for sustainable development.", logo: "🇧🇪", recommended: false, url: "https://www.vliruos.be/en/scholarships" },
  { id: 223, name: "Australia Awards", category: 'Fellowship', description: "Education and professional development in Australia.", logo: "🇦🇺", recommended: false, url: "https://www.australiaawards.gov.au/" },
  { id: 224, name: "Humphrey Fellowship", category: 'Fellowship', description: "Non-degree professional exchange in the USA for leaders.", logo: "🇺🇸", recommended: false, url: "https://www.humphreyfellowship.org/" },
  { id: 225, name: "Global Health Corps", category: 'Fellowship', description: "Mission-driven fellowship for health equity in Africa.", logo: "🏥", recommended: false, url: "https://ghcorps.org/" },
  { id: 226, name: "Mulago Fellows", category: 'Fellowship', description: "Training for entrepreneurs with high-impact solutions.", logo: "📈", recommended: false, url: "https://www.mulagofoundation.org/fellows" },
  { id: 227, name: "Draper Hills", category: 'Fellowship', description: "Summer program at Stanford for global democracy leaders.", logo: "🌲", recommended: false, url: "https://cddrl.fsi.stanford.edu/summer-fellowship" },
  { id: 228, name: "African Tech Fellows", category: 'Fellowship', description: "Global internships for top African software talent.", logo: "🛰️", recommended: true, url: "https://africantechfellows.com/" },
  { id: 229, name: "IMF Fellowship", category: 'Fellowship', description: "Internship and fellowship opportunities at the IMF.", logo: "🏛️", recommended: false, url: "https://www.imf.org/en/About/Recruitment" },
  { id: 230, name: "AfDB YPP", category: 'Fellowship', description: "African Development Bank Young Professionals Program.", logo: "🏦", recommended: true, url: "https://www.afdb.org/en/about-us/careers/young-professionals-program-ypp" },

  // TRAINING (21)
  { id: 301, name: "ALX Africa", category: 'Training', description: "Elite software engineering and data science training.", logo: "💻", recommended: true, url: "https://www.alxafrica.com/" },
  { id: 302, name: "Moringa School", category: 'Training', description: "Kenya's top coding bootcamp for software engineering.", logo: "🏫", recommended: true, url: "https://moringaschool.com/" },
  { id: 303, name: "Gebeya", category: 'Training', description: "Gebeya Talent Academy - Specialized dev training Ethiopia.", logo: "🇪🇹", recommended: true, url: "https://gebeya.com/" },
  { id: 304, name: "Decagon Institute", category: 'Training', description: "Elite tech talent training for global placement in Nigeria.", logo: "🇳🇬", recommended: true, url: "https://decagon.institute/" },
  { id: 305, name: "SheCodeAfrica", category: 'Training', description: "Empowering African women through specialized tech skills.", logo: "👩‍💻", recommended: true, url: "https://shecodeafrica.org/" },
  { id: 306, name: "Zindi Africa", category: 'Training', description: "Real-world AI and data science training and competitions.", logo: "🏁", recommended: true, url: "https://zindi.africa/" },
  { id: 307, name: "Andela Learning", category: 'Training', description: "Andela Learning Community - Global engineering pathways.", logo: "⚡", recommended: false, url: "https://andela.com/andela-learning-community/" },
  { id: 308, name: "Data Science NG", category: 'Training', description: "Building the AI ecosystem across Nigeria and beyond.", logo: "📊", recommended: true, url: "https://www.datasciencenigeria.org/" },
  { id: 309, name: "GOMYCODE", category: 'Training', description: "Modern tech education centers across North and West Africa.", logo: "🇹🇳", recommended: false, url: "https://gomycode.com/" },
  { id: 310, name: "Semicolon Africa", category: 'Training', description: "Tech-preneurship and software engineering for Nigerians.", logo: "🏛️", recommended: true, url: "https://semicolon.africa/" },
  { id: 311, name: "MEST Africa", category: 'Training', description: "Pan-African tech incubator and entrepreneurial training.", logo: "🚀", recommended: true, url: "https://meltwater.org/" },
  { id: 312, name: "Google for Startups", category: 'Training', description: "Accelerator and training for African tech entrepreneurs.", logo: "🔍", recommended: true, url: "https://startup.google.com/accelerator/africa/" },
  { id: 313, name: "IBM SkillsBuild", category: 'Training', description: "Free online courses for high-growth tech careers in Africa.", logo: "🏢", recommended: false, url: "https://skillsbuild.org/" },
  { id: 314, name: "Cisco Academy", category: 'Training', description: "IT and networking training centers across the continent.", logo: "📡", recommended: false, url: "https://www.netacad.com/" },
  { id: 315, name: "AWS re/Start", category: 'Training', description: "Cloud computing skills training for unemployed youth.", logo: "☁️", recommended: true, url: "https://aws.amazon.com/training/restart/" },
  { id: 316, name: "AltSchool Africa", category: 'Training', description: "School for alternative learning in tech and creative arts.", logo: "🎓", recommended: true, url: "https://altschoolafrica.com/" },
  { id: 317, name: "Nexford University", category: 'Training', description: "Modern, online-first training for global business skills.", logo: "🌍", recommended: false, url: "https://www.nexford.org/" },
  { id: 318, name: "Utiva Africa", category: 'Training', description: "Upskilling platform for high-end digital and data skills.", logo: "🛠️", recommended: true, url: "https://utiva.io/" },
  { id: 319, name: "Edubridge NG", category: 'Training', description: "Hands-on tech training and placement in West Africa.", logo: "🌉", recommended: false, url: "https://www.edubridge.ng/" },
  { id: 320, name: "Flutterwave Academy", category: 'Training', description: "Specialized training for fintech and engineering talent.", logo: "🌊", recommended: false, url: "https://flutterwave.com/us/careers" },
  { id: 321, name: "Microsoft ADC", category: 'Training', description: "Microsoft Africa Development Centre - Advanced mentorship.", logo: "💻", recommended: true, url: "https://www.microsoft.com/en-us/africa-development-center" }
];

export const SKILLS = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
