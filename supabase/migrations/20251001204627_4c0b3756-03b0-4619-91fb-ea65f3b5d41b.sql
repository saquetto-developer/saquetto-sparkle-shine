-- Add foreign key constraint between saquetto_invoices_storage and saquetto
ALTER TABLE saquetto_invoices_storage 
ADD CONSTRAINT fk_saquetto_invoices_storage_saquetto_id 
FOREIGN KEY (saquetto_id) 
REFERENCES saquetto(id) 
ON DELETE CASCADE;