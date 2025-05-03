export interface User {
  id: string;
  name: string;
  email: string;
  premium: boolean;
  avatar: string;
  credits: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  avatar: string;
  healthInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    vaccinations: {
      lastUpdated: Date;
      nextDue: Date;
      records: string[];
    };
    diet: {
      current: string;
      feedingSchedule: string;
      treats: string[];
      restrictions: string[];
    };
    exercise: {
      dailyRoutine: string;
      activities: string[];
      restrictions: string;
    };
    lastCheckup: Date;
    nextAppointment: Date;
  };
}

export type AgentType = 'general' | 'nutrition' | 'assessment' | 'analysis' | 'creative';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  agentType?: AgentType;
  images?: string[];
  hasMoreFiles?: boolean;
}

export interface VetHistoryItem {
  id: string;
  type: 'allergies' | 'appointment' | 'question';
  title: string;
  timestamp: Date;
}

export interface PinnedFeature {
  id: string;
  title: string;
  icon: string;
  path: string;
}

export interface NutritionProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface NutritionOrder {
  id: string;
  nextDelivery: Date;
  frequency: string;
  status: 'active' | 'paused' | 'cancelled';
  products: NutritionProduct[];
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface Shortcut {
  id: string;
  title: string;
  icon: string;
  color: string;
  path: string;
}