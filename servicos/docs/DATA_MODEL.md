# Modelo de Dados Proposto

Este documento orienta as migracoes futuras. Nenhuma tabela deve ser criada sem
uma ferramenta ou fluxo aprovado que a utilize.

## Tabelas iniciais

### profiles

Extensao minima de `auth.users`.

- `id uuid primary key references auth.users`
- `display_name text`
- `role text not null default 'client'`
- `created_at timestamptz`
- `updated_at timestamptz`

Nao armazenar papeis em metadados editaveis pelo usuario.

### proposals

Propostas comerciais acessadas pelo cliente por magic link e gerenciadas pela
equipe interna.

- `id uuid primary key`
- `client_name text not null`
- `client_email text not null`
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
