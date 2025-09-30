import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch base64 data for a specific nota fiscal
 */
export async function fetchBase64ForNota(saquettoId: number): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('base64')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching base64:', error);
      return null;
    }

    return data?.base64 || null;
  } catch (error) {
    console.error('Error fetching base64:', error);
    return null;
  }
}

/**
 * Update or insert base64 data for a nota fiscal
 */
export async function upsertBase64ForNota(
  saquettoId: number, 
  base64: string
): Promise<boolean> {
  try {
    // Check if record exists
    const { data: existing } = await supabase
      .from('saquetto_notafiscal_base64')
      .select('id')
      .eq('saquetto_id', saquettoId)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('saquetto_notafiscal_base64')
        .update({ base64, updated_at: new Date().toISOString() })
        .eq('saquetto_id', saquettoId);

      if (error) {
        console.error('Error updating base64:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('saquetto_notafiscal_base64')
        .insert({ saquetto_id: saquettoId, base64 });

      if (error) {
        console.error('Error inserting base64:', error);
        return false;
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
 */
export async function deleteBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
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
 */
export async function hasBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
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
