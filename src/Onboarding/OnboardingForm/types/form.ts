export interface VetRecord {
    filename: string;
    url: string;
}

export interface FormData {
    // Basic Info
    petName: string;
    breed: string;
    breedType: 'mixed' | 'purebred' | '';
    sex: 'male' | 'female' | 'neutered' | 'spayed' | '';
    birthDate: Date | null;
    weight: string;
    sizeCategory: 'small' | 'medium' | 'large' | 'giant' | '';

    // Medical History
    medicalConditions: string[];
    otherCondition: string;
    currentMedications: string;
    surgeriesOrProcedures: string;
    surgeryDate: Date | null;
    vetRecords: VetRecord[] | null;

    // Diet
    dietTypes: string[];
    otherDietType: string;
    mainBrands: string;
    takesSupplements: boolean;
    supplementDetails: string;
    foodAllergies: string;

    // Lifestyle
    activityLevel: 'low' | 'moderate' | 'high' | '';
    activityMinutes: number;
    usesTrackingDevice: boolean;
    trackingDeviceDetails: string;
    aloneInDay: boolean;
    hoursAlone: number;

    // Behavior & Health
    temperament: 'calm' | 'friendly' | 'energetic' | 'anxious' | 'aggressive' | '';
    recentBehaviors: string[];
    currentSymptoms: string[];
    majorHealthEvents: string;

    // Owner Sentiment
    topConcern: string;
    improvementGoals: string;
    careConfidence: number;
    interests: string[];
}

export type FormSection =
  | 'basicInfo'
  | 'medicalHistory'
  | 'diet'
  | 'lifestyle'
  | 'behaviorHealth'
  | 'ownerSentiment'
  | 'review';

export interface FormSectionInfo {
  id: FormSection;
  title: string;
  description: string;
}

export const formSections: FormSectionInfo[] = [
  {
    id: 'basicInfo',
    title: 'Basic Info',
    description: 'Let\'s start with some basic information about your pet',
  },
  {
    id: 'medicalHistory',
    title: 'Medical History',
    description: 'Information about your pet\'s medical history and current conditions',
  },
  {
    id: 'diet',
    title: 'Diet',
    description: 'Details about what and how your pet eats',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    description: 'Information about your pet\'s daily activities and routine',
  },
  {
    id: 'behaviorHealth',
    title: 'Behavior & General Health',
    description: 'Understanding your pet\'s behavior and current health status',
  },
  {
    id: 'ownerSentiment',
    title: 'Your Concerns & Goals',
    description: 'Help us understand your concerns and what you\'d like to improve',
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your pet\'s health profile before submission',
  },
];

export const initialFormData: FormData = {
  // Basic Info
  petName: '',
  breed: '',
  breedType: '',
  sex: '',
  birthDate: null,
  weight: '',
  sizeCategory: '',

  // Medical History
  medicalConditions: [],
  otherCondition: '',
  currentMedications: '',
  surgeriesOrProcedures: '',
  surgeryDate: null,
  vetRecords: null,

  // Diet
  dietTypes: [],
  otherDietType: '',
  mainBrands: '',
  takesSupplements: false,
  supplementDetails: '',
  foodAllergies: '',

  // Lifestyle
  activityLevel: '',
  activityMinutes: 30,
  usesTrackingDevice: false,
  trackingDeviceDetails: '',
  aloneInDay: false,
  hoursAlone: 0,

  // Behavior & Health
  temperament: '',
  recentBehaviors: [],
  currentSymptoms: [],
  majorHealthEvents: '',

  // Owner Sentiment
  topConcern: '',
  improvementGoals: '',
  careConfidence: 3,
  interests: [],
};  
