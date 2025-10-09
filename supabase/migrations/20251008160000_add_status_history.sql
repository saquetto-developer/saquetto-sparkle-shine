-- Create table for status change history (audit trail)
CREATE TABLE IF NOT EXISTS public.saquetto_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saquetto_id INTEGER NOT NULL,
  status_anterior TEXT NOT NULL,
  status_novo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  usuario_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint to saquetto table
ALTER TABLE public.saquetto_status_history
ADD CONSTRAINT fk_saquetto_status_history_saquetto
FOREIGN KEY (saquetto_id) REFERENCES public.saquetto(id)
ON DELETE CASCADE;

-- Create index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_saquetto_status_history_saquetto_id
ON public.saquetto_status_history(saquetto_id);

-- Create index for created_at to optimize time-based queries
CREATE INDEX IF NOT EXISTS idx_saquetto_status_history_created_at
ON public.saquetto_status_history(created_at DESC);

-- Enable RLS on the table
ALTER TABLE public.saquetto_status_history ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read history
CREATE POLICY "Allow authenticated users to read status history"
ON public.saquetto_status_history
FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to insert history
CREATE POLICY "Allow authenticated users to insert status history"
ON public.saquetto_status_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add comment to table for documentation
COMMENT ON TABLE public.saquetto_status_history IS 'Audit trail for status changes on notas fiscais. Tracks who changed what, when, and why.';

COMMENT ON COLUMN public.saquetto_status_history.motivo IS 'Required justification for status change. Minimum 10 characters recommended.';
