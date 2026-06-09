# QR Code Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o Gerador de QR Code como primeira ferramenta funcional e
inteiramente local do Hub.

**Architecture:** O dominio transforma entradas validadas em payloads QR sem
depender de React. A interface seleciona o tipo, coleta dados, solicita a
codificacao local e disponibiliza uma imagem PNG para download.

**Tech Stack:** React, TypeScript, Zod, `qrcode`, Vitest e Testing Library.

---

### Task 1: Dominio e validacao

- [x] Criar testes para link, texto, WhatsApp, telefone, Wi-Fi e Pix Copia e Cola.
- [x] Confirmar que os testes falham sem a implementacao.
- [x] Criar schemas, tipos e construtor de payload.
- [x] Confirmar testes aprovados.

### Task 2: Codificacao local

- [x] Instalar `qrcode` e tipos.
- [x] Criar adaptador de geracao PNG com limite de payload.
- [x] Testar o adaptador com encoder injetavel.

### Task 3: Interface

- [x] Criar componente da ferramenta com selecao de tipo.
- [x] Exibir validacao inline e aviso de processamento local.
- [x] Gerar previa e download PNG.
- [x] Integrar a rota da ferramenta ao Hub.

### Task 4: Liberacao

- [x] Alterar o manifesto para `available`.
- [x] Atualizar o roadmap.
- [x] Executar testes, lint e build.
- [x] Validar visualmente desktop e mobile.
