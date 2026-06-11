# Prompt — Agente Antigravity
# Tarefa: Construir a Fase A do Painel Administrativo Plena

---

## Contexto do projeto

**Repositório:** `C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena`

**Stack:**
- React 19 + TypeScript + Vite — pasta `servicos/hub/`
- Vitest + @testing-library/react — testes com `fireEvent` (NUNCA `userEvent`)
- Zod 4 — validação de formulários
- `@supabase/supabase-js` — JÁ instalado, versão `^2.108.1`
- HashRouter (react-router-dom) — roteamento interno
- Sem novas dependências — usar apenas o que está em `package.json`

**Build output:** `servicos/ferramentas/qr-code/` (único ponto de entrada Vite)

---

## Estado atual da suite de testes

**Antes de começar qualquer coisa**, execute:

```powershell
cd "C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\hub"
npm.cmd run test -- --run 2>&1 | tail -6
```

Você verá **1 teste falhando por timeout** no arquivo
`src/app/institutional-integration.test.tsx`, teste:
`mantem navegacao, retorno ao catalogo e rodape na pagina dedicada`

**Esta é a primeira tarefa:** corrigir esse teste antes de construir qualquer coisa
nova. O timeout ocorre porque o `App.tsx` foi refatorado pelo Codex e a rota `/`
agora redireciona para `/ferramentas/qr-code` em vez de renderizar diretamente.
O teste usa `window.location.hash = '#/ferramentas/qr-code'` e espera que o
`InstitutionalShell` e o `QrCodeTool` estejam presentes.

Leia o teste e o `App.tsx` atual para entender a causa exata e aplicar a correção
mínima necessária. Não altere a lógica de roteamento do App — apenas corrija o teste
para funcionar com o novo fluxo.

Após a correção, todos os testes devem passar antes de prosseguir.

---

## Arquivos que NÃO podem ser tocados

```
servicos/hub/src/app/tool-registry.ts
servicos/hub/src/app/tool-registry.test.ts
servicos/hub/src/app/tool-presentation.test.ts
servicos/ROADMAP.md
qualquer arquivo em src/features/tools/
```

**Podem ser modificados:**
- `servicos/hub/src/App.tsx` — para adicionar rotas admin
- `servicos/hub/src/app/institutional-integration.test.tsx` — somente para corrigir
  o timeout existente, não para remover ou enfraquecer as asserções
- `servicos/servicos.html` — para adicionar link de entrada ao painel no rodapé

---

## Estrutura a criar

```
servicos/hub/src/admin/
├── supabase-client.ts
├── admin.css
├── auth/
│   ├── AuthGuard.tsx
│   ├── AuthGuard.test.tsx
│   ├── LoginPage.tsx
│   └── LoginPage.test.tsx
├── shell/
│   ├── AdminShell.tsx
│   └── admin-shell.css
├── dashboard/
│   ├── DashboardPage.tsx
│   ├── DashboardPage.test.tsx
│   └── dashboard.css
├── transactions/
│   ├── TransactionListPage.tsx
│   ├── TransactionListPage.test.tsx
│   ├── NewTransactionForm.tsx
│   ├── NewTransactionForm.test.tsx
│   ├── transaction-schema.ts
│   └── transactions.css
└── reports/
    ├── ReportPage.tsx
    ├── ReportPage.test.tsx
    └── reports.css
```

---

## Arquivo 1: `admin/supabase-client.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AdminSession = {
  userId: string
  email: string
  role: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null
  const role = session.user.user_metadata?.role as string | undefined
  if (role !== 'admin') return null
  return { userId: session.user.id, email: session.user.email ?? '', role }
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}
```

**Em testes:** sempre mockar este módulo com `vi.mock`. Nunca chamar o Supabase
real em testes.

---

## Arquivo 2: `admin/auth/AuthGuard.tsx`

Wrapper de proteção de rota. Regras:

1. No mount, chama `getSession()` (injetável via prop)
2. Enquanto carrega: `<div aria-live="polite">Verificando acesso...</div>`
3. Session nula ou `role !== 'admin'`: `<Navigate to="/admin/login" replace />`
4. Autenticado: renderiza `{children}`

```typescript
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import type { AdminSession } from '../supabase-client'
import { getAdminSession } from '../supabase-client'

interface AuthGuardProps {
  children: ReactNode
  getSession?: () => Promise<AdminSession | null>
}

export function AuthGuard({
  children,
  getSession = getAdminSession,
}: AuthGuardProps) {
  // implementar
}
```

**Testes obrigatórios (AuthGuard.test.tsx):**
- `vi.mock('../supabase-client')` no topo
- Exibe "Verificando acesso..." durante carregamento
- Redireciona para `/admin/login` quando `getSession` retorna `null`
- Renderiza children quando `getSession` retorna sessão admin válida
- Usar `MemoryRouter` do react-router-dom para envolver o componente nos testes

---

## Arquivo 3: `admin/auth/LoginPage.tsx`

### Layout visual

```
┌─────────────────────────────────────────────────────┐
│  [Logo Plena pequeno]  Área Administrativa           │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Acesso restrito                            │   │
│  │                                             │   │
│  │  E-mail *                                   │   │
│  │  [________________________________]         │   │
│  │                                             │   │
│  │  Senha *                                    │   │
│  │  [____________________________] [👁]        │   │
│  │                                             │   │
│  │  {error && <p role="alert">...</p>}         │   │
│  │                                             │   │
│  │  [        Entrar        ]                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Não compartilhe suas credenciais.                  │
│  Acesso monitorado e restrito.                      │
└─────────────────────────────────────────────────────┘
```

### Validação Zod (antes de qualquer chamada ao Supabase)

```typescript
const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})
```

### Comportamento

- `isLoading` → botão desabilitado + texto "Entrando..."
- Toggle de visibilidade da senha: botão `aria-label="Mostrar senha"` / `"Ocultar senha"`
- Erro de autenticação → `role="alert"` com mensagem genérica:
  **"E-mail ou senha incorretos."** — nunca revelar qual campo está errado
- Em sucesso → `onSuccess()` (que navega para `/admin/dashboard`)
- Foco automático no campo e-mail no mount

### Props injetáveis para testes

```typescript
interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<{ error: Error | null }>
  onSuccess?: () => void
}
// Padrão real: onLogin = signIn, onSuccess = () => navigate('/admin/dashboard', { replace: true })
```

### Testes obrigatórios (LoginPage.test.tsx)

1. Renderiza campo E-mail e campo Senha
2. Botão "Entrar" presente
3. E-mail inválido ao submeter → `role="alert"` com mensagem Zod
4. Senha curta ao submeter → `role="alert"` com mensagem Zod
5. `onLogin` chamado com email e senha ao submeter dados válidos
6. Durante `isLoading=true` → botão exibe "Entrando..." e está `disabled`
7. Quando `onLogin` retorna `error` → exibe `role="alert"` com "E-mail ou senha incorretos."
8. Toggle de senha: clique alterna `type="password"` ↔ `type="text"`

---

## Arquivo 4: `admin/shell/AdminShell.tsx`

Layout de todas as páginas protegidas do painel.

### Estrutura HTML

```tsx
<div className="adm-layout">
  <aside className="adm-sidebar" aria-label="Navegação administrativa">
    <div className="adm-sidebar__brand">
      <strong>PLENA</strong><span>Admin</span>
    </div>
    <nav>
      <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/atendimentos" ...>Atendimentos</NavLink>
      <NavLink to="/admin/relatorios" ...>Relatórios</NavLink>
    </nav>
    <button type="button" className="adm-logout" onClick={onLogout}>
      Sair
    </button>
  </aside>

  <div className="adm-body">
    <header className="adm-topbar" aria-label="Cabeçalho administrativo">
      <h1 className="adm-topbar__title">{pageTitle}</h1>
      {userEmail && <span className="adm-topbar__user">{userEmail}</span>}
    </header>
    <main className="adm-content">
      {children}
    </main>
  </div>
</div>
```

### CSS (`admin-shell.css`)

```css
.adm-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.adm-sidebar {
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.adm-sidebar__brand {
  padding: 0 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 1rem;
}

.adm-sidebar__brand strong { color: #ffffff; font-size: 1.1rem; }
.adm-sidebar__brand span { color: #ea580c; font-size: 0.75rem; display: block; }

.adm-nav-link {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}

.adm-nav-link:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }
.adm-nav-link--active { color: #ea580c; background: rgba(234,88,12,0.1); border-left: 3px solid #ea580c; }

.adm-logout {
  margin-top: auto;
  margin: auto 1.25rem 1.25rem;
  padding: 0.625rem 1rem;
  background: rgba(220,38,38,0.1);
  color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  width: calc(100% - 2.5rem);
}

.adm-logout:hover { background: rgba(220,38,38,0.2); }

.adm-body { display: flex; flex-direction: column; background: #f8fafc; }

.adm-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.adm-topbar__title { font-size: 1.125rem; font-weight: 600; color: #0f172a; margin: 0; }
.adm-topbar__user { font-size: 0.8rem; color: #64748b; }

.adm-content { padding: 1.5rem; flex: 1; }

/* Mobile: sidebar como drawer */
@media (max-width: 768px) {
  .adm-layout { grid-template-columns: 1fr; }
  .adm-sidebar {
    position: fixed;
    left: -240px;
    z-index: 100;
    transition: left 0.25s ease;
    height: 100dvh;
  }
  .adm-sidebar--open { left: 0; }
  .adm-topbar { padding: 0.875rem 1rem; }
}

/* Impressão */
@media print {
  .adm-sidebar, .adm-topbar { display: none; }
  .adm-layout { grid-template-columns: 1fr; }
  .adm-content { padding: 0; }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .adm-sidebar { transition: none; }
}
```

### Props

```typescript
interface AdminShellProps {
  children: ReactNode
  pageTitle: string
  userEmail?: string
  onLogout?: () => void
}
```

---

## Arquivo 5: `admin/transactions/transaction-schema.ts`

```typescript
import { z } from 'zod'

export const PAYMENT_METHODS = ['dinheiro', 'pix', 'cartao', 'outro'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao: 'Cartão',
  outro: 'Outro',
}

export const SERVICE_CATEGORIES = [
  'MEI',
  'IRPF',
  'Impressão',
  'Documentos',
  'Currículo',
  'Cartão de Visitas',
  'Cardápio',
  'Encadernação',
  'Plastificação',
  'Outros',
] as const
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

export const transactionSchema = z.object({
  serviceDate: z
    .string()
    .min(1, 'Informe a data do atendimento')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  category: z.enum(SERVICE_CATEGORIES, {
    error: 'Selecione uma categoria',
  }),
  serviceName: z
    .string()
    .trim()
    .min(1, 'Informe o serviço realizado')
    .max(120, 'Use no máximo 120 caracteres'),
  amount: z
    .string()
    .min(1, 'Informe o valor cobrado')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .pipe(z.number().min(0.01, 'Valor deve ser maior que zero')),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    error: 'Selecione a forma de pagamento',
  }),
  notes: z.string().trim().max(500, 'Use no máximo 500 caracteres').optional(),
})

export type TransactionInput = z.input<typeof transactionSchema>
export type Transaction = z.output<typeof transactionSchema>
```

**Atenção:** Zod 4 usa `error` (string), não `errorMap`. Confirme a versão
instalada com `cat package.json | grep zod` antes de escrever os schemas.

---

## Arquivo 6: `admin/transactions/NewTransactionForm.tsx`

### Layout

```
┌─ Registrar atendimento ──────────────────────────────────────────────┐
│  Data do atendimento *         [2026-06-10     ] (input type="date") │
│  Categoria *                   [Selecione...  ▼] (select)            │
│  Serviço realizado *           [_______________] (input text)        │
│  Valor cobrado (R$) *          [_______________] (input text)        │
│  Forma de pagamento *                                                 │
│    ◉ Dinheiro  ○ Pix  ○ Cartão  ○ Outro  (radio group)              │
│  Observações                   [textarea]                             │
│  {error && <p role="alert">...</p>}                                  │
│  [ Cancelar ]                  [ Registrar atendimento ]             │
└──────────────────────────────────────────────────────────────────────┘
```

### Detalhes de implementação

- Data padrão: `new Date().toISOString().split('T')[0]`
- Validação Zod no submit; ao falhar, foca o primeiro campo inválido
- `isSubmitting` → botão "Registrar" exibe "Salvando..." e fica `disabled`
- Acessibilidade: `<fieldset>` + `<legend>Forma de pagamento *</legend>` nos radios
- Labels associados com `htmlFor`/`id` em todos os campos

### Props injetáveis para testes

```typescript
interface NewTransactionFormProps {
  onSubmit?: (data: Transaction) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}
// onSubmit padrão: stub async () => {} — Fase B implementa a query real
```

### Testes obrigatórios (NewTransactionForm.test.tsx)

1. Renderiza todos os campos obrigatórios com labels corretos
2. Data padrão é a data de hoje no formato `YYYY-MM-DD`
3. Erro ao submeter sem preencher nenhum campo → `role="alert"` visível
4. Select de categoria tem as 10 opções definidas em `SERVICE_CATEGORIES`
5. Radios de pagamento: Dinheiro / Pix / Cartão / Outro presentes
6. `onSubmit` chamado com `Transaction` correto ao preencher dados válidos e submeter
7. Botão "Registrar atendimento" com `disabled={true}` quando `isSubmitting=true`
8. Botão "Cancelar" chama `onCancel`

---

## Arquivo 7: `admin/transactions/TransactionListPage.tsx`

### Layout

```
┌─ Atendimentos ──────────────────────────────────────────────────────┐
│  [ + Novo atendimento ]                                             │
│                                                                     │
│  Filtros: [De:____] [Até:____]  [Categoria ▼]  [Pagamento ▼]       │
│                                                                     │
│  Estado vazio:                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Nenhum atendimento registrado ainda.                        │   │
│  │  Use o botão "Novo atendimento" para começar.                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  (quando showForm=true, renderiza NewTransactionForm acima)         │
└─────────────────────────────────────────────────────────────────────┘
```

- `showForm` controlado por estado local: botão "Novo atendimento" → `true`; "Cancelar" → `false`
- Estado vazio: `aria-live="polite"` no container da tabela
- Filtros: inputs de data e selects de categoria/pagamento — sem lógica de filtro
  (stub visual; Fase B implementa a query)

### Testes obrigatórios (TransactionListPage.test.tsx)

1. Renderiza heading "Atendimentos"
2. Botão "Novo atendimento" presente
3. Inputs de filtro de data (De / Até) presentes
4. Mensagem de estado vazio visível
5. Clicar em "Novo atendimento" → `NewTransactionForm` aparece no DOM
6. Clicar em "Cancelar" no formulário → formulário some do DOM

---

## Arquivo 8: `admin/dashboard/DashboardPage.tsx`

### Layout

```
┌─ KPIs (3 cards lado a lado) ──────────────────────────────────────┐
│  Hoje              Este mês            Este ano                    │
│  R$ —              R$ —                R$ —                        │
│  — atendimentos    — atendimentos      — atendimentos              │
└────────────────────────────────────────────────────────────────────┘

┌─ Por categoria (este mês) ─────────────────────────────────────────┐
│  Categoria       Qtd.    Total                                     │
│  MEI             —       R$ —                                      │
│  IRPF            —       R$ —                                      │
│  Impressão       —       R$ —                                      │
│  Documentos      —       R$ —                                      │
│  Outros          —       R$ —                                      │
└────────────────────────────────────────────────────────────────────┘

[ + Registrar atendimento ]    [ Ver todos os atendimentos ]
  (Link /admin/atendimentos)     (Link /admin/atendimentos)
```

- Valores exibem `—` (traço em) quando sem dados, nunca `null` ou `undefined` no DOM
- Comentário no componente: `// TODO Fase B: buscar dados via supabase`
- Os dois botões usam `<Link>` do react-router-dom para `/admin/atendimentos`

### Testes obrigatórios (DashboardPage.test.tsx)

1. Renderiza 3 cards: "Hoje", "Este mês", "Este ano"
2. Tabela de categorias presente
3. `Link` "Registrar atendimento" presente
4. `Link` "Ver todos os atendimentos" presente

---

## Arquivo 9: `admin/reports/ReportPage.tsx`

### Layout

```
┌─ Relatórios ────────────────────────────────────────────────────────┐
│  Período:  [Mês/Ano ▼]  [Junho ▼] [2026 ▼]    [Gerar relatório]    │
│                                                                     │
│  ┌─── Resumo ──────────────────────────────────────────────────┐   │
│  │  Total de atendimentos    —                                  │   │
│  │  Total faturado           R$ —                               │   │
│  │  Média por atendimento    R$ —                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Por categoria                                                      │
│  Categoria      Qtd.    Total                                       │
│  ─────────────────────────────────────────────────────────────     │
│  (aguardando seleção de período)                                    │
│                                                                     │
│  [ Exportar CSV ]  (desabilitado sem dados)                         │
│                                                                     │
│  Nota: relatórios gerados localmente, sem envio de dados.           │
└─────────────────────────────────────────────────────────────────────┘
```

- Exportar CSV: gera `plena-relatorio-{mes}-{ano}.csv` localmente via Blob +
  `URL.createObjectURL` + click simulado + `URL.revokeObjectURL`
- O stub pode gerar um CSV com cabeçalho vazio; Fase B preenche os dados reais
- Botão "Exportar CSV" desabilitado quando `hasPeriodSelected = false`

### Testes obrigatórios (ReportPage.test.tsx)

1. Renderiza heading "Relatórios"
2. Seletores de mês e ano presentes
3. Botão "Gerar relatório" presente
4. Botão "Exportar CSV" presente no DOM
5. Resumo de KPIs presente com traços iniciais
6. Nota de privacidade sobre geração local presente

---

## Arquivo 10: `admin/admin.css`

```css
/* =================================================================
   Painel Administrativo Plena — prefixo adm-
   Importar em admin/shell/AdminShell.tsx
   ================================================================= */

:root {
  --adm-sidebar-bg: #0f172a;
  --adm-sidebar-text: #e2e8f0;
  --adm-accent: #ea580c;
  --adm-accent-light: rgba(234, 88, 12, 0.1);
  --adm-topbar-bg: #ffffff;
  --adm-content-bg: #f8fafc;
  --adm-border: #e2e8f0;
  --adm-danger: #dc2626;
  --adm-success: #15803d;
  --adm-text: #0f172a;
  --adm-text-muted: #64748b;
  --adm-card-bg: #ffffff;
  --adm-card-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* Cards de KPI e blocos informativos */
.adm-card {
  background: var(--adm-card-bg);
  border: 1px solid var(--adm-border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  box-shadow: var(--adm-card-shadow);
}

.adm-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .adm-kpi-grid { grid-template-columns: 1fr; }
}

.adm-kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--adm-text);
}

.adm-kpi-label {
  font-size: 0.8rem;
  color: var(--adm-text-muted);
  margin-top: 0.25rem;
}

/* Tabela padrão do painel */
.adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.adm-table th {
  text-align: left;
  padding: 0.625rem 1rem;
  font-weight: 600;
  color: var(--adm-text-muted);
  border-bottom: 2px solid var(--adm-border);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.adm-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--adm-border);
  color: var(--adm-text);
}

/* Formulários */
.adm-field { margin-bottom: 1rem; }

.adm-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--adm-text);
  margin-bottom: 0.375rem;
}

.adm-input,
.adm-select,
.adm-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--adm-border);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--adm-text);
  background: #fff;
  transition: border-color 0.15s;
}

.adm-input:focus,
.adm-select:focus,
.adm-textarea:focus {
  outline: none;
  border-color: var(--adm-accent);
  box-shadow: 0 0 0 3px var(--adm-accent-light);
}

/* Botões */
.adm-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.15s, opacity 0.15s;
}

.adm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.adm-btn--primary { background: var(--adm-accent); color: #fff; }
.adm-btn--primary:hover:not(:disabled) { background: #c2410c; }

.adm-btn--secondary {
  background: transparent;
  color: var(--adm-text-muted);
  border: 1px solid var(--adm-border);
}

.adm-btn--secondary:hover:not(:disabled) { background: #f1f5f9; }

.adm-btn--danger { background: var(--adm-danger); color: #fff; }

/* Alertas e erros */
.adm-alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.adm-alert--error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* Estado vazio */
.adm-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--adm-text-muted);
}

/* Login page */
.adm-login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--adm-content-bg);
  padding: 1.5rem;
}

.adm-login-card {
  background: #fff;
  border: 1px solid var(--adm-border);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.adm-login-card h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: var(--adm-text);
}

/* Impressão */
@media print {
  .adm-btn, .adm-topbar { display: none; }
}

/* Foco visível */
.adm-btn:focus-visible,
.adm-input:focus-visible,
.adm-select:focus-visible {
  outline: 2px solid var(--adm-accent);
  outline-offset: 2px;
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .adm-input, .adm-btn, .adm-sidebar { transition: none !important; }
}
```

---

## Rotas a adicionar em `App.tsx`

Leia o `App.tsx` atual antes de modificar. O arquivo foi refatorado pelo Codex e
usa um mapa `toolComponents` + componente `ToolRoute`. Não altere nada da lógica
existente — apenas adicione os novos imports e rotas.

**Imports a adicionar:**

```tsx
import type { ReactNode } from 'react'
import { AuthGuard } from './admin/auth/AuthGuard'
import { LoginPage } from './admin/auth/LoginPage'
import { AdminShell } from './admin/shell/AdminShell'
import { DashboardPage } from './admin/dashboard/DashboardPage'
import { TransactionListPage } from './admin/transactions/TransactionListPage'
import { ReportPage } from './admin/reports/ReportPage'
import './admin/admin.css'
```

**Função auxiliar a adicionar (antes do componente App):**

```tsx
function AdminPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell pageTitle={title}>{children}</AdminShell>
    </AuthGuard>
  )
}
```

**Rotas a adicionar dentro de `<Routes>` — ANTES do catch-all `path="*"`:**

```tsx
<Route path="/admin" element={<Navigate to="/admin/login" replace />} />
<Route path="/admin/login" element={<LoginPage />} />
<Route
  path="/admin/dashboard"
  element={<AdminPage title="Dashboard"><DashboardPage /></AdminPage>}
/>
<Route
  path="/admin/atendimentos"
  element={<AdminPage title="Atendimentos"><TransactionListPage /></AdminPage>}
/>
<Route
  path="/admin/relatorios"
  element={<AdminPage title="Relatórios"><ReportPage /></AdminPage>}
/>
```

---

## Link de entrada em `servicos.html`

Adicionar no rodapé (`<footer>`), logo antes do `</footer>`, dentro do bloco de
links existente (Termos / Privacidade):

```html
<a href="ferramentas/qr-code/#/admin" class="hover:text-[var(--color-primary)] transition-colors">Área administrativa</a>
```

---

## Regras de implementação críticas

### Encoding
- **Todos os arquivos em UTF-8** com acentuação PT-BR correta
- **NÃO usar PowerShell** para criar ou reescrever arquivos — usar a ferramenta
  `Write` do agente (PowerShell corrompe acentos neste projeto)

### Código React
- **Inline styles proibidos** — linter ESLint bloqueia `style={{ ... }}`
- Todo CSS no arquivo `.css` da feature, importado pelo componente principal
- Sem `console.log` com dados de sessão, senhas ou tokens

### Supabase em testes
- **Sempre mockar** `supabase-client.ts` com `vi.mock('./supabase-client')` ou
  `vi.mock('../../supabase-client')` conforme o caminho relativo
- Nunca chamar o Supabase real em testes
- Variáveis de ambiente não precisam estar definidas nos testes pois o módulo
  será mockado

### Zod
- Confirmar a versão exata com `cat package.json | grep zod` antes de escrever schemas
- **Zod 4:** usar `error: 'mensagem'` (string) nos `z.enum()`, não `errorMap`
- **Zod 3:** usar `errorMap: () => ({ message: 'mensagem' })`

### CSS
- Prefixo `adm-` em TODAS as classes do painel — nunca reutilizar classes do Hub público
- Importar `admin.css` apenas no `AdminShell.tsx` (não no `App.tsx` global)

### Testes
- `fireEvent` do `@testing-library/react` — NUNCA `userEvent`
- `MemoryRouter` para componentes que usam `Link` ou `Navigate`
- Mockar `supabase-client` em todos os testes do painel

---

## Verificação final obrigatória

```powershell
cd "C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\hub"
npm.cmd run test -- --run
npm.cmd run lint
npm.cmd run build
```

- **Todos os testes devem passar** — incluindo o timeout que você corrigiu no início
- **Zero erros de lint**
- **Build com sucesso** — avisos de chunk size e `INEFFECTIVE_DYNAMIC_IMPORT` são
  pré-existentes e esperados

---

## Relatório final esperado

1. **Correção do teste de timeout** — o que causava e como foi corrigido
2. **Arquivos criados** (lista completa com caminho relativo)
3. **Arquivos modificados** (`App.tsx`, `institutional-integration.test.tsx`,
   `servicos.html`) — descrever cada alteração
4. **Testes aprovados** — total e breakdown por módulo
5. **Resultado de lint e build**
6. **Ajustes fora do escopo** — se nenhum: escrever exatamente
   "Nenhum ajuste fora do escopo foi realizado."

Não fazer commit nem push.
