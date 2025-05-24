-- Create storage bucket for pet documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-documents', 'pet-documents', true);

-- Set up storage policies
CREATE POLICY "Users can upload their own pet documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can view their own pet documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pet-documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can update their own pet documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their own pet documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
); 