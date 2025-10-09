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
          id_row: number
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
          id_row?: number
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
          id_row?: number
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
      saquetto_invoices_storage: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          saquetto_id: number
          updated_at: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          saquetto_id: number
          updated_at?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          saquetto_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_saquetto_invoices_storage_saquetto_id"
            columns: ["saquetto_id"]
            isOneToOne: true
            referencedRelation: "saquetto"
            referencedColumns: ["id"]
          },
        ]
      }
      saquetto_status_history: {
        Row: {
          created_at: string | null
          id: string
          motivo: string
          saquetto_id: number
          status_anterior: string
          status_novo: string
          usuario_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo: string
          saquetto_id: number
          status_anterior: string
          status_novo: string
          usuario_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string
          saquetto_id?: number
          status_anterior?: string
          status_novo?: string
          usuario_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_saquetto_status_history_saquetto"
            columns: ["saquetto_id"]
            isOneToOne: false
            referencedRelation: "saquetto"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
