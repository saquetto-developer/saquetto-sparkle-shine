import { supabase } from "@/integrations/supabase/client";

export interface StatusHistoryEntry {
  id: string;
  saquetto_id: number;
  status_anterior: string;
  status_novo: string;
  motivo: string;
  usuario_email: string;
  created_at: string;
}

export interface UpdateStatusParams {
  notaId: number;
  statusAtual: string;
  statusNovo: string;
  motivo: string;
}

/**
 * Update nota fiscal status and record change in history
 * This function performs an atomic transaction:
 * 1. Updates the status in saquetto table
 * 2. Inserts audit record in saquetto_status_history table
 */
export async function updateNotaStatus(params: UpdateStatusParams): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { notaId, statusAtual, statusNovo, motivo } = params;

    console.log('[updateNotaStatus] Starting status update for notaId:', notaId);
    console.log('[updateNotaStatus] Status change:', statusAtual, '→', statusNovo);

    // Validate inputs
    if (!notaId || !statusAtual || !statusNovo || !motivo) {
      return {
        success: false,
        error: 'Todos os campos são obrigatórios'
      };
    }

    if (motivo.trim().length < 10) {
      return {
        success: false,
        error: 'A justificativa deve ter pelo menos 10 caracteres'
      };
    }

    if (statusAtual === statusNovo) {
      return {
        success: false,
        error: 'O novo status deve ser diferente do atual'
      };
    }

    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error('[updateNotaStatus] Error getting user:', userError);
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }

    const usuarioEmail = userData.user.email || 'unknown@unknown.com';
    console.log('[updateNotaStatus] User email:', usuarioEmail);

    // Step 1: Update status in saquetto table
    const { error: updateError } = await supabase
      .from('saquetto')
      .update({
        situacao: statusNovo
      })
      .eq('id', notaId);

    if (updateError) {
      console.error('[updateNotaStatus] Error updating saquetto:', updateError);
      return {
        success: false,
        error: `Erro ao atualizar status: ${updateError.message}`
      };
    }

    console.log('[updateNotaStatus] Status updated successfully in saquetto table');

    // Step 2: Insert audit record in history table
    const { error: historyError } = await supabase
      .from('saquetto_status_history')
      .insert({
        saquetto_id: notaId,
        status_anterior: statusAtual,
        status_novo: statusNovo,
        motivo: motivo.trim(),
        usuario_email: usuarioEmail,
        created_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('[updateNotaStatus] Error inserting history:', historyError);

      // Rollback: revert status change
      await supabase
        .from('saquetto')
        .update({ situacao: statusAtual })
        .eq('id', notaId);

      return {
        success: false,
        error: `Erro ao salvar histórico: ${historyError.message}`
      };
    }

    console.log('[updateNotaStatus] History record created successfully');

    return {
      success: true
    };
  } catch (error) {
    console.error('[updateNotaStatus] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Get status change history for a specific nota fiscal
 * Returns the most recent changes first
 */
export async function getStatusHistory(
  notaId: number,
  limit: number = 10
): Promise<{
  success: boolean;
  data?: StatusHistoryEntry[];
  error?: string;
}> {
  try {
    console.log('[getStatusHistory] Fetching history for notaId:', notaId);

    const { data, error } = await supabase
      .from('saquetto_status_history')
      .select('*')
      .eq('saquetto_id', notaId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getStatusHistory] Error fetching history:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('[getStatusHistory] Found', data?.length || 0, 'history entries');

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('[getStatusHistory] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Check if a nota fiscal has had its status manually changed
 */
export async function hasManualStatusChange(notaId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('saquetto_status_history')
      .select('id')
      .eq('saquetto_id', notaId)
      .limit(1);

    if (error) {
      console.error('[hasManualStatusChange] Error:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('[hasManualStatusChange] Unexpected error:', error);
    return false;
  }
}
