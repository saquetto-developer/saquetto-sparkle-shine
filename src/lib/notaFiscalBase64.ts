import { supabase } from "@/integrations/supabase/client";
import { downloadInvoiceFile, hasInvoiceFile, migrateBase64ToStorage } from "./invoiceStorage";

/**
 * Fetch base64 data for a specific nota fiscal
 * First tries storage, then falls back to base64 table
 */
export async function fetchBase64ForNota(saquettoId: number): Promise<string | null> {
  try {
    // Try storage first
    const hasFile = await hasInvoiceFile(saquettoId);
    
    if (hasFile) {
      const xmlContent = await downloadInvoiceFile(saquettoId);
      if (xmlContent) {
        // Convert XML back to base64 for compatibility
        return btoa(xmlContent);
      }
    }

    // Fallback to base64 table
    const { data, error } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('base64')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching base64:', error);
      return null;
    }

    // If found in base64 table, migrate to storage
    if (data?.base64) {
      console.log('Migrating invoice to storage:', saquettoId);
      migrateBase64ToStorage(saquettoId, data.base64);
    }

    return data?.base64 || null;
  } catch (error) {
    console.error('Error fetching base64:', error);
    return null;
  }
}

/**
 * Update or insert base64 data for a nota fiscal
 * Now saves to storage instead of base64 table
 */
export async function upsertBase64ForNota(
  saquettoId: number, 
  base64: string
): Promise<boolean> {
  try {
    // Migrate to storage
    const success = await migrateBase64ToStorage(saquettoId, base64);
    
    if (!success) {
      console.error('Failed to save to storage, falling back to base64 table');
      
      // Fallback to base64 table
      const { data: existing } = await supabase
        .from('saquetto_notafiscal_base64')
        .select('id')
        .eq('saquetto_id', saquettoId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('saquetto_notafiscal_base64')
          .update({ base64, updated_at: new Date().toISOString() })
          .eq('saquetto_id', saquettoId);

        if (error) {
          console.error('Error updating base64:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('saquetto_notafiscal_base64')
          .insert({ saquetto_id: saquettoId, base64 });

        if (error) {
          console.error('Error inserting base64:', error);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error upserting base64:', error);
    return false;
  }
}

/**
 * Delete base64 data for a nota fiscal
 * Deletes from both storage and base64 table
 */
export async function deleteBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
    const { deleteInvoiceFile } = await import('./invoiceStorage');
    
    // Delete from storage
    await deleteInvoiceFile(saquettoId);
    
    // Delete from base64 table
    const { error } = await supabase
      .from('saquetto_notafiscal_base64')
      .delete()
      .eq('saquetto_id', saquettoId);

    if (error) {
      console.error('Error deleting base64:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting base64:', error);
    return false;
  }
}

/**
 * Check if base64 exists for a nota fiscal
 * Checks both storage and base64 table
 */
export async function hasBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
    // Check storage first
    const hasFile = await hasInvoiceFile(saquettoId);
    if (hasFile) return true;
    
    // Check base64 table
    const { data, error } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('id')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (error) {
      console.error('Error checking base64:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking base64:', error);
    return false;
  }
}
