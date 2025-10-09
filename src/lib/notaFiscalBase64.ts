import { downloadInvoiceFile, hasInvoiceFile, uploadInvoiceFile, deleteInvoiceFile } from "./invoiceStorage";

/**
 * Fetch base64 data for a specific nota fiscal
 * Uses ONLY saquetto_invoices_storage table via storage functions
 */
export async function fetchBase64ForNota(saquettoId: number): Promise<string | null> {
  try {
    console.log('[fetchBase64ForNota] Starting fetch for saquettoId:', saquettoId);

    // Check if file exists in storage
    const hasFile = await hasInvoiceFile(saquettoId);
    console.log('[fetchBase64ForNota] File exists in storage:', hasFile);

    if (!hasFile) {
      console.warn('[fetchBase64ForNota] No file found in saquetto_invoices_storage for saquettoId:', saquettoId);
      return null;
    }

    // Download XML content from storage
    const xmlContent = await downloadInvoiceFile(saquettoId);
    console.log('[fetchBase64ForNota] Downloaded XML content length:', xmlContent?.length || 0);

    if (!xmlContent) {
      console.error('[fetchBase64ForNota] Failed to download XML content for saquettoId:', saquettoId);
      return null;
    }

    // Convert XML to base64 for compatibility with existing code
    const base64Content = btoa(xmlContent);
    console.log('[fetchBase64ForNota] Successfully converted to base64, length:', base64Content.length);

    return base64Content;
  } catch (error) {
    console.error('[fetchBase64ForNota] Error fetching base64 for saquettoId:', saquettoId, error);
    return null;
  }
}

/**
 * Update or insert base64 data for a nota fiscal
 * Saves ONLY to saquetto_invoices_storage via storage functions
 */
export async function upsertBase64ForNota(
  saquettoId: number,
  base64: string
): Promise<boolean> {
  try {
    console.log('[upsertBase64ForNota] Starting upsert for saquettoId:', saquettoId);
    console.log('[upsertBase64ForNota] Base64 content length:', base64.length);

    // Decode base64 to XML
    const xmlContent = atob(base64);
    console.log('[upsertBase64ForNota] Decoded XML content length:', xmlContent.length);

    // Generate filename
    const fileName = `invoice_${saquettoId}.xml`;
    console.log('[upsertBase64ForNota] Uploading to storage with filename:', fileName);

    // Upload to storage (uploads to invoices bucket and saves metadata to saquetto_invoices_storage)
    const success = await uploadInvoiceFile(saquettoId, xmlContent, fileName);

    if (success) {
      console.log('[upsertBase64ForNota] Successfully saved to saquetto_invoices_storage for saquettoId:', saquettoId);
    } else {
      console.error('[upsertBase64ForNota] Failed to save to saquetto_invoices_storage for saquettoId:', saquettoId);
    }

    return success;
  } catch (error) {
    console.error('[upsertBase64ForNota] Error upserting base64 for saquettoId:', saquettoId, error);
    return false;
  }
}

/**
 * Delete base64 data for a nota fiscal
 * Deletes ONLY from saquetto_invoices_storage via storage functions
 */
export async function deleteBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
    console.log('[deleteBase64ForNota] Starting delete for saquettoId:', saquettoId);

    // Delete from storage (removes from invoices bucket and saquetto_invoices_storage)
    const success = await deleteInvoiceFile(saquettoId);

    if (success) {
      console.log('[deleteBase64ForNota] Successfully deleted from saquetto_invoices_storage for saquettoId:', saquettoId);
    } else {
      console.error('[deleteBase64ForNota] Failed to delete from saquetto_invoices_storage for saquettoId:', saquettoId);
    }

    return success;
  } catch (error) {
    console.error('[deleteBase64ForNota] Error deleting base64 for saquettoId:', saquettoId, error);
    return false;
  }
}

/**
 * Check if base64 exists for a nota fiscal
 * Checks ONLY saquetto_invoices_storage via storage functions
 */
export async function hasBase64ForNota(saquettoId: number): Promise<boolean> {
  try {
    console.log('[hasBase64ForNota] Checking existence for saquettoId:', saquettoId);

    // Check storage (queries saquetto_invoices_storage table)
    const hasFile = await hasInvoiceFile(saquettoId);

    console.log('[hasBase64ForNota] File exists in saquetto_invoices_storage:', hasFile, 'for saquettoId:', saquettoId);

    return hasFile;
  } catch (error) {
    console.error('[hasBase64ForNota] Error checking base64 for saquettoId:', saquettoId, error);
    return false;
  }
}
