# 🚀 Deploy de Migrations no Supabase

## ⚠️ IMPORTANTE

**As migrations locais NÃO são aplicadas automaticamente no Supabase Cloud.**

Sempre que criar uma nova migration em `supabase/migrations/`, você deve aplicá-la manualmente no banco de dados de produção.

---

## 📋 Processo de Deploy de Migrations

### Passo 1: Acessar Supabase Dashboard

1. Abra [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login com sua conta
3. Selecione o projeto **saquetto-auditor-fiscal**
4. No menu lateral, clique em **SQL Editor**

### Passo 2: Aplicar Migration

1. Clique em **New query** (botão verde no canto superior direito)
2. Abra o arquivo da migration em `supabase/migrations/`
3. Copie **TODO** o conteúdo SQL
4. Cole no SQL Editor
5. Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)
6. Aguarde a mensagem de sucesso ✅

### Passo 3: Verificar Aplicação

Execute este SQL para confirmar:

```sql
-- Verificar se a tabela foi criada
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'NOME_DA_TABELA';

-- Verificar políticas RLS
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'NOME_DA_TABELA';
```

---

## 🔧 Migrations Pendentes (Aplicar Agora!)

### ⚠️ **URGENTE: Correção de Download de XML**

**Problema:** Erro "XML não disponível para esta nota fiscal" ao tentar baixar XMLs

**Arquivo:** `supabase/scripts/CORRIGIR_DOWNLOAD.sql`

**Status:** ❌ APLICAR IMEDIATAMENTE

**Causa:** Políticas RLS incompatíveis com Supabase Auth (criadas para role `anon`, agora usando role `authenticated`)

**Instruções:**
1. Abra o arquivo `supabase/scripts/CORRIGIR_DOWNLOAD.sql`
2. Copie **TODO** o conteúdo
3. Cole no **SQL Editor** do Supabase Dashboard
4. Clique em **Run**
5. Aguarde mensagens de sucesso ✅
6. Recarregue a aplicação e teste o download

---

### Migration 1: Tabela de Histórico de Status

**Arquivo:** `supabase/migrations/20251008160000_add_status_history.sql` ou `supabase/scripts/APLICAR_AGORA.sql`

**Status:** ❌ NÃO APLICADA

**Instruções:** Veja o arquivo `supabase/scripts/APLICAR_AGORA.sql` criado especialmente para você.

### Migration 2: Usuário Admin no Supabase Auth

**Arquivo:** `supabase/migrations/20251008220000_create_admin_user.sql`

**Status:** ✅ APLICADA (usuário criado via interface)

**Instruções:** Já foi criado manualmente via Authentication → Users.

---

## 📦 Checklist de Deploy

Antes de considerar uma funcionalidade "pronta para produção", verifique:

- [ ] Migration criada em `supabase/migrations/`
- [ ] SQL testado localmente (se possível)
- [ ] Migration aplicada no Supabase Dashboard (SQL Editor)
- [ ] Políticas RLS criadas (se necessário)
- [ ] Índices criados (se necessário)
- [ ] Verificação executada (queries SELECT para confirmar)
- [ ] Funcionalidade testada na aplicação web
- [ ] Commit feito no Git com mensagem clara

---

## 🚨 Troubleshooting

### Erro: "Could not find the table 'public.XXX' in the schema cache"

**Causa:** A migration não foi aplicada no banco de dados remoto.

**Solução:**
1. Encontre o arquivo SQL da migration em `supabase/migrations/`
2. Aplique no SQL Editor do Supabase Dashboard
3. Verifique se a tabela foi criada com `SELECT * FROM information_schema.tables WHERE table_name = 'XXX'`

### Erro: "new row violates row-level security policy"

**Causa:** Políticas RLS estão bloqueando a operação.

**Solução:**
1. Verifique se as políticas RLS foram criadas: `SELECT * FROM pg_policies WHERE tablename = 'XXX'`
2. Se não existirem, aplique a migration que cria as políticas
3. Se existirem, verifique se o usuário está autenticado corretamente

### Erro: "duplicate key value violates unique constraint"

**Causa:** Tentando aplicar uma migration que já foi aplicada parcialmente.

**Solução:**
1. Use `CREATE TABLE IF NOT EXISTS` em vez de `CREATE TABLE`
2. Use `DROP POLICY IF EXISTS` antes de `CREATE POLICY`
3. Use `CREATE INDEX IF NOT EXISTS` em vez de `CREATE INDEX`

---

## 🔗 Vincular Projeto Local ao Supabase (Opcional)

Se você quiser aplicar migrations automaticamente via CLI:

```bash
# 1. Login no Supabase
npx supabase login

# 2. Vincular projeto local ao remoto
npx supabase link --project-ref SEU_PROJECT_REF

# 3. Aplicar todas as migrations pendentes
npx supabase db push

# 4. Verificar status
npx supabase db remote commit
```

**Onde encontrar PROJECT_REF:**
- Supabase Dashboard → Settings → General → Reference ID

---

## 📚 Recursos Úteis

- [Documentação Supabase CLI](https://supabase.com/docs/guides/cli)
- [Migrations no Supabase](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📝 Histórico de Migrations Aplicadas

| Data | Migration | Status | Aplicado Por |
|------|-----------|--------|--------------|
| 2025-10-09 | `20251008160000_add_status_history.sql` | ⏳ Pendente | - |
| 2025-10-09 | `20251008220000_create_admin_user.sql` | ⏳ Pendente | - |

**Após aplicar cada migration, atualize esta tabela com ✅ e seu nome.**
