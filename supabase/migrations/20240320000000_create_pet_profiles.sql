-- Create pet_profiles table
CREATE TABLE IF NOT EXISTS pet_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    breed TEXT,
    breed_type TEXT CHECK (breed_type IN ('mixed', 'purebred')),
    sex TEXT CHECK (sex IN ('male', 'female', 'neutered', 'spayed')),
    birth_date TIMESTAMP WITH TIME ZONE,
    weight TEXT,
    size_category TEXT CHECK (size_category IN ('small', 'medium', 'large', 'giant')),
    
    -- Medical History
    medical_conditions TEXT[] DEFAULT '{}',
    other_condition TEXT,
    current_medications TEXT,
    surgeries_or_procedures TEXT,
    surgery_date TIMESTAMP WITH TIME ZONE,
    vet_records TEXT, -- URL or reference to stored file
    
    -- Diet
    diet_types TEXT[] DEFAULT '{}',
    other_diet_type TEXT,
    main_brands TEXT,
    takes_supplements BOOLEAN DEFAULT false,
    supplement_details TEXT,
    food_allergies TEXT,
    
    -- Lifestyle
    activity_level TEXT CHECK (activity_level IN ('low', 'moderate', 'high')),
    activity_minutes INTEGER,
    uses_tracking_device BOOLEAN DEFAULT false,
    tracking_device_details TEXT,
    alone_in_day BOOLEAN DEFAULT false,
    hours_alone INTEGER,
    
    -- Behavior & Health
    temperament TEXT CHECK (temperament IN ('calm', 'friendly', 'energetic', 'anxious', 'aggressive')),
    recent_behaviors TEXT[] DEFAULT '{}',
    current_symptoms TEXT[] DEFAULT '{}',
    major_health_events TEXT,
    
    -- Owner Sentiment
    top_concern TEXT,
    improvement_goals TEXT,
    care_confidence INTEGER CHECK (care_confidence >= 1 AND care_confidence <= 5),
    interests TEXT[] DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE pet_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own pet profiles
CREATE POLICY "Users can view their own pet profiles"
    ON pet_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own pet profiles
CREATE POLICY "Users can insert their own pet profiles"
    ON pet_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own pet profiles
CREATE POLICY "Users can update their own pet profiles"
    ON pet_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own pet profiles
CREATE POLICY "Users can delete their own pet profiles"
    ON pet_profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_pet_profiles_updated_at
    BEFORE UPDATE ON pet_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 