-- ============================================================================
-- SCRIPT DE CORREÇÃO COMPLETO - APLICAR NO SUPABASE DASHBOARD
-- ============================================================================
--
-- Este script resolve o erro:
-- "Could not find the table 'public.saquetto_status_history' in the schema cache"
--
-- INSTRUÇÕES:
-- 1. Acesse Supabase Dashboard → SQL Editor → New query
-- 2. Copie e cole TODO este arquivo
-- 3. Clique em RUN ou pressione Ctrl/Cmd + Enter
-- 4. Aguarde mensagem de sucesso
-- 5. Recarregue a aplicação web
-- 6. Teste alterar status de uma nota fiscal
--
-- Tempo estimado: 2-3 minutos
-- ============================================================================

-- ============================================================================
-- PARTE 1: CRIAR TABELA DE HISTÓRICO DE STATUS
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'INICIANDO CRIAÇÃO DA TABELA saquetto_status_history';
  RAISE NOTICE '========================================';
END $$;

-- Create table for status change history (audit trail)
CREATE TABLE IF NOT EXISTS public.saquetto_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saquetto_id INTEGER NOT NULL,
  status_anterior TEXT NOT NULL,
  status_novo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  usuario_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DO $$ BEGIN RAISE NOTICE '✅ Tabela saquetto_status_history criada'; END $$;

-- Add foreign key constraint to saquetto table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_saquetto_status_history_saquetto'
  ) THEN
    ALTER TABLE public.saquetto_status_history
    ADD CONSTRAINT fk_saquetto_status_history_saquetto
    FOREIGN KEY (saquetto_id) REFERENCES public.saquetto(id)
    ON DELETE CASCADE;

    RAISE NOTICE '✅ Foreign key constraint criada';
  ELSE
    RAISE NOTICE '⚠️  Foreign key constraint já existe';
  END IF;
END $$;

-- Create index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_saquetto_status_history_saquetto_id
ON public.saquetto_status_history(saquetto_id);

DO $$ BEGIN RAISE NOTICE '✅ Índice idx_saquetto_status_history_saquetto_id criado'; END $$;

-- Create index for created_at to optimize time-based queries
CREATE INDEX IF NOT EXISTS idx_saquetto_status_history_created_at
ON public.saquetto_status_history(created_at DESC);

DO $$ BEGIN RAISE NOTICE '✅ Índice idx_saquetto_status_history_created_at criado'; END $$;

-- Enable RLS on the table
ALTER TABLE public.saquetto_status_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN RAISE NOTICE '✅ RLS habilitado em saquetto_status_history'; END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read status history" ON public.saquetto_status_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert status history" ON public.saquetto_status_history;

-- Create policy for authenticated users to read history
CREATE POLICY "Allow authenticated users to read status history"
ON public.saquetto_status_history
FOR SELECT
TO authenticated
USING (true);

DO $$ BEGIN RAISE NOTICE '✅ Política SELECT criada'; END $$;

-- Create policy for authenticated users to insert history
CREATE POLICY "Allow authenticated users to insert status history"
ON public.saquetto_status_history
FOR INSERT
TO authenticated
WITH CHECK (true);

DO $$ BEGIN RAISE NOTICE '✅ Política INSERT criada'; END $$;

-- Add comment to table for documentation
COMMENT ON TABLE public.saquetto_status_history IS 'Audit trail for status changes on notas fiscais. Tracks who changed what, when, and why.';

COMMENT ON COLUMN public.saquetto_status_history.motivo IS 'Required justification for status change. Minimum 10 characters recommended.';

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ PARTE 1 CONCLUÍDA COM SUCESSO';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- PARTE 2: ADICIONAR POLÍTICAS RLS NA TABELA saquetto
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'INICIANDO CONFIGURAÇÃO DE RLS EM saquetto';
  RAISE NOTICE '========================================';
END $$;

-- Enable RLS on saquetto table (may already be enabled)
ALTER TABLE public.saquetto ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN RAISE NOTICE '✅ RLS habilitado em saquetto'; END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read saquetto" ON public.saquetto;
DROP POLICY IF EXISTS "Allow authenticated users to update saquetto" ON public.saquetto;

-- Create policy for SELECT (read)
CREATE POLICY "Allow authenticated users to read saquetto"
ON public.saquetto
FOR SELECT
TO authenticated
USING (true);

DO $$ BEGIN RAISE NOTICE '✅ Política SELECT em saquetto criada'; END $$;

-- Create policy for UPDATE (modify status)
CREATE POLICY "Allow authenticated users to update saquetto"
ON public.saquetto
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DO $$ BEGIN RAISE NOTICE '✅ Política UPDATE em saquetto criada'; END $$;

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ PARTE 2 CONCLUÍDA COM SUCESSO';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- PARTE 3: VERIFICAÇÃO FINAL
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICAÇÃO FINAL';
  RAISE NOTICE '========================================';
END $$;

-- Verificar se tabela foi criada
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'saquetto_status_history'
  ) INTO table_exists;

  IF table_exists THEN
    RAISE NOTICE '✅ Tabela saquetto_status_history: EXISTE';
  ELSE
    RAISE EXCEPTION '❌ ERRO: Tabela saquetto_status_history NÃO foi criada';
  END IF;
END $$;

-- Contar políticas
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'saquetto_status_history';

  IF policy_count >= 2 THEN
    RAISE NOTICE '✅ Políticas RLS em saquetto_status_history: % políticas criadas', policy_count;
  ELSE
    RAISE WARNING '⚠️  Apenas % política(s) encontrada(s)', policy_count;
  END IF;
END $$;

-- Contar índices
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'saquetto_status_history';

  IF index_count >= 2 THEN
    RAISE NOTICE '✅ Índices criados: % índices', index_count;
  ELSE
    RAISE WARNING '⚠️  Apenas % índice(s) encontrado(s)', index_count;
  END IF;
END $$;

-- Verificar políticas em saquetto
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'saquetto';

  IF policy_count >= 2 THEN
    RAISE NOTICE '✅ Políticas RLS em saquetto: % políticas criadas', policy_count;
  ELSE
    RAISE WARNING '⚠️  Apenas % política(s) em saquetto encontrada(s)', policy_count;
  END IF;
END $$;

-- ============================================================================
-- RESULTADO FINAL
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 SCRIPT EXECUTADO COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Recarregue a página da aplicação web (F5)';
  RAISE NOTICE '2. Faça logout e login novamente';
  RAISE NOTICE '3. Tente alterar o status de uma nota fiscal';
  RAISE NOTICE '4. Verifique se o histórico é salvo corretamente';
  RAISE NOTICE '';
  RAISE NOTICE '✅ O erro "Could not find the table" foi corrigido!';
  RAISE NOTICE '========================================';
END $$;

-- Exibir resumo das tabelas criadas
SELECT
  'saquetto_status_history' AS tabela,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'saquetto_status_history') AS colunas,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'saquetto_status_history') AS politicas_rls,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'saquetto_status_history') AS indices;
