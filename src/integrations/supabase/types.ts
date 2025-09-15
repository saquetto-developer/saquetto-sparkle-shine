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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      Attivar: {
        Row: {
          base64_image: string | null
          canal_origem: string | null
          cargo: string | null
          created_at: string
          data_entrada: string | null
          data_image: string | null
          empresa: string | null
          etapa_funil: string | null
          funil_atualizado: boolean | null
          id: number
          id_deal_AGENDOR: number | null
          id_empresa_AGENDOR: number | null
          id_pessoas_AGENDOR: number | null
          interação_completa: boolean | null
          nome: string | null
          observacoes: string | null
          orcamento_aprovado: string | null
          personalizacao: string | null
          possui_logo: string | null
          prazo_entrega: string | null
          precisa_design: string | null
          quantidade_pecas: string | null
          segmento: string | null
          status: string | null
          tecidos_desejados: string | null
          tipo_uniforme: string | null
          ultima_interacao: string | null
          url_image: string | null
          whatsapp: string | null
        }
        Insert: {
          base64_image?: string | null
          canal_origem?: string | null
          cargo?: string | null
          created_at?: string
          data_entrada?: string | null
          data_image?: string | null
          empresa?: string | null
          etapa_funil?: string | null
          funil_atualizado?: boolean | null
          id?: number
          id_deal_AGENDOR?: number | null
          id_empresa_AGENDOR?: number | null
          id_pessoas_AGENDOR?: number | null
          interação_completa?: boolean | null
          nome?: string | null
          observacoes?: string | null
          orcamento_aprovado?: string | null
          personalizacao?: string | null
          possui_logo?: string | null
          prazo_entrega?: string | null
          precisa_design?: string | null
          quantidade_pecas?: string | null
          segmento?: string | null
          status?: string | null
          tecidos_desejados?: string | null
          tipo_uniforme?: string | null
          ultima_interacao?: string | null
          url_image?: string | null
          whatsapp?: string | null
        }
        Update: {
          base64_image?: string | null
          canal_origem?: string | null
          cargo?: string | null
          created_at?: string
          data_entrada?: string | null
          data_image?: string | null
          empresa?: string | null
          etapa_funil?: string | null
          funil_atualizado?: boolean | null
          id?: number
          id_deal_AGENDOR?: number | null
          id_empresa_AGENDOR?: number | null
          id_pessoas_AGENDOR?: number | null
          interação_completa?: boolean | null
          nome?: string | null
          observacoes?: string | null
          orcamento_aprovado?: string | null
          personalizacao?: string | null
          possui_logo?: string | null
          prazo_entrega?: string | null
          precisa_design?: string | null
          quantidade_pecas?: string | null
          segmento?: string | null
          status?: string | null
          tecidos_desejados?: string | null
          tipo_uniforme?: string | null
          ultima_interacao?: string | null
          url_image?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      Attivar_follow_up: {
        Row: {
          atualização: string | null
          created_at: string
          data: string | null
          Data_contato: string | null
          email: string | null
          empresa: string | null
          id: number
          nome_cliente: string | null
          qtd_peças: number | null
          row_number: number | null
          telefone: number | null
        }
        Insert: {
          atualização?: string | null
          created_at?: string
          data?: string | null
          Data_contato?: string | null
          email?: string | null
          empresa?: string | null
          id?: number
          nome_cliente?: string | null
          qtd_peças?: number | null
          row_number?: number | null
          telefone?: number | null
        }
        Update: {
          atualização?: string | null
          created_at?: string
          data?: string | null
          Data_contato?: string | null
          email?: string | null
          empresa?: string | null
          id?: number
          nome_cliente?: string | null
          qtd_peças?: number | null
          row_number?: number | null
          telefone?: number | null
        }
        Relationships: []
      }
      barbara_dias_SDR: {
        Row: {
          created_at: string
          etapa_funil: string | null
          id: number
          link_de_midia: string | null
          nome: string | null
          numero: string | null
          prova_social_enviada: boolean | null
          situacao_lead: string | null
          ultima_mensagem: string | null
        }
        Insert: {
          created_at?: string
          etapa_funil?: string | null
          id?: number
          link_de_midia?: string | null
          nome?: string | null
          numero?: string | null
          prova_social_enviada?: boolean | null
          situacao_lead?: string | null
          ultima_mensagem?: string | null
        }
        Update: {
          created_at?: string
          etapa_funil?: string | null
          id?: number
          link_de_midia?: string | null
          nome?: string | null
          numero?: string | null
          prova_social_enviada?: boolean | null
          situacao_lead?: string | null
          ultima_mensagem?: string | null
        }
        Relationships: []
      }
      cliente_rom_seguros: {
        Row: {
          cliente_retornou: boolean | null
          cotacao: string | null
          cotacao_enviada: boolean | null
          Cotação_espera: string | null
          created_at: string | null
          data_contato: string | null
          "e-mail": string | null
          empresa: string | null
          IAstop: boolean | null
          id: number
          nome: string | null
          placa: string | null
          RDIDContato: string | null
          RecusouCotacao: string | null
          seguradora: string | null
          status: string | null
          tentativa_contato: number | null
          vencimento: string | null
          whatsapp: string | null
        }
        Insert: {
          cliente_retornou?: boolean | null
          cotacao?: string | null
          cotacao_enviada?: boolean | null
          Cotação_espera?: string | null
          created_at?: string | null
          data_contato?: string | null
          "e-mail"?: string | null
          empresa?: string | null
          IAstop?: boolean | null
          id?: number
          nome?: string | null
          placa?: string | null
          RDIDContato?: string | null
          RecusouCotacao?: string | null
          seguradora?: string | null
          status?: string | null
          tentativa_contato?: number | null
          vencimento?: string | null
          whatsapp?: string | null
        }
        Update: {
          cliente_retornou?: boolean | null
          cotacao?: string | null
          cotacao_enviada?: boolean | null
          Cotação_espera?: string | null
          created_at?: string | null
          data_contato?: string | null
          "e-mail"?: string | null
          empresa?: string | null
          IAstop?: boolean | null
          id?: number
          nome?: string | null
          placa?: string | null
          RDIDContato?: string | null
          RecusouCotacao?: string | null
          seguradora?: string | null
          status?: string | null
          tentativa_contato?: number | null
          vencimento?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      cliente_romseguros_cotacoes_pdf: {
        Row: {
          alterado_por: string | null
          apolice: string | null
          celular: string | null
          cnpj: string | null
          cobertura: string | null
          cotacao_enviada: boolean | null
          criado_em: string | null
          criado_por: string | null
          data_envio: string | null
          email: string | null
          forma_pagamento: string | null
          franquia: string | null
          id: string
          impresso_em: string | null
          iof: string | null
          legislacao: string | null
          limite_indenizacao: string | null
          NomeArquivo: string | null
          num_passageiros: string | null
          num_tripulantes: string | null
          numero_cotacao: string | null
          parcelas: number | null
          placa: string | null
          premio_liquido: string | null
          premio_total: string | null
          razao_social: string | null
          regiao_origem_risco: string | null
          renovacao: string | null
          seguradora: string | null
          tipo_carroceria: string | null
          tipo_seguro: string | null
          utilizacao: string | null
          validade: string | null
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          alterado_por?: string | null
          apolice?: string | null
          celular?: string | null
          cnpj?: string | null
          cobertura?: string | null
          cotacao_enviada?: boolean | null
          criado_em?: string | null
          criado_por?: string | null
          data_envio?: string | null
          email?: string | null
          forma_pagamento?: string | null
          franquia?: string | null
          id?: string
          impresso_em?: string | null
          iof?: string | null
          legislacao?: string | null
          limite_indenizacao?: string | null
          NomeArquivo?: string | null
          num_passageiros?: string | null
          num_tripulantes?: string | null
          numero_cotacao?: string | null
          parcelas?: number | null
          placa?: string | null
          premio_liquido?: string | null
          premio_total?: string | null
          razao_social?: string | null
          regiao_origem_risco?: string | null
          renovacao?: string | null
          seguradora?: string | null
          tipo_carroceria?: string | null
          tipo_seguro?: string | null
          utilizacao?: string | null
          validade?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          alterado_por?: string | null
          apolice?: string | null
          celular?: string | null
          cnpj?: string | null
          cobertura?: string | null
          cotacao_enviada?: boolean | null
          criado_em?: string | null
          criado_por?: string | null
          data_envio?: string | null
          email?: string | null
          forma_pagamento?: string | null
          franquia?: string | null
          id?: string
          impresso_em?: string | null
          iof?: string | null
          legislacao?: string | null
          limite_indenizacao?: string | null
          NomeArquivo?: string | null
          num_passageiros?: string | null
          num_tripulantes?: string | null
          numero_cotacao?: string | null
          parcelas?: number | null
          placa?: string | null
          premio_liquido?: string | null
          premio_total?: string | null
          razao_social?: string | null
          regiao_origem_risco?: string | null
          renovacao?: string | null
          seguradora?: string | null
          tipo_carroceria?: string | null
          tipo_seguro?: string | null
          utilizacao?: string | null
          validade?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: []
      }
      CPDC_SDR: {
        Row: {
          agendado: boolean | null
          created_at: string
          data_agendamento: string | null
          etapa_funil: string | null
          id: number
          nome: string | null
          numero: string | null
          ultima_mensagem: string | null
        }
        Insert: {
          agendado?: boolean | null
          created_at?: string
          data_agendamento?: string | null
          etapa_funil?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          ultima_mensagem?: string | null
        }
        Update: {
          agendado?: boolean | null
          created_at?: string
          data_agendamento?: string | null
          etapa_funil?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          ultima_mensagem?: string | null
        }
        Relationships: []
      }
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
      Gisele: {
        Row: {
          atualização: string | null
          cliente_retornou: boolean | null
          "Contato realizado": string | null
          created_at: string
          data: string | null
          data_forms: string | null
          "e-mail": string | null
          IAStop: boolean | null
          id_row: number
          Intereacao_completa: boolean | null
          mensagem_inicial_enviada: boolean | null
          name: string | null
          "nome e sobrenome": string | null
          "renda-mensal": string | null
          tentativas_follow_up: number | null
          tentativas_followup: number | null
          "trabalho-atual": string | null
          ultima_mensagem: string | null
          whatsapp: string | null
        }
        Insert: {
          atualização?: string | null
          cliente_retornou?: boolean | null
          "Contato realizado"?: string | null
          created_at?: string
          data?: string | null
          data_forms?: string | null
          "e-mail"?: string | null
          IAStop?: boolean | null
          id_row?: number
          Intereacao_completa?: boolean | null
          mensagem_inicial_enviada?: boolean | null
          name?: string | null
          "nome e sobrenome"?: string | null
          "renda-mensal"?: string | null
          tentativas_follow_up?: number | null
          tentativas_followup?: number | null
          "trabalho-atual"?: string | null
          ultima_mensagem?: string | null
          whatsapp?: string | null
        }
        Update: {
          atualização?: string | null
          cliente_retornou?: boolean | null
          "Contato realizado"?: string | null
          created_at?: string
          data?: string | null
          data_forms?: string | null
          "e-mail"?: string | null
          IAStop?: boolean | null
          id_row?: number
          Intereacao_completa?: boolean | null
          mensagem_inicial_enviada?: boolean | null
          name?: string | null
          "nome e sobrenome"?: string | null
          "renda-mensal"?: string | null
          tentativas_follow_up?: number | null
          tentativas_followup?: number | null
          "trabalho-atual"?: string | null
          ultima_mensagem?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      NexusMind: {
        Row: {
          created_at: string
          data_agendamento: string | null
          data_agendamento_2: string | null
          id: number
          id_google_meet: string | null
          link_da_reunião: string | null
          nome: string | null
          status_lead: string | null
          telefone: string | null
          tentativa_followup: string | null
          ultima_mensagem: string | null
        }
        Insert: {
          created_at?: string
          data_agendamento?: string | null
          data_agendamento_2?: string | null
          id?: number
          id_google_meet?: string | null
          link_da_reunião?: string | null
          nome?: string | null
          status_lead?: string | null
          telefone?: string | null
          tentativa_followup?: string | null
          ultima_mensagem?: string | null
        }
        Update: {
          created_at?: string
          data_agendamento?: string | null
          data_agendamento_2?: string | null
          id?: number
          id_google_meet?: string | null
          link_da_reunião?: string | null
          nome?: string | null
          status_lead?: string | null
          telefone?: string | null
          tentativa_followup?: string | null
          ultima_mensagem?: string | null
        }
        Relationships: []
      }
      NexusMindFollowUp: {
        Row: {
          created_at: string
          email: string | null
          id: number
          interesse: string | null
          mensagem_inicial: string | null
          nome: string | null
          telefone: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          interesse?: string | null
          mensagem_inicial?: string | null
          nome?: string | null
          telefone?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          interesse?: string | null
          mensagem_inicial?: string | null
          nome?: string | null
          telefone?: number | null
        }
        Relationships: []
      }
      relatorio_workflows: {
        Row: {
          concluiu_todas_etapas: number | null
          concluiu_todas_etapas_no_dia: number | null
          created_at: string
          databook_enviado: number | null
          databook_enviado_dia: number | null
          Empresa: string | null
          id: number
          primeiro_contato: number | null
          primeiro_contato_neste_dia: number | null
        }
        Insert: {
          concluiu_todas_etapas?: number | null
          concluiu_todas_etapas_no_dia?: number | null
          created_at?: string
          databook_enviado?: number | null
          databook_enviado_dia?: number | null
          Empresa?: string | null
          id?: number
          primeiro_contato?: number | null
          primeiro_contato_neste_dia?: number | null
        }
        Update: {
          concluiu_todas_etapas?: number | null
          concluiu_todas_etapas_no_dia?: number | null
          created_at?: string
          databook_enviado?: number | null
          databook_enviado_dia?: number | null
          Empresa?: string | null
          id?: number
          primeiro_contato?: number | null
          primeiro_contato_neste_dia?: number | null
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
          codigo_fornecedor: string | null
          codigo_item: string | null
          create_at: string | null
          data_entrada: string | null
          data_mensagem_enviada: string | null
          dentro_fora_prazo_entrega: string | null
          do_fc_no_dc: string | null
          email: string | null
          emissao_pedido_compra: string | null
          familia: string | null
          fornecedor: string | null
          id: number
          id_message: string | null
          mensagem_enviada: string | null
          mes_entrada: string | null
          motivo_reprogramacao: string | null
          nota_fiscal_faturamento: string | null
          nota_fiscal_retorno: string | null
          observacao: string | null
          observacao_compra: string | null
          os_pv: string | null
          pedido: string | null
          percentual: number | null
          pontualidade: number | null
          preco: number | null
          producao_insumos: string | null
          qualidade: number | null
          reprogramacao: string | null
          retornou: string | null
          row_number: string | null
          saldo_pendente_pedido_compra: string | null
          thread_message: string | null
          total: number | null
          vlr_nf: string | null
          vlr_pedido: string | null
        }
        Insert: {
          codigo_fornecedor?: string | null
          codigo_item?: string | null
          create_at?: string | null
          data_entrada?: string | null
          data_mensagem_enviada?: string | null
          dentro_fora_prazo_entrega?: string | null
          do_fc_no_dc?: string | null
          email?: string | null
          emissao_pedido_compra?: string | null
          familia?: string | null
          fornecedor?: string | null
          id?: number
          id_message?: string | null
          mensagem_enviada?: string | null
          mes_entrada?: string | null
          motivo_reprogramacao?: string | null
          nota_fiscal_faturamento?: string | null
          nota_fiscal_retorno?: string | null
          observacao?: string | null
          observacao_compra?: string | null
          os_pv?: string | null
          pedido?: string | null
          percentual?: number | null
          pontualidade?: number | null
          preco?: number | null
          producao_insumos?: string | null
          qualidade?: number | null
          reprogramacao?: string | null
          retornou?: string | null
          row_number?: string | null
          saldo_pendente_pedido_compra?: string | null
          thread_message?: string | null
          total?: number | null
          vlr_nf?: string | null
          vlr_pedido?: string | null
        }
        Update: {
          codigo_fornecedor?: string | null
          codigo_item?: string | null
          create_at?: string | null
          data_entrada?: string | null
          data_mensagem_enviada?: string | null
          dentro_fora_prazo_entrega?: string | null
          do_fc_no_dc?: string | null
          email?: string | null
          emissao_pedido_compra?: string | null
          familia?: string | null
          fornecedor?: string | null
          id?: number
          id_message?: string | null
          mensagem_enviada?: string | null
          mes_entrada?: string | null
          motivo_reprogramacao?: string | null
          nota_fiscal_faturamento?: string | null
          nota_fiscal_retorno?: string | null
          observacao?: string | null
          observacao_compra?: string | null
          os_pv?: string | null
          pedido?: string | null
          percentual?: number | null
          pontualidade?: number | null
          preco?: number | null
          producao_insumos?: string | null
          qualidade?: number | null
          reprogramacao?: string | null
          retornou?: string | null
          row_number?: string | null
          saldo_pendente_pedido_compra?: string | null
          thread_message?: string | null
          total?: number | null
          vlr_nf?: string | null
          vlr_pedido?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
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
        Returns: unknown
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
