-- First create a temporary column
ALTER TABLE pet_profiles ADD COLUMN vet_records_new jsonb[];

-- Update the new column with transformed data
UPDATE pet_profiles
SET vet_records_new = (
  SELECT array_agg(
    jsonb_build_object(
      'filename', split_part(url, '/', -1),
      'url', url
    )
  )
  FROM unnest(vet_records::text[]) AS url
);

-- Drop the old column and rename the new one
ALTER TABLE pet_profiles DROP COLUMN vet_records;
ALTER TABLE pet_profiles RENAME COLUMN vet_records_new TO vet_records; 