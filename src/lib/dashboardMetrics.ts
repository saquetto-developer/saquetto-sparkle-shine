import type { NotaFiscal, DashboardMetrics, OperationData } from '@/types/notaFiscal';
import { countByTaxRegime } from './taxRegimeUtils';

/**
 * Extrai o tipo de operação da natureza da operação (primeira palavra)
 */
export function extrairTipoOperacao(naturezaOperacao: string): string {
  if (!naturezaOperacao) return 'OUTROS';

  // Limpar e normalizar
  const cleaned = naturezaOperacao.trim().toUpperCase();

  // Extrair primeira palavra
  const primeiraPalavra = cleaned.split(' ')[0];

  // Tratar casos especiais
  if (primeiraPalavra.match(/^\d/)) return 'OUTROS'; // Se começar com número
  if (primeiraPalavra.length < 3) return 'OUTROS'; // Se muito curta

  return primeiraPalavra;
}

/**
 * Calcula operações agrupadas por tipo
 */
export function calcularOperacoesPorTipo(notas: NotaFiscal[]): OperationData[] {
  const operacoesMap = new Map<string, { quantidade: number; valor: number }>();
  let valorTotalGeral = 0;

  notas.forEach(nota => {
    const tipo = extrairTipoOperacao(nota.natureza_operacao || '');
    const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');

    valorTotalGeral += valor;

    if (operacoesMap.has(tipo)) {
      const existing = operacoesMap.get(tipo)!;
      operacoesMap.set(tipo, {
        quantidade: existing.quantidade + 1,
        valor: existing.valor + valor
      });
    } else {
      operacoesMap.set(tipo, { quantidade: 1, valor });
    }
  });

  return Array.from(operacoesMap.entries())
    .map(([tipo, stats]) => ({
      tipo,
      quantidade: stats.quantidade,
      valor: stats.valor,
      percentual: notas.length > 0 ? (stats.quantidade / notas.length) * 100 : 0
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

/**
 * Calcula todas as métricas do dashboard a partir de um array de notas
 */
export function calcularMetricas(notas: NotaFiscal[]): DashboardMetrics {
  const totalNotas = notas.length;
  const notasAprovadas = notas.filter(n => n.situacao === 'Aprovado').length;
  const notasReprovadas = notas.filter(n => n.situacao === 'Reprovado').length;
  const notasAlerta = notas.filter(n => n.situacao === 'Alerta').length;

  const valorTotal = notas.reduce((sum, nota) => {
    const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
    return sum + valor;
  }, 0);

  const totalIcms = notas.reduce((sum, nota) => {
    const valor = parseFloat(nota.icms_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
    return sum + valor;
  }, 0);

  const totalPis = notas.reduce((sum, nota) => {
    const valor = parseFloat(nota.pis_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
    return sum + valor;
  }, 0);

  const totalCofins = notas.reduce((sum, nota) => {
    const valor = parseFloat(nota.cofins_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
    return sum + valor;
  }, 0);

  const totalIpi = notas.reduce((sum, nota) => {
    const valor = parseFloat(nota.ipi_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
    return sum + valor;
  }, 0);

  const operacoesPorTipo = calcularOperacoesPorTipo(notas);

  // Calculate tax regime counts
  const taxRegimeCounts = countByTaxRegime(notas);

  return {
    totalNotas,
    notasAprovadas,
    notasReprovadas,
    notasAlerta,
    valorTotal,
    totalIcms,
    totalPis,
    totalCofins,
    totalIpi,
    operacoesPorTipo,
    simplesNacional: taxRegimeCounts.simples,
    lucroPresumido: taxRegimeCounts.presumido,
    semInformacao: taxRegimeCounts.sem_informacao
  };
}

/**
 * Retorna métricas vazias (para estado inicial)
 */
export function getEmptyMetrics(): DashboardMetrics {
  return {
    totalNotas: 0,
    notasAprovadas: 0,
    notasReprovadas: 0,
    notasAlerta: 0,
    valorTotal: 0,
    totalIcms: 0,
    totalPis: 0,
    totalCofins: 0,
    totalIpi: 0,
    operacoesPorTipo: [],
    simplesNacional: 0,
    lucroPresumido: 0,
    semInformacao: 0
  };
}
