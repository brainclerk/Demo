import React from 'react';
import { Check } from 'lucide-react';
import { FormSection, FormSectionInfo } from './types/form';
import classNames from 'classnames';

interface FormProgressProps {
  sections: FormSectionInfo[];
  currentSection: FormSection;
  completedSections: Set<FormSection>;
  onSectionClick: (section: FormSection) => void;
}

const FormProgress: React.FC<FormProgressProps> = ({
  sections,
  currentSection,
  completedSections,
  onSectionClick,
}) => {
  return (
    <div className="hidden md:block">
      <div className="flex items-center justify-between">
        {sections.map((section, index) => {
          const isCompleted = completedSections.has(section.id);
          const isCurrent = section.id === currentSection;
          
          return (
            <React.Fragment key={section.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={() => {
                    if (isCompleted || isCurrent) {
                      onSectionClick(section.id);
                    }
                  }}
                  className={classNames(
                    "w-10 h-10 rounded-full flex items-center justify-center transition duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400",
                    {
                      "bg-blue-400 text-white": isCompleted || isCurrent,
                      "bg-slate-200 text-slate-500": !isCompleted && !isCurrent,
                      "cursor-pointer": isCompleted || isCurrent,
                      "cursor-not-allowed": !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </button>
                <span 
                  className={classNames(
                    "text-xs mt-2 font-medium text-center max-w-[80px]",
                    {
                      "text-blue-500": isCurrent,
                      "text-slate-800": isCompleted && !isCurrent,
                      "text-slate-500": !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {section.title}
                </span>
              </div>
              
              {index < sections.length - 1 && (
                <div className="flex-1 mx-2">
                  <div 
                    className={classNames(
                      "h-0.5 w-full",
                      {
                        "bg-blue-400": completedSections.has(section.id),
                        "bg-slate-200": !completedSections.has(section.id),
                      }
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;