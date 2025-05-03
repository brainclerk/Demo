import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../../../types/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from '../../fields/InputField';
import { RadioGroup } from '../fields/RadioGroup';
import { Dog, User, User2, Calendar } from 'lucide-react';
import classNames from 'classnames';

const dogBreeds = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Dachshund", "Yorkshire Terrier",
  "Boxer", "Pug", "Siberian Husky", "Shih Tzu", "Great Dane", "Chihuahua",
  "Doberman Pinscher", "Miniature Schnauzer", "Border Collie", "Cocker Spaniel",
  "Australian Shepherd", "Cavalier King Charles Spaniel", "Boston Terrier",
  "Bernese Mountain Dog", "Pomeranian", "Havanese", "Shetland Sheepdog",
  "Brittany", "Pembroke Welsh Corgi", "Vizsla", "Belgian Malinois", "Maltese",
  "Weimaraner", "Newfoundland", "Rhodesian Ridgeback", "Bichon Frise",
  "West Highland White Terrier", "Basset Hound", "Chesapeake Bay Retriever",
  "Bullmastiff", "St. Bernard", "Portuguese Water Dog", "Bloodhound",
  "Akita", "Alaskan Malamute", "Samoyed", "Schnauzer", "Doberman", "Dogue de Bordeaux",
];

const BasicInfoSection: React.FC = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<FormData>();
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const selectedSize = watch('sizeCategory');
  const selectedSex = watch('sex');
  const breedValue = watch('breed');
  
  const handleBreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('breed', value);
    
    if (value.length > 0) {
      const filtered = dogBreeds.filter(breed =>
        breed.toLowerCase().includes(value.toLowerCase())
      );
      setBreedSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setBreedSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectBreed = (breed: string) => {
    setValue('breed', breed);
    setShowSuggestions(false);
  };

  const sizeOptions = [
    { 
      value: 'small', 
      label: 'Small (under 20 lbs)',
      description: 'Chihuahua, Yorkshire Terrier, Pug'
    },
    { 
      value: 'medium', 
      label: 'Medium (20-50 lbs)',
      description: 'Border Collie, Bulldog, Beagle'
    },
    { 
      value: 'large', 
      label: 'Large (50-90 lbs)',
      description: 'German Shepherd, Golden Retriever'
    },
    { 
      value: 'giant', 
      label: 'Giant (over 90 lbs)',
      description: 'Saint Bernard, Great Dane'
    }
  ];

  const sexOptions = [
    { value: 'male', label: 'Male', icon: User },
    { value: 'female', label: 'Female', icon: User2 },
    { value: 'neutered', label: 'Neutered Male', icon: User },
    { value: 'spayed', label: 'Spayed Female', icon: User2 }
  ];

  return (
    <div className="space-y-6">
      <InputField
        label="Pet Name"
        name="petName"
        register={register}
        required={true}
        error={errors.petName}
        placeholder="Your pet's name"
      />
      
      <div className="space-y-2">
        <InputField
          label="Breed"
          name="breed"
          register={register}
          required={true}
          error={errors.breed}
          placeholder="Type a breed like 'Labrador' or 'German Shepherd'"
          rules={{
            required: 'Breed is required',
            onChange: handleBreedChange
          }}
        />
        
        {showSuggestions && breedSuggestions.length > 0 && (
          <div 
            id="breed-suggestions"
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-auto"
          >
            {breedSuggestions.map((breed, index) => (
              <button
                key={index}
                type="button"
                role="option"
                aria-selected={breed === breedValue}
                className={classNames(
                  "w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors duration-150",
                  "focus:outline-none focus:bg-red-50",
                  { "border-b border-slate-100": index !== breedSuggestions.length - 1 }
                )}
                onClick={() => selectBreed(breed)}
              >
                {breed}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <RadioGroup
          label="Is your pet mixed or purebred?"
          name="breedType"
          options={[
            { value: 'mixed', label: 'Mixed' },
            { value: 'purebred', label: 'Purebred' }
          ]}
          register={register}
          rules={{ required: 'Please select an option' }}
          error={errors.breedType}
        />
      </div>
      
      <div className="space-y-2">
        <label className="label">Pet's Sex</label>
        <div className="grid grid-cols-2 gap-4">
          {sexOptions.map((option) => (
            <div
              key={option.value}
              className={classNames(
                "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                "hover:border-blue-400 hover:bg-blue-50",
                {
                  "border-blue-400 bg-blue-50": selectedSex === option.value,
                  "border-slate-200": selectedSex !== option.value
                }
              )}
              onClick={() => setValue('sex', option.value as 'male' | 'female' | 'neutered' | 'spayed')}
            >
              <input
                type="radio"
                className="sr-only"
                {...register('sex', { required: 'Please select your pet\'s sex' })}
                value={option.value}
              />
              <div className="flex items-center space-x-4">
                <option.icon 
                  className={classNames(
                    "w-5 h-5 transition-all duration-200",
                    {
                      'text-blue-400': selectedSex === option.value,
                      'text-slate-400': selectedSex !== option.value
                    }
                  )}
                />
                <span className="font-medium text-slate-800">{option.label}</span>
              </div>
            </div>
          ))}
        </div>
        {errors.sex && (
          <p className="error-message">{errors.sex.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <InputField
          label="Estimated Date of Birth"
          name="birthDate"
          register={register}
          required={true}
          error={errors.birthDate}
          placeholder="Select birth date"
          rules={{
            required: 'Birth date is required'
          }}
          render={({ onChange, value }) => (
            <div className="relative">
              <DatePicker
                selected={value}
                onChange={(date: Date | null) => {
                  onChange(date);
                  setValue('birthDate', date);
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select birth date"
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
      </div>
      
      <div className="space-y-2">
        <label className="label">Size Category</label>
        <div className="grid grid-cols-2 gap-4">
          {sizeOptions.map((option) => (
            <div
              key={option.value}
              className={classNames(
                "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                "hover:border-blue-400 hover:bg-blue-50",
                {
                  "border-blue-400 bg-blue-50": selectedSize === option.value,
                  "border-slate-200": selectedSize !== option.value
                }
              )}
              onClick={() => setValue('sizeCategory', option.value as 'small' | 'medium' | 'large' | 'giant')}
            >
              <input
                type="radio"
                className="sr-only"
                {...register('sizeCategory', { required: 'Please select a size category' })}
                value={option.value}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800">{option.label}</span>
                <Dog 
                  className={classNames(
                    "transition-all duration-200",
                    {
                      'w-4 h-4': option.value === 'small',
                      'w-5 h-5': option.value === 'medium',
                      'w-6 h-6': option.value === 'large',
                      'w-7 h-7': option.value === 'giant',
                      'text-blue-400': selectedSize === option.value,
                      'text-slate-400': selectedSize !== option.value
                    }
                  )}
                />
              </div>
              <p className="text-xs text-slate-500">{option.description}</p>
            </div>
          ))}
        </div>
        {errors.sizeCategory && (
          <p className="error-message">{errors.sizeCategory.message}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;