import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from '../fields/InputField';
import { CheckboxGroup } from '../fields/CheckboxGroup';
import { FileUploadField } from '../fields/FileUploadField';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { FieldError } from 'react-hook-form';

const MedicalHistorySection: React.FC = () => {
  const { register, control, formState: { errors }, watch, setValue } = useFormContext<FormData>();
  
  // Watch all form values we need
  const formValues = watch();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CheckboxGroup
          label="Medical Conditions (select all that apply)"
          name="medicalConditions"
          options={[
            { value: 'Arthritis', label: 'Arthritis' },
            { value: 'Diabetes', label: 'Diabetes' },
            { value: 'Heart Disease', label: 'Heart Disease' },
            { value: 'Kidney Disease', label: 'Kidney Disease' },
            { value: 'Thyroid Issues', label: 'Thyroid Issues' },
            { value: 'Allergies', label: 'Allergies' },
            { value: 'Dental Disease', label: 'Dental Disease' },
            { value: 'Other', label: 'Other' }
          ]}
          register={register}
          error={errors.medicalConditions as any}
        />
      </div>
      
      {formValues.medicalConditions?.includes('Other') && (
        <InputField
          label="Please specify other condition"
          name="otherCondition"
          register={register}
          placeholder="Describe the condition"
        />
      )}
      
      <InputField
        label="Current Medications/Supplements"
        name="currentMedications"
        register={register}
        placeholder="List any medications or supplements your pet is currently taking"
        isTextarea={true}
        rows={3}
      />
      
      <InputField
        label="Surgeries or Procedures"
        name="surgeriesOrProcedures"
        register={register}
        placeholder="List any surgeries or procedures your pet has had"
        isTextarea={true}
        rows={3}
      />
      
      {formValues.surgeriesOrProcedures && (
        <InputField
          label="Surgery Date"
          name="surgeryDate"
          register={register}
          placeholder="When was the surgery performed?"
          render={({ onChange, value }) => (
            <div className="relative">
              <DatePicker
                selected={value}
                onChange={(date: Date | null) => {
                  onChange(date);
                  setValue('surgeryDate', date);
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select surgery date"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={15}
                scrollableYearDropdown
                className="input-field pl-10 w-full"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          )}
        />
      )}
      
      <FileUploadField
        label="Vet Records"
        name="vetRecords"
        accept=".pdf,.jpg,.jpeg,.png"
        control={control}
        error={errors.vetRecords}
      />
    </div>
  );
};

export default MedicalHistorySection;