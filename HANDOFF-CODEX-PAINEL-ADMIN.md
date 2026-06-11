# Handoff para Codex — Painel Administrativo Plena
**Data:** 2026-06-10
**Agentes envolvidos:** Claude (coordenação + correções TS) · Antigravity (implementação React/Vitest)
**Estado final:** 265/265 testes · lint limpo · build OK

---

## O que foi construído

### Painel Administrativo (`/admin`)

Área protegida por autenticação Supabase, acessível via `#/admin/login` no hub.
Rota raiz: `HashRouter`, prefixo `/admin/`.

#### Estrutura de arquivos criada

```
servicos/hub/src/admin/
├── supabase-client.ts          — createClient, signIn, signOut, getAdminSession, onAdminAuthStateChange
├── admin.css                   — design tokens e utilitários do painel (prefixo .adm-)
├── auth/
│   ├── AuthGuard.tsx           — protege rotas; redireciona para /admin/login se não autenticado
│   ├── AuthGuard.test.tsx
│   ├── LoginPage.tsx           — formulário de login com validação Zod
│   ├── LoginPage.test.tsx
│   └── login-page.css
├── shell/
│   ├── AdminShell.tsx          — layout com sidebar de navegação
│   └── admin-shell.css
├── dashboard/
│   ├── DashboardPage.tsx       — KPIs (hoje/mês/ano) + tabela por categoria, dados reais do Supabase
│   ├── DashboardPage.test.tsx
│   └── dashboard.css
├── transactions/
│   ├── transaction-schema.ts   — Zod schema; Transaction (output) tem amount: number
│   ├── transaction-service.ts  — getTransactions / addTransaction / deleteTransaction (Supabase)
│   ├── NewTransactionForm.tsx  — formulário de registro com validação Zod
│   ├── NewTransactionForm.test.tsx
│   ├── TransactionListPage.tsx — listagem + exclusão em tempo real
│   ├── TransactionListPage.test.tsx
│   └── transactions.css
└── reports/
    ├── ReportPage.tsx          — relatório por mês/ano + exportação CSV
    ├── ReportPage.test.tsx
    └── reports.css
```

#### Rotas adicionadas em `App.tsx`

```
/admin               → redirect para /admin/login
/admin/login         → LoginPage (público)
/admin/dashboard     → DashboardPage (protegido por AuthGuard)
/admin/atendimentos  → TransactionListPage (protegido)
/admin/relatorios    → ReportPage (protegido)
```

---

## Banco de dados — Supabase

**Project ref:** `vpbofkmvplikprgtnwsi`
**URL:** `https://vpbofkmvplikprgtnwsi.supabase.co`

### Tabela `public.transactions`

| Coluna | Tipo | Constraint |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid | FK → `auth.users(id)` ON DELETE CASCADE |
| `service_date` | date | NOT NULL |
| `category` | text | CHECK enum de 10 valores |
| `service_name` | text | CHECK 1–120 chars |
| `amount` | numeric(10,2) | CHECK > 0 |
| `payment_method` | text | CHECK ('dinheiro','pix','cartao','outro') |
| `notes` | text | nullable, CHECK ≤ 500 chars |
| `created_at` | timestamptz | DEFAULT now() |

**RLS ativo** com 3 políticas: SELECT, INSERT e DELETE restritos ao `auth.uid() = user_id`.
**Índices:** `(user_id, service_date DESC)` e `(category)`.

### Variáveis de ambiente

Arquivo: `servicos/hub/.env.local` (no `.gitignore`)

```
VITE_SUPABASE_URL=https://vpbofkmvplikprgtnwsi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RJeblgAx4iKuB8YJcKVVXw_oP_zwFui
```

> **Atenção:** o nome da variável é `VITE_SUPABASE_PUBLISHABLE_KEY` (não `ANON_KEY`).
> O módulo `src/lib/env.ts` valida exatamente esse nome em runtime e em testes.

---

## Decisões de design relevantes

### `Transaction.amount` é `number`

O Zod schema faz `transform((v) => parseFloat(...))`, então `z.output` tem `amount: number`.
O `transaction-service.ts` recebe e armazena diretamente — **não há conversão de string para número na service layer**.

```ts
// CERTO — amount já é number vindo do Zod
const amountNumber = transaction.amount

// ERRADO — não fazer isso
const amountNumber = parseFloat(transaction.amount.replace(',', '.'))
```

### AuthGuard não verifica `user_metadata.role`

Sistema de admin único. Qualquer usuário autenticado no Supabase Auth é tratado como admin.
A verificação de role foi removida de `getAdminSession` e `onAdminAuthStateChange`.
Se no futuro houver múltiplos usuários com níveis diferentes, adicionar a checagem de role de volta.

### `onAdminAuthStateChange` gerencia logout automático

O `AuthGuard` assina `onAuthStateChange` via `onAdminAuthStateChange`. Quando o token expira
ou o usuário faz logout em outra aba, o guard redireciona para `/admin/login` automaticamente.

---

## Ferramentas novas no hub (integradas nesta sessão)

Os seguintes 5 stubs foram integrados ao `tool-registry.ts`, `App.tsx` e `servicos.html`
(status `building`, botões desabilitados, aguardando implementação):

| roadmapOrder | slug | CSS prefix | Accent |
|---|---|---|---|
| 7 | `menu-builder` | `.mb-` | `#b45309` |
| 8 | `business-card-creator` | `.bcc-` | `#1e3a5f` |
| 9 | `label-generator` | `.lg-` | `#0f4c81` |
| 10 | `mei-das-guide` | `.mdg-` | `#2d6a4f` |
| 11 | `print-cost-estimator` | `.pce-` | `#7b2d8b` |

---

## Estado da suíte de testes

```
Test Files  42 passed (42)
Tests       265 passed (265)
```

Todos os testes do painel admin estão em `src/admin/*/`.
Padrão de mock: `vi.mock('../supabase-client')` — **nunca** chamar o Supabase real em testes.
Padrão de assertions assíncronas: `await screen.findByText(...)` ou `waitFor(...)`.

---

## O que NÃO foi feito (backlog)

- **Edição de atendimentos** — só criação e exclusão por enquanto
- **Paginação** na `TransactionListPage` — carrega tudo em memória
- **Filtros** por data/categoria na listagem
- **Relatório por período livre** (não só mês/ano fixo)
- **Code split** do bundle — está acima de 500 KB minificado (aviso do Vite, não erro)

---

## Arquivos que NÃO podem ser tocados (regra estabelecida)

```
servicos/hub/src/app/tool-registry.ts
servicos/hub/src/app/tool-registry.test.ts
servicos/hub/src/app/tool-presentation.test.ts
servicos/ROADMAP.md
servicos/hub/src/features/tools/**  (exceto novos stubs)
```
