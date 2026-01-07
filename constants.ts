
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
    "Model predictive spread of malaria using satellite telemetry.",
    "Engineer cold-chain logistics trackers for vaccine distribution.",
    "Expert Protocol: Design AI-driven portable diagnostic scanners for clinics."
  ],
  'robotics': [
    "Calibrate aquatic bots to monitor river pollution.",
    "Develop kinematic logic for modular 3D-printed prosthetic limbs.",
    "Expert Protocol: Design autonomous drone-grids for last-mile medical delivery."
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
  // --- PRIORITY PATHWAYS ---
  { id: 1, name: "ALU", category: 'University', description: "African Leadership University - Leadership training in STEM and social impact.", logo: "🎓", recommended: true, url: "https://www.alueducation.com/" },
  { id: 2, name: "ALX Africa", category: 'Training', description: "Software engineering and data science training for Africa's top talent.", logo: "💻", recommended: true, url: "https://www.alxafrica.com/" },
  { id: 3, name: "Dell Young Leaders", category: 'Fellowship', description: "Support for high-potential students from low-income backgrounds.", logo: "💻", recommended: true, url: "https://www.dellyoungleaders.org/" },
  { id: 4, name: "Fulbright Africa", category: 'Fellowship', description: "Educational exchange program between Africa and the USA.", logo: "🗽", recommended: true, url: "https://fulbrightscholars.org/what-fulbright/opportunities" },
  { id: 5, name: "UCT Program", category: 'University', description: "University of Cape Town - Africa's highest-ranked research university.", logo: "🏗️", recommended: true, url: "https://www.uct.ac.za/" },

  // --- UNIVERSITIES (20+ NEW) ---
  { id: 101, name: "Makerere University", category: 'University', description: "Uganda's historical giant in medicine and social research.", logo: "🇺🇬", recommended: true, url: "https://www.mak.ac.ug/" },
  { id: 102, name: "University of Lagos", category: 'University', description: "Nigeria's hub for creative and tech-enabled business.", logo: "🇳🇬", recommended: true, url: "https://unilag.edu.ng/" },
  { id: 103, name: "University of Nairobi", category: 'University', description: "Kenya's leading institution for architectural and medical research.", logo: "🇰🇪", recommended: true, url: "https://uonbi.ac.ke/" },
  { id: 104, name: "Wits University", category: 'University', description: "Global leader in deep-level mining and tech innovation.", logo: "💎", recommended: true, url: "https://www.wits.ac.za/" },
  { id: 105, name: "Ashesi University", category: 'University', description: "Cultivating ethical leadership and critical thinking in Ghana.", logo: "🦁", recommended: true, url: "https://www.ashesi.edu.gh/" },
  { id: 106, name: "Cairo University", category: 'University', description: "The premier research center in Egypt for engineering.", logo: "🇪🇬", recommended: false, url: "https://cu.edu.eg/" },
  { id: 107, name: "University of Ghana", category: 'University', description: "Flagship university with deep humanities and science legacy.", logo: "🇬🇭", recommended: false, url: "https://www.ug.edu.gh/" },
  { id: 108, name: "University of Ibadan", category: 'University', description: "Nigeria's oldest university, specializing in bio-research.", logo: "🧪", recommended: false, url: "https://ui.edu.ng/" },
  { id: 109, name: "Addis Ababa Univ", category: 'University', description: "The academic center of the Horn of Africa.", logo: "🇪🇹", recommended: false, url: "http://www.aau.edu.et/" },
  { id: 110, name: "Univ of Rwanda", category: 'University', description: "Powering digital transformation in the Great Lakes region.", logo: "🇷🇼", recommended: false, url: "https://ur.ac.rw/" },
  { id: 111, name: "Univ of Botswana", category: 'University', description: "Advancing knowledge in environmental management.", logo: "🇧🇼", recommended: false, url: "https://www.ub.bw/" },
  { id: 112, name: "Univ of Namibia", category: 'University', description: "Leading research in renewable energy and marine biology.", logo: "🇳🇦", recommended: false, url: "https://www.unam.edu.na/" },
  { id: 113, name: "Eduardo Mondlane", category: 'University', description: "Mozambique's flagship coastal research institution.", logo: "🇲🇿", recommended: false, url: "https://www.uem.mz/" },
  { id: 114, name: "Univ of Dar es Salaam", category: 'University', description: "Tanzania's largest public research university.", logo: "🇹🇿", recommended: false, url: "https://www.udsm.ac.tz/" },
  { id: 115, name: "Univ of Zambia", category: 'University', description: "Leading engineering and mineral processing center.", logo: "🇿🇲", recommended: false, url: "https://www.unza.zm/" },
  { id: 116, name: "Univ of Zimbabwe", category: 'University', description: "Premier hub for innovation and STEM in Harare.", logo: "🇿🇼", recommended: false, url: "https://www.uz.ac.zw/" },
  { id: 117, name: "Univ of Mauritius", category: 'University', description: "Leading research in the Blue Economy and tech.", logo: "🌊", recommended: false, url: "https://uom.ac.mu/" },
  { id: 118, name: "Strathmore Univ", category: 'University', description: "Kenya's premier private university for IT and finance.", logo: "📊", recommended: true, url: "https://strathmore.edu/" },
  { id: 119, name: "Kenyatta University", category: 'University', description: "Diverse campus with strong focus on environmental science.", logo: "🌿", recommended: false, url: "https://www.ku.ac.ke/" },
  { id: 120, name: "JKUAT", category: 'University', description: "Jomo Kenyatta Univ of Agriculture and Technology.", logo: "🚜", recommended: true, url: "https://www.jkuat.ac.ke/" },
  { id: 121, name: "Univ of Pretoria", category: 'University', description: "Top-tier veterinary, engineering and data science hub.", logo: "🏢", recommended: false, url: "https://www.up.ac.za/" },

  // --- FELLOWSHIPS (20+ NEW) ---
  { id: 201, name: "Mandela Rhodes", category: 'Fellowship', description: "Building exceptional leadership capacity in African graduates.", logo: "🦁", recommended: true, url: "https://mandelarhodes.org/" },
  { id: 202, name: "Mastercard Scholars", category: 'Fellowship', description: "Full scholarships for transformative leaders across Africa.", logo: "🤝", recommended: true, url: "https://mastercardfdn.org/" },
  { id: 203, name: "Rhodes Scholarship", category: 'Fellowship', description: "Oxford-based leadership development for top African talent.", logo: "🏛️", recommended: true, url: "https://www.rhodeshouse.ox.ac.uk/" },
  { id: 204, name: "Chevening Scholarship", category: 'Fellowship', description: "UK government global awards for future leaders.", logo: "🇬🇧", recommended: true, url: "https://www.chevening.org/" },
  { id: 205, name: "Obama Leaders Africa", category: 'Fellowship', description: "Ethical leadership training for rising stars in the public sector.", logo: "🌍", recommended: true, url: "https://www.obama.org/leaders/africa/" },
  { id: 206, name: "Tony Elumelu Fund", category: 'Fellowship', description: "Seed capital and training for high-impact entrepreneurs.", logo: "💰", recommended: true, url: "https://www.tonyelumelufoundation.org/" },
  { id: 207, name: "Mo Ibrahim Fellowship", category: 'Fellowship', description: "Leadership training within global institutions (AfDB, ECA).", logo: "🗳️", recommended: false, url: "https://moibrahim.foundation/fellowships" },
  { id: 208, name: "AU Youth Corps", category: 'Fellowship', description: "Volunteering for development across AU member states.", logo: "🇦🇺", recommended: false, url: "https://au.int/en/youth-volunteer-corps" },
  { id: 209, name: "TechWomen Africa", category: 'Fellowship', description: "Exchange program for women leaders in STEM.", logo: "👩‍💻", recommended: true, url: "https://www.techwomen.org/" },
  { id: 210, name: "Schmidt Science", category: 'Fellowship', description: "Interdisciplinary science fellowship for global problem solvers.", logo: "⚛️", recommended: true, url: "https://schmidtsciencefellows.org/" },
  { id: 211, name: "L'Oreal Women Science", category: 'Fellowship', description: "Grants for talented young female scientists in Africa.", logo: "🔬", recommended: true, url: "https://www.fondationloreal.com/" },
  { id: 212, name: "YALI Fellowship", category: 'Fellowship', description: "Mandela Washington Fellowship for young leaders.", logo: "🇺🇸", recommended: true, url: "https://yali.state.gov/" },
  { id: 213, name: "Echoing Green", category: 'Fellowship', description: "Seed funding for social entrepreneurs in emerging markets.", logo: "🌱", recommended: false, url: "https://www.echoinggreen.org/" },
  { id: 214, name: "Ashoka Fellows", category: 'Fellowship', description: "Supporting social entrepreneurs driving systemic change.", logo: "💡", recommended: false, url: "https://www.ashoka.org/" },
  { id: 215, name: "Skoll Scholarship", category: 'Fellowship', description: "MBA scholarship for social entrepreneurs at Oxford.", logo: "📈", recommended: false, url: "https://www.skollscholarship.org/" },
  { id: 216, name: "Gates Cambridge", category: 'Fellowship', description: "Postgraduate scholarships for Africans at Cambridge.", logo: "🏫", recommended: true, url: "https://www.gatescambridge.org/" },
  { id: 217, name: "RAEng Africa Prize", category: 'Fellowship', description: "Engineering innovation prize for scalable tech in Africa.", logo: "⚙️", recommended: true, url: "https://www.raeng.org.uk/africa-prize" },
  { id: 218, name: "FLAIR Fellowship", category: 'Fellowship', description: "Early-career research support for African scientists.", logo: "📖", recommended: true, url: "https://royalsociety.org/grants-schemes-awards/grants/flair/" },
  { id: 219, name: "Next Einstein Forum", category: 'Fellowship', description: "Recognizing Africa's top young scientists.", logo: "🧠", recommended: true, url: "https://nef.org/" },
  { id: 220, name: "Schwarzman Scholars", category: 'Fellowship', description: "Master's program in China for future global leaders.", logo: "🌏", recommended: false, url: "https://www.schwarzmanscholars.org/" },
  { id: 221, name: "Abebe Bikila Fellow", category: 'Fellowship', description: "Excellence in sports and health science research.", logo: "🏃", recommended: false, url: "https://www.olympic.org/" },

  // --- TRAINING HUBS (30+ NEW) ---
  { id: 301, name: "Moringa School", category: 'Training', description: "Market-aligned software engineering training in Kenya.", logo: "🌳", recommended: true, url: "https://moringaschool.com/" },
  { id: 302, name: "Decagon Academy", category: 'Training', description: "Elite software engineering bootcamp in Nigeria.", logo: "🔟", recommended: true, url: "https://decagon.institute/" },
  { id: 303, name: "Semicolon Africa", category: 'Training', description: "Building a community of African software engineers.", logo: "🖋️", recommended: true, url: "https://semicolon.africa/" },
  { id: 304, name: "AltSchool Africa", category: 'Training', description: "Alternative school for high-demand tech skills.", logo: "🏫", recommended: true, url: "https://altschoolafrica.com/" },
  { id: 305, name: "Gebeya", category: 'Training', description: "Marketplace for African tech talent and upskilling.", logo: "🏗️", recommended: true, url: "https://gebeya.com/" },
  { id: 306, name: "GoMyCode", category: 'Training', description: "Interactive tech school with physical hubs in Africa.", logo: "⌨️", recommended: false, url: "https://gomycode.com/" },
  { id: 307, name: "MEST Africa", category: 'Training', description: "Seed funding and tech entrepreneurship training.", logo: "🚀", recommended: true, url: "https://meltwater.org/" },
  { id: 308, name: "CcHUB", category: 'Training', description: "Co-creation hub for tech innovation and startup training.", logo: "⚙️", recommended: true, url: "https://cchubnigeria.com/" },
  { id: 309, name: "iHub Nairobi", category: 'Training', description: "Nairobi's premier tech hub and community space.", logo: "🏢", recommended: true, url: "https://ihub.co.ke/" },
  { id: 310, name: "BongoHive", category: 'Training', description: "Zambia's first technology and innovation hub.", logo: "🐝", recommended: false, url: "https://bongohive.co.zm/" },
  { id: 311, name: "Outbox Uganda", category: 'Training', description: "Incubator helping Ugandan startups to scale.", logo: "📦", recommended: false, url: "https://outbox.co.ug/" },
  { id: 312, name: "Gearbox Kenya", category: 'Training', description: "Maker space for hardware engineering and design.", logo: "🔨", recommended: true, url: "https://www.gearbox.africa/" },
  { id: 313, name: "kLab Rwanda", category: 'Training', description: "Open space for IT entrepreneurs in Kigali.", logo: "🇷🇼", recommended: false, url: "https://klab.rw/" },
  { id: 314, name: "iceaddis", category: 'Training', description: "Ethiopia's first innovation hub and incubator.", logo: "🇪🇹", recommended: true, url: "https://www.iceaddis.com/" },
  { id: 315, name: "Smart Lab TZ", category: 'Training', description: "Connecting startups to corporations in Tanzania.", logo: "🇹🇿", recommended: false, url: "https://smartlab.co.tz/" },
  { id: 316, name: "Norrsken Kigali", category: 'Training', description: "Europe's biggest impact hub's African home.", logo: "🏙️", recommended: true, url: "https://www.norrsken.org/kigali" },
  { id: 317, name: "Node Eight", category: 'Training', description: "Digital skill training and venture builder in Ghana.", logo: "📍", recommended: false, url: "https://nodeeight.org/" },
  { id: 318, name: "Kumasi Hive", category: 'Training', description: "Hardware and digital manufacturing hub in Ghana.", logo: "🛠️", recommended: true, url: "https://kumasihive.com/" },
  { id: 319, name: "Sote Hub", category: 'Training', description: "Innovation and startup support in coastal Kenya.", logo: "🇰🇪", recommended: false, url: "https://sotehub.com/" },
  { id: 320, name: "LakeHub Kisumu", category: 'Training', description: "The heartbeat of tech in Western Kenya.", logo: "🌊", recommended: false, url: "https://lakehub.co.ke/" },
  { id: 321, name: "Swahilipot Hub", category: 'Training', description: "Mombasa's center for tech and the arts.", logo: "🏺", recommended: false, url: "https://swahilipot.com/" },
  { id: 322, name: "FabLab Kenya", category: 'Training', description: "Digital fabrication and electronics prototyping.", logo: "🔌", recommended: false, url: "http://fablab.uonbi.ac.ke/" },
  { id: 323, name: "Tshimologong", category: 'Training', description: "Digital innovation precinct at Wits, Jo'burg.", logo: "🏗️", recommended: true, url: "https://tshimologong.joburg/" },
  { id: 324, name: "M-Lab SA", category: 'Training', description: "Mobile application laboratory for social good.", logo: "📱", recommended: false, url: "https://mlab.co.za/" },
  { id: 325, name: "Bandwidth Barn", category: 'Training', description: "Cape Town's center for tech entrepreneurship.", logo: "🏚️", recommended: false, url: "https://www.bandwidthbarn.org/" },
  { id: 326, name: "Silicon Cape", category: 'Training', description: "Promoting Cape Town as a global tech destination.", logo: "⛰️", recommended: true, url: "https://www.siliconcape.com/" },
  { id: 327, name: "Wennovation Hub", category: 'Training', description: "Incubator for social entrepreneurs in Nigeria.", logo: "💡", recommended: false, url: "https://wennovationhub.org/" },
  { id: 328, name: "nHub Jos", category: 'Training', description: "The tech heartbeat of Northern Nigeria.", logo: "⛰️", recommended: false, url: "https://nhubng.com/" },
  { id: 329, name: "Enyata Academy", category: 'Training', description: "Intensive training for world-class developers.", logo: "🚀", recommended: false, url: "https://enyata.com/" },
  { id: 330, name: "Zindi AI", category: 'Training', description: "The leading AI competition platform for Africa.", logo: "🏁", recommended: true, url: "https://zindi.africa/" },
  { id: 331, name: "Data Science Nigeria", category: 'Training', description: "Building a world-class AI ecosystem for impact.", logo: "🤖", recommended: true, url: "https://www.datasciencenigeria.org/" }
];

export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
