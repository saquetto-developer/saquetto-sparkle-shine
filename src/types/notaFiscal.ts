// Tipos compartilhados para Nota Fiscal

export interface NotaFiscal {
  // Identificação
  id: number;
  numero_nfe: string | null;
  serie: string | null;
  modelo: string | null;
  chave_acesso: string | null;
  ambiente: string | null;
  data_emissao: string | null;
  data_autorizacao: string | null;
  finalidade_nfe: string | null;
  status_autorizacao: string | null;
  protocolo_sefaz: string | null;
  situacao: string | null;
  explicacao: string | null;
  created_at: string | null;

  // Emitente
  emitente_razao_social: string | null;
  emitente_cnpj: string | null;
  emitente_ie: string | null;
  emitente_endereco: string | null;
  emitente_telefone: string | null;
  emitente_regime_tributario: string | null;
  emitente_saquetto: boolean | null;
  simples_optante: boolean | null;

  // Destinatário
  destinatario_razao_social: string | null;
  destinatario_cnpj: string | null;
  destinatario_ie: string | null;
  destinatario_endereco: string | null;
  destinatario_email: string | null;
  destinatario_telefone: string | null;

  // Produto
  descricao_produto: string | null;
  codigo_produto: string | null;
  ncm: string | null;
  cest: string | null;
  quantidade: string | null;
  valor_unitario: string | null;
  item: string | null;

  // Valores
  valor_total_nfe: string | null;
  valor_total_produto: string | null;
  valor_original: string | null;
  base_calculo_icms: string | null;

  // ICMS
  icms_cst: string | null;
  icms_aliquota: string | null;
  icms_base_calculo: string | null;
  icms_valor: string | null;
  valor_icms: string | null;

  // PIS
  pis_cst: string | null;
  pis_aliquota: string | null;
  pis_base_calculo: string | null;
  pis_valor: string | null;
  valor_pis: string | null;

  // COFINS
  cofins_cst: string | null;
  cofins_aliquota: string | null;
  cofins_base_calculo: string | null;
  cofins_valor: string | null;
  valor_cofins: string | null;

  // IPI
  ipi_cst: string | null;
  ipi_valor: string | null;

  // Operação
  natureza_operacao: string | null;
  cfop: string | null;
  pedido: string | null;
  pedido_cliente: string | null;
  oc: string | null;

  // Logística
  transportadora: string | null;
  local_entrega: string | null;
  linha: string | null;

  // Financeiro
  forma_pagamento: string | null;
  numero_fatura: string | null;
  valor_duplicata: string | null;
  vencimento: string | null;
  valor_pago: string | null;

  // Outros
  codigo_municipio_emissor: string | null;
  certificado_digital: string | null;
}

export interface OperationData {
  tipo: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

export interface DashboardMetrics {
  totalNotas: number;
  notasAprovadas: number;
  notasReprovadas: number;
  notasAlerta: number;
  valorTotal: number;
  totalIcms: number;
  totalPis: number;
  totalCofins: number;
  totalIpi: number;
  operacoesPorTipo: OperationData[];
  simplesNacional: number;
  lucroPresumido: number;
  semInformacao: number;
}
