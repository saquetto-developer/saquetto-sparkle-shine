-- Ensure saquetto_status_history table exists with correct structure
CREATE TABLE IF NOT EXISTS public.saquetto_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  saquetto_id INTEGER NOT NULL,
  status_anterior TEXT NOT NULL,
  status_novo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  usuario_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.saquetto_status_history ENABLE ROW LEVEL SECURITY;

-- Recreate policies (will skip if they exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saquetto_status_history' 
    AND policyname = 'Allow authenticated users to read status history'
  ) THEN
    CREATE POLICY "Allow authenticated users to read status history"
      ON public.saquetto_status_history
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saquetto_status_history' 
    AND policyname = 'Allow authenticated users to insert status history'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert status history"
      ON public.saquetto_status_history
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;