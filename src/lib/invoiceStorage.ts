import { supabase } from "@/integrations/supabase/client";

/**
 * Upload invoice file to Supabase Storage
 */
export async function uploadInvoiceFile(
  saquettoId: number,
  fileContent: string,
  fileName: string
): Promise<boolean> {
  try {
    // Convert base64 or XML string to blob
    const blob = new Blob([fileContent], { type: 'application/xml' });
    const filePath = `${saquettoId}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('notas_fiscais')
      .upload(filePath, blob, {
        contentType: 'application/xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return false;
    }

    // Save metadata to database
    const { error: dbError } = await supabase
      .from('saquetto_invoices_storage')
      .upsert({
        saquetto_id: saquettoId,
        file_path: filePath,
        file_name: fileName,
        file_size: blob.size,
        content_type: 'application/xml',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'saquetto_id'
      });

    if (dbError) {
      console.error('Error saving file metadata:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error uploading invoice file:', error);
    return false;
  }
}

/**
 * Download invoice file from Supabase Storage
 */
export async function downloadInvoiceFile(saquettoId: number): Promise<string | null> {
  try {
    // Get file metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('saquetto_invoices_storage')
      .select('file_path')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (metadataError || !metadata) {
      console.error('Error fetching file metadata:', metadataError);
      return null;
    }

    // Download file from storage
    const { data, error } = await supabase.storage
      .from('notas_fiscais')
      .download(metadata.file_path);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    // Convert blob to text
    const text = await data.text();
    return text;
  } catch (error) {
    console.error('Error downloading invoice file:', error);
    return null;
  }
}

/**
 * Delete invoice file from Supabase Storage
 */
export async function deleteInvoiceFile(saquettoId: number): Promise<boolean> {
  try {
    // Get file metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('saquetto_invoices_storage')
      .select('file_path')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (metadataError || !metadata) {
      console.error('Error fetching file metadata:', metadataError);
      return false;
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('notas_fiscais')
      .remove([metadata.file_path]);

    if (storageError) {
      console.error('Error deleting file:', storageError);
      return false;
    }

    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('saquetto_invoices_storage')
      .delete()
      .eq('saquetto_id', saquettoId);

    if (dbError) {
      console.error('Error deleting file metadata:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting invoice file:', error);
    return false;
  }
}

/**
 * Check if invoice file exists in storage
 */
export async function hasInvoiceFile(saquettoId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('saquetto_invoices_storage')
      .select('id')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (error) {
      console.error('Error checking file existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking invoice file:', error);
    return false;
  }
}

/**
 * Get signed URL for invoice file
 */
export async function getInvoiceFileUrl(saquettoId: number): Promise<string | null> {
  try {
    // Get file metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('saquetto_invoices_storage')
      .select('file_path')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (metadataError || !metadata) {
      console.error('Error fetching file metadata:', metadataError);
      return null;
    }

    // Create signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from('notas_fiscais')
      .createSignedUrl(metadata.file_path, 3600);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting invoice file URL:', error);
    return null;
  }
}

/**
 * Migrate base64 data to storage
 */
export async function migrateBase64ToStorage(
  saquettoId: number,
  base64Content: string
): Promise<boolean> {
  try {
    // Decode base64 to XML
    const xmlContent = atob(base64Content);
    
    // Generate filename
    const fileName = `invoice_${saquettoId}.xml`;
    
    // Upload to storage
    const success = await uploadInvoiceFile(saquettoId, xmlContent, fileName);
    
    return success;
  } catch (error) {
    console.error('Error migrating base64 to storage:', error);
    return false;
  }
}

/**
 * Migration result interface
 */
export interface MigrationResult {
  saquettoId: number;
  success: boolean;
  error?: string;
}

/**
 * Batch migrate all invoices from base64 table to storage
 */
export async function batchMigrateAllInvoices(
  batchSize: number = 5,
  onProgress?: (progress: { total: number; completed: number; failed: number }) => void
): Promise<MigrationResult[]> {
  try {
    // Fetch all records from base64 table
    const { data: records, error } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('saquetto_id, base64')
      .not('base64', 'is', null);

    if (error) {
      console.error('Error fetching records:', error);
      return [];
    }

    if (!records || records.length === 0) {
      console.log('No records to migrate');
      return [];
    }

    const results: MigrationResult[] = [];
    const total = records.length;
    let completed = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (record) => {
          try {
            const success = await migrateBase64ToStorage(
              record.saquetto_id,
              record.base64
            );
            
            if (success) {
              completed++;
            } else {
              failed++;
            }

            if (onProgress) {
              onProgress({ total, completed, failed });
            }

            return {
              saquettoId: record.saquetto_id,
              success,
              error: success ? undefined : 'Migration failed'
            };
          } catch (error) {
            failed++;
            if (onProgress) {
              onProgress({ total, completed, failed });
            }

            return {
              saquettoId: record.saquetto_id,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      results.push(...batchResults);
    }

    return results;
  } catch (error) {
    console.error('Error in batch migration:', error);
    return [];
  }
}

/**
 * Validate migrated data
 */
export async function validateMigration(saquettoId: number): Promise<boolean> {
  try {
    // Check if file exists in storage
    const hasFile = await hasInvoiceFile(saquettoId);
    if (!hasFile) {
      return false;
    }

    // Try to download and verify content
    const content = await downloadInvoiceFile(saquettoId);
    if (!content) {
      return false;
    }

    // Verify it's valid XML
    if (!content.trim().startsWith('<?xml') && !content.trim().startsWith('<')) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating migration:', error);
    return false;
  }
}

/**
 * Get migration statistics
 */
export async function getMigrationStats(): Promise<{
  totalInBase64: number;
  totalInStorage: number;
  needsMigration: number;
}> {
  try {
    // Count records in base64 table
    const { count: base64Count, error: base64Error } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('*', { count: 'exact', head: true });

    // Count records in storage table
    const { count: storageCount, error: storageError } = await supabase
      .from('saquetto_invoices_storage')
      .select('*', { count: 'exact', head: true });

    if (base64Error || storageError) {
      console.error('Error fetching stats:', base64Error || storageError);
      return { totalInBase64: 0, totalInStorage: 0, needsMigration: 0 };
    }

    const totalInBase64 = base64Count || 0;
    const totalInStorage = storageCount || 0;
    const needsMigration = Math.max(0, totalInBase64 - totalInStorage);

    return { totalInBase64, totalInStorage, needsMigration };
  } catch (error) {
    console.error('Error getting migration stats:', error);
    return { totalInBase64: 0, totalInStorage: 0, needsMigration: 0 };
  }
}
