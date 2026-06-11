# Plano — Painel Administrativo Plena
## Gestão Financeira do Hub de Soluções Digitais

_Versão 1.0 — junho de 2026_

---

## 1. Objetivo

Criar um painel interno acessível por administradores autenticados que permita:

- Registrar atendimentos presenciais e remotos com valor cobrado
- Visualizar o faturamento por categoria, período e tipo de serviço
- Acompanhar o histórico de atendimentos
- Exportar relatórios simples

O painel não processa pagamentos — registra o que foi cobrado e pago no balcão ou
via combinação direta. É um caderno de controle financeiro digital, não um sistema
de checkout.

---

## 2. O que já existe e pode ser aproveitado

| Recurso              | Localização                       | Observação                                |
| -------------------- | --------------------------------- | ----------------------------------------- |
| `@supabase/supabase-js` | `servicos/hub/package.json`     | Já instalado, aguardando uso              |
| React + TypeScript   | `servicos/hub/`                   | Stack base                                |
| HashRouter           | `App.tsx`                         | Roteamento interno já configurado         |
| InstitutionalShell   | `src/app/InstitutionalShell.tsx`  | Shell de página reutilizável              |
| Zod                  | `package.json`                    | Validação de formulários                  |
| `servicos/servicos.html` | —                             | Link de entrada para o painel             |

---

## 3. Arquitetura

### 3.1 Camadas

```
servicos/hub/src/
├── admin/                          ← NOVO domínio isolado do Hub público
│   ├── auth/
│   │   ├── supabase-client.ts      ← instância única do cliente Supabase
│   │   ├── auth-guard.tsx          ← HOC/wrapper de proteção de rota
│   │   ├── login-page.tsx          ← tela de login
│   │   └── auth.test.tsx
│   ├── dashboard/
│   │   ├── DashboardPage.tsx       ← visão geral (KPIs + gráfico simples)
│   │   └── dashboard.test.tsx
│   ├── transactions/
│   │   ├── TransactionListPage.tsx ← lista paginada + filtros
│   │   ├── NewTransactionForm.tsx  ← formulário de registro
│   │   ├── transaction-schema.ts   ← Zod schema
│   │   └── transactions.test.tsx
│   ├── reports/
│   │   ├── ReportPage.tsx          ← exportação CSV simples
│   │   └── reports.test.tsx
│   └── admin-shell.tsx             ← layout do painel (sidebar + topbar)
```

### 3.2 Rota no HashRouter

```
/#/admin                → redireciona para /#/admin/login (se não autenticado)
/#/admin/login          → tela pública de login
/#/admin/dashboard      → painel protegido
/#/admin/atendimentos   → lista + novo registro
/#/admin/relatorios     → exportação
```

### 3.3 Entrada pública

Em `servicos.html`, adicionar link discreto no rodapé:
```html
<a href="ferramentas/qr-code/#/admin">Área administrativa</a>
```

---

## 4. Modelo de dados (Supabase)

### Tabela `service_categories`

Categorias pré-definidas dos serviços — semeadas via migration ou painel Supabase.

```sql
CREATE TABLE service_categories (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,       -- "MEI", "IRPF", "Impressão", etc.
  slug text NOT NULL UNIQUE
);
```

### Tabela `transactions`

Registro de cada atendimento cobrado.

```sql
CREATE TABLE transactions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz DEFAULT now(),
  service_date   date NOT NULL,
  category_id    uuid REFERENCES service_categories(id),
  service_name   text NOT NULL,    -- "MEI Abertura", "Currículo", etc.
  amount         numeric(10,2) NOT NULL CHECK (amount >= 0),
  payment_method text NOT NULL     -- "dinheiro" | "pix" | "cartao"
                 CHECK (payment_method IN ('dinheiro', 'pix', 'cartao', 'outro')),
  notes          text,
  created_by     uuid REFERENCES auth.users(id)
);
```

### RLS (Row Level Security)

```sql
-- Apenas usuários autenticados com role 'admin' podem ler/escrever
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON transactions
  USING (auth.uid() IN (
    SELECT id FROM auth.users
    WHERE raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "admin_read_categories" ON service_categories
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );
```

**Nota:** O campo `role: 'admin'` é definido no `raw_user_meta_data` do Supabase Auth
diretamente no painel do Supabase — não via aplicação. Isso garante que nenhum
usuário se auto-promova administrador.

---

## 5. Autenticação

- **Método:** Email + senha via `supabase.auth.signInWithPassword()`
- **Sessão:** Gerenciada pelo Supabase SDK (localStorage)
- **Proteção de rota:** `AuthGuard` verifica `session` + `role === 'admin'` antes
  de renderizar qualquer rota protegida
- **Logout:** `supabase.auth.signOut()` limpa a sessão
- **Sem "Esqueci minha senha" na fase 1:** Redefinição feita diretamente no painel
  Supabase pelo responsável técnico
- **Sem cadastro público:** Administradores são criados exclusivamente no painel
  Supabase — nunca via formulário na aplicação

---

## 6. Interface — Telas

### 6.1 Tela de Login

```
┌─────────────────────────────────────────┐
│  🔒  Plena — Área Administrativa        │
│                                         │
│  [E-mail          ]                     │
│  [Senha           ] [👁]               │
│                                         │
│  [   Entrar   ]                         │
│                                         │
│  Acesso restrito. Não compartilhe        │
│  suas credenciais.                      │
└─────────────────────────────────────────┘
```

### 6.2 Dashboard

```
┌─ Hoje ────────────────┐ ┌─ Este mês ────────────┐ ┌─ Este ano ────────────┐
│  R$ 0,00              │ │  R$ 0,00              │ │  R$ 0,00              │
│  0 atendimentos       │ │  0 atendimentos       │ │  0 atendimentos       │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘

┌─ Por categoria (mês) ─────────────────────────────────────────────────────┐
│  MEI          ████████████████  R$ 0,00   0 atend.                        │
│  IRPF         ██████            R$ 0,00   0 atend.                        │
│  Impressão    ████              R$ 0,00   0 atend.                        │
│  Documentos   ██               R$ 0,00   0 atend.                         │
└───────────────────────────────────────────────────────────────────────────┘

[ + Registrar atendimento ]  [ Ver todos os atendimentos ]
```

### 6.3 Lista de Atendimentos

- Filtros: período (de / até), categoria, forma de pagamento
- Tabela: data, serviço, categoria, valor, pagamento, notas, ações (editar/excluir)
- Paginação: 20 por página
- Botão "Novo atendimento"

### 6.4 Formulário de Novo Atendimento

Campos:
- Data do atendimento (default: hoje)
- Categoria (select das `service_categories`)
- Nome do serviço (texto livre ou lista de serviços pré-cadastrados)
- Valor cobrado (R$)
- Forma de pagamento: Dinheiro / Pix / Cartão / Outro
- Observações (opcional)

### 6.5 Relatórios

- Seleção de período (mês/ano ou intervalo customizado)
- Resumo: total de atendimentos, total faturado, média por atendimento
- Breakdown por categoria
- Breakdown por forma de pagamento
- Botão "Exportar CSV"

---

## 7. Segurança

| Risco                            | Mitigação                                                     |
| -------------------------------- | ------------------------------------------------------------- |
| Acesso não autorizado            | RLS no Supabase + AuthGuard no React                          |
| Escalada de privilégio           | role 'admin' definido apenas no painel Supabase               |
| Sessão comprometida              | `signOut` limpa localStorage; sessão expira em 1h (padrão)   |
| Dados sensíveis na URL           | HashRouter — dados nunca vão para query string                |
| Injeção de dados                 | Zod valida todos os campos antes de qualquer query            |
| CNPJ / CPF no banco              | **Proibido.** Nenhum dado pessoal de clientes é armazenado.   |
| Nome de cliente no banco         | **Proibido nesta fase.** Campo "notas" é livre mas orientado. |

---

## 8. Variáveis de ambiente

O cliente Supabase precisará de:

```
VITE_SUPABASE_URL=https://{seu-projeto}.supabase.co
VITE_SUPABASE_ANON_KEY={anon-key-pública}
```

Essas variáveis são **públicas** (prefixo `VITE_`). A segurança real vem do RLS —
a anon key sozinha não acessa nada sem sessão admin autenticada.

O arquivo `.env.local` não deve ser commitado. Adicionar ao `.gitignore` se ainda
não estiver.

---

## 9. Fases de entrega

### Fase A — Base (escopo do Antigravity)

Construir a estrutura visual e de roteamento sem dados reais:

- Estrutura de pastas `src/admin/`
- Supabase client com variáveis de ambiente (mock em testes)
- AuthGuard com lógica de redirect
- Tela de login com formulário validado (Zod) — chamada real ao Supabase
- AdminShell (layout: sidebar + topbar + área de conteúdo)
- DashboardPage com KPIs em zero e layout completo
- TransactionListPage com tabela vazia e filtros
- NewTransactionForm com todos os campos e validação Zod
- ReportPage com seletores de período e área de exportação
- CSS isolado com prefixo `adm-`
- Testes de: renderização, redirecionamento sem sessão, validação de formulário

### Fase B — Dados reais (escopo do Codex após Supabase estar configurado)

- Migrations Supabase (tabelas, RLS, seed de categorias)
- Implementação das queries reais (`supabase.from('transactions').select(...)`)
- Dashboard com dados agregados
- Exportação CSV funcional
- Tratamento de erros de rede

### Fase C — Refinamentos futuros

- Edição e exclusão de atendimentos
- Notificações de metas mensais
- Múltiplos administradores com nomes visíveis no log
- Dashboard de comparação mês a mês

---

## 10. Fora do escopo (todas as fases)

- Processamento de pagamentos (Stripe, PagSeguro, etc.)
- Emissão de nota fiscal
- CPF, CNPJ, nome ou qualquer dado pessoal de clientes
- Integração com bancos ou operadoras de cartão
- Cadastro de administradores via aplicação
- Recuperação de senha via aplicação
- Acesso público ao painel (sem autenticação)
- Relatórios contábeis oficiais

---

## 11. Critérios de aceite da Fase A

- [ ] Rota `/#/admin/login` renderiza formulário de login
- [ ] Rota `/#/admin/dashboard` redireciona para login sem sessão
- [ ] Formulário de login valida email e senha com Zod
- [ ] AdminShell exibe sidebar com navegação entre seções
- [ ] DashboardPage exibe os 3 KPIs e a grade de categorias
- [ ] TransactionListPage exibe tabela com estado vazio orientativo
- [ ] NewTransactionForm valida todos os campos obrigatórios
- [ ] ReportPage exibe seletores de período e botão de exportação
- [ ] Logout redireciona para login
- [ ] Lint, testes e build passam
- [ ] Nenhum arquivo do Hub público foi alterado
