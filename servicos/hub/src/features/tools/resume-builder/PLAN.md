# Criador de Curriculo - Plano de Implementacao

**Objetivo:** Entregar o nucleo local e testavel do Criador de Curriculo.

**Arquitetura:** Dados e validacao ficam independentes de React. O gerador PDF
recebe somente dados validados. A interface oferece edicao e previa, mas nao
conhece persistencia ou integracoes remotas.

**Tecnologias:** React, TypeScript, Zod, pdf-lib, Vitest e Testing Library.

## Tarefa 1: Dominio

- [x] Escrever testes para dados obrigatorios, limites e secoes opcionais.
- [x] Implementar tipos, schemas e normalizacao.
- [x] Confirmar testes aprovados.

## Tarefa 2: PDF

- [x] Escrever testes para titulo, secoes e documento valido.
- [x] Implementar gerador com dependencia injetavel.
- [x] Confirmar testes aprovados.

## Tarefa 3: Interface

- [x] Escrever testes do formulario, secoes dinamicas, previa e download.
- [x] Implementar o componente e os estilos isolados.
- [x] Alterar o manifesto para `building`.
- [x] Confirmar testes focados.

## Tarefa 4: Verificacao

- [x] Executar suite completa.
- [x] Executar lint.
- [x] Executar build.
- [x] Confirmar que nenhum arquivo compartilhado foi alterado.
