
export type TabType = 'home' | 'opportunities' | 'community' | 'leaderboard' | 'profile';

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

export type MissionType = 'Standard' | 'Rhythm' | 'Data-Stream';

export interface Mission {
  id: number;
  worldId: string; 
  title: string;
  story: string;
  difficulty: 'Medium' | 'Hard' | 'Expert';
  xp: number;
  locked: boolean;
  bgGradient: string;
  completed: boolean;
  environment: string;
  type?: MissionType;
}

export interface Opportunity {
  id: number;
  name: string;
  description: string;
  logo: string;
  recommended: boolean;
  url: string;
  category: 'Scholarship' | 'University' | 'Fellowship' | 'Training';
}

export interface Player {
  rank: number;
  username: string;
  xp: number;
  avatar: string;
  isUser?: boolean;
  id?: string;
  lastActive?: number;
}

export interface NeuralSignal {
  id: string;
  commander: string;
  action: string;
  timestamp: number;
}

export interface CommunitySquad {
  id: string;
  name: string;
  members: number;
  goalXp: number;
  currentXp: number;
  icon: string;
  status: 'Active' | 'Locked';
}

export interface GlobalMesh {
  commanders: Player[];
  signals: NeuralSignal[];
}

export interface SkillProgress {
  skill: string;
  progress: number;
  badge: 'Bronze' | 'Silver' | 'Gold';
  icon: string;
}
