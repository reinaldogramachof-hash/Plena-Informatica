# QR Code Dedicated Page Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar o card do QR Code a uma pagina dedicada publicavel com a
identidade institucional da Plena.

**Architecture:** O Hub React continua como fonte da ferramenta e passa a gerar
seu build em `servicos/ferramentas/qr-code/`. A rota recebe um shell
institucional e o card da pagina principal aponta para esse caminho estatico.

**Tech Stack:** HTML, CSS, React, TypeScript, Vite, Vitest e Testing Library.

---

### Task 1: Contrato de integracao

- [x] Criar teste que exige CTA ativo no card do QR Code.
- [x] Criar teste que exige navegacao institucional na rota dedicada.
- [x] Executar os testes e confirmar a falha esperada.

### Task 2: Pagina dedicada

- [x] Criar shell institucional com cabecalho, retorno e rodape.
- [x] Preservar o componente funcional do QR Code.
- [x] Ajustar estilos desktop e mobile.
- [x] Confirmar os testes focados.

### Task 3: Publicacao estatica

- [x] Configurar o Vite para gerar `servicos/ferramentas/qr-code/`.
- [x] Ativar o CTA do card sem alterar os demais cards.
- [x] Gerar os arquivos publicaveis.

### Task 4: Verificacao

- [x] Executar suite completa.
- [x] Executar lint e build.
- [x] Validar pagina principal, ida, uso e retorno.
- [x] Validar desktop e mobile.
- [x] Atualizar a documentacao da entrega.
