# Registro de acao - organizacao da raiz e limpeza

Data: 12/08/2026

## Objetivo

Organizar a raiz do projeto apos o deploy corretivo, centralizando assets,
documentos, ferramentas locais e artefatos de deploy, alem de remover sobras
temporarias que poderiam causar novo pacote incorreto.

## Organizacao aplicada

- Imagens publicas da raiz movidas para `assets/images/`.
- Referencias publicas atualizadas para `assets/images/`.
- Documentos de auditoria movidos para `docs/auditorias/`.
- Plano estrategico movido para `docs/estrategia/`.
- Tabela comercial movida para `docs/comercial/`.
- Handoff antigo movido para `docs/handoffs/`.
- `tmp-caixa/` e `graphify-out/` movidos para `docs/archive/`.
- Scripts locais movidos para `tools/local/`.
- Scripts de manutencao movidos/criados em `tools/maintenance/`.
- Pacotes superseded movidos para `deploy/archive/2026-08-12-superseded/`.
- Stagings temporarios e diagnosticos de hotfix removidos de `deploy/`.
- Bundle legado em `servicos/ferramentas/qr-code/assets/` removido, pois a rota
  atual redireciona para `servicos/hub-app/`.

## Correcoes aplicadas durante a limpeza

- Recuperacao de textos publicos a partir do pacote limpo validado.
- Reaplicacao dos caminhos organizados para `assets/images/`.
- Correcao de metadados sociais que ainda apontavam para `/plena.jpg`.
- Restauracao dos registros historicos `.Agent` tocados acidentalmente pela
  primeira versao do organizador.

## Validacoes

- `node tools/maintenance/audit-public-root.js`: sem referencias quebradas e sem
  imagens apontando para a raiz antiga.
- `node --check` aprovado para:
  - `script.js`
  - `servicos/script.js`
  - `tecnologia/script.js`
  - `tecnologia/sites-premium/portal.js`
  - `produtos/assets/produtos.js`
- `git diff --check`: aprovado, apenas avisos de normalizacao futura de CRLF.

## Observacoes

Nao houve commit nem push nesta rodada.
