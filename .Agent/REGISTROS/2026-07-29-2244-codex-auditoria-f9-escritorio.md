# Auditoria tecnica independente - Pacote F9 Gestao Escritorio

Data: 2026-07-29 22:44  
Agente: Codex  
Escopo: Pacote F9 - Gestao Escritorio e login unificado  
Projeto Supabase alvo informado: `nnckpyzjllqsdcwlnxei`  
Migration de referencia: `servicos/supabase/migrations/20260728210000_create_office_management_schema.sql`

## Resumo executivo

O modulo nao pode ser tratado como "pronto para producao" com a evidencia desta auditoria.

Motivos principais:

- O projeto Supabase `nnckpyzjllqsdcwlnxei` nao apareceu na lista de projetos acessiveis pelo MCP autenticado atual.
- Chamadas MCP diretas para `list_tables` e `get_advisors` nesse ref retornaram `INVALID_ARGUMENT`.
- Portanto, schema real, RLS efetiva, counts reais, grants reais e advisors reais desse projeto nao foram confirmados nesta rodada.
- A suite completa do Hub falhou: `5 failed | 59 passed (64)` arquivos, `17 failed | 480 passed | 3 skipped (500)` testes.
- `npm.cmd run lint` falhou com 17 erros, todos em arquivos de F9.
- `git diff --check` falhou com muitos trailing whitespace em `OfficeAreaPage.tsx`.
- `npm.cmd run build` passou e gerou bundle `OfficeAreaPage-0nwqnfCr.js`.
- Teste focado de office/admin passou isoladamente: `3 passed`, `8 passed`.
- O working tree nao esta limpo e contem muitas alteracoes pre-existentes, incluindo arquivos de F9, bundle publicado local e remocoes amplas em `Sistemas_Gestao`.

## 1. Confirmacao de existencia do projeto

### Comando/MCP

`mcp__codex_apps__supabase._list_projects`

### Output bruto

```json
{
  "projects": [
    {
      "id": "lxaframzkwmhjiamipsv",
      "ref": "lxaframzkwmhjiamipsv",
      "organization_id": "vkftrrlfjjpunjotllhe",
      "organization_slug": "vkftrrlfjjpunjotllhe",
      "name": "Sistemas de Gestão",
      "region": "sa-east-1",
      "status": "ACTIVE_HEALTHY",
      "database": {
        "host": "db.lxaframzkwmhjiamipsv.supabase.co",
        "version": "17.6.1.141",
        "postgres_engine": "17",
        "release_channel": "ga"
      },
      "created_at": "2026-07-10T18:57:00.576626Z"
    },
    {
      "id": "crdtguvjuyfszxbpnwms",
      "ref": "crdtguvjuyfszxbpnwms",
      "organization_id": "vkftrrlfjjpunjotllhe",
      "organization_slug": "vkftrrlfjjpunjotllhe",
      "name": "Gestão Saúde UBS",
      "region": "us-east-1",
      "status": "ACTIVE_HEALTHY",
      "database": {
        "host": "db.crdtguvjuyfszxbpnwms.supabase.co",
        "version": "17.6.1.127",
        "postgres_engine": "17",
        "release_channel": "ga"
      },
      "created_at": "2026-06-11T13:18:38.521568Z"
    }
  ]
}
```

### Conclusao

Achado critico: o projeto `nnckpyzjllqsdcwlnxei` nao foi listado como acessivel pela sessao MCP atual. Nao e possivel confirmar que ele existe e esta ACTIVE pela conta autenticada nesta rodada.

Isso nao prova que o projeto foi apagado; prova que a equipe/agente autenticado nesta sessao nao conseguiu inspeciona-lo. A afirmacao "schema validado contra o projeto nnckpyzjllqsdcwlnxei" fica sem evidencia remota atual.

## 2. Schema real vs migration

### Comando/MCP

`mcp__codex_apps__supabase._list_tables` com `project_id = nnckpyzjllqsdcwlnxei`, `schemas = ["public","private"]`, `verbose = true`.

### Output bruto

```json
{"error_code":"INVALID_ARGUMENT"}
```

### Evidencia local da migration

Arquivo lido: `servicos/supabase/migrations/20260728210000_create_office_management_schema.sql`

Trechos brutos relevantes:

```sql
create or replace function private.is_staff(uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = uid and p.role in ('admin', 'recepcao')
  );
end;
$$;

alter table public.profiles add column if not exists areas text[] not null default '{}';

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  document text,
  address text,
  notes text,
  origin text not null default 'escritorio' check (origin in ('escritorio', 'digital')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  text text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

create table public.office_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text,
  active boolean not null default true
);

create table public.office_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null,
  quantity integer,
  description text not null,
  category_id uuid references public.office_categories(id),
  client_id uuid references public.clients(id),
  tags text[] not null default '{}',
  transaction_date date not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'pix', 'other')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.office_service_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_price numeric(12,2) not null,
  active boolean not null default true
);

create table public.office_service_records (
  id uuid primary key default gen_random_uuid(),
  service_item_id uuid references public.office_service_items(id),
  name text not null,
  quantity integer not null default 1,
  client_id uuid references public.clients(id),
  record_date date not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.office_cash_closings (
  id uuid primary key default gen_random_uuid(),
  closing_date date not null unique,
  total_income numeric(12,2) not null,
  total_expense numeric(12,2) not null,
  balance numeric(12,2) not null,
  notes text,
  closed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

### Conclusao

As 7 tabelas estao descritas na migration local. Nao foi possivel comparar uma a uma contra o banco real porque `list_tables` no projeto alvo falhou.

## 3. RLS efetiva

### Comando/MCP para listar policies reais

Nao executado com sucesso porque o projeto alvo nao esta acessivel pelo MCP atual.

### Output bruto de tentativa remota relacionada

```json
{"error_code":"INVALID_ARGUMENT"}
```

### Evidencia local da migration

```sql
alter table public.clients enable row level security;
create policy "clients_staff_all" on public.clients for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.client_tasks enable row level security;
create policy "client_tasks_staff_all" on public.client_tasks for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_categories enable row level security;
create policy "office_categories_staff_all" on public.office_categories for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_transactions enable row level security;
create policy "office_transactions_staff_all" on public.office_transactions for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_service_items enable row level security;
create policy "office_service_items_staff_all" on public.office_service_items for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_service_records enable row level security;
create policy "office_service_records_staff_all" on public.office_service_records for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_cash_closings enable row level security;
create policy "office_cash_closings_staff_all" on public.office_cash_closings for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));
```

### Cenarios de RLS solicitados

Nao reexecutados no banco real porque o projeto alvo nao esta acessivel pelo MCP atual. Qualquer afirmacao de que "staff insere/le", "cliente comum bloqueado" e "anonimo bloqueado" continuam validos seria especulativa nesta rodada.

## 4. Dados reais

### Query solicitada

`select count(*)` nas 7 tabelas.

### Output bruto

Nao houve output bruto de dados porque o projeto alvo nao esta acessivel pelo MCP atual.

### Conclusao

Nao foi possivel confirmar se as tabelas estao zeradas, se possuem dados reais, ou se contem dados ficticios usados em validacao.

Este e o ponto mais importante do pedido: sem counts reais, a afirmacao "pronto para producao" nao se sustenta. No maximo, o repositorio local mostra codigo e migration para receber dados, mas nao prova importacao real do Plena Cash Control.

## 5. Grants

### Query solicitada

`information_schema.role_table_grants` para as 7 tabelas.

### Output bruto

Nao houve output bruto de grants porque o projeto alvo nao esta acessivel pelo MCP atual.

### Evidencia local da migration

```sql
revoke all on
  public.clients, public.client_tasks, public.office_categories,
  public.office_transactions, public.office_service_items,
  public.office_service_records, public.office_cash_closings
  from anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.clients, public.client_tasks, public.office_categories,
  public.office_transactions, public.office_service_items,
  public.office_service_records, public.office_cash_closings
  to authenticated;
```

### Conclusao

A migration local expressa `anon` sem privilegios e `authenticated` com `select, insert, update, delete`. O banco real nao foi confirmado.

## 6. Advisors

### Comandos/MCP

`mcp__codex_apps__supabase._get_advisors` security e performance para `nnckpyzjllqsdcwlnxei`.

### Output bruto

Security:

```json
{"error_code":"INVALID_ARGUMENT"}
```

Performance:

```json
{"error_code":"INVALID_ARGUMENT"}
```

### Evidencia local de tentativa de correcao posterior

Arquivo: `servicos/supabase/migrations/20260728214000_link_proposals_clients_and_harden_advisors.sql`

```sql
-- Indices para chaves estrangeiras apontadas pelos performance advisors.
create index if not exists idx_audit_events_actor_user_id
  on public.audit_events (actor_user_id);

create index if not exists idx_clients_created_by
  on public.clients (created_by);

create index if not exists idx_office_cash_closings_closed_by
  on public.office_cash_closings (closed_by);

create index if not exists idx_office_service_records_client_id
  on public.office_service_records (client_id);

create index if not exists idx_office_service_records_created_by
  on public.office_service_records (created_by);

create index if not exists idx_office_service_records_service_item_id
  on public.office_service_records (service_item_id);

create index if not exists idx_office_transactions_client_id
  on public.office_transactions (client_id);

create index if not exists idx_office_transactions_created_by
  on public.office_transactions (created_by);

-- A funcao segue disponivel para o event trigger interno ensure_rls,
-- mas deixa de ser chamavel via RPC por anon/authenticated.
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
```

### Conclusao

Nao foi possivel comparar os 3 avisos de seguranca e 18 de performance do registro de 28/07 contra o estado real atual. Localmente existe uma migration posterior tentando corrigir FKs sem indice e `rls_auto_enable()`, mas nao ha evidencia remota atual de aplicacao.

Leaked password protection tambem nao foi confirmado porque advisors nao retornaram dados.

## 7. Suite de testes completa

### Comando

`npm.cmd run test` em `servicos/hub`.

### Output bruto principal

```text
> plena-digital-hub@0.1.0 test
> vitest run

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 ❯ src/features/tools/mei-das-guide/domain/das-values.test.ts (38 tests | 7 failed) 283ms
     × freight: sempre inclui INSS 33ms
     × commerce: sourceUrl aponta para Receita Federal 37ms
     × services: sourceUrl aponta para Receita Federal 16ms
     × both: sourceUrl aponta para Receita Federal 15ms
     × transport: sourceUrl aponta para Receita Federal 11ms
     × freight: sourceUrl aponta para Receita Federal 12ms
     × freight: inclui ISS, nao inclui ICMS, e INSS e 194.52 1ms
 ❯ src/admin/auth/AdminApp.test.tsx (4 tests | 2 failed) 6975ms
     × exibe o portal de escritorio para usuario autorizado 1618ms
     × clicar em "Sair" executa logout e redireciona para o login do portal 3684ms
 ❯ src/app/institutional-integration.test.tsx (13 tests | 6 failed | 3 skipped) 3701ms
     × mantem navegacao, retorno ao catalogo e rodape na pagina dedicada 2614ms
     × abre o Criador de Curriculo no shell institucional 222ms
     × abre o Unificador de PDFs no shell institucional 192ms
     × abre o Gerador de Declaracoes no shell institucional 241ms
     × abre o Checklist MEI e IRPF no shell institucional 170ms
     × aplica o layout compartilhado a uma ferramenta em construcao 148ms
 ❯ src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx (19 tests | 1 failed) 17053ms
     × selecionar "Transporte autônomo de cargas" exibe aviso e valores corretos 458ms
 ❯ src/features/tools/label-generator/domain/create-labels-pdf.test.ts (16 tests | 1 failed) 7752ms
     × retorna Uint8Array nao vazio para uma etiqueta 6141ms

 Test Files  5 failed | 59 passed (64)
      Tests  17 failed | 480 passed | 3 skipped (500)
   Start at  22:41:29
   Duration  118.75s (transform 34.78s, setup 132.41s, import 185.93s, tests 194.80s, environment 720.91s)
```

### Falhas conhecidas de mei-das-guide

Confirmadas como ainda existentes:

```text
AssertionError: expected 81.05 to be close to 194.52, received difference is 113.47000000000001
Expected: "receita.fazenda.gov.br"
Received: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/perguntas-frequentes/pagamento-da-contribuicao-mensal-carne-mensal/qual-o-valor-das-contribuicoes"
AssertionError: expected 1 to be 2
- Expected
+ Received
- 2
+ 1
```

### Observacao sobre F9

O relatorio anterior que citou apenas 4 testes/2 arquivos foi um recorte parcial, nao a suite completa. A suite completa esta vermelha.

### Teste focado executado adicionalmente

Comando:

`npm.cmd run test -- src/features/office src/admin/auth/AdminApp.test.tsx`

Output bruto:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/features/office src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 Test Files  3 passed (3)
      Tests  8 passed (8)
   Start at  22:43:41
   Duration  7.63s (transform 971ms, setup 1.53s, import 3.84s, tests 1.68s, environment 10.42s)
```

Conclusao: o recorte focado passa isolado, mas isso nao substitui a suite completa.

## 8. Lint e build

### Lint

Comando: `npm.cmd run lint`

Output bruto:

```text
> plena-digital-hub@0.1.0 lint
> eslint .

C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\hub\src\features\office\ui\OfficeAreaPage.tsx
     5:83  error  'AlertCircle' is defined but never used          @typescript-eslint/no-unused-vars
   104:64  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   297:40  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   318:40  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   378:54  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   379:56  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   411:34  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   451:47  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   509:9   error  'summary' is assigned a value but never used     @typescript-eslint/no-unused-vars
   543:18  error  'submitClient' is defined but never used         @typescript-eslint/no-unused-vars
   571:18  error  'submitServiceItem' is defined but never used    @typescript-eslint/no-unused-vars
   585:18  error  'submitServiceRecord' is defined but never used  @typescript-eslint/no-unused-vars
   599:18  error  'submitClosing' is defined but never used        @typescript-eslint/no-unused-vars
   613:18  error  'submitTask' is defined but never used           @typescript-eslint/no-unused-vars
  1068:42  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any

C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\hub\src\features\office\ui\components\Dashboard.tsx
  201:40  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  238:42  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 17 problems (17 errors, 0 warnings)
```

Conclusao: lint falha diretamente em F9. Isso contradiz qualquer status de pronto para producao.

### Build

Comando: `npm.cmd run build`

Output bruto:

```text
> plena-digital-hub@0.1.0 build
> tsc -b && vite build

vite v8.0.16 building client environment for production...
transforming...✓ 2679 modules transformed.
rendering chunks...
computing gzip size...
../hub-app/index.html                                     0.91 kB │ gzip:   0.48 kB
../hub-app/assets/LiberationSans-Bold-D7ZE4CAh.ttf      137.05 kB
../hub-app/assets/LiberationSans-Regular-BMLF__tr.ttf   139.51 kB
../hub-app/assets/logo-plena-ZEPN7Did.png               330.59 kB
../hub-app/assets/MergePdfTool-CUlq_Ohr.css               2.53 kB │ gzip:   0.79 kB
../hub-app/assets/proposals-DQXe8PUD.css                  2.90 kB │ gzip:   0.97 kB
../hub-app/assets/ImagesToPdfTool-C3Qx_0pE.css            2.93 kB │ gzip:   0.86 kB
../hub-app/assets/LabelGeneratorTool-DrPNKHHB.css         4.33 kB │ gzip:   1.34 kB
../hub-app/assets/BusinessCardCreatorTool-DHu5URTi.css    4.75 kB │ gzip:   1.42 kB
../hub-app/assets/MenuBuilderTool-D0Bx0ywr.css            5.43 kB │ gzip:   1.57 kB
../hub-app/assets/DeclarationBuilderTool-CFBqTC19.css     5.44 kB │ gzip:   1.50 kB
../hub-app/assets/MeiDasGuideTool-HYVUoltl.css            5.65 kB │ gzip:   1.44 kB
../hub-app/assets/PrintCostEstimatorTool-ZN9Cp0pq.css     5.66 kB │ gzip:   1.45 kB
../hub-app/assets/MeiIrpfChecklistTool-DZsNthLL.css       6.81 kB │ gzip:   1.73 kB
../hub-app/assets/ResumeBuilderTool-CTJ5pcju.css         10.66 kB │ gzip:   2.62 kB
../hub-app/assets/index-jwDQjZXM.css                     62.51 kB │ gzip:  12.87 kB
../hub-app/assets/chunk-QTnfLwEv.js                       0.69 kB │ gzip:   0.42 kB
../hub-app/assets/use-local-storage-C3vDw7zi.js           0.75 kB │ gzip:   0.42 kB
../hub-app/assets/proposals-Csju0YuL.js                   3.79 kB │ gzip:   1.49 kB
../hub-app/assets/ClientProposalPage-DnhSVO68.js          4.11 kB │ gzip:   1.47 kB
../hub-app/assets/ImagesToPdfTool-C0KdSmzU.js             5.36 kB │ gzip:   2.24 kB
../hub-app/assets/MergePdfTool-DugmPen4.js                5.39 kB │ gzip:   2.16 kB
../hub-app/assets/AdminProposalsPage-B0fAH8M7.js          5.67 kB │ gzip:   1.60 kB
../hub-app/assets/LabelGeneratorTool-CDn86eqx.js          5.85 kB │ gzip:   2.60 kB
../hub-app/assets/MeiDasGuideTool-DaJ7o6Zo.js             9.67 kB │ gzip:   3.65 kB
../hub-app/assets/BusinessCardCreatorTool-CV8uIRSr.js    10.86 kB │ gzip:   3.68 kB
../hub-app/assets/PrintCostEstimatorTool-D8G8CVLE.js     11.18 kB │ gzip:   3.41 kB
../hub-app/assets/MenuBuilderTool-DRuL4oYE.js            11.92 kB │ gzip:   4.00 kB
../hub-app/assets/MeiIrpfChecklistTool-BCnQfN0r.js       28.34 kB │ gzip:   7.69 kB
../hub-app/assets/ResumeBuilderTool-E4mm64S-.js          31.02 kB │ gzip:   8.11 kB
../hub-app/assets/DeclarationBuilderTool-C3pIq2XP.js     31.21 kB │ gzip:   9.02 kB
../hub-app/assets/QrCodeTool-B9kTNtrj.js                 34.95 kB │ gzip:  12.66 kB
../hub-app/assets/es-D9b0asL_.js                        424.96 kB │ gzip: 177.42 kB
../hub-app/assets/OfficeAreaPage-0nwqnfCr.js            466.85 kB │ gzip: 125.64 kB
../hub-app/assets/index-CVhFtCmV.js                     531.93 kB │ gzip: 152.15 kB

✓ built in 1.72s
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

Conclusao: build passa, com warning de chunk acima de 500 kB. O bundle local contem `OfficeAreaPage-0nwqnfCr.js`.

## 9. Tabela office_cash_closings

### Busca local

Comando: `rg -n "office_cash_closings|createOfficeCashClosing|Fechamento|closing" servicos/hub/src/features/office`

Output bruto:

```text
servicos/hub/src/features/office\services\office-service.ts:18:export type OfficeCashClosing = Tables<'office_cash_closings'>
servicos/hub/src/features/office\services\office-service.ts:86:    supabase.from('office_cash_closings').select('*').order('closing_date', { ascending: false }),
servicos/hub/src/features/office\services\office-service.ts:222:export async function createOfficeCashClosing(input: OfficeCashClosingInput) {
servicos/hub/src/features/office\services\office-service.ts:226:    .from('office_cash_closings')
servicos/hub/src/features/office\services\office-service.ts:228:      closing_date: input.closingDate,
servicos/hub/src/features/office\ui\OfficeAreaPage.test.tsx:16:  createOfficeCashClosing: vi.fn(),
servicos/hub/src/features/office\ui\OfficeAreaPage.tsx:26:  createOfficeCashClosing,
servicos/hub/src/features/office\ui\OfficeAreaPage.tsx:52:export type OfficeTab = 'dashboard' | 'transactions' | 'clients' | 'services' | 'closing' | 'settings' | 'import'
servicos/hub/src/features/office\ui\OfficeAreaPage.tsx:607:    await createOfficeCashClosing(parsed.data)
servicos/hub/src/features/office\ui\OfficeAreaPage.tsx:609:    showSuccess('Fechamento registrado.')
```

### Testes existentes

Trecho bruto de `office-service.test.ts`:

```ts
describe('office-service', () => {
  it('importa JSON do Cash Control sem acessar banco real', async () => {
    // ...
    expect(from).toHaveBeenCalledWith('clients')
    expect(from).toHaveBeenCalledWith('office_transactions')
    expect(from).toHaveBeenCalledWith('office_service_items')
    expect(from).toHaveBeenCalledWith('office_service_records')
    expect(insert).toHaveBeenCalledTimes(4)
  })

  it('salva transacao no schema novo do escritorio', async () => {
    // ...
    expect(from).toHaveBeenCalledWith('office_transactions')
  })
})
```

Trecho bruto de `OfficeAreaPage.test.tsx`:

```ts
const officeServiceMocks = vi.hoisted(() => ({
  listOfficeData: vi.fn(),
  createOfficeClient: vi.fn(),
  createClientTask: vi.fn(),
  toggleClientTask: vi.fn(),
  createOfficeCategory: vi.fn(),
  createOfficeTransaction: vi.fn(),
  deleteOfficeTransaction: vi.fn(),
  createOfficeServiceItem: vi.fn(),
  createOfficeServiceRecord: vi.fn(),
  createOfficeCashClosing: vi.fn(),
  importCashControlJson: vi.fn(),
}))

describe('OfficeAreaPage', () => {
  it('renderiza dashboard com dados do escritorio', async () => { ... })
  it('salva cliente usando o servico mockado', async () => { ... })
})
```

### Conclusao

Existe codigo usando `office_cash_closings` em `listOfficeData()` e `createOfficeCashClosing()`. Nao encontrei teste cobrindo gravacao de fechamento de caixa em `office_cash_closings`. O mock existe, mas nenhum teste afirma que `createOfficeCashClosing` foi chamado no fluxo de fechamento, e `office-service.test.ts` nao cobre insert nessa tabela. Lacuna de cobertura confirmada.

## 10. Status de deploy e Git

### Build/bundle local

O build local gerou `../hub-app/assets/OfficeAreaPage-0nwqnfCr.js`. Isso prova geracao local, nao publish em dominio de producao.

Nao encontrei evidencia local suficiente de publish real no dominio de producao nesta rodada. A pasta `servicos/hub-app` tem alteracoes/untracked de build local.

### Git fetch

Comando: `git fetch origin`

Output bruto:

```text
From https://github.com/reinaldogramachof-hash/Plena-Informatica
   f036378..7f8ddfc  main       -> origin/main
```

### Branch

Comando: `git branch --show-current`

Output bruto:

```text
main
```

Comando: `git log --oneline --decorate -12`

Output bruto:

```text
7f8ddfc (HEAD -> main) feat: substituicao de logo por SVG, troca de hero por imagem estatica, depoimentos reais do Google e lapidacao de secoes da Home
f036378 (origin/main, origin/HEAD) Atualiza bundle publicado do Hub com icones e navegacao agrupada
f9c270e Aproxima AdminShell do modelo visual Plena Cash Control
682e45e Corrige caminho de publicacao do Hub e fecha rota orfa /catalogo
a560cb1 Implementa gestao escritorio e portais administrativos
fb597f8 Implementa propostas comerciais no Hub
77ef2d6 refactor: remocao completa do segmento de personalizados, integracao do video na hero e atualizacao do build de producao
6caafa9 feat: reconstrói visual da página tecnologia
d142631 refactor: lapida landings de gestão
940eddf fix: restaura abertura da demo Gestão Gastro
b9fc6d9 feat: aprimora demo e FAQ do Gestão Gastro
f111849 feat: aprimora páginas e demos de gestão
```

Observacao: antes do `fetch`, `origin/main` aparecia em `f036378`; apos o fetch, `origin/main` avancou para `7f8ddfc`.

Comando: `git branch -r --contains a560cb1`

Output bruto:

```text
  origin/HEAD -> origin/main
  origin/main
```

Comando: `git branch -r --contains f9c270e`

Output bruto:

```text
  origin/HEAD -> origin/main
  origin/main
```

Comando: `git branch -r --contains f036378`

Output bruto:

```text
  origin/HEAD -> origin/main
  origin/main
```

Comando: `git log --oneline origin/main..HEAD`

Output bruto:

```text

```

Conclusao: os commits `a560cb1`, `f9c270e` e `f036378` estao contidos em `origin/main`. A branch local nao esta a frente de `origin/main` apos fetch.

### Working tree

Comando: `git status --short`

Output bruto resumido:

```text
 D Sistemas_Gestão/_design-system.md
 D Sistemas_Gestão/_device-classification.md
 D Sistemas_Gestão/gestao-alugueis/assets/css/styles.css
 ...
 D hero.mp4
 D logo-plena.png
 D servicos/hub-app/assets/index-DSj2oNcD.js
 D servicos/hub-app/assets/index-KILtb9Kn.css
 M servicos/hub-app/index.html
 M servicos/hub/index.html
 M servicos/hub/package-lock.json
 M servicos/hub/package.json
 M servicos/hub/src/App.tsx
 M servicos/hub/src/features/office/services/office-service.ts
 M servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx
 M servicos/hub/src/features/office/ui/OfficeAreaPage.tsx
 M servicos/hub/src/styles/app.css
?? graphify-out/
?? servicos/hub-app/assets/AdminProposalsPage-B0fAH8M7.js
?? servicos/hub-app/assets/BusinessCardCreatorTool-CV8uIRSr.js
...
?? servicos/hub-app/assets/OfficeAreaPage-0nwqnfCr.js
...
?? servicos/hub/postcss.config.js
?? servicos/hub/src/features/office/ui/components/
?? servicos/hub/src/features/office/ui/utils.ts
?? servicos/hub/tailwind.config.js
```

Conclusao: working tree nao esta limpo. Ha alteracoes amplas pre-existentes e arquivos de build/untracked. Nao atribui estas alteracoes a esta auditoria, exceto este novo registro.

## 11. Risco de fonte dupla de dados

### Busca local focada

Comando: `rg -n "Plena Cash Control|Controle de Caixa|localStorage|standalone|fonte de verdade|descontinu" AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md docs servicos/ROADMAP.md servicos/docs servicos/hub/src/features/office`

Output bruto:

```text
servicos/ROADMAP.md:11:Este documento é a fonte de verdade para:
servicos/ROADMAP.md:572:- o app legado Plena Cash Control continua como fonte de backup JSON para uma
AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md:81:`TABELA-DE-PRECOS-E-FERRAMENTAS.md` é a fonte de verdade dos preços do negócio 1, mas
AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md:160:  status (ativo | em_desenvolvimento | descontinuado), description, demo_url
AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md:218:Um quinto sistema paralelo foi identificado: "Plena Cash Control", app React/Vite
AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md:219:standalone (Google AI Studio + Gemini), usado hoje pela colaboradora do
AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md:238:  manual pelo responsável fica descontinuado por decisão explícita, após
servicos/docs\DESIGN-REFERENCE-PLENA-CASH-CONTROL.md:1:# Referência visual — Plena Cash Control (sistema modelo)
servicos/docs\DESIGN-REFERENCE-PLENA-CASH-CONTROL.md:3:_Capturado em 29/07/2026 a partir de prints reais do app standalone
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:1:# Integração do Controle de Caixa ao Painel Administrativo
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:53:- persistência integral em `localStorage`;
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:60:2. Transações, clientes e CPF/CNPJ armazenados em `localStorage`.
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:69:11. `localStorage.clear()` remove dados sem segmentação.
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:89:- persistência em `localStorage`;
docs\superpowers\specs\2026-06-11-admin-cash-control-integration-design.md:455:- nenhuma dependência de `localStorage`;
```

### Conclusao

Ha evidencia documental de que o standalone Plena Cash Control existia/era usado e que o ROADMAP trata o legado como "fonte de backup JSON para uma importacao unica". Nao ha, nesta auditoria, evidencia operacional de que a importacao unica ja foi executada no Supabase real, nem evidencia formal de descontinuacao ja realizada.

Risco: se o app standalone continuar sendo usado em paralelo enquanto o Hub recebe ou tenta receber dados, havera fonte dupla de verdade. A fonte oficial precisa ser decidida e registrada operacionalmente antes de producao.

## Verificacao adicional: git diff --check

Comando: `git diff --check`

Output bruto inicial:

```text
servicos/hub/src/features/office/ui/OfficeAreaPage.tsx:2: trailing whitespace.
+import {
servicos/hub/src/features/office/ui/OfficeAreaPage.tsx:3: trailing whitespace.
+  Briefcase, CheckCircle, Plus, Minus, Search, Settings2, Trash2, Edit2, X, Printer,
servicos/hub/src/features/office/ui/OfficeAreaPage.tsx:4: trailing whitespace.
+  FileText, User, Mail, Phone, MapPin, StickyNote, CheckSquare, Check, Folder, Calendar,
...
servicos/hub/src/features/office/ui/OfficeAreaPage.tsx:1805: trailing whitespace.
+                <button
```

Conclusao: ha falha de whitespace em `OfficeAreaPage.tsx`, arquivo central do F9. Isso tambem contradiz prontidao de entrega.

## Discrepancias vs relatorio Antigravity

### Bateu com evidencia local

- Existe migration local para as 7 tabelas do F9.
- Existe codigo local para Gestao Escritorio.
- Existe uso de `office_cash_closings` em `createOfficeCashClosing()` e `listOfficeData()`.
- O build local passa e gera bundle com `OfficeAreaPage-0nwqnfCr.js`.
- Commits `a560cb1`, `f9c270e` e `f036378` estao no remoto `origin/main`.

### Nao bateu

- "Pronto para producao" nao bate com a evidencia atual: projeto Supabase alvo nao acessivel, suite completa falhando, lint falhando em F9, `git diff --check` falhando em F9 e working tree sujo.
- Se o relatorio anterior afirmou validacao atual do schema real em `nnckpyzjllqsdcwlnxei`, essa afirmacao nao foi confirmada nesta auditoria.
- Se afirmou RLS efetiva atual, counts reais, grants reais e advisors atuais, isso ficou sem confirmacao remota nesta auditoria.
- Se tratou apenas os 4 testes de 2 arquivos como evidencia suficiente, isso foi um recorte parcial. A suite completa falhou com 17 testes.

### Ficou sem evidencia

- Existencia/ACTIVE do projeto `nnckpyzjllqsdcwlnxei` na organizacao acessivel pela equipe atual.
- Colunas, FKs e RLS reais linha a linha contra a migration.
- Policies reais atualmente instaladas.
- 4 cenarios de RLS reexecutados em transacao revertida.
- Counts reais das 7 tabelas.
- Se o importador `importCashControlJson` ja foi executado com dados reais.
- Grants reais de `anon` e `authenticated`.
- Advisors security/performance atuais.
- Publicacao real do bundle em dominio de producao.
- Descontinuacao operacional do Plena Cash Control standalone.

## Status final

Auditoria aplicada com registro local criado. Nenhuma correcao de codigo, schema ou build foi aplicada nesta rodada.

Status tecnico do Pacote F9 nesta evidencia: **nao aprovado para producao**.

## Adendo 2026-07-29 22:55 - Reautenticacao Supabase autorizada

O responsavel solicitou nova conexao ao MCP Supabase e autorizou o OAuth.

### Configuracao e login

Comando executado:

```powershell
codex mcp add supabase --url "https://mcp.supabase.com/mcp?project_ref=nnckpyzjllqsdcwlnxei&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
```

Output bruto:

```text
Added global MCP server 'supabase'.
```

Comando executado:

```powershell
codex mcp login supabase
```

Output bruto:

```text
Authorize `supabase` by opening this URL in your browser:
https://api.supabase.com/v1/oauth/authorize?response_type=code&client_id=18d25537-5d25-4fa3-a625-195f31f3b0e2&state=Q1LDQPUx9qDZrARC5oVgqw&code_challenge=D4ztACxMxSuOrFiQFix-D8s_YHy1BO7SwWeFp2ASM8o&code_challenge_method=S256&redirect_uri=http%3A%2F%2F127.0.0.1%3A56704%2Fcallback%2F5kaxQjsmbRMQ&scope=organizations%3Aread+projects%3Aread+projects%3Awrite+database%3Awrite+database%3Aread+analytics%3Aread+secrets%3Aread+edge_functions%3Aread+edge_functions%3Awrite+environment%3Aread+environment%3Awrite+storage%3Aread&resource=https%3A%2F%2Fmcp.supabase.com%2Fmcp%3Fproject_ref%3Dnnckpyzjllqsdcwlnxei%26features%3Ddocs%252Caccount%252Cdatabase%252Cdebugging%252Cdevelopment%252Cfunctions%252Cbranching
Successfully logged in to MCP server 'supabase'.
```

Comando executado:

```powershell
codex mcp get supabase
```

Output bruto:

```text
supabase
  enabled: true
  transport: streamable_http
  url: https://mcp.supabase.com/mcp?project_ref=nnckpyzjllqsdcwlnxei&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching
  bearer_token_env_var: -
  http_headers: -
  env_http_headers: -
  remove: codex mcp remove supabase
```

### Observacao sobre a sessao atual

As ferramentas `mcp__codex_apps__supabase` ja carregadas nesta conversa continuaram listando apenas `lxaframzkwmhjiamipsv` e `crdtguvjuyfszxbpnwms`, e continuaram retornando `INVALID_ARGUMENT` para `nnckpyzjllqsdcwlnxei`.

Para carregar o MCP recem-configurado, foi usada uma sessao nova e efemera de `codex exec --ephemeral -s read-only`. Nessa sessao, o servidor exposto foi `mcp__supabase`, preso ao projeto da URL. Ele nao retornou `project_ref` nas respostas e nao expôs `list_projects`, `get_project` ou `execute_sql`; expôs `list_tables`, `list_edge_functions` e `get_advisors`.

### Evidencia nova - list_tables

Output bruto da sessao efemera:

```json
{
  "server": "mcp__supabase",
  "project_ref": "not returned by mcp__supabase.list_tables/get_advisors",
  "list_tables": {
    "input": { "schemas": ["public", "private"], "verbose": true },
    "private_schema_tables_returned": [],
    "exact_columns_pks_fks_returned": true,
    "tables": [
      {
        "name": "public.profiles",
        "rls_enabled": true,
        "rows": 4,
        "columns": [
          ["id", "uuid"],
          ["email", "text"],
          ["display_name", "text"],
          ["role", "text", "default 'cliente'::text", "check role = ANY (ARRAY['admin','recepcao','cliente'])"],
          ["created_at", "timestamp with time zone", "default now()"],
          ["updated_at", "timestamp with time zone", "default now()"],
          ["areas", "ARRAY", "default '{}'::text[]"]
        ],
        "primary_keys": ["id"],
        "foreign_key_constraints": [
          ["clients_created_by_fkey", "public.clients.created_by", "public.profiles.id"],
          ["profiles_id_fkey", "public.profiles.id", "auth.users.id"],
          ["proposals_created_by_fkey", "public.proposals.created_by", "public.profiles.id"],
          ["office_transactions_created_by_fkey", "public.office_transactions.created_by", "public.profiles.id"],
          ["office_service_records_created_by_fkey", "public.office_service_records.created_by", "public.profiles.id"],
          ["office_cash_closings_closed_by_fkey", "public.office_cash_closings.closed_by", "public.profiles.id"]
        ]
      },
      {
        "name": "public.proposals",
        "rls_enabled": true,
        "rows": 2,
        "columns": [
          ["id", "uuid"], ["client_name", "text"], ["client_email", "text"],
          ["client_user_id", "uuid"], ["title", "text"], ["scope_included", "jsonb"],
          ["scope_excluded", "jsonb"], ["tech_stack", "jsonb"], ["investment_amount", "numeric"],
          ["currency", "text"], ["estimated_timeline", "text"], ["status", "text"],
          ["version", "integer"], ["valid_until", "date"], ["created_by", "uuid"],
          ["created_at", "timestamp with time zone"], ["updated_at", "timestamp with time zone"],
          ["sent_at", "timestamp with time zone"], ["accepted_at", "timestamp with time zone"],
          ["client_id", "uuid"]
        ],
        "primary_keys": ["id"],
        "foreign_key_constraints": [
          ["proposals_client_user_id_fkey", "public.proposals.client_user_id", "auth.users.id"],
          ["proposals_created_by_fkey", "public.proposals.created_by", "public.profiles.id"],
          ["proposals_client_id_fkey", "public.proposals.client_id", "public.clients.id"]
        ]
      },
      {
        "name": "public.office_categories",
        "rows": 0,
        "primary_keys": ["id"],
        "foreign_key_constraints": [["office_transactions_category_id_fkey", "public.office_transactions.category_id", "public.office_categories.id"]]
      },
      {
        "name": "public.office_transactions",
        "rows": 0,
        "primary_keys": ["id"],
        "foreign_key_constraints": [
          ["office_transactions_client_id_fkey", "public.office_transactions.client_id", "public.clients.id"],
          ["office_transactions_category_id_fkey", "public.office_transactions.category_id", "public.office_categories.id"],
          ["office_transactions_created_by_fkey", "public.office_transactions.created_by", "public.profiles.id"]
        ]
      },
      {
        "name": "public.office_service_items",
        "rows": 1,
        "primary_keys": ["id"],
        "foreign_key_constraints": [["office_service_records_service_item_id_fkey", "public.office_service_records.service_item_id", "public.office_service_items.id"]]
      },
      {
        "name": "public.office_service_records",
        "rows": 1,
        "primary_keys": ["id"],
        "foreign_key_constraints": [
          ["office_service_records_created_by_fkey", "public.office_service_records.created_by", "public.profiles.id"],
          ["office_service_records_service_item_id_fkey", "public.office_service_records.service_item_id", "public.office_service_items.id"],
          ["office_service_records_client_id_fkey", "public.office_service_records.client_id", "public.clients.id"]
        ]
      },
      {
        "name": "public.office_cash_closings",
        "rows": 0,
        "primary_keys": ["id"],
        "foreign_key_constraints": [["office_cash_closings_closed_by_fkey", "public.office_cash_closings.closed_by", "public.profiles.id"]]
      }
    ]
  }
}
```

Uma chamada anterior, tambem na sessao efemera, retornou ainda:

```text
list_tables schemas=["public"] verbose=true
OK
tables:
- public.profiles rows=4 rls_enabled=true
- public.proposals rows=2 rls_enabled=true
- public.consent_records rows=2 rls_enabled=true
- public.audit_events rows=2 rls_enabled=true
- public.clients rows=1 rls_enabled=true
- public.client_tasks rows=1 rls_enabled=true
- public.office_categories rows=0 rls_enabled=true
- public.office_transactions rows=0 rls_enabled=true
- public.office_service_items rows=1 rls_enabled=true
- public.office_service_records rows=1 rls_enabled=true
- public.office_cash_closings rows=0 rls_enabled=true

list_tables schemas=["private"] verbose=true
OK
{"tables":[]}
```

### Evidencia nova - advisors

Output bruto da sessao efemera:

```json
{
  "get_advisors_security": [
    {
      "name": "auth_leaked_password_protection",
      "title": "Leaked Password Protection Disabled",
      "level": "WARN",
      "facing": "EXTERNAL",
      "categories": ["SECURITY"],
      "detail": "Leaked password protection is currently disabled.",
      "remediation": "https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection"
    }
  ],
  "get_advisors_performance": [
    "unused_index public.profiles idx_profiles_role",
    "unused_index public.consent_records idx_consent_records_user_id",
    "unused_index public.proposals idx_proposals_client_user_id",
    "unused_index public.clients idx_clients_document",
    "unused_index public.client_tasks idx_client_tasks_client_id",
    "unused_index public.office_transactions idx_office_transactions_date",
    "unused_index public.office_transactions idx_office_transactions_category",
    "unused_index public.office_service_records idx_office_service_records_date",
    "unused_index public.audit_events idx_audit_events_actor_user_id",
    "unused_index public.clients idx_clients_created_by",
    "unused_index public.office_cash_closings idx_office_cash_closings_closed_by",
    "unused_index public.office_service_records idx_office_service_records_client_id",
    "unused_index public.office_service_records idx_office_service_records_created_by",
    "unused_index public.office_service_records idx_office_service_records_service_item_id",
    "unused_index public.office_transactions idx_office_transactions_client_id",
    "unused_index public.office_transactions idx_office_transactions_created_by",
    "unused_index public.proposals idx_proposals_client_id",
    "unused_index public.proposals idx_proposals_created_by"
  ]
}
```

### Revisao do achado apos reautenticacao

O achado anterior "projeto alvo nao acessivel" fica parcialmente superado para `list_tables` e `get_advisors`, porque o servidor `mcp__supabase` configurado com `project_ref=nnckpyzjllqsdcwlnxei` respondeu com tabelas F9 e advisors.

Continuam sem evidencia nesta rodada:

- confirmacao direta por `list_projects`/`get_project` de que o ref selecionado e exatamente `nnckpyzjllqsdcwlnxei`, pois o servidor preso ao projeto nao expoe essas ferramentas;
- `execute_sql`, portanto nao foi possivel consultar policies reais, grants reais, funcoes reais ou rodar cenarios RLS em transacao revertida;
- conteudo dos registros para saber se as linhas existentes sao dados reais de producao ou dados de teste.

O ponto "dados reais" muda de "nao confirmado" para "ha linhas em algumas tabelas, mas a natureza dos dados segue nao confirmada":

- `clients`: 1 linha;
- `client_tasks`: 1 linha;
- `office_service_items`: 1 linha;
- `office_service_records`: 1 linha;
- `office_categories`: 0 linhas;
- `office_transactions`: 0 linhas;
- `office_cash_closings`: 0 linhas.

Portanto, a distincao final permanece: ha schema e algum dado em tabelas do Escritorio, mas nao ha evidencia suficiente de importacao real completa do Plena Cash Control nem de prontidao de producao.
