# Modelo de Dados Proposto

Este documento orienta as migracoes futuras. Nenhuma tabela deve ser criada sem
uma ferramenta ou fluxo aprovado que a utilize.

## Tabelas iniciais

### profiles

Extensao minima de `auth.users`.

- `id uuid primary key references auth.users`
- `display_name text`
- `created_at timestamptz`
- `updated_at timestamptz`

Nao armazenar papeis em metadados editaveis pelo usuario.

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
- `document_version text not null`
- `accepted_at timestamptz not null`

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
