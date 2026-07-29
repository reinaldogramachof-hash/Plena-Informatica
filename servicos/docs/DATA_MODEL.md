# Modelo de Dados Proposto

Este documento orienta as migracoes futuras. Nenhuma tabela deve ser criada sem
uma ferramenta ou fluxo aprovado que a utilize.

## Tabelas iniciais

### profiles

Extensao minima de `auth.users`.

- `id uuid primary key references auth.users`
- `display_name text`
- `role text not null default 'client'`
- `areas text[] not null default '{}'`
- `created_at timestamptz`
- `updated_at timestamptz`

Nao armazenar papeis em metadados editaveis pelo usuario.

`areas` controla apenas navegacao no Hub administrativo. A seguranca de dados
continua sendo aplicada por RLS no banco.

### proposals

Propostas comerciais acessadas pelo cliente por magic link e gerenciadas pela
equipe interna.

- `id uuid primary key`
- `client_name text not null`
- `client_email text not null`
- `client_id uuid null references clients(id)`
- `client_user_id uuid null references auth.users`
- `title text not null`
- `scope_included jsonb not null`
- `scope_excluded jsonb not null`
- `tech_stack jsonb`
- `investment_amount numeric not null`
- `currency text not null default 'BRL'`
- `estimated_timeline text`
- `status text not null default 'draft'`
- `version integer not null default 1`
- `valid_until date`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `sent_at timestamptz`
- `accepted_at timestamptz`

Estados previstos:

- `draft`: proposta em preparo pela equipe interna.
- `sent`: proposta enviada e visivel para o cliente autenticado vinculado.
- `accepted`: aceite registrado via `consent_records`.
- `declined`: proposta recusada ou encerrada sem aceite.

Indices previstos:

- `(client_user_id)`
- `(lower(client_email))`
- `(status)`
- `(created_by)`

### tool_projects

Rascunhos salvos voluntariamente.

- `id uuid primary key`
- `user_id uuid not null`
- `tool_slug text not null`
- `title text`
- `payload jsonb not null`
- `schema_version integer not null`
- `created_at timestamptz`
- `updated_at timestamptz`
- `expires_at timestamptz`

Indices previstos:

- `(user_id, updated_at desc)`
- `(user_id, tool_slug, updated_at desc)`

### support_requests

- `id uuid primary key`
- `user_id uuid not null`
- `tool_project_id uuid null`
- `category text not null`
- `status text not null`
- `summary text not null`
- `created_at timestamptz`
- `updated_at timestamptz`

### consent_records

- `id uuid primary key`
- `user_id uuid not null`
- `document_type text not null`
- `document_id uuid not null`
- `document_version integer not null`
- `user_agent text`
- `ip_address inet`
- `accepted_at timestamptz not null`

Para propostas, o cliente autenticado insere apenas:

- `document_type = 'proposal'`
- `document_id = proposals.id`
- `document_version = proposals.version`
- `user_agent`, quando disponivel no navegador

O cliente nao atualiza `proposals`. O gatilho de banco vinculado a
`consent_records` marca a proposta como aceita e registra a auditoria tecnica.

### audit_events

Trilha tecnica de acoes administrativas, sem conteudo de documentos.

- `id bigint generated always as identity`
- `actor_user_id uuid`
- `action text not null`
- `resource_type text not null`
- `resource_id text`
- `metadata jsonb`
- `created_at timestamptz`

## Gestao Escritorio

O schema de Escritorio fica restrito a equipe interna por RLS usando
`private.is_staff()`, onde staff significa `profiles.role in ('admin',
'recepcao')`.

### clients

Cadastro unico de clientes, compartilhado entre Gestao Escritorio e Gestao
Digital.

- `id uuid primary key`
- `name text not null`
- `phone text`
- `email text`
- `document text`
- `address text`
- `notes text`
- `origin text not null default 'escritorio'`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`

### client_tasks

Tarefas operacionais vinculadas ao cadastro unico de clientes.

- `id uuid primary key`
- `client_id uuid not null references clients(id)`
- `text text not null`
- `completed boolean not null default false`
- `due_date date`
- `created_at timestamptz`

### office_categories

Categorias de caixa do atendimento presencial.

- `id uuid primary key`
- `name text not null`
- `type text not null check ('income', 'expense')`
- `color text`
- `active boolean not null default true`

### office_transactions

Movimentos financeiros exclusivos da Gestao Escritorio.

- `id uuid primary key`
- `type text not null check ('income', 'expense')`
- `amount numeric(12,2) not null`
- `quantity integer`
- `description text not null`
- `category_id uuid references office_categories(id)`
- `client_id uuid references clients(id)`
- `tags text[] not null default '{}'`
- `transaction_date date not null`
- `payment_method text not null check ('cash', 'card', 'transfer', 'pix', 'other')`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`

### office_service_items

Catalogo de servicos de escritorio.

- `id uuid primary key`
- `name text not null`
- `default_price numeric(12,2) not null`
- `active boolean not null default true`

### office_service_records

Registros de servicos realizados no atendimento presencial.

- `id uuid primary key`
- `service_item_id uuid references office_service_items(id)`
- `name text not null`
- `quantity integer not null default 1`
- `client_id uuid references clients(id)`
- `record_date date not null`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`

### office_cash_closings

Fechamentos de caixa do escritorio.

- `id uuid primary key`
- `closing_date date not null unique`
- `total_income numeric(12,2) not null`
- `total_expense numeric(12,2) not null`
- `balance numeric(12,2) not null`
- `notes text`
- `closed_by uuid references profiles(id)`
- `created_at timestamptz`

### Regra fixa de separacao financeira

`clients` e a unica tabela compartilhada entre Gestao Escritorio e Gestao
Digital. `office_transactions` e `proposals.investment_amount` nunca devem ser
somados ou combinados em relatorios, dashboards ou views. Sao fontes de receita
com ticket, ciclo comercial e estrutura de custo diferentes.

## Dados fora do banco

- PDFs processados localmente.
- Imagens usadas para gerar PDF.
- Conteudo de QR Code, salvo apenas por decisao explicita do usuario.
- Downloads gerados.
- Senhas e credenciais de terceiros.

## Evolucao de payloads

`tool_projects.payload` deve incluir apenas dados validados pelo schema da
ferramenta. `schema_version` permite migrar rascunhos sem alterar documentos
historicos silenciosamente.
