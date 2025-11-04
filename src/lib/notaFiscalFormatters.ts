/**
 * Utility functions for formatting nota fiscal data
 */

/**
 * Format currency values to Brazilian Real format
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'N/A';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'N/A';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'N/A';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'N/A';

  return `${numValue.toFixed(2)}%`;
}

/**
 * Format CNPJ (00.000.000/0000-00)
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return 'N/A';

  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) return cnpj;

  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Format CPF (000.000.000-00)
 */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return 'N/A';

  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return cpf;

  return cleaned.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

/**
 * Format phone number (Brazilian format)
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';

  const cleaned = phone.replace(/\D/g, '');

  // Mobile: (00) 00000-0000
  if (cleaned.length === 11) {
    return cleaned.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3'
    );
  }

  // Landline: (00) 0000-0000
  if (cleaned.length === 10) {
    return cleaned.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3'
    );
  }

  return phone;
}

/**
 * Format date to Brazilian format (DD/MM/YYYY)
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return date;
  }
}

/**
 * Format datetime to Brazilian format (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(date: string | null | undefined): string {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return date;
  }
}

/**
 * Format chave de acesso (NFe key) with grouping
 */
export function formatChaveAcesso(chave: string | null | undefined): string {
  if (!chave) return 'N/A';

  const cleaned = chave.replace(/\D/g, '');

  if (cleaned.length !== 44) return chave;

  // Group in 4-digit blocks
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Format NCM code (0000.00.00)
 */
export function formatNCM(ncm: string | null | undefined): string {
  if (!ncm) return 'N/A';

  const cleaned = ncm.replace(/\D/g, '');

  if (cleaned.length !== 8) return ncm;

  return cleaned.replace(
    /^(\d{4})(\d{2})(\d{2})$/,
    '$1.$2.$3'
  );
}

/**
 * Format CFOP (0.000)
 */
export function formatCFOP(cfop: string | null | undefined): string {
  if (!cfop) return 'N/A';

  const cleaned = cfop.replace(/\D/g, '');

  if (cleaned.length !== 4) return cfop;

  return cleaned.replace(
    /^(\d{1})(\d{3})$/,
    '$1.$2'
  );
}

/**
 * Format CEP (00000-000)
 */
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return 'N/A';

  const cleaned = cep.replace(/\D/g, '');

  if (cleaned.length !== 8) return cep;

  return cleaned.replace(
    /^(\d{5})(\d{3})$/,
    '$1-$2'
  );
}

/**
 * Format boolean to Sim/Não
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return value ? 'Sim' : 'Não';
}

/**
 * Format regime tributário
 */
export function formatRegimeTributario(regime: string | null | undefined): string {
  if (!regime) return 'N/A';

  const regimes: Record<string, string> = {
    '1': 'Simples Nacional',
    '2': 'Simples Nacional - Excesso',
    '3': 'Regime Normal',
    'simples': 'Simples Nacional',
    'presumido': 'Lucro Presumido',
    'real': 'Lucro Real'
  };

  return regimes[regime] || regime;
}

/**
 * Format quantidade with proper decimal places
 */
export function formatQuantidade(quantidade: string | number | null | undefined): string {
  if (quantidade === null || quantidade === undefined || quantidade === '') return 'N/A';

  const numValue = typeof quantidade === 'string' ? parseFloat(quantidade) : quantidade;

  if (isNaN(numValue)) return 'N/A';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(numValue);
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(text: string | null | undefined, maxLength: number = 50): string {
  if (!text) return 'N/A';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
}

/**
 * Check if value is empty/null/undefined
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * Get display value or N/A
 */
export function displayValue(value: any): string {
  return isEmpty(value) ? 'N/A' : String(value);
}
