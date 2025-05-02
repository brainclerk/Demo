import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface PetContextType {
  pets: Pet[];
  currentPet: Pet | null;
  isLoading: boolean;
  error: string | null;
  setCurrentPet: (pet: Pet) => void;
  refreshPets: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setPets([]);
        setCurrentPet(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('pet_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Pet type
      const transformedPets: Pet[] = data.map(pet => ({
        id: pet.id,
        name: pet.pet_name,
        species: 'Dog', // You might want to add this to your pet_profiles table
        breed: pet.breed,
        age: pet.birth_date ? calculateAge(pet.birth_date) : 0,
        weight: parseFloat(pet.weight) || 0,
        avatar: '', // You might want to add this to your pet_profiles table
        healthInfo: {
          allergies: pet.food_allergies ? pet.food_allergies.split(',').map((a: string) => a.trim()) : [],
          medications: pet.current_medications ? pet.current_medications.split(',').map((m: string) => m.trim()) : [],
          conditions: pet.medical_conditions || [],
          vaccinations: {
            lastUpdated: new Date(),
            nextDue: new Date(),
            records: []
          },
          diet: {
            current: pet.main_brands || '',
            feedingSchedule: '',
            treats: [],
            restrictions: pet.food_allergies ? pet.food_allergies.split(',').map((a: string) => a.trim()) : []
          },
          exercise: {
            dailyRoutine: `${pet.activity_minutes || 0} minutes ${pet.activity_level || 'moderate'} activity`,
            activities: [],
            restrictions: ''
          },
          lastCheckup: new Date(),
          nextAppointment: new Date()
        }
      }));

      setPets(transformedPets);
      
      // Set the first pet as current if none is selected
      if (!currentPet && transformedPets.length > 0) {
        setCurrentPet(transformedPets[0]);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pets');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    fetchPets();
  }, [user]); // Re-fetch when user changes

  const refreshPets = async () => {
    await fetchPets();
  };

  return (
    <PetContext.Provider value={{
      pets,
      currentPet,
      isLoading,
      error,
      setCurrentPet,
      refreshPets
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
}; 