# Changelog - Saquetto Auditor Fiscal

## [Unreleased] - 2025-10-08

### 🔒 Seguranca

- **CRÍTICO**: Removidas credenciais hardcoded do código
  - Credenciais do Supabase agora são lidas de variáveis de ambiente
  - Arquivo `.env` adicionado ao `.gitignore`
  - Criado `.env.example` como template
  - ⚠️ **AÇÃO NECESSÁRIA**: Configure o arquivo `.env` com suas credenciais antes de rodar o projeto

### ✅ Correções

- Corrigida inconsistência no nome do bucket de storage (`notas_fiscais` → `invoices`)
- Adicionadas RLS policies para o bucket de storage do Supabase
- Melhoradas configurações do TypeScript para maior segurança de tipos:
  - Ativado `strict: true`
  - Ativado `strictNullChecks: true`
  - Ativado `noImplicitAny: true`
  - Ativado `noUnusedLocals: true`
  - Ativado `noUnusedParameters: true`

### ⚡ Performance

- Implementado **code splitting** com React lazy loading
  - Todas as páginas principais agora são carregadas sob demanda
  - Redução significativa do bundle inicial
- Otimizado bundling do Vite:
  - Separação de vendors (react, ui, charts, supabase)
  - Bundle principal: ~148 KB (43.5 KB gzip)
  - React vendor: ~164 KB (53.5 KB gzip)
  - Charts vendor: ~411 KB (110.5 KB gzip)
  - Supabase vendor: ~132 KB (35.7 KB gzip)
  - UI vendor: ~97 KB (33 KB gzip)

### 🛡️ Confiabilidade

- Implementado **ErrorBoundary** global
  - Captura erros React em produção
  - Interface amigável para erros
  - Stack trace em modo desenvolvimento

### 📝 Arquivos Novos

- `.env.example` - Template de variáveis de ambiente
- `src/components/ErrorBoundary.tsx` - Componente de tratamento de erros
- `supabase/migrations/20251008000000_add_storage_policies.sql` - Políticas RLS do storage
- `CHANGELOG.md` - Este arquivo

### 🔄 Migrations Necessárias

Execute a migration de storage policies:
```bash
# Se usar Supabase CLI
supabase db push

# Ou aplique manualmente via Dashboard do Supabase
```

### ⚠️ Breaking Changes

**IMPORTANTE**: O projeto agora requer variáveis de ambiente. Siga os passos:

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` com suas credenciais do Supabase

3. **NUNCA** commite o arquivo `.env` no git

### 📊 Métricas de Build

**Antes**:
- Bundle único: 1.06 MB (299 KB gzip)
- Tempo de build: ~4.4s

**Depois**:
- Bundle principal: 148 KB (43.5 KB gzip)
- Total de chunks: 26 arquivos
- Tempo de build: ~3s
- **Melhoria**: ~67% redução no bundle inicial

---

## Notas para Desenvolvimento

### Próximos Passos Recomendados

1. ⚠️ **Autenticação**: Implementar autenticação real com Supabase Auth
2. 📦 **Validação**: Implementar schemas Zod para validação de dados
3. 🔍 **Monitoramento**: Adicionar Sentry ou similar para tracking de erros
4. 📄 **Paginação**: Implementar paginação real nas listagens
5. ♿ **Acessibilidade**: Melhorar labels ARIA e navegação por teclado
