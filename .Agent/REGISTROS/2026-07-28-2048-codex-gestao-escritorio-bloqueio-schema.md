# Registro de bloqueio

- Data: `2026-07-28`
- Agente: Codex
- Área: Hub / Gestão Escritório
- Pacote: F9 — Gestão Escritório e login unificado
- Status: Bloqueado antes da implementação

## Objetivo

Iniciar a consolidação do Plena Cash Control dentro do Hub como nova área
`Gestão Escritório`, usando o schema Supabase informado como já aplicado.

## Verificação executada

O anexo recebido informa que já existem:

- `profiles.areas`
- `private.is_staff(uid uuid)`
- `clients`
- `client_tasks`
- `office_categories`
- `office_transactions`
- `office_service_items`
- `office_service_records`
- `office_cash_closings`

Foram executadas consultas somente leitura no MCP Supabase:

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'clients',
    'client_tasks',
    'office_categories',
    'office_transactions',
    'office_service_items',
    'office_service_records',
    'office_cash_closings',
    'profiles',
    'proposals'
  )
order by table_name;
```

Resultado real:

- `public.profiles`
- `public.proposals`

Também foi consultado:

```sql
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'profiles',
    'proposals',
    'clients',
    'client_tasks',
    'office_categories',
    'office_transactions',
    'office_service_items',
    'office_service_records',
    'office_cash_closings'
  )
order by table_name, ordinal_position;
```

Resultado real:

- `profiles` não possui coluna `areas`.
- `proposals` não possui coluna `client_id`.
- Nenhuma tabela `clients` ou `office_*` aparece no catálogo.

Consulta de funções:

```sql
select n.nspname as schema_name,
       p.proname as function_name,
       pg_get_function_arguments(p.oid) as arguments,
       pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'private'
  and p.proname in ('is_staff','is_admin')
order by p.proname;
```

Resultado real:

- Existe `private.is_admin(uid uuid)`.
- Não existe `private.is_staff(uid uuid)`.

## Decisão

A implementação foi interrompida antes de alterar código porque o prompt
proíbe rodar migração/DDL e o schema informado como pré-existente não está
visível no banco acessado pela sessão.

Prosseguir agora criaria telas e serviços contra tabelas inexistentes, sem
validação real e com risco de quebrar o Hub.

## Próximo passo necessário

O responsável precisa:

1. aplicar o SQL F9 no projeto Supabase correto; ou
2. confirmar que o MCP desta sessão está apontando para o projeto errado; ou
3. autorizar explicitamente o Codex a aplicar o DDL recebido.

Depois disso, retomar por:

1. `list_tables`/`information_schema` para confirmar `profiles.areas`,
   `clients`, `client_tasks` e tabelas `office_*`;
2. gerar novamente tipos TypeScript reais;
3. implementar login unificado, área Escritório, importador JSON e substituição
   de Atendimentos antigo.

## Git

- Nenhum commit.
- Nenhum push.
- Nenhuma alteração funcional aplicada nesta rodada.
