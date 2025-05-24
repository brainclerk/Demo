import React from 'react';
import { Sparkles, MoreHorizontal, PawPrint, Stethoscope, FlaskConical, Database } from 'lucide-react';
import { mockShortcuts } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../contexts/PetContext';
import { VetRecord } from '../../Onboarding/OnboardingForm/types/form';

const Shortcuts: React.FC = () => {
  const navigate = useNavigate();
  const { currentPet } = usePet();

  const handleShortcutClick = (shortcut: typeof mockShortcuts[0]) => {
    if (shortcut.id === '1') { // Pet Profile shortcut
      if (currentPet) {
        const formData = {
          petName: currentPet.pet_name,
          breed: currentPet.breed,
          breedType: currentPet.breed_type,
          sex: currentPet.sex,
          birthDate: new Date(currentPet.birth_date),
          weight: currentPet.weight,
          sizeCategory: currentPet.size_category,
          medicalConditions: currentPet.medical_conditions,
          otherCondition: currentPet.other_condition,
          currentMedications: currentPet.current_medications,
          surgeriesOrProcedures: currentPet.surgeries_or_procedures,
          surgeryDate: currentPet.surgery_date ? new Date(currentPet.surgery_date) : null,
          vetRecords: currentPet.vet_records as VetRecord[] | null,
          dietTypes: currentPet.diet_types,
          otherDietType: currentPet.other_diet_type,
          mainBrands: currentPet.main_brands,
          takesSupplements: currentPet.takes_supplements,
          supplementDetails: currentPet.supplement_details,
          foodAllergies: currentPet.food_allergies,
          activityLevel: currentPet.activity_level,
          activityMinutes: currentPet.activity_minutes,
          usesTrackingDevice: currentPet.uses_tracking_device,
          trackingDeviceDetails: currentPet.tracking_device_details,
          aloneInDay: currentPet.alone_in_day,
          hoursAlone: currentPet.hours_alone,
          temperament: currentPet.temperament,
          recentBehaviors: currentPet.recent_behaviors,
          currentSymptoms: currentPet.current_symptoms,
          majorHealthEvents: currentPet.major_health_events,
          topConcern: currentPet.top_concern,
          improvementGoals: currentPet.improvement_goals,
          careConfidence: currentPet.care_confidence,
          interests: currentPet.interests
        };
        navigate('/onboarding', { state: { initialData: formData, petId: currentPet.id } });
      }
    } else {
      // For other shortcuts, we'll just show a message for now
      console.log(`Navigating to ${shortcut.path}`);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-500 font-medium">Your</span>
          <span className="text-gray-700 font-medium ml-1">Shortcuts</span>
        </div>
        {/* <button className="text-sm text-gray-600 font-medium">More</button> */}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {mockShortcuts.map((shortcut) => (
          <button 
            key={shortcut.id}
            onClick={() => handleShortcutClick(shortcut)}
            className={`${shortcut.color} p-4 rounded-md flex flex-col items-center justify-center text-center transition-transform hover:scale-105`}
          >
            {shortcut.icon === 'paw-print' && <PawPrint className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'stethoscope' && <Stethoscope className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'flask-conical' && <FlaskConical className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'database' && <Database className="w-6 h-6 mb-1 text-gray-700" />}
            <span className="text-xs font-medium text-gray-700">{shortcut.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;