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
    const filePath = fileName;

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
 * Get public URL for invoice file (for direct download or opening in new tab)
 */
export async function getPublicInvoiceUrl(saquettoId: number): Promise<string | null> {
  try {
    // Get file metadata from database
    const { data: metadata, error: metadataError } = await supabase
      .from('saquetto_invoices_storage')
      .select('file_path')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (metadataError || !metadata) {
      console.error('Error fetching file metadata:', metadataError);
      return null;
    }

    // Use official Supabase API to get public URL
    const { data } = supabase.storage
      .from('notas_fiscais')
      .getPublicUrl(metadata.file_path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting public invoice URL:', error);
    return null;
  }
}
