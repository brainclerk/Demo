import { VetRecord } from '../Onboarding/OnboardingForm/types/form';

export interface User {
  id: string;
  name: string;
  email: string;
  premium: boolean;
  avatar: string;
  credits: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  user_id: string;
  pet_name: string;
  breed: string;
  breed_type: 'mixed' | 'purebred';
  sex: 'male' | 'female' | 'neutered' | 'spayed';
  birth_date: string;
  weight: string;
  size_category: 'small' | 'medium' | 'large' | 'giant';
  medical_conditions: string[];
  other_condition: string;
  current_medications: string;
  surgeries_or_procedures: string;
  surgery_date: string | null;
  vet_records: VetRecord[] | null;
  diet_types: string[];
  other_diet_type: string;
  main_brands: string;
  takes_supplements: boolean;
  supplement_details: string;
  food_allergies: string;
  activity_level: 'low' | 'moderate' | 'high';
  activity_minutes: number;
  uses_tracking_device: boolean;
  tracking_device_details: string;
  alone_in_day: boolean;
  hours_alone: number;
  temperament: 'calm' | 'friendly' | 'energetic' | 'anxious' | 'aggressive';
  recent_behaviors: string[];
  current_symptoms: string[];
  major_health_events: string;
  top_concern: string;
  improvement_goals: string;
  care_confidence: number;
  interests: string[];
  created_at: string;
  updated_at: string;
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
  type: AgentType | 'allergies' | 'appointment';
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