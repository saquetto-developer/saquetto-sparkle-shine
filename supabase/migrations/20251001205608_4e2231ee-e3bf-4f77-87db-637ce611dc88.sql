-- Corrigir file_path para usar caminho relativo ao invés de URL completa
UPDATE saquetto_invoices_storage 
SET file_path = saquetto_id || '/' || file_name,
    updated_at = now()
WHERE file_path LIKE 'http%' OR file_path LIKE '//%';