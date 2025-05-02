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
    vetRecords: File | null;

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