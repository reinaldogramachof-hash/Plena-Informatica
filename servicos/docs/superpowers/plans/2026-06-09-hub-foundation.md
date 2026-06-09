# Hub Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a base modular, documentada e testavel do Hub de Solucoes Digitais.

**Architecture:** A pagina publica permanece isolada enquanto uma aplicacao Vite
React TypeScript e criada em `servicos/hub`. Ferramentas sao modulos registrados
por manifestos e Supabase e um adaptador opcional, ativado apenas com ambiente
valido.

**Tech Stack:** Vite, React, TypeScript, React Router, Zod, Vitest, Testing Library
e Supabase JS.

---

### Task 1: Documentacao

- [x] Criar `servicos/README.md` e `servicos/ROADMAP.md`.
- [x] Criar arquitetura, seguranca, dados, Supabase e desenvolvimento.
- [x] Registrar dependencias e criterios de adocao.

### Task 2: Scaffold

- [x] Criar configuracao Vite, TypeScript, ESLint e Vitest.
- [x] Criar shell visual inicial do Hub.
- [x] Criar arquivo de ambiente de exemplo.

### Task 3: Registro das ferramentas

- [x] Escrever teste que exige seis slugs unicos.
- [x] Escrever teste das politicas local e opcional.
- [x] Criar tipos e manifestos para as seis ferramentas.
- [x] Renderizar o catalogo a partir do registro central.

### Task 4: Configuracao Supabase

- [x] Escrever testes de ambiente ausente, completo e parcial.
- [x] Criar parser de ambiente.
- [x] Criar cliente Supabase opcional.
- [x] Criar estrutura versionada de migrations e functions.

### Task 5: Verificacao

- [x] Instalar dependencias.
- [x] Executar testes.
- [x] Executar lint.
- [x] Executar build.
- [x] Revisar arquivos gerados e segredos.
