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

      // The data from Supabase already matches our Pet interface
      setPets(data as Pet[]);
      
      // Only set current pet if we don't have one or if the current pet no longer exists
      if (!currentPet) {
        if (data.length > 0) {
          setCurrentPet(data[0] as Pet);
        }
      } else {
        // Check if current pet still exists in the new data
        const currentPetExists = data.some(pet => pet.id === currentPet.id);
        if (!currentPetExists && data.length > 0) {
          setCurrentPet(data[0] as Pet);
        } else if (currentPetExists) {
          // Update current pet with latest data
          const updatedPet = data.find(pet => pet.id === currentPet.id);
          if (updatedPet) {
            setCurrentPet(updatedPet as Pet);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pets');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate age from birth date
  // const calculateAge = (birthDate: string): number => {
  //   const birth = new Date(birthDate);
  //   const today = new Date();
  //   let age = today.getFullYear() - birth.getFullYear();
  //   const monthDiff = today.getMonth() - birth.getMonth();
    
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
  //     age--;
  //   }
    
  //   return age;
  // };

  useEffect(() => {
    fetchPets();

    // Set up real-time subscription
    if (user) {
      const subscription = supabase
        .channel('pet_profiles_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pet_profiles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            fetchPets(); // Refresh data when changes occur
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

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