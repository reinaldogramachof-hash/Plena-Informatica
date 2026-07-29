# Registro de ação

## Identificação

- Data: `2026-07-29`
- Horário e fuso: `16:27 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Ajuste de Máscara de Transparência do Carrossel de Depoimentos
- Solicitação de origem: "muito bem agora diminua o efeito de transparência das margens para quando a navegção for por desktop os comentários fiquem mais visíveis. Quando o uso for smartphone remover o efeito de transparência total."
- Branch: main

## Escopo

- Objetivo: Reduzir a largura do degradê de transparência (`mask-image`) nas laterais do carrossel no desktop para exibir mais depoimentos na tela e desabilitá-lo por completo em smartphones.
- Arquivos permitidos: `style.css`
- Arquivos reservados: Nenhum
- Critérios de aceite:
  - O degradê lateral de fade-out no desktop deve ser reduzido de 6%/54% para apenas 4% nas bordas externas, expandindo o conteúdo visível para 92% da tela.
  - Em smartphones (`max-width: 767px`), a máscara do carrossel deve ser removida por completo (`mask-image: none`).

## Estado inicial

- Git: Depoimentos atualizados salvos, testes de contrato passando.
- Testes: Teste `tests/hero-image-contract.test.js` passava.
- Lint: Não configurado.
- Build: Não configurado.
- Riscos conhecidos: Nenhum.

## Ações realizadas

1. Modificadas as propriedades `-webkit-mask-image` e `mask-image` do `.marquee-wrapper` no arquivo `style.css`.
2. Alterado o gradiente para `linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)`, mantendo as bordas com leve transparência (apenas nos primeiros e últimos 4% do contêiner).
3. Criada a regra de responsividade `@media (max-width: 767px)` para limpar a máscara (`mask-image: none`) em smartphones.
4. Executados testes de contrato automatizados locais.

## Arquivos

### Criados

- Nenhum.

### Modificados

- [style.css](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/style.css)

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --test tests/hero-image-contract.test.js` | 1 pass, 0 fail (Sucesso) |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Nenhum.

## Estado final

- Status: Concluído.
- Commit: Pendente de commit pelo usuário.
- Push: Não realizado.
- Aprovação local: Aguardando verificação manual do responsável.
