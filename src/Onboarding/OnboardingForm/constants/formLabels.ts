export const sexLabels: Record<string, string> = {
  'male': 'Male',
  'female': 'Female',
  'neutered': 'Neutered Male',
  'spayed': 'Spayed Female'
};

export const breedTypeLabels: Record<string, string> = {
  'mixed': 'Mixed',
  'purebred': 'Purebred'
};

export const sizeCategoryLabels: Record<string, string> = {
  'small': 'Small (under 20 lbs)',
  'medium': 'Medium (20-50 lbs)',
  'large': 'Large (50-90 lbs)',
  'giant': 'Giant (over 90 lbs)'
};

export const activityLevelLabels: Record<string, string> = {
  'low': 'Low (mostly indoors, short walks)',
  'moderate': 'Moderate (regular walks, some play)',
  'high': 'High (runs, hikes, very active)'
};

export const temperamentLabels: Record<string, string> = {
  'calm': 'Calm',
  'friendly': 'Friendly',
  'energetic': 'Energetic',
  'anxious': 'Anxious',
  'aggressive': 'Aggressive'
};

// Helper function to get label with fallback
export const getLabel = (value: string | undefined, labels: Record<string, string>): string => {
  if (!value) return 'Not specified';
  return labels[value] || value;
}; 