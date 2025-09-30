export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      saquetto: {
        Row: {
          ambiente: string | null
          base_calculo_icms: string | null
          certificado_digital: string | null
          cest: string | null
          cfop: string | null
          chave_acesso: string | null
          codigo_municipio_emissor: string | null
          codigo_produto: string | null
          cofins_aliquota: string | null
          cofins_base_calculo: string | null
          cofins_cst: string | null
          cofins_valor: string | null
          created_at: string | null
          data_autorizacao: string | null
          data_emissao: string | null
          descricao_produto: string | null
          destinatario_cnpj: string | null
          destinatario_email: string | null
          destinatario_endereco: string | null
          destinatario_ie: string | null
          destinatario_razao_social: string | null
          destinatario_telefone: string | null
          emitente_cnpj: string | null
          emitente_endereco: string | null
          emitente_ie: string | null
          emitente_razao_social: string | null
          emitente_regime_tributario: string | null
          emitente_saquetto: boolean | null
          emitente_telefone: string | null
          explicacao: string | null
          finalidade_nfe: string | null
          forma_pagamento: string | null
          icms_aliquota: string | null
          icms_base_calculo: string | null
          icms_cst: string | null
          icms_valor: string | null
          id: number
          ipi_cst: string | null
          ipi_valor: string | null
          item: string | null
          linha: string | null
          local_entrega: string | null
          modelo: string | null
          natureza_operacao: string | null
          ncm: string | null
          numero_fatura: string | null
          numero_nfe: string | null
          oc: string | null
          pedido: string | null
          pedido_cliente: string | null
          pis_aliquota: string | null
          pis_base_calculo: string | null
          pis_cst: string | null
          pis_valor: string | null
          protocolo_sefaz: string | null
          quantidade: string | null
          serie: string | null
          simples_optante: boolean | null
          situacao: string | null
          status_autorizacao: string | null
          transportadora: string | null
          valor_cofins: string | null
          valor_duplicata: string | null
          valor_icms: string | null
          valor_original: string | null
          valor_pago: string | null
          valor_pis: string | null
          valor_total_nfe: string | null
          valor_total_produto: string | null
          valor_unitario: string | null
          vencimento: string | null
        }
        Insert: {
          ambiente?: string | null
          base_calculo_icms?: string | null
          certificado_digital?: string | null
          cest?: string | null
          cfop?: string | null
          chave_acesso?: string | null
          codigo_municipio_emissor?: string | null
          codigo_produto?: string | null
          cofins_aliquota?: string | null
          cofins_base_calculo?: string | null
          cofins_cst?: string | null
          cofins_valor?: string | null
          created_at?: string | null
          data_autorizacao?: string | null
          data_emissao?: string | null
          descricao_produto?: string | null
          destinatario_cnpj?: string | null
          destinatario_email?: string | null
          destinatario_endereco?: string | null
          destinatario_ie?: string | null
          destinatario_razao_social?: string | null
          destinatario_telefone?: string | null
          emitente_cnpj?: string | null
          emitente_endereco?: string | null
          emitente_ie?: string | null
          emitente_razao_social?: string | null
          emitente_regime_tributario?: string | null
          emitente_saquetto?: boolean | null
          emitente_telefone?: string | null
          explicacao?: string | null
          finalidade_nfe?: string | null
          forma_pagamento?: string | null
          icms_aliquota?: string | null
          icms_base_calculo?: string | null
          icms_cst?: string | null
          icms_valor?: string | null
          id?: number
          ipi_cst?: string | null
          ipi_valor?: string | null
          item?: string | null
          linha?: string | null
          local_entrega?: string | null
          modelo?: string | null
          natureza_operacao?: string | null
          ncm?: string | null
          numero_fatura?: string | null
          numero_nfe?: string | null
          oc?: string | null
          pedido?: string | null
          pedido_cliente?: string | null
          pis_aliquota?: string | null
          pis_base_calculo?: string | null
          pis_cst?: string | null
          pis_valor?: string | null
          protocolo_sefaz?: string | null
          quantidade?: string | null
          serie?: string | null
          simples_optante?: boolean | null
          situacao?: string | null
          status_autorizacao?: string | null
          transportadora?: string | null
          valor_cofins?: string | null
          valor_duplicata?: string | null
          valor_icms?: string | null
          valor_original?: string | null
          valor_pago?: string | null
          valor_pis?: string | null
          valor_total_nfe?: string | null
          valor_total_produto?: string | null
          valor_unitario?: string | null
          vencimento?: string | null
        }
        Update: {
          ambiente?: string | null
          base_calculo_icms?: string | null
          certificado_digital?: string | null
          cest?: string | null
          cfop?: string | null
          chave_acesso?: string | null
          codigo_municipio_emissor?: string | null
          codigo_produto?: string | null
          cofins_aliquota?: string | null
          cofins_base_calculo?: string | null
          cofins_cst?: string | null
          cofins_valor?: string | null
          created_at?: string | null
          data_autorizacao?: string | null
          data_emissao?: string | null
          descricao_produto?: string | null
          destinatario_cnpj?: string | null
          destinatario_email?: string | null
          destinatario_endereco?: string | null
          destinatario_ie?: string | null
          destinatario_razao_social?: string | null
          destinatario_telefone?: string | null
          emitente_cnpj?: string | null
          emitente_endereco?: string | null
          emitente_ie?: string | null
          emitente_razao_social?: string | null
          emitente_regime_tributario?: string | null
          emitente_saquetto?: boolean | null
          emitente_telefone?: string | null
          explicacao?: string | null
          finalidade_nfe?: string | null
          forma_pagamento?: string | null
          icms_aliquota?: string | null
          icms_base_calculo?: string | null
          icms_cst?: string | null
          icms_valor?: string | null
          id?: number
          ipi_cst?: string | null
          ipi_valor?: string | null
          item?: string | null
          linha?: string | null
          local_entrega?: string | null
          modelo?: string | null
          natureza_operacao?: string | null
          ncm?: string | null
          numero_fatura?: string | null
          numero_nfe?: string | null
          oc?: string | null
          pedido?: string | null
          pedido_cliente?: string | null
          pis_aliquota?: string | null
          pis_base_calculo?: string | null
          pis_cst?: string | null
          pis_valor?: string | null
          protocolo_sefaz?: string | null
          quantidade?: string | null
          serie?: string | null
          simples_optante?: boolean | null
          situacao?: string | null
          status_autorizacao?: string | null
          transportadora?: string | null
          valor_cofins?: string | null
          valor_duplicata?: string | null
          valor_icms?: string | null
          valor_original?: string | null
          valor_pago?: string | null
          valor_pis?: string | null
          valor_total_nfe?: string | null
          valor_total_produto?: string | null
          valor_unitario?: string | null
          vencimento?: string | null
        }
        Relationships: []
      }
      Saquetto_arquivos_drive: {
        Row: {
          created_at: string | null
          drive_id: string
          extensao: string | null
          id: string
          nome: string
          ordem_merge: number | null
          parent_drive_id: string | null
          thumbnail_link: string | null
          tipo: string
          web_view_link: string | null
        }
        Insert: {
          created_at?: string | null
          drive_id: string
          extensao?: string | null
          id?: string
          nome: string
          ordem_merge?: number | null
          parent_drive_id?: string | null
          thumbnail_link?: string | null
          tipo: string
          web_view_link?: string | null
        }
        Update: {
          created_at?: string | null
          drive_id?: string
          extensao?: string | null
          id?: string
          nome?: string
          ordem_merge?: number | null
          parent_drive_id?: string | null
          thumbnail_link?: string | null
          tipo?: string
          web_view_link?: string | null
        }
        Relationships: []
      }
      Saquetto_arquivos_drive_Temp: {
        Row: {
          created_at: string | null
          drive_id: string
          extensao: string | null
          id: string
          nome: string
          ordem_merge: number | null
          parent_drive_id: string | null
          search: boolean | null
          thumbnail_link: string | null
          tipo: string
          web_view_link: string | null
        }
        Insert: {
          created_at?: string | null
          drive_id: string
          extensao?: string | null
          id?: string
          nome: string
          ordem_merge?: number | null
          parent_drive_id?: string | null
          search?: boolean | null
          thumbnail_link?: string | null
          tipo: string
          web_view_link?: string | null
        }
        Update: {
          created_at?: string | null
          drive_id?: string
          extensao?: string | null
          id?: string
          nome?: string
          ordem_merge?: number | null
          parent_drive_id?: string | null
          search?: boolean | null
          thumbnail_link?: string | null
          tipo?: string
          web_view_link?: string | null
        }
        Relationships: []
      }
      saquetto_atestados: {
        Row: {
          acidente_empresa: boolean | null
          atestado_cid: string | null
          atestado_cid_descricao: string | null
          atestado_descricao_completa: string | null
          atestado_dias_afastados: number | null
          atestado_motivo: string | null
          atestado_tipo: string | null
          cid: string | null
          cid_descricao: string | null
          cid_descricao_abreviada: string | null
          cid_excluidos: string | null
          cid_refer: string | null
          clinica: string | null
          clinica_contato_email: string | null
          clinica_contato_site: string | null
          clinica_contato_telefone_principal: string | null
          clinica_contato_telefones_adicionais: Json | null
          clinica_endereco_bairro: string | null
          clinica_endereco_cep: string | null
          clinica_endereco_cidade: string | null
          clinica_endereco_estado: string | null
          clinica_endereco_logradouro: string | null
          clinica_endereco_numero: string | null
          data_emissao: string | null
          hora_emissao: string | null
          id: number
          medico_categoria: string | null
          medico_crm: string | null
          medico_especialidade: string | null
          medico_especialidades: string | null
          medico_nome: string | null
          medico_nome_razao_social: string | null
          medico_numero_registro: string | null
          medico_situacao: string | null
          medico_uf: string | null
          observacoes: string | null
          paciente_documento: string | null
          paciente_nome: string | null
          perda_dinheiro: string | null
          resumo: string | null
          salario: number | null
          situacao_atestado: string | null
          status: string | null
        }
        Insert: {
          acidente_empresa?: boolean | null
          atestado_cid?: string | null
          atestado_cid_descricao?: string | null
          atestado_descricao_completa?: string | null
          atestado_dias_afastados?: number | null
          atestado_motivo?: string | null
          atestado_tipo?: string | null
          cid?: string | null
          cid_descricao?: string | null
          cid_descricao_abreviada?: string | null
          cid_excluidos?: string | null
          cid_refer?: string | null
          clinica?: string | null
          clinica_contato_email?: string | null
          clinica_contato_site?: string | null
          clinica_contato_telefone_principal?: string | null
          clinica_contato_telefones_adicionais?: Json | null
          clinica_endereco_bairro?: string | null
          clinica_endereco_cep?: string | null
          clinica_endereco_cidade?: string | null
          clinica_endereco_estado?: string | null
          clinica_endereco_logradouro?: string | null
          clinica_endereco_numero?: string | null
          data_emissao?: string | null
          hora_emissao?: string | null
          id?: number
          medico_categoria?: string | null
          medico_crm?: string | null
          medico_especialidade?: string | null
          medico_especialidades?: string | null
          medico_nome?: string | null
          medico_nome_razao_social?: string | null
          medico_numero_registro?: string | null
          medico_situacao?: string | null
          medico_uf?: string | null
          observacoes?: string | null
          paciente_documento?: string | null
          paciente_nome?: string | null
          perda_dinheiro?: string | null
          resumo?: string | null
          salario?: number | null
          situacao_atestado?: string | null
          status?: string | null
        }
        Update: {
          acidente_empresa?: boolean | null
          atestado_cid?: string | null
          atestado_cid_descricao?: string | null
          atestado_descricao_completa?: string | null
          atestado_dias_afastados?: number | null
          atestado_motivo?: string | null
          atestado_tipo?: string | null
          cid?: string | null
          cid_descricao?: string | null
          cid_descricao_abreviada?: string | null
          cid_excluidos?: string | null
          cid_refer?: string | null
          clinica?: string | null
          clinica_contato_email?: string | null
          clinica_contato_site?: string | null
          clinica_contato_telefone_principal?: string | null
          clinica_contato_telefones_adicionais?: Json | null
          clinica_endereco_bairro?: string | null
          clinica_endereco_cep?: string | null
          clinica_endereco_cidade?: string | null
          clinica_endereco_estado?: string | null
          clinica_endereco_logradouro?: string | null
          clinica_endereco_numero?: string | null
          data_emissao?: string | null
          hora_emissao?: string | null
          id?: number
          medico_categoria?: string | null
          medico_crm?: string | null
          medico_especialidade?: string | null
          medico_especialidades?: string | null
          medico_nome?: string | null
          medico_nome_razao_social?: string | null
          medico_numero_registro?: string | null
          medico_situacao?: string | null
          medico_uf?: string | null
          observacoes?: string | null
          paciente_documento?: string | null
          paciente_nome?: string | null
          perda_dinheiro?: string | null
          resumo?: string | null
          salario?: number | null
          situacao_atestado?: string | null
          status?: string | null
        }
        Relationships: []
      }
      saquetto_atestados_base64: {
        Row: {
          atestado_id: number
          base64: string | null
          created_at: string
          id: string
        }
        Insert: {
          atestado_id: number
          base64?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          atestado_id?: number
          base64?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_atestado_base64_atestado_id"
            columns: ["atestado_id"]
            isOneToOne: false
            referencedRelation: "saquetto_atestados"
            referencedColumns: ["id"]
          },
        ]
      }
      saquetto_atestados_upload: {
        Row: {
          acidente_empresa: boolean | null
          base64: string | null
          created_at: string
          id: number
          status: string | null
          user_email: string | null
        }
        Insert: {
          acidente_empresa?: boolean | null
          base64?: string | null
          created_at?: string
          id?: number
          status?: string | null
          user_email?: string | null
        }
        Update: {
          acidente_empresa?: boolean | null
          base64?: string | null
          created_at?: string
          id?: number
          status?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
      saquetto_clientes: {
        Row: {
          bairro_fornecedor: string | null
          cidade_fornecedor: string | null
          cnpj_comprador: string | null
          cnpj_fornecedor: string | null
          comprador: string | null
          condicao_pagamento: string | null
          data_emissao: string | null
          email_fornecedor: string | null
          endereco_cobranca: string | null
          endereco_comprador: string | null
          endereco_fornecedor: string | null
          fornecedor: string | null
          frete: string | null
          id: number
          ie_fornecedor: string | null
          itens_codigo: string | null
          itens_descricao: string | null
          itens_icms: string | null
          itens_ipi: string | null
          itens_ordem_compra: string | null
          itens_prazo_entrega: string | null
          itens_preco_total: string | null
          itens_preco_unitario: string | null
          itens_quantidade: string | null
          itens_unidade: string | null
          itens0_codigo: string | null
          itens0_ordem_compra: string | null
          local_entrega: string | null
          observacao: string | null
          pedido: string | null
          telefone_comprador: string | null
          telefone_fornecedor: string | null
          uf_fornecedor: string | null
          valor_total: string | null
        }
        Insert: {
          bairro_fornecedor?: string | null
          cidade_fornecedor?: string | null
          cnpj_comprador?: string | null
          cnpj_fornecedor?: string | null
          comprador?: string | null
          condicao_pagamento?: string | null
          data_emissao?: string | null
          email_fornecedor?: string | null
          endereco_cobranca?: string | null
          endereco_comprador?: string | null
          endereco_fornecedor?: string | null
          fornecedor?: string | null
          frete?: string | null
          id?: number
          ie_fornecedor?: string | null
          itens_codigo?: string | null
          itens_descricao?: string | null
          itens_icms?: string | null
          itens_ipi?: string | null
          itens_ordem_compra?: string | null
          itens_prazo_entrega?: string | null
          itens_preco_total?: string | null
          itens_preco_unitario?: string | null
          itens_quantidade?: string | null
          itens_unidade?: string | null
          itens0_codigo?: string | null
          itens0_ordem_compra?: string | null
          local_entrega?: string | null
          observacao?: string | null
          pedido?: string | null
          telefone_comprador?: string | null
          telefone_fornecedor?: string | null
          uf_fornecedor?: string | null
          valor_total?: string | null
        }
        Update: {
          bairro_fornecedor?: string | null
          cidade_fornecedor?: string | null
          cnpj_comprador?: string | null
          cnpj_fornecedor?: string | null
          comprador?: string | null
          condicao_pagamento?: string | null
          data_emissao?: string | null
          email_fornecedor?: string | null
          endereco_cobranca?: string | null
          endereco_comprador?: string | null
          endereco_fornecedor?: string | null
          fornecedor?: string | null
          frete?: string | null
          id?: number
          ie_fornecedor?: string | null
          itens_codigo?: string | null
          itens_descricao?: string | null
          itens_icms?: string | null
          itens_ipi?: string | null
          itens_ordem_compra?: string | null
          itens_prazo_entrega?: string | null
          itens_preco_total?: string | null
          itens_preco_unitario?: string | null
          itens_quantidade?: string | null
          itens_unidade?: string | null
          itens0_codigo?: string | null
          itens0_ordem_compra?: string | null
          local_entrega?: string | null
          observacao?: string | null
          pedido?: string | null
          telefone_comprador?: string | null
          telefone_fornecedor?: string | null
          uf_fornecedor?: string | null
          valor_total?: string | null
        }
        Relationships: []
      }
      Saquetto_databook: {
        Row: {
          base64: string | null
          created_at: string
          id: number
          name: string | null
          tentativas: number
          url_databook_PDFco: string | null
          url_drive: string | null
        }
        Insert: {
          base64?: string | null
          created_at?: string
          id?: number
          name?: string | null
          tentativas?: number
          url_databook_PDFco?: string | null
          url_drive?: string | null
        }
        Update: {
          base64?: string | null
          created_at?: string
          id?: number
          name?: string | null
          tentativas?: number
          url_databook_PDFco?: string | null
          url_drive?: string | null
        }
        Relationships: []
      }
      saquetto_follow_up: {
        Row: {
          cliente_retornou: boolean | null
          cnpj: string | null
          codigo_fornecedor: string | null
          codigo_item: string | null
          create_at: string | null
          data_entrada: string | null
          data_mensagem_enviada: string | null
          data_ultimo_contato: string | null
          dentro_fora_prazo_entrega: string | null
          do_fc_no_dc: string | null
          email: string | null
          emissao_pedido_compra: string | null
          estado: string | null
          familia: string | null
          "follow-up": boolean | null
          fornecedor: string | null
          id: number
          id_message: string | null
          mensagem_enviada: string | null
          mensagem_enviada_ao_usuário: string | null
          mensagem_usuário: string | null
          mes_entrada: string | null
          motivo_e_data: string | null
          motivo_reprogramacao: string | null
          nota_fiscal_faturamento: string | null
          nota_fiscal_retorno: string | null
          observacao: string | null
          observacao_compra: string | null
          os_pv: string | null
          pedido: string | null
          percentual: string | null
          pontualidade: string | null
          preco: string | null
          producao_insumos: string | null
          qualidade: string | null
          reprogramacao: string | null
          retornou: string | null
          row_number: string | null
          saldo_pendente_pedido_compra: string | null
          tentativas_follow_up: number | null
          thread_message: string | null
          total: string | null
          vlr_nf: string | null
          vlr_pedido: string | null
        }
        Insert: {
          cliente_retornou?: boolean | null
          cnpj?: string | null
          codigo_fornecedor?: string | null
          codigo_item?: string | null
          create_at?: string | null
          data_entrada?: string | null
          data_mensagem_enviada?: string | null
          data_ultimo_contato?: string | null
          dentro_fora_prazo_entrega?: string | null
          do_fc_no_dc?: string | null
          email?: string | null
          emissao_pedido_compra?: string | null
          estado?: string | null
          familia?: string | null
          "follow-up"?: boolean | null
          fornecedor?: string | null
          id?: number
          id_message?: string | null
          mensagem_enviada?: string | null
          mensagem_enviada_ao_usuário?: string | null
          mensagem_usuário?: string | null
          mes_entrada?: string | null
          motivo_e_data?: string | null
          motivo_reprogramacao?: string | null
          nota_fiscal_faturamento?: string | null
          nota_fiscal_retorno?: string | null
          observacao?: string | null
          observacao_compra?: string | null
          os_pv?: string | null
          pedido?: string | null
          percentual?: string | null
          pontualidade?: string | null
          preco?: string | null
          producao_insumos?: string | null
          qualidade?: string | null
          reprogramacao?: string | null
          retornou?: string | null
          row_number?: string | null
          saldo_pendente_pedido_compra?: string | null
          tentativas_follow_up?: number | null
          thread_message?: string | null
          total?: string | null
          vlr_nf?: string | null
          vlr_pedido?: string | null
        }
        Update: {
          cliente_retornou?: boolean | null
          cnpj?: string | null
          codigo_fornecedor?: string | null
          codigo_item?: string | null
          create_at?: string | null
          data_entrada?: string | null
          data_mensagem_enviada?: string | null
          data_ultimo_contato?: string | null
          dentro_fora_prazo_entrega?: string | null
          do_fc_no_dc?: string | null
          email?: string | null
          emissao_pedido_compra?: string | null
          estado?: string | null
          familia?: string | null
          "follow-up"?: boolean | null
          fornecedor?: string | null
          id?: number
          id_message?: string | null
          mensagem_enviada?: string | null
          mensagem_enviada_ao_usuário?: string | null
          mensagem_usuário?: string | null
          mes_entrada?: string | null
          motivo_e_data?: string | null
          motivo_reprogramacao?: string | null
          nota_fiscal_faturamento?: string | null
          nota_fiscal_retorno?: string | null
          observacao?: string | null
          observacao_compra?: string | null
          os_pv?: string | null
          pedido?: string | null
          percentual?: string | null
          pontualidade?: string | null
          preco?: string | null
          producao_insumos?: string | null
          qualidade?: string | null
          reprogramacao?: string | null
          retornou?: string | null
          row_number?: string | null
          saldo_pendente_pedido_compra?: string | null
          tentativas_follow_up?: number | null
          thread_message?: string | null
          total?: string | null
          vlr_nf?: string | null
          vlr_pedido?: string | null
        }
        Relationships: []
      }
      saquetto_funcionarios: {
        Row: {
          arquivos_medicos: Json | null
          created_at: string
          data_entrada_empresa: string | null
          data_saida_empresa: string | null
          descricao: string | null
          email: string
          id: string
          nome: string
          salario: number
          telefone: string | null
          updated_at: string
        }
        Insert: {
          arquivos_medicos?: Json | null
          created_at?: string
          data_entrada_empresa?: string | null
          data_saida_empresa?: string | null
          descricao?: string | null
          email: string
          id?: string
          nome: string
          salario?: number
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          arquivos_medicos?: Json | null
          created_at?: string
          data_entrada_empresa?: string | null
          data_saida_empresa?: string | null
          descricao?: string | null
          email?: string
          id?: string
          nome?: string
          salario?: number
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saquetto_notafiscal_base64: {
        Row: {
          base64: string | null
          created_at: string
          id: string
          saquetto_id: number
          updated_at: string
        }
        Insert: {
          base64?: string | null
          created_at?: string
          id?: string
          saquetto_id: number
          updated_at?: string
        }
        Update: {
          base64?: string | null
          created_at?: string
          id?: string
          saquetto_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_saquetto_notafiscal_base64_saquetto"
            columns: ["saquetto_id"]
            isOneToOne: false
            referencedRelation: "saquetto"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          nome: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          nome?: string | null
          password_hash: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
