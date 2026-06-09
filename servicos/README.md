# Plena Hub de Solucoes Digitais

Esta pasta contem a pagina publica atual de Servicos Digitais e a base da
aplicacao modular que passara a executar ferramentas no navegador.

## Estrutura

- `servicos.html`, `style.css`, `script.js`: pagina publica atualmente ativa.
- `hub/`: aplicacao React + TypeScript das ferramentas.
- `docs/`: arquitetura, seguranca, dados, Supabase e operacao.
- `supabase/`: artefatos versionados de banco e Edge Functions.
- `ROADMAP.md`: ordem aprovada de construcao e liberacao.

## Regra de migracao

A pagina publica nao deve ser substituida pela aplicacao de uma unica vez.
Cada ferramenta deve ser implementada, testada e validada isoladamente. O card
correspondente sera ativado somente quando a ferramenta estiver pronta.

## Comandos do Hub

```powershell
cd servicos\hub
npm.cmd install
npm.cmd run test
npm.cmd run build
npm.cmd run dev
```

Consulte `docs/DEVELOPMENT.md` antes de iniciar uma ferramenta.
