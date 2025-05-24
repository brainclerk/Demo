import { supabase } from '../lib/supabase';
import { FormData, VetRecord } from '../Onboarding/OnboardingForm/types/form';

class PetService {
    private static instance: PetService;

    private constructor() { }

    public static getInstance(): PetService {
        if (!PetService.instance) {
            PetService.instance = new PetService();
        }
        return PetService.instance;
    }

    private async uploadFiles(files: (File | VetRecord)[], userId: string, petName: string): Promise<{ filename: string; url: string }[]> {
        try {
            const uploadPromises = files.map(async (file) => {
                // If it's already a VetRecord, return it as is
                if ('url' in file) {
                    return file;
                }

                // Create a unique file path
                const fileExt = file.name.split('.').pop();
                const sanitizedPetName = petName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                const fileName = `${sanitizedPetName}-vet-records-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${userId}/${fileName}`;

                // Upload file to Supabase Storage
                const { error: uploadError, data } = await supabase.storage
                    .from('pet-documents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get the public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('pet-documents')
                    .getPublicUrl(filePath);

                return {
                    filename: file.name,
                    url: publicUrl
                };
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    private async deleteFiles(fileUrls: string[]): Promise<void> {
        try {
            const deletePromises = fileUrls.map(async (url) => {
                // Extract the file path from the URL
                const filePath = url.split('/').slice(-2).join('/'); // Gets userId/filename
                if (filePath) {
                    const { error } = await supabase.storage
                        .from('pet-documents')
                        .remove([filePath]);
                    
                    if (error) throw error;
                }
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting files:', error);
            throw error;
        }
    }

    async createPetProfile(userId: string, formData: FormData): Promise<boolean> {
        try {
            let vetRecords: { filename: string; url: string }[] = [];

            // If there are files to upload, handle them first
            if (Array.isArray(formData.vetRecords) && formData.vetRecords.length > 0) {
                console.log('Uploading vet records');
                // Filter out any existing VetRecords (they already have URLs)
                const newFiles = formData.vetRecords.filter(record => !('url' in record)) as File[];
                const existingRecords = formData.vetRecords.filter(record => 'url' in record) as VetRecord[];
                
                // Upload new files
                if (newFiles.length > 0) {
                    const uploadedRecords = await this.uploadFiles(newFiles, userId, formData.petName);
                    vetRecords = [...existingRecords, ...uploadedRecords];
                } else {
                    vetRecords = existingRecords;
                }
            }

            const { error, data } = await supabase
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
                        vet_records: vetRecords,
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
                ])
                .select()
                .single();

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error creating pet profile:', error);
            throw error;
        }
    }

    async updatePetProfile(userId: string, petId: string, formData: FormData): Promise<boolean> {
        try {
            console.log('Updating pet profile', formData);
            let vetRecords: { filename: string; url: string }[] = [];

            // Get current pet profile to compare vet records
            const { data: currentProfile, error: fetchError } = await supabase
                .from('pet_profiles')
                .select('vet_records')
                .eq('id', petId)
                .single();

            if (fetchError) throw fetchError;

            // Find records to delete (records that exist in current profile but not in formData)
            const currentRecords = (currentProfile?.vet_records || []) as VetRecord[];
            const newRecords = (formData.vetRecords || []) as VetRecord[];
            const recordsToDelete = currentRecords.filter(
                (current) => !newRecords.some((newRecord) => newRecord.url === current.url)
            );

            // Delete removed files from storage
            if (recordsToDelete.length > 0) {
                await this.deleteFiles(recordsToDelete.map((record) => record.url));
            }

            // Handle new file uploads
            if (Array.isArray(formData.vetRecords) && formData.vetRecords.length > 0) {
                console.log('Uploading vet records');
                // Filter out any existing VetRecords (they already have URLs)
                const newFiles = formData.vetRecords.filter(record => !('url' in record)) as File[];
                const existingRecords = formData.vetRecords.filter(record => 'url' in record) as VetRecord[];
                
                // Upload new files
                if (newFiles.length > 0) {
                    const uploadedRecords = await this.uploadFiles(newFiles, userId, formData.petName);
                    vetRecords = [...existingRecords, ...uploadedRecords];
                } else {
                    vetRecords = existingRecords;
                }
            }

            const { error, data } = await supabase
                .from('pet_profiles')
                .update({
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
                    vet_records: vetRecords,
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
                })
                .eq('id', petId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error updating pet profile:', error);
            throw error;
        }
    }
}

export const petService = PetService.getInstance(); 