import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData, formSections } from '../types/form';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  sexLabels, 
  breedTypeLabels, 
  sizeCategoryLabels, 
  activityLevelLabels, 
  temperamentLabels,
  getLabel 
} from '../constants/formLabels';

interface ReviewSectionProps {
  onSubmit: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ onSubmit }) => {
  const { watch } = useFormContext<FormData>();
  const formData = watch();
  
  // Helper function to format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  };
  
  // Helper function to format array values
  const formatArray = (array: string[] | undefined) => {
    if (!array || array.length === 0) return 'None';
    return array.join(', ');
  };
  
  // Extract the first 6 sections (excluding review)
  const dataSections = formSections.slice(0, 6);
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 flex items-start"
      >
        <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <p>
          Great job completing your pet's health profile! Please review the information below 
          before submitting. You can go back to any section to make changes if needed.
        </p>
      </motion.div>
      
      {dataSections.map((section, idx) => (
        <motion.div 
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="border border-slate-200 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="font-medium text-slate-700">{section.title}</h3>
          </div>
          <div className="p-4">
            {section.id === 'basicInfo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Pet Name</p>
                  <p className="font-medium">{formData.petName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Breed</p>
                  <p className="font-medium">{formData.breed || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Breed Type</p>
                  <p className="font-medium">{getLabel(formData.breedType, breedTypeLabels)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sex</p>
                  <p className="font-medium">{getLabel(formData.sex, sexLabels)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(formData.birthDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Weight</p>
                  <p className="font-medium">{formData.weight ? `${formData.weight} lbs` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Size Category</p>
                  <p className="font-medium">{getLabel(formData.sizeCategory, sizeCategoryLabels)}</p>
                </div>
              </div>
            )}
            
            {section.id === 'medicalHistory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Medical Conditions</p>
                  <p className="font-medium">{formatArray(formData.medicalConditions)}</p>
                </div>
                {formData.medicalConditions?.includes('Other') && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Other Condition</p>
                    <p className="font-medium">{formData.otherCondition || 'Not specified'}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Current Medications/Supplements</p>
                  <p className="font-medium">{formData.currentMedications || 'None'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Surgeries or Procedures</p>
                  <p className="font-medium">{formData.surgeriesOrProcedures || 'None'}</p>
                </div>
                {formData.surgeriesOrProcedures && (
                  <div>
                    <p className="text-sm text-slate-500">Surgery Date</p>
                    <p className="font-medium">{formatDate(formData.surgeryDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Vet Records</p>
                  <div className="space-y-1">
                    {formData.vetRecords instanceof File 
                      ? <p className="font-medium">{formData.vetRecords.name}</p>
                      : Array.isArray(formData.vetRecords)
                        ? formData.vetRecords.map((record, index) => {
                            // Handle both File objects and our custom record type
                            const filename = 'filename' in record ? String(record.filename) : record.name;
                            const url = 'url' in record ? String(record.url) : null;
                            
                            return (
                              <div key={index} className="flex items-center space-x-2">
                                <p className="font-medium">{filename}</p>
                                {url && (
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                  >
                                    View
                                  </a>
                                )}
                              </div>
                            );
                          })
                        : formData.vetRecords 
                          ? 'File uploaded' 
                          : 'Not uploaded'}
                  </div>
                </div>
              </div>
            )}
            
            {section.id === 'diet' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Diet Types</p>
                  <p className="font-medium">{formatArray(formData.dietTypes)}</p>
                </div>
                {formData.dietTypes?.includes('Other') && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Other Diet Type</p>
                    <p className="font-medium">{formData.otherDietType || 'Not specified'}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Main Brands</p>
                  <p className="font-medium">{formData.mainBrands || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Takes Supplements</p>
                  <p className="font-medium">{formData.takesSupplements ? 'Yes' : 'No'}</p>
                </div>
                {formData.takesSupplements && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Supplement Details</p>
                    <p className="font-medium">{formData.supplementDetails || 'Not specified'}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Food Allergies</p>
                  <p className="font-medium">{formData.foodAllergies || 'None'}</p>
                </div>
              </div>
            )}
            
            {section.id === 'lifestyle' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Activity Level</p>
                  <p className="font-medium">{getLabel(formData.activityLevel, activityLevelLabels)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Activity Minutes per Day</p>
                  <p className="font-medium">{formData.activityMinutes || '0'} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Uses Tracking Device</p>
                  <p className="font-medium">{formData.usesTrackingDevice ? 'Yes' : 'No'}</p>
                </div>
                {formData.usesTrackingDevice && (
                  <div>
                    <p className="text-sm text-slate-500">Tracking Device Details</p>
                    <p className="font-medium">{formData.trackingDeviceDetails || 'Not specified'}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Alone During Day</p>
                  <p className="font-medium">{formData.aloneInDay ? 'Yes' : 'No'}</p>
                </div>
                {formData.aloneInDay && (
                  <div>
                    <p className="text-sm text-slate-500">Hours Alone</p>
                    <p className="font-medium">{formData.hoursAlone || '0'} hours</p>
                  </div>
                )}
              </div>
            )}
            
            {section.id === 'behaviorHealth' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">General Temperament</p>
                  <p className="font-medium">{getLabel(formData.temperament, temperamentLabels)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Recent Behaviors</p>
                  <p className="font-medium">{formatArray(formData.recentBehaviors)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Current Symptoms</p>
                  <p className="font-medium">{formatArray(formData.currentSymptoms)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Major Health Events</p>
                  <p className="font-medium">{formData.majorHealthEvents || 'None'}</p>
                </div>
              </div>
            )}
            
            {section.id === 'ownerSentiment' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Top Concern</p>
                  <p className="font-medium">{formData.topConcern || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Improvement Goals</p>
                  <p className="font-medium">{formData.improvementGoals || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Care Confidence</p>
                  <p className="font-medium">{formData.careConfidence || '3'}/5</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Interests</p>
                  <p className="font-medium">{formatArray(formData.interests)}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
      
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>Submit Pet Health Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;