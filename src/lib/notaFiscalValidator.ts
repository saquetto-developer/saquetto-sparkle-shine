import type { NotaFiscal } from '@/types/notaFiscal';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestedStatus: 'Aprovado' | 'Alerta' | 'Reprovado';
}

export interface ValidationRule {
  name: string;
  validate: (nota: NotaFiscal) => {
    isValid: boolean;
    message?: string;
    severity: 'error' | 'warning';
  };
}

/**
 * Regras de validação para Notas Fiscais
 */
const validationRules: ValidationRule[] = [
  // === REGRAS CRÍTICAS (ERRO) ===
  {
    name: 'NCM válido',
    validate: (nota) => {
      const ncm = nota.ncm?.trim();
      if (!ncm) {
        return {
          isValid: false,
          message: 'NCM não informado',
          severity: 'error'
        };
      }
      // NCM deve ter 8 dígitos
      if (!/^\d{8}$/.test(ncm.replace(/\D/g, ''))) {
        return {
          isValid: false,
          message: `NCM inválido: "${ncm}" - deve conter 8 dígitos`,
          severity: 'error'
        };
      }
      return { isValid: true, severity: 'error' };
    }
  },
  {
    name: 'CFOP válido',
    validate: (nota) => {
      const cfop = nota.cfop?.trim();
      if (!cfop) {
        return {
          isValid: false,
          message: 'CFOP não informado',
          severity: 'error'
        };
      }
      // CFOP deve ter 4 dígitos
      if (!/^\d{4}$/.test(cfop.replace(/\D/g, ''))) {
        return {
          isValid: false,
          message: `CFOP inválido: "${cfop}" - deve conter 4 dígitos`,
          severity: 'error'
        };
      }
      return { isValid: true, severity: 'error' };
    }
  },
  {
    name: 'Valor total válido',
    validate: (nota) => {
      const valor = parseFloat(
        nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'
      );
      if (valor <= 0) {
        return {
          isValid: false,
          message: `Valor total inválido: R$ ${valor.toFixed(2)} - deve ser maior que zero`,
          severity: 'error'
        };
      }
      return { isValid: true, severity: 'error' };
    }
  },
  {
    name: 'Número NFe válido',
    validate: (nota) => {
      if (!nota.numero_nfe?.trim()) {
        return {
          isValid: false,
          message: 'Número da NFe não informado',
          severity: 'error'
        };
      }
      return { isValid: true, severity: 'error' };
    }
  },
  {
    name: 'Chave de acesso válida',
    validate: (nota) => {
      const chave = nota.chave_acesso?.replace(/\D/g, '');
      if (!chave) {
        return {
          isValid: false,
          message: 'Chave de acesso não informada',
          severity: 'error'
        };
      }
      // Chave de acesso deve ter 44 dígitos
      if (chave.length !== 44) {
        return {
          isValid: false,
          message: `Chave de acesso inválida - deve conter 44 dígitos (atual: ${chave.length})`,
          severity: 'error'
        };
      }
      return { isValid: true, severity: 'error' };
    }
  },

  // === REGRAS DE ALERTA (WARNING) ===
  {
    name: 'Destinatário informado',
    validate: (nota) => {
      if (!nota.destinatario_razao_social?.trim() && !nota.destinatario_cnpj?.trim()) {
        return {
          isValid: false,
          message: 'Destinatário não identificado (sem razão social ou CNPJ)',
          severity: 'warning'
        };
      }
      return { isValid: true, severity: 'warning' };
    }
  },
  {
    name: 'CNPJ destinatário válido',
    validate: (nota) => {
      const cnpj = nota.destinatario_cnpj?.replace(/\D/g, '');
      if (cnpj && cnpj.length !== 14) {
        return {
          isValid: false,
          message: `CNPJ do destinatário inválido: "${nota.destinatario_cnpj}" - deve conter 14 dígitos`,
          severity: 'warning'
        };
      }
      return { isValid: true, severity: 'warning' };
    }
  },
  {
    name: 'Descrição do produto',
    validate: (nota) => {
      if (!nota.descricao_produto?.trim()) {
        return {
          isValid: false,
          message: 'Descrição do produto não informada',
          severity: 'warning'
        };
      }
      if (nota.descricao_produto.trim().length < 5) {
        return {
          isValid: false,
          message: 'Descrição do produto muito curta (mínimo 5 caracteres)',
          severity: 'warning'
        };
      }
      return { isValid: true, severity: 'warning' };
    }
  },
  {
    name: 'CST/CSOSN válido',
    validate: (nota) => {
      const icmsCst = nota.icms_cst?.trim();
      if (!icmsCst) {
        return {
          isValid: false,
          message: 'CST/CSOSN do ICMS não informado',
          severity: 'warning'
        };
      }
      return { isValid: true, severity: 'warning' };
    }
  },
  {
    name: 'Valores de tributos consistentes',
    validate: (nota) => {
      const valorTotal = parseFloat(
        nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'
      );
      const icms = parseFloat(
        nota.icms_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'
      );
      const pis = parseFloat(
        nota.pis_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'
      );
      const cofins = parseFloat(
        nota.cofins_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'
      );

      const totalTributos = icms + pis + cofins;

      // Tributos não podem ser maiores que o valor total
      if (totalTributos > valorTotal * 1.5) {
        return {
          isValid: false,
          message: `Soma dos tributos (R$ ${totalTributos.toFixed(2)}) parece inconsistente com valor total (R$ ${valorTotal.toFixed(2)})`,
          severity: 'warning'
        };
      }
      return { isValid: true, severity: 'warning' };
    }
  }
];

/**
 * Valida uma nota fiscal completa
 */
export function validateNotaFiscal(nota: NotaFiscal): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Executar todas as regras de validação
  validationRules.forEach(rule => {
    const result = rule.validate(nota);
    if (!result.isValid && result.message) {
      if (result.severity === 'error') {
        errors.push(`[${rule.name}] ${result.message}`);
      } else {
        warnings.push(`[${rule.name}] ${result.message}`);
      }
    }
  });

  // Determinar status sugerido
  let suggestedStatus: 'Aprovado' | 'Alerta' | 'Reprovado' = 'Aprovado';

  if (errors.length > 0) {
    suggestedStatus = 'Reprovado';
  } else if (warnings.length > 0) {
    suggestedStatus = 'Alerta';
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestedStatus
  };
}

/**
 * Valida múltiplas notas fiscais em lote
 */
export function validateNotasFiscais(notas: NotaFiscal[]): Map<number, ValidationResult> {
  const results = new Map<number, ValidationResult>();

  notas.forEach(nota => {
    if (nota.id) {
      results.set(nota.id, validateNotaFiscal(nota));
    }
  });

  return results;
}

/**
 * Gera mensagem de explicação consolidada
 */
export function getValidationExplanation(result: ValidationResult): string {
  const messages: string[] = [];

  if (result.errors.length > 0) {
    messages.push('ERROS CRÍTICOS:');
    messages.push(...result.errors.map(e => `• ${e}`));
  }

  if (result.warnings.length > 0) {
    if (messages.length > 0) messages.push('');
    messages.push('ALERTAS:');
    messages.push(...result.warnings.map(w => `• ${w}`));
  }

  if (messages.length === 0) {
    return 'Nota fiscal aprovada - todos os dados estão corretos.';
  }

  return messages.join('\n');
}

/**
 * Estatísticas de validação
 */
export function getValidationStats(results: Map<number, ValidationResult>) {
  let aprovadas = 0;
  let alertas = 0;
  let reprovadas = 0;
  let totalErros = 0;
  let totalAlertas = 0;

  results.forEach(result => {
    if (result.suggestedStatus === 'Aprovado') aprovadas++;
    else if (result.suggestedStatus === 'Alerta') alertas++;
    else if (result.suggestedStatus === 'Reprovado') reprovadas++;

    totalErros += result.errors.length;
    totalAlertas += result.warnings.length;
  });

  return {
    total: results.size,
    aprovadas,
    alertas,
    reprovadas,
    totalErros,
    totalAlertas,
    taxaAprovacao: results.size > 0 ? (aprovadas / results.size) * 100 : 0
  };
}
