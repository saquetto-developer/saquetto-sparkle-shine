-- Step 1: Create new table for base64 data
CREATE TABLE public.saquetto_notafiscal_base64 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  saquetto_id INTEGER NOT NULL,
  base64 TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 2: Add foreign key constraint
ALTER TABLE public.saquetto_notafiscal_base64
ADD CONSTRAINT fk_saquetto_notafiscal_base64_saquetto
FOREIGN KEY (saquetto_id) REFERENCES public.saquetto(id)
ON DELETE CASCADE;

-- Step 3: Create index for performance
CREATE INDEX idx_saquetto_notafiscal_base64_saquetto_id 
ON public.saquetto_notafiscal_base64(saquetto_id);

-- Step 4: Migrate existing base64 data from saquetto table
INSERT INTO public.saquetto_notafiscal_base64 (saquetto_id, base64, created_at, updated_at)
SELECT 
  id,
  base64,
  COALESCE(created_at, now()),
  now()
FROM public.saquetto
WHERE base64 IS NOT NULL AND base64 != '';

-- Step 5: Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION public.update_saquetto_notafiscal_base64_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Step 6: Create trigger
CREATE TRIGGER trigger_update_saquetto_notafiscal_base64_updated_at
BEFORE UPDATE ON public.saquetto_notafiscal_base64
FOR EACH ROW
EXECUTE FUNCTION public.update_saquetto_notafiscal_base64_updated_at();

-- Step 7: Remove base64 column from saquetto table (after verification)
ALTER TABLE public.saquetto DROP COLUMN IF EXISTS base64;