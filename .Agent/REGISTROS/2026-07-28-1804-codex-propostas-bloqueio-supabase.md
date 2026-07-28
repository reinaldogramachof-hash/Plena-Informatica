# Registro de acao

Data: 2026-07-28 18:04

Agente: Codex

## Objetivo

Iniciar o pacote Propostas comerciais, com validacao obrigatoria previa do
projeto Supabase `vpbofkmvplikprgtnwsi`.

## Status

Bloqueado no passo zero.

## Evidencias

- A base `.Agent` e os documentos de arquitetura, dados, seguranca, Supabase e
  roadmap foram lidos antes de qualquer implementacao.
- O conector Supabase autenticado listou apenas os projetos:
  - `lxaframzkwmhjiamipsv` / Sistemas de Gestao / `ACTIVE_HEALTHY`;
  - `crdtguvjuyfszxbpnwms` / Gestao Saude UBS / `ACTIVE_HEALTHY`.
- O projeto solicitado no briefing, `vpbofkmvplikprgtnwsi`, nao apareceu na lista
  de projetos acessiveis pelo conector.
- A tentativa de listar tabelas em `vpbofkmvplikprgtnwsi` retornou
  `INVALID_ARGUMENT`.
- O Supabase CLI nao esta disponivel no PATH local.
- O arquivo local `servicos/hub/.env.local` aponta para outro projeto:
  `https://iqgyqszvtyqbjgqdgrss.supabase.co`.

## Arquivos modificados

- `.Agent/REGISTROS/2026-07-28-1804-codex-propostas-bloqueio-supabase.md`

## Arquivos nao modificados

- Nenhuma migracao foi criada ou aplicada.
- `servicos/docs/DATA_MODEL.md` nao foi alterado.
- `servicos/ROADMAP.md` nao foi alterado.
- Nenhuma tela admin ou cliente foi implementada.

## Pendencia para retomada

Confirmar acesso ao projeto Supabase correto (`vpbofkmvplikprgtnwsi`) via MCP ou
CLI vinculado antes de criar migracoes, documentacao de dados, roadmap ou
interface.
