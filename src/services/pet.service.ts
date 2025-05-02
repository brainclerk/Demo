import { supabase } from '../lib/supabase';
import { FormData } from '../Onboarding/OnboardingForm/types/form';

class PetService {
    private static instance: PetService;

    private constructor() { }

    public static getInstance(): PetService {
        if (!PetService.instance) {
            PetService.instance = new PetService();
        }
        return PetService.instance;
    }

    async createPetProfile(userId: string, formData: FormData): Promise<void> {
        try {
            const { error } = await supabase
                .from('pet_profiles')
                .insert([
                    {
                        user_id: userId,
                        pet_name: formData.petName,
                        breed: formData.breed,
                        breed_type: formData.breedType,
                        sex: formData.sex,
                        birth_date: formData.birthDate,
                        weight: formData.weight,
                        size_category: formData.sizeCategory,
                        medical_conditions: formData.medicalConditions,
                        other_condition: formData.otherCondition,
                        current_medications: formData.currentMedications,
                        surgeries_or_procedures: formData.surgeriesOrProcedures,
                        surgery_date: formData.surgeryDate,
                        vet_records: formData.vetRecords,
                        diet_types: formData.dietTypes,
                        other_diet_type: formData.otherDietType,
                        main_brands: formData.mainBrands,
                        takes_supplements: formData.takesSupplements,
                        supplement_details: formData.supplementDetails,
                        food_allergies: formData.foodAllergies,
                        activity_level: formData.activityLevel,
                        activity_minutes: formData.activityMinutes,
                        uses_tracking_device: formData.usesTrackingDevice,
                        tracking_device_details: formData.trackingDeviceDetails,
                        alone_in_day: formData.aloneInDay,
                        hours_alone: formData.hoursAlone,
                        temperament: formData.temperament,
                        recent_behaviors: formData.recentBehaviors,
                        current_symptoms: formData.currentSymptoms,
                        major_health_events: formData.majorHealthEvents,
                        top_concern: formData.topConcern,
                        improvement_goals: formData.improvementGoals,
                        care_confidence: formData.careConfidence,
                        interests: formData.interests
                    }
                ]);

            if (error) throw error;
        } catch (error) {
            console.error('Error creating pet profile:', error);
            throw error;
        }
    }
}

export const petService = PetService.getInstance(); 