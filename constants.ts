
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
  ],
  'health-science': [
    "Model the predictive spread of malaria in the East African highlands using satellite telemetry.",
    "Engineer a cold-chain logistics tracker for vaccine distribution in high-humidity tropical sectors.",
    "Expert Protocol: Design a low-cost, AI-driven portable diagnostic scanner for rural clinics."
  ],
  'robotics': [
    "Calibrate a swarm of low-cost aquatic bots to monitor river pollution in industrial zones.",
    "Develop the kinematic logic for a modular prosthetic limb using locally sourced 3D-printed parts.",
    "Expert Protocol: Design an autonomous drone-grid for last-mile medical delivery in mountainous terrain."
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
  // --- CORE ---
  { id: 1, name: "ALU", category: 'University', description: "African Leadership University - Innovative leadership training in STEM and social impact.", logo: "🎓", recommended: true, url: "https://www.alueducation.com/" },
  { id: 2, name: "ALX Africa", category: 'Training', description: "Elite software engineering and data science training for Africa's top talent.", logo: "💻", recommended: true, url: "https://www.alxafrica.com/" },
  { id: 3, name: "ALCHE", category: 'University', description: "African Leadership College - Specialized undergraduate programmes for global leaders.", logo: "🏛️", recommended: true, url: "https://alcheducation.com/undergraduate-programmes/" },
  { id: 4, name: "UCT Program", category: 'University', description: "University of Cape Town - Africa's highest-ranked research university.", logo: "🏗️", recommended: true, url: "https://www.uct.ac.za/" },
  { id: 6, name: "Ashesi University", category: 'University', description: "Cultivating ethical leadership and critical thinking in West Africa.", logo: "🦁", recommended: true, url: "https://www.ashesi.edu.gh/" },
  { id: 7, name: "AIMS", category: 'University', description: "African Institute for Mathematical Sciences - Excellence in mathematical sciences.", logo: "∞", recommended: true, url: "https://nexteinstein.org/" },

  // --- UNIVERSITIES (20 NEW) ---
  { id: 101, name: "Wits University", category: 'University', description: "University of the Witwatersrand - A global leader in deep-level mining and tech.", logo: "💎", recommended: true, url: "https://www.wits.ac.za/" },
  { id: 102, name: "Univ of Pretoria", category: 'University', description: "Leading research university in South Africa with top-tier veterinary and engineering.", logo: "🐾", recommended: false, url: "https://www.up.ac.za/" },
  { id: 103, name: "Eduardo Mondlane", category: 'University', description: "Mozambique's flagship research institution focused on coastal ecology.", logo: "🇲🇿", recommended: false, url: "https://www.uem.mz/" },
  { id: 104, name: "Univ of Khartoum", category: 'University', description: "Sudan's premier center for natural sciences and desert engineering.", logo: "🏜️", recommended: false, url: "https://uofk.edu/" },
  { id: 105, name: "Univ of Zambia", category: 'University', description: "Zambia's intellectual powerhouse for engineering and mineral sciences.", logo: "🇿🇲", recommended: false, url: "https://www.unza.zm/" },
  { id: 106, name: "Univ of Zimbabwe", category: 'University', description: "Top-ranked institution for STEM and innovation in Southern Africa.", logo: "🇿🇼", recommended: false, url: "https://www.uz.ac.zw/" },
  { id: 107, name: "Univ of Botswana", category: 'University', description: "A hub for information technology and environmental research in the Kalahari.", logo: "🇧🇼", recommended: false, url: "https://www.ub.bw/" },
  { id: 108, name: "Univ of Namibia", category: 'University', description: "UNAM - Leading the way in renewable energy and marine biology.", logo: "🇳🇦", recommended: false, url: "https://www.unam.edu.na/" },
  { id: 109, name: "Univ of Yaoundé I", category: 'University', description: "Cameroon's center for mathematical and physical sciences.", logo: "🇨🇲", recommended: false, url: "https://www.uy1.uninet.cm/" },
  { id: 110, name: "Univ of Abidjan", category: 'University', description: "Ivory Coast's flagship university for engineering and social science.", logo: "🇨🇮", recommended: false, url: "https://www.univ-fhb.edu.ci/" },
  { id: 111, name: "Univ of Lagos", category: 'University', description: "UNILAG - Nigeria's hub for creative and tech-enabled business.", logo: "🇳🇬", recommended: true, url: "https://unilag.edu.ng/" },
  { id: 112, name: "Univ of Nairobi", category: 'University', description: "Kenya's leading institution for architectural and medical research.", logo: "🇰🇪", recommended: true, url: "https://uonbi.ac.ke/" },
  { id: 113, name: "Makerere Univ", category: 'University', description: "Uganda's historical giant in medicine and social research.", logo: "🇺🇬", recommended: true, url: "https://www.mak.ac.ug/" },
  { id: 114, name: "Stellenbosch Univ", category: 'University', description: "Specialized in viticulture, engineering, and astrophysics in South Africa.", logo: "🔭", recommended: false, url: "https://www.sun.ac.za/" },
  { id: 115, name: "Jimma University", category: 'University', description: "Ethiopia's leader in community-based medical education.", logo: "🇪🇹", recommended: false, url: "https://www.ju.edu.et/" },
  { id: 116, name: "KNUST Ghana", category: 'University', description: "Kwame Nkrumah Univ of Science & Tech - Engineering excellence.", logo: "🛠️", recommended: true, url: "https://www.knust.edu.gh/" },
  { id: 117, name: "Rhodes University", category: 'University', description: "Famous for pharmacy, journalism, and humanities in South Africa.", logo: "🏛️", recommended: false, url: "https://www.ru.ac.za/" },
  { id: 118, name: "Univ of Mauritius", category: 'University', description: "Leading research in the Blue Economy and maritime technology.", logo: "🌊", recommended: false, url: "https://uom.ac.mu/" },
  { id: 119, name: "Univ of Rwanda", category: 'University', description: "Powering Rwanda's ICT and healthcare transformation.", logo: "🇷🇼", recommended: false, url: "https://ur.ac.rw/" },
  { id: 120, name: "Univ of Malawi", category: 'University', description: "Advancing agricultural and educational sciences in the Warm Heart of Africa.", logo: "🇲🇼", recommended: false, url: "https://www.unima.ac.mw/" },

  // --- FELLOWSHIPS (20 NEW) ---
  { id: 201, name: "Rhodes Scholarship", category: 'Fellowship', description: "World's most prestigious postgraduate scholarship for African students to Oxford.", logo: "🎓", recommended: true, url: "https://www.rhodeshouse.ox.ac.uk/" },
  { id: 202, name: "Chevening Africa", category: 'Fellowship', description: "UK government's global scholarship program for future leaders.", logo: "🇬🇧", recommended: true, url: "https://www.chevening.org/" },
  { id: 203, name: "Commonwealth Fellows", category: 'Fellowship', description: "Excellence and academic exchange within the Commonwealth nations.", logo: "🤝", recommended: false, url: "https://cscuk.fcdo.gov.uk/" },
  { id: 204, name: "L'Oréal Women Science", category: 'Fellowship', description: "Supporting young female scientists in Sub-Saharan Africa.", logo: "👩‍🔬", recommended: true, url: "https://www.fondationloreal.com/" },
  { id: 205, name: "Humphrey Fellowship", category: 'Fellowship', description: "Professional exchange program in the USA for mid-career leaders.", logo: "🇺🇸", recommended: false, url: "https://www.humphreyfellowship.org/" },
  { id: 206, name: "Ibrahim Leadership", category: 'Fellowship', description: "Training African leaders within global institutions (AfDB, ECA).", logo: "🏛️", recommended: true, url: "https://moibrahim.foundation/fellowships" },
  { id: 207, name: "Ford Foundation", category: 'Fellowship', description: "Social justice and equity-focused leadership development.", logo: "💡", recommended: false, url: "https://www.fordfoundation.org/" },
  { id: 208, name: "Gates Cambridge", category: 'Fellowship', description: "Full-cost scholarships for Africans to study at the University of Cambridge.", logo: "🏫", recommended: true, url: "https://www.gatescambridge.org/" },
  { id: 209, name: "Rotary Peace Fellow", category: 'Fellowship', description: "Training professionals to become agents of peace and conflict resolution.", logo: "🕊️", recommended: false, url: "https://www.rotary.org/en/our-programs/peace-fellowships" },
  { id: 210, name: "Skoll Scholarship", category: 'Fellowship', description: "Support for social entrepreneurs pursuing an MBA at Oxford Saïd.", logo: "📈", recommended: false, url: "https://www.skollscholarship.org/" },
  { id: 211, name: "Dell Young Leaders", category: 'Fellowship', description: "Supporting high-potential students from low-income backgrounds in SA.", logo: "💻", recommended: false, url: "https://www.dellyoungleaders.org.za/" },
  { id: 212, name: "WAAW Foundation", category: 'Fellowship', description: "Working to Advance STEM Education for African Women.", logo: "🔬", recommended: true, url: "https://waawfoundation.org/" },
  { id: 213, name: "Zawadi Africa", category: 'Fellowship', description: "Leadership development and scholarships for academically gifted girls.", logo: "🎒", recommended: false, url: "https://zawadiafrica.org/" },
  { id: 214, name: "Canon Collins Trust", category: 'Fellowship', description: "Supporting social justice research through postgraduate study.", logo: "⚖️", recommended: false, url: "https://www.canoncollins.org/" },
  { id: 215, name: "Schmidt Fellows", category: 'Fellowship', description: "Interdisciplinary science fellowship for early-career PhDs.", logo: "⚛️", recommended: true, url: "https://schmidtsciencefellows.org/" },
  { id: 216, name: "Tony Elumelu Fund", category: 'Fellowship', description: "Empowering African entrepreneurs with capital and training.", logo: "💰", recommended: true, url: "https://www.tonyelumelufoundation.org/" },
  { id: 217, name: "Echoing Green", category: 'Fellowship', description: "Seed stage support for social justice entrepreneurs in Africa.", logo: "🌱", recommended: false, url: "https://www.echoinggreen.org/" },
  { id: 218, name: "AU Youth Volunteers", category: 'Fellowship', description: "African Union's youth development through volunteering.", logo: "🇦🇺", recommended: false, url: "https://au.int/en/youth-volunteer-corps" },
  { id: 219, name: "Obama Leaders Africa", category: 'Fellowship', description: "Ethical leadership training for rising stars on the continent.", logo: "🌍", recommended: true, url: "https://www.obama.org/leaders/africa/" },
  { id: 220, name: "Mandela Rhodes Fund", category: 'Fellowship', description: "Building exceptional leadership capacity in Africa.", logo: "🦁", recommended: true, url: "https://mandelarhodes.org/" },

  // --- TRAINING HUBS (30 NEW) ---
  { id: 301, name: "Node Eight", category: 'Training', description: "Innovation hub in Ho, Ghana focusing on regional tech ecosystems.", logo: "📍", recommended: false, url: "https://nodeeight.org/" },
  { id: 302, name: "Kumasi Hive", category: 'Training', description: "Hardware and digital manufacturing space in Ghana.", logo: "🐝", recommended: true, url: "https://kumasihive.com/" },
  { id: 303, name: "Sote Hub", category: 'Training', description: "Vibrant startup incubator in Voi, Kenya.", logo: "🇰🇪", recommended: false, url: "https://sotehub.com/" },
  { id: 304, name: "LakeHub", category: 'Training', description: "The tech heartbeat of Kisumu, Kenya.", logo: "🌊", recommended: false, url: "https://lakehub.co.ke/" },
  { id: 305, name: "Swahilipot Hub", category: 'Training', description: "Mombasa's hub for creative and technology talent.", logo: "🏺", recommended: false, url: "https://swahilipot.com/" },
  { id: 306, name: "iHub Nairobi", category: 'Training', description: "Kenya's premier innovation and incubation space.", logo: "🏢", recommended: true, url: "https://ihub.co.ke/" },
  { id: 307, name: "Nailab", category: 'Training', description: "Accelerator for early-stage tech startups in Kenya.", logo: "🧪", recommended: false, url: "https://nailab.co.ke/" },
  { id: 308, name: "CcHUB Design Lab", category: 'Training', description: "Design-led innovation hub in Kigali, Rwanda.", logo: "🖍️", recommended: true, url: "https://cchubnigeria.com/designlab/" },
  { id: 309, name: "Norrsken Kigali", category: 'Training', description: "Europe's biggest impact hub's first African home.", logo: "🏙️", recommended: true, url: "https://www.norrsken.org/kigali" },
  { id: 310, name: "2253 Hub", category: 'Training', description: "Algeria's center for digital entrepreneurship.", logo: "🇩🇿", recommended: false, url: "https://2253hub.dz/" },
  { id: 311, name: "Flat6Labs Cairo", category: 'Training', description: "Leading seed-stage accelerator in North Africa.", logo: "🇪🇬", recommended: true, url: "https://www.flat6labs.com/cairo/" },
  { id: 312, name: "Cogite Tunisia", category: 'Training', description: "Tunisia's first co-working space and impact community.", logo: "🇹🇳", recommended: false, url: "https://cogite.tn/" },
  { id: 313, name: "Technopark Morocco", category: 'Training', description: "Specialized hub for IT startups in Casablanca.", logo: "🇲🇦", recommended: false, url: "https://www.technopark.ma/" },
  { id: 314, name: "M-Lab SA", category: 'Training', description: "South Africa's mobile applications laboratory.", logo: "📱", recommended: false, url: "https://mlab.co.za/" },
  { id: 315, name: "Bandwidth Barn", category: 'Training', description: "Cape Town's oldest and most respected tech hub.", logo: "🏚️", recommended: false, url: "https://www.bandwidthbarn.org/" },
  { id: 316, name: "Silicon Cape", category: 'Training', description: "Promoting Cape Town as a global tech destination.", logo: "⛰️", recommended: true, url: "https://www.siliconcape.com/" },
  { id: 317, name: "Wennovation Hub", category: 'Training', description: "Pioneer startup incubator in Lagos and Ibadan.", logo: "💡", recommended: false, url: "https://wennovationhub.org/" },
  { id: 318, name: "nHub Jos", category: 'Training', description: "Building a tech ecosystem in Northern Nigeria.", logo: "⛰️", recommended: false, url: "https://nhubng.com/" },
  { id: 319, name: "Iceaddis", category: 'Training', description: "Ethiopia's first innovation hub and startup incubator.", logo: "🇪🇹", recommended: true, url: "https://www.iceaddis.com/" },
  { id: 320, name: "Smart Lab TZ", category: 'Training', description: "Next-gen innovation hub in Dar es Salaam.", logo: "🇹🇿", recommended: false, url: "https://smartlab.co.tz/" },
  { id: 321, name: "Decagon Academy", category: 'Training', description: "Nigeria's elite software engineering bootcamp.", logo: "🔟", recommended: true, url: "https://decagon.institute/" },
  { id: 322, name: "Moringa School", category: 'Training', description: "Project-based software training in Kenya and Ghana.", logo: "🌳", recommended: true, url: "https://moringaschool.com/" },
  { id: 323, name: "Semicolon Africa", category: 'Training', description: "Preparing the next generation of software engineers.", logo: "🖋️", recommended: false, url: "https://semicolon.africa/" },
  { id: 324, name: "AltSchool Africa", category: 'Training', description: "Skill-to-market software engineering platform.", logo: "🏫", recommended: true, url: "https://altschoolafrica.com/" },
  { id: 325, name: "Enyata Academy", category: 'Training', description: "Immersive software development training for the top 1%.", logo: "🚀", recommended: false, url: "https://enyata.com/academy" },
  { id: 326, name: "Zindi Africa AI", category: 'Training', description: "The leading AI competition platform for Africa.", logo: "🏁", recommended: true, url: "https://zindi.africa/" },
  { id: 327, name: "Data Science Nigeria", category: 'Training', description: "Building a world-class AI ecosystem for social impact.", logo: "🤖", recommended: true, url: "https://www.datasciencenigeria.org/" },
  { id: 328, name: "MEST Africa Hub", category: 'Training', description: "Seed funding and tech entrepreneurship training.", logo: "🚀", recommended: true, url: "https://meltwater.org/" },
  { id: 329, name: "BongoHive Zambia", category: 'Training', description: "Technology and innovation hub for startups.", logo: "🐝", recommended: false, url: "https://bongohive.co.zm/" },
  { id: 330, name: "Outbox Uganda", category: 'Training', description: "Innovation hub helping startups to scale.", logo: "📦", recommended: false, url: "https://outbox.co.ug/" }
];

export const SKILLS: SkillProgress[] = [
  { skill: "Problem Solver", progress: 0, badge: "Bronze", icon: "🎯" },
  { skill: "Systems Thinker", progress: 0, badge: "Bronze", icon: "👥" },
  { skill: "Innovator", progress: 0, badge: "Bronze", icon: "💡" }
];
