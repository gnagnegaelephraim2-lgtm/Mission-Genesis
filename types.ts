
export type TabType = 'home' | 'opportunities' | 'leaderboard' | 'profile';

export interface World {
  id: string;
  subject: string;
  title: string;
  progress: number;
  gradient: string;
  icon: string;
  color: string;
}

export interface Chapter {
  id: string;
  title: string;
  status: string;
  missionsCompleted: number;
  totalMissions: number;
  locked: boolean;
}

export interface Mission {
  id: number;
  worldId: string; // Direct link to parent subject
  title: string;
  story: string;
  difficulty: 'Medium' | 'Hard' | 'Expert';
  xp: number;
  locked: boolean;
  bgGradient: string;
  completed: boolean;
  environment: string;
}

export interface Opportunity {
  id: number;
  name: string;
  description: string;
  logo: string;
  recommended: boolean;
  url: string;
}

export interface Player {
  rank: number;
  username: string;
  xp: number;
  avatar: string;
  isUser?: boolean;
}

export interface SkillProgress {
  skill: string;
  progress: number;
  badge: 'Bronze' | 'Silver' | 'Gold';
  icon: string;
}
