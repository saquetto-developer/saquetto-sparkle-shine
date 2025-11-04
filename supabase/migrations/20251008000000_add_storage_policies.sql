-- Add RLS policies for invoices storage bucket

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload invoices
CREATE POLICY "Allow authenticated uploads to invoices bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

-- Policy to allow public read access to invoices (since using anon key)
CREATE POLICY "Allow public read from invoices bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'invoices');

-- Policy to allow authenticated users to update invoices
CREATE POLICY "Allow authenticated updates to invoices bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'invoices')
WITH CHECK (bucket_id = 'invoices');

-- Policy to allow authenticated users to delete invoices
CREATE POLICY "Allow authenticated deletes from invoices bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'invoices');
