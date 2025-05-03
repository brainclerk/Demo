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
          className="btn-secondary flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
      ) : (
        <div></div>
      )}
      
      {!isLastSection && (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;