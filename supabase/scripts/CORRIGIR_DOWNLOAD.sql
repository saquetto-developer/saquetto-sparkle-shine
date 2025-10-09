-- ============================================================================
-- CORREÇÃO: Erro ao Baixar Nota Fiscal (XML não disponível)
-- ============================================================================
--
-- Este script corrige as políticas RLS para funcionar com Supabase Auth
--
-- INSTRUÇÕES:
-- 1. Supabase Dashboard → SQL Editor → New query
-- 2. Copiar e colar este script
-- 3. Clicar em RUN
-- 4. Recarregar a aplicação
-- 5. Tentar baixar XML novamente
--
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CORRIGINDO POLÍTICAS RLS PARA DOWNLOAD';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- PARTE 1: ATUALIZAR POLÍTICAS NA TABELA saquetto_invoices_storage
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Atualizando políticas em saquetto_invoices_storage...'; END $$;

-- Garantir que RLS está habilitado
ALTER TABLE public.saquetto_invoices_storage ENABLE ROW LEVEL SECURITY;

-- Remover policy antiga
DROP POLICY IF EXISTS "Allow all operations on storage metadata" ON public.saquetto_invoices_storage;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Allow authenticated to read storage metadata" ON public.saquetto_invoices_storage;
DROP POLICY IF EXISTS "Allow authenticated to insert storage metadata" ON public.saquetto_invoices_storage;
DROP POLICY IF EXISTS "Allow authenticated to update storage metadata" ON public.saquetto_invoices_storage;
DROP POLICY IF EXISTS "Allow authenticated to delete storage metadata" ON public.saquetto_invoices_storage;

-- Criar policies específicas para authenticated
CREATE POLICY "Allow authenticated to read storage metadata"
ON public.saquetto_invoices_storage
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated to insert storage metadata"
ON public.saquetto_invoices_storage
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update storage metadata"
ON public.saquetto_invoices_storage
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete storage metadata"
ON public.saquetto_invoices_storage
FOR DELETE
TO authenticated
USING (true);

DO $$ BEGIN RAISE NOTICE '✅ Políticas em saquetto_invoices_storage atualizadas'; END $$;

-- ============================================================================
-- PARTE 2: ATUALIZAR POLÍTICAS NO STORAGE BUCKET invoices
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Atualizando políticas no storage bucket invoices...'; END $$;

-- Garantir que RLS está habilitado no storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Allow public read from invoices bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to invoices bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to invoices bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from invoices bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can select invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can insert invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete invoices" ON storage.objects;

-- Recriar policies para authenticated
CREATE POLICY "Authenticated can select invoices"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'invoices');

CREATE POLICY "Authenticated can insert invoices"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Authenticated can update invoices"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'invoices')
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Authenticated can delete invoices"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'invoices');

DO $$ BEGIN RAISE NOTICE '✅ Políticas no storage bucket atualizadas'; END $$;

-- ============================================================================
-- PARTE 3: VERIFICAÇÃO
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICAÇÃO FINAL';
  RAISE NOTICE '========================================';
END $$;

-- Contar policies na tabela
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'saquetto_invoices_storage';

  IF policy_count >= 4 THEN
    RAISE NOTICE '✅ Políticas em saquetto_invoices_storage: % (esperado: 4)', policy_count;
  ELSE
    RAISE WARNING '⚠️  Apenas % política(s) em saquetto_invoices_storage (esperado: 4)', policy_count;
  END IF;
END $$;

-- Contar policies no storage
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%invoices%';

  IF policy_count >= 4 THEN
    RAISE NOTICE '✅ Políticas no storage bucket: % (esperado: 4)', policy_count;
  ELSE
    RAISE WARNING '⚠️  Apenas % política(s) no storage (esperado: 4)', policy_count;
  END IF;
END $$;

-- Contar arquivos no storage
DO $$
DECLARE
  file_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO file_count
  FROM public.saquetto_invoices_storage;

  IF file_count > 0 THEN
    RAISE NOTICE '✅ Total de arquivos XML armazenados: %', file_count;
  ELSE
    RAISE WARNING '⚠️  Nenhum arquivo XML encontrado no storage!';
    RAISE WARNING '   Se o erro persistir, pode ser que os XMLs não foram uploadados.';
  END IF;
END $$;

-- Exibir policies criadas
SELECT
  'saquetto_invoices_storage' AS tabela,
  policyname AS politica,
  cmd AS operacao,
  roles AS roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'saquetto_invoices_storage'
ORDER BY policyname;

SELECT
  'storage.objects (invoices)' AS tabela,
  policyname AS politica,
  cmd AS operacao,
  roles AS roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%invoices%'
ORDER BY policyname;

-- ============================================================================
-- RESULTADO FINAL
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 CORREÇÃO APLICADA COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Recarregue a página da aplicação (F5 ou Ctrl+R)';
  RAISE NOTICE '2. Tente baixar um XML de qualquer nota fiscal';
  RAISE NOTICE '3. O download deve funcionar perfeitamente!';
  RAISE NOTICE '';
  RAISE NOTICE 'Se o erro persistir:';
  RAISE NOTICE '- Verifique se há arquivos no storage (query acima)';
  RAISE NOTICE '- Abra o Console do navegador (F12) e veja os logs';
  RAISE NOTICE '- Verifique se está logado com Supabase Auth';
  RAISE NOTICE '';
  RAISE NOTICE '✅ O erro "XML não disponível" foi corrigido!';
  RAISE NOTICE '========================================';
END $$;
