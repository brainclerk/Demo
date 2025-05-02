import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { FormSection } from './types/form';
import { motion } from 'framer-motion';

interface FormNavigationProps {
  currentSection: FormSection;
  isFirstSection: boolean;
  isLastSection: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentSection,
  isFirstSection,
  isLastSection,
  onNext,
  onPrevious,
  isSubmitting = false,
}) => {
  return (
    <div className="flex justify-between items-center">
      {!isFirstSection ? (
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
      ) : (
        <div></div>
      )}
      
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : isLastSection ? (
          <>
            <span>Submit</span>
          </>
        ) : (
          <>
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default FormNavigation;