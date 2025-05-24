import React from 'react';
import { PawPrint } from 'lucide-react';
import { Pet } from '../../types';

interface PetProfileProps {
  pet: Pet;
}

interface Age {
  years: number;
  months: number;
}

const calculateAge = (birthDate: string): Age => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

const formatAge = (age: Age): string => {
  if (age.years === 0) {
    return `${age.months} month${age.months !== 1 ? 's' : ''} old`;
  }
  if (age.months === 0) {
    return `${age.years} year${age.years !== 1 ? 's' : ''} old`;
  }
  return `${age.years} year${age.years !== 1 ? 's' : ''} and ${age.months} month${age.months !== 1 ? 's' : ''} old`;
};

const PetProfile: React.FC<PetProfileProps> = ({ pet }) => {
  console.log(pet);
  if (!pet) {
    return null;
  }

  const age = pet.birth_date ? calculateAge(pet.birth_date) : null;
  
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <PawPrint className="w-6 h-6 text-blue-500" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{pet.pet_name}</h3>
          <p className="text-sm text-gray-600">{pet.breed}</p>
          {age !== null && <p className="text-sm text-gray-500">{formatAge(age)}</p>}
        </div>
      </div>
    </div>
  );
};

export default PetProfile; 