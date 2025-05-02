import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from '../../fields/InputField';
import { CheckboxGroup } from '../fields/CheckboxGroup';
import { FileUploadField } from '../fields/FileUploadField';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { FieldError } from 'react-hook-form';

const MedicalHistorySection: React.FC = () => {
  const { 
    register, 
    control, 
    formState: { errors }, 
    watch,
    setValue 
  } = useFormContext<FormData>();
  
  const medicalConditions = watch('medicalConditions') || [];
  const hasOtherCondition = medicalConditions.includes('Other');
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CheckboxGroup
          label="Known Medical Conditions"
          name="medicalConditions"
          options={[
            { value: 'Arthritis', label: 'Arthritis' },
            { value: 'Allergies', label: 'Allergies' },
            { value: 'Hip Dysplasia', label: 'Hip Dysplasia' },
            { value: 'Heart Disease', label: 'Heart Disease' },
            { value: 'Diabetes', label: 'Diabetes' },
            { value: 'Anxiety', label: 'Anxiety' },
            { value: 'Epilepsy', label: 'Epilepsy' },
            { value: 'Other', label: 'Other' }
          ]}
          register={register}
          error={errors.medicalConditions as FieldError}
        />
      </div>
      
      {hasOtherCondition && (
        <InputField
          label="Please specify other condition"
          name="otherCondition"
          register={register}
          rules={{ required: 'Please specify the other condition' }}
          error={errors.otherCondition}
          placeholder="Enter other medical condition"
        />
      )}
      
      <InputField
        label="Current Medications/Supplements"
        name="currentMedications"
        register={register}
        placeholder="List any medications or supplements your pet is taking"
        isTextarea={true}
        rows={3}
      />
      
      <InputField
        label="Surgeries or Procedures"
        name="surgeriesOrProcedures"
        register={register}
        placeholder="Describe any surgeries or procedures your pet has had"
        isTextarea={true}
        rows={3}
      />
      
      <div className="space-y-2">
        <label className="label">
          Date of Most Recent Surgery/Procedure (if applicable)
        </label>
        <div className="relative">
          <DatePicker
            selected={watch('surgeryDate')}
            onChange={(date: Date | null) => setValue('surgeryDate', date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select surgery date"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            className="input-field pl-10 w-full"
            isClearable
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
        {errors.surgeryDate && (
          <p className="error-message">{errors.surgeryDate.message}</p>
        )}
      </div>
      
      <FileUploadField
        label="Upload Vet Records (optional)"
        name="vetRecords"
        accept=".pdf,.jpg,.jpeg,.png"
        control={control}
        error={errors.vetRecords}
      />
    </div>
  );
};

export default MedicalHistorySection;