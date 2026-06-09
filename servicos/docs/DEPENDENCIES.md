# Dependencias

## Producao

- `react` e `react-dom`: interface e composicao.
- `react-router-dom`: URL propria para cada ferramenta.
- `zod`: validacao de entradas e payloads persistidos.
- `@supabase/supabase-js`: integracao opcional com Auth, banco e Storage.

## Desenvolvimento

- `vite`: servidor e build.
- `typescript`: contratos e verificacao estatica.
- `vitest`: testes unitarios.
- `@testing-library/react`: testes de componentes.
- `jsdom`: ambiente DOM dos testes.
- `eslint` e plugins React/TypeScript: analise estatica.

## Dependencias futuras sob demanda

Nao instalar antes da ferramenta correspondente:

- QR Code: biblioteca pequena e auditada para geracao.
- PDF: `pdf-lib` ou equivalente para manipulacao local.
- Download: preferir APIs nativas antes de adicionar bibliotecas.

Toda nova dependencia deve registrar:

- justificativa;
- tamanho aproximado no bundle;
- licenca;
- historico de manutencao;
- riscos ao processar dados nao confiaveis.
