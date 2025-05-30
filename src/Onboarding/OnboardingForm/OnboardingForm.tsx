import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { FormData } from './types/form';
import { FormSection, formSections, initialFormData } from './types/form';
import FormProgress from './FormProgress';
import BasicInfoSection from './sections/BasicInfoSection';
import MedicalHistorySection from './sections/MedicalHistorySection';
import DietSection from './sections/DietSection';
import LifestyleSection from './sections/LifestyleSection';
import BehaviorHealthSection from './sections/BehaviorHealthSection';
import OwnerSentimentSection from './sections/OwnerSentimentSection';
import ReviewSection from './sections/ReviewSection';
import FormNavigation from './FormNavigation';
import { petService } from '../../services/pet.service';
import { useAuth } from '../../contexts/AuthContext';
import { Pet } from '../../types';
import { usePet } from '../../contexts/PetContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingFormProps {
  onComplete?: () => void;
  initialData?: Partial<FormData> | Pet;
  petId?: string;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete, initialData, petId }) => {
  const { user } = useAuth();
  const { refreshPets } = usePet();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<FormSection>('basicInfo');
  const [completed, setCompleted] = useState<Set<FormSection>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<FormData>({
    defaultValues: {
      ...initialFormData,
      ...(initialData || {}),
      vetRecords: 'vet_records' in (initialData || {}) 
        ? (initialData as Pet).vet_records 
        : (initialData as Partial<FormData>)?.vetRecords || null
    },
    mode: 'onChange',
  });
  
  const { handleSubmit, watch } = methods;
  
  // Watch all form values
  const formValues = watch();
  
  // Log form values whenever they change
  // useEffect(() => {
  //   console.log('Current form values:', formValues);
  // }, [formValues]);
  
  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      console.log(petId);
      console.log('Submitting form data:', data);
      
      let result;
      if (petId) {
        // Update existing pet profile
        result = await petService.updatePetProfile(user.id, petId, data);
      } else {
        // Create new pet profile
        result = await petService.createPetProfile(user.id, data);
      }

      console.log('Result:', result);
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
      // Refresh pet data in the context after navigation
      await refreshPets();
      
      // Only call onComplete after the Supabase actions are complete
      if (onComplete && result !== undefined) {
        onComplete();
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the pet profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goToNextSection = async () => {
    const currentIndex = formSections.findIndex(section => section.id === currentSection);
    
    if (currentIndex < formSections.length - 1) {
      // Mark current section as completed
      const newCompleted = new Set(completed);
      newCompleted.add(currentSection);
      setCompleted(newCompleted);
      
      // Move to next section
      setCurrentSection(formSections[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousSection = () => {
    const currentIndex = formSections.findIndex(section => section.id === currentSection);
    
    if (currentIndex > 0) {
      setCurrentSection(formSections[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  const goToSection = (section: FormSection) => {
    setCurrentSection(section);
    window.scrollTo(0, 0);
  };
  
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'basicInfo':
        return <BasicInfoSection />;
      case 'medicalHistory':
        return <MedicalHistorySection />;
      case 'diet':
        return <DietSection />;
      case 'lifestyle':
        return <LifestyleSection />;
      case 'behaviorHealth':
        return <BehaviorHealthSection />;
      case 'ownerSentiment':
        return <OwnerSentimentSection />;
      case 'review':
        return <ReviewSection onSubmit={handleSubmit(onSubmit)} />;
      default:
        return <BasicInfoSection />;
    }
  };
  
  const currentSectionInfo = formSections.find(section => section.id === currentSection);
  
  return (
    <FormProvider {...methods}>
      <div className="mb-8">
        <FormProgress 
          sections={formSections} 
          currentSection={currentSection}
          completedSections={completed}
          onSectionClick={goToSection}
        />
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentSectionInfo?.title}</h2>
          <p className="text-slate-500">{currentSectionInfo?.description}</p>
        </div>
        
        <div className="form-section mb-6">
          {renderCurrentSection()}
        </div>
        
        <FormNavigation 
          currentSection={currentSection}
          isFirstSection={currentSection === 'basicInfo'}
          isLastSection={currentSection === 'review'}
          onNext={
            currentSection === 'review' 
              ? handleSubmit(onSubmit) 
              : () => methods.trigger().then(isValid => {
                  if (isValid) goToNextSection();
                })
          }
          onPrevious={goToPreviousSection}
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </FormProvider>
  );
};

export default OnboardingForm;