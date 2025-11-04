import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Info,
  DollarSign,
  Building2,
  Package,
  ReceiptText,
  Truck,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { NotaFiscalSection, DataGrid, type SectionField } from './NotaFiscalSection';
import { ValidationPanel } from './ValidationPanel';
import {
  formatCurrency,
  formatPercentage,
  formatCNPJ,
  formatCPF,
  formatPhone,
  formatDate,
  formatDateTime,
  formatChaveAcesso,
  formatNCM,
  formatCFOP,
  formatBoolean,
  formatRegimeTributario,
  formatQuantidade,
} from '@/lib/notaFiscalFormatters';

interface NotaFiscal {
  // All 89 fields from database
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
  cfop_indicado: string | null;
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
  created_at: string | null;
}

interface NotaFiscalTabsProps {
  nota: NotaFiscal;
}

export function NotaFiscalTabs({ nota }: NotaFiscalTabsProps) {
  const [activeTab, setActiveTab] = React.useState('info');

  // Error boundary - Prevent white screen
  if (!nota) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Nenhuma nota fiscal selecionada</p>
      </div>
    );
  }

  // Badge for status
  const getStatusBadge = () => {
    const variant =
      nota.situacao === 'Aprovado'
        ? 'default'
        : nota.situacao === 'Alerta'
        ? 'secondary'
        : 'destructive';

    const className =
      nota.situacao === 'Alerta'
        ? 'bg-warning/10 text-warning border-warning/20'
        : '';

    return (
      <Badge variant={variant} className={className}>
        {nota.situacao || 'N/A'}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">NFe:</span>
            <span className="font-mono font-bold">{nota.numero_nfe || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge()}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Emissão:</span>{' '}
            <span className="font-medium">{formatDate(nota.data_emissao)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Cliente:</span>{' '}
            <span className="font-medium">{nota.destinatario_razao_social || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Valor:</span>{' '}
            <span className="font-medium">{formatCurrency(nota.valor_total_nfe)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="validacao" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 h-auto">
          <TabsTrigger value="validacao" className="text-xs gap-1 py-2">
            <ShieldCheck className="h-3 w-3" />
            <span className="hidden sm:inline">Validação</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs gap-1 py-2">
            <Info className="h-3 w-3" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
          <TabsTrigger value="valores" className="text-xs gap-1 py-2">
            <DollarSign className="h-3 w-3" />
            <span className="hidden sm:inline">Valores</span>
          </TabsTrigger>
          <TabsTrigger value="partes" className="text-xs gap-1 py-2">
            <Building2 className="h-3 w-3" />
            <span className="hidden sm:inline">Partes</span>
          </TabsTrigger>
          <TabsTrigger value="produto" className="text-xs gap-1 py-2">
            <Package className="h-3 w-3" />
            <span className="hidden sm:inline">Produto</span>
          </TabsTrigger>
          <TabsTrigger value="tributos" className="text-xs gap-1 py-2">
            <ReceiptText className="h-3 w-3" />
            <span className="hidden sm:inline">Tributos</span>
          </TabsTrigger>
          <TabsTrigger value="logistica" className="text-xs gap-1 py-2">
            <Truck className="h-3 w-3" />
            <span className="hidden sm:inline">Logística</span>
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="text-xs gap-1 py-2">
            <CreditCard className="h-3 w-3" />
            <span className="hidden sm:inline">Financeiro</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Validação Automática */}
        <TabsContent value="validacao" className="mt-4">
          <ValidationPanel nota={nota as any} />
        </TabsContent>

        {/* Tab: Informações Gerais */}
        <TabsContent value="info" className="space-y-6 mt-4">
          <NotaFiscalSection
            title="Identificação da NF-e"
            icon={Info}
            iconClassName="text-blue-600"
            fields={[
              { label: 'Número', value: nota.numero_nfe, className: 'font-mono font-bold' },
              { label: 'Série', value: nota.serie },
              { label: 'Modelo', value: nota.modelo },
              {
                label: 'Chave de Acesso',
                value: nota.chave_acesso,
                formatter: formatChaveAcesso,
                className: 'font-mono text-xs',
                copyable: true,
              },
              { label: 'Ambiente', value: nota.ambiente },
            ]}
          />

          <NotaFiscalSection
            title="Datas"
            fields={[
              { label: 'Data de Emissão', value: nota.data_emissao, formatter: formatDateTime },
              {
                label: 'Data de Autorização',
                value: nota.data_autorizacao,
                formatter: formatDateTime,
              },
            ]}
          />

          <NotaFiscalSection
            title="Status e Protocolo"
            fields={[
              { label: 'Status SEFAZ', value: nota.status_autorizacao },
              {
                label: 'Protocolo SEFAZ',
                value: nota.protocolo_sefaz,
                className: 'font-mono text-xs',
                copyable: true,
              },
              { label: 'Finalidade', value: nota.finalidade_nfe },
              { label: 'Município Emissor', value: nota.codigo_municipio_emissor },
            ]}
          />

          <NotaFiscalSection
            title="CFOP"
            fields={[
              { label: 'CFOP', value: nota.cfop, formatter: formatCFOP },
              { label: 'CFOP indicado (entrada Saquetto)', value: nota.cfop_indicado, formatter: formatCFOP, showWhenEmpty: true },
            ]}
          />

          {nota.explicacao && (
            <NotaFiscalSection
              title="Observações da Auditoria"
              fields={[{ label: 'Explicação', value: nota.explicacao }]}
            />
          )}
        </TabsContent>

        {/* Tab: Valores */}
        <TabsContent value="valores" className="space-y-6 mt-4">
          <NotaFiscalSection
            title="Valores Principais"
            icon={DollarSign}
            iconClassName="text-green-600"
            fields={[
              {
                label: 'Valor Total da NF-e',
                value: nota.valor_total_nfe,
                formatter: formatCurrency,
                className: 'font-bold text-lg text-green-600',
              },
              {
                label: 'Valor Total dos Produtos',
                value: nota.valor_total_produto,
                formatter: formatCurrency,
              },
              {
                label: 'Valor Original',
                value: nota.valor_original,
                formatter: formatCurrency,
              },
            ]}
          />

          <NotaFiscalSection
            title="Base de Cálculo"
            fields={[
              {
                label: 'Base de Cálculo ICMS',
                value: nota.base_calculo_icms,
                formatter: formatCurrency,
              },
            ]}
          />

          <NotaFiscalSection
            title="Valores dos Tributos"
            fields={[
              { label: 'ICMS', value: nota.icms_valor || nota.valor_icms, formatter: formatCurrency },
              { label: 'PIS', value: nota.pis_valor || nota.valor_pis, formatter: formatCurrency },
              {
                label: 'COFINS',
                value: nota.cofins_valor || nota.valor_cofins,
                formatter: formatCurrency,
              },
              { label: 'IPI', value: nota.ipi_valor, formatter: formatCurrency },
            ]}
          />
        </TabsContent>

        {/* Tab: Partes (Emitente + Destinatário) */}
        <TabsContent value="partes" className="space-y-6 mt-4">
          <DataGrid title="Emitente" icon={Building2} iconClassName="text-purple-600">
            <NotaFiscalSection
              title="Dados Cadastrais"
              fields={[
                { label: 'Razão Social', value: nota.emitente_razao_social },
                { label: 'CNPJ', value: nota.emitente_cnpj, formatter: formatCNPJ, copyable: true },
                { label: 'Inscrição Estadual', value: nota.emitente_ie, copyable: true },
              ]}
            />

            <NotaFiscalSection
              title="Regime e Contato"
              fields={[
                {
                  label: 'Regime Tributário',
                  value: nota.emitente_regime_tributario,
                  formatter: formatRegimeTributario,
                },
                {
                  label: 'Optante Simples',
                  value: nota.simples_optante,
                  formatter: formatBoolean,
                },
                { label: 'É Saquetto?', value: nota.emitente_saquetto, formatter: formatBoolean },
                { label: 'Telefone', value: nota.emitente_telefone, formatter: formatPhone },
                { label: 'Endereço', value: nota.emitente_endereco },
              ]}
            />
          </DataGrid>

          <DataGrid title="Destinatário" icon={Building2} iconClassName="text-purple-600">
            <NotaFiscalSection
              title="Dados Cadastrais"
              fields={[
                { label: 'Razão Social', value: nota.destinatario_razao_social },
                {
                  label: 'CNPJ',
                  value: nota.destinatario_cnpj,
                  formatter: formatCNPJ,
                  copyable: true,
                },
                { label: 'Inscrição Estadual', value: nota.destinatario_ie, copyable: true },
              ]}
            />

            <NotaFiscalSection
              title="Contato"
              fields={[
                { label: 'E-mail', value: nota.destinatario_email, copyable: true },
                {
                  label: 'Telefone',
                  value: nota.destinatario_telefone,
                  formatter: formatPhone,
                },
                { label: 'Endereço', value: nota.destinatario_endereco },
              ]}
            />
          </DataGrid>
        </TabsContent>

        {/* Tab: Produto */}
        <TabsContent value="produto" className="space-y-6 mt-4">
          <NotaFiscalSection
            title="Informações do Produto"
            icon={Package}
            iconClassName="text-orange-600"
            fields={[
              { label: 'Descrição', value: nota.descricao_produto },
              { label: 'Código', value: nota.codigo_produto, className: 'font-mono' },
              { label: 'Item', value: nota.item },
            ]}
          />

          <NotaFiscalSection
            title="Classificação Fiscal"
            fields={[
              { label: 'NCM', value: nota.ncm, formatter: formatNCM, copyable: true },
              { label: 'CEST', value: nota.cest, copyable: true },
            ]}
          />

          <NotaFiscalSection
            title="Quantidade e Valores"
            fields={[
              { label: 'Quantidade', value: nota.quantidade, formatter: formatQuantidade },
              { label: 'Valor Unitário', value: nota.valor_unitario, formatter: formatCurrency },
              {
                label: 'Valor Total',
                value: nota.valor_total_produto,
                formatter: formatCurrency,
                className: 'font-bold',
              },
            ]}
          />
        </TabsContent>

        {/* Tab: Tributos */}
        <TabsContent value="tributos" className="space-y-6 mt-4">
          <DataGrid title="Tributos Detalhados" icon={ReceiptText} iconClassName="text-red-600">
            <NotaFiscalSection
              title="ICMS"
              fields={[
                { label: 'CST', value: nota.icms_cst },
                { label: 'Alíquota', value: nota.icms_aliquota, formatter: formatPercentage },
                {
                  label: 'Base de Cálculo',
                  value: nota.icms_base_calculo,
                  formatter: formatCurrency,
                },
                { label: 'Valor', value: nota.icms_valor, formatter: formatCurrency },
              ]}
            />

            <NotaFiscalSection
              title="PIS"
              fields={[
                { label: 'CST', value: nota.pis_cst },
                { label: 'Alíquota', value: nota.pis_aliquota, formatter: formatPercentage },
                {
                  label: 'Base de Cálculo',
                  value: nota.pis_base_calculo,
                  formatter: formatCurrency,
                },
                { label: 'Valor', value: nota.pis_valor, formatter: formatCurrency },
              ]}
            />

            <NotaFiscalSection
              title="COFINS"
              fields={[
                { label: 'CST', value: nota.cofins_cst },
                { label: 'Alíquota', value: nota.cofins_aliquota, formatter: formatPercentage },
                {
                  label: 'Base de Cálculo',
                  value: nota.cofins_base_calculo,
                  formatter: formatCurrency,
                },
                { label: 'Valor', value: nota.cofins_valor, formatter: formatCurrency },
              ]}
            />

            <NotaFiscalSection
              title="IPI"
              fields={[
                { label: 'CST', value: nota.ipi_cst },
                { label: 'Valor', value: nota.ipi_valor, formatter: formatCurrency },
              ]}
            />
          </DataGrid>
        </TabsContent>

        {/* Tab: Logística */}
        <TabsContent value="logistica" className="space-y-6 mt-4">
          <NotaFiscalSection
            title="Informações de Transporte"
            icon={Truck}
            iconClassName="text-cyan-600"
            fields={[
              { label: 'Transportadora', value: nota.transportadora },
              { label: 'Local de Entrega', value: nota.local_entrega },
              { label: 'Linha', value: nota.linha },
            ]}
          />

          <NotaFiscalSection
            title="Operação"
            fields={[
              { label: 'Natureza da Operação', value: nota.natureza_operacao },
              { label: 'CFOP', value: nota.cfop, formatter: formatCFOP },
            ]}
          />

          <NotaFiscalSection
            title="Pedidos e Ordens"
            fields={[
              { label: 'Pedido', value: nota.pedido },
              { label: 'Pedido do Cliente', value: nota.pedido_cliente },
              { label: 'OC (Ordem de Compra)', value: nota.oc },
            ]}
          />
        </TabsContent>

        {/* Tab: Financeiro */}
        <TabsContent value="financeiro" className="space-y-6 mt-4">
          <NotaFiscalSection
            title="Forma de Pagamento"
            icon={CreditCard}
            iconClassName="text-yellow-600"
            fields={[{ label: 'Forma de Pagamento', value: nota.forma_pagamento }]}
          />

          <NotaFiscalSection
            title="Duplicatas e Vencimentos"
            fields={[
              { label: 'Número da Fatura', value: nota.numero_fatura },
              {
                label: 'Valor da Duplicata',
                value: nota.valor_duplicata,
                formatter: formatCurrency,
              },
              { label: 'Vencimento', value: nota.vencimento, formatter: formatDate },
              { label: 'Valor Pago', value: nota.valor_pago, formatter: formatCurrency },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
