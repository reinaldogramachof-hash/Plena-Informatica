# Plena Hub de Solucoes Digitais

Esta pasta contem a pagina publica atual de Servicos Digitais e a base da
aplicacao modular que passara a executar ferramentas no navegador.

> **Estado em 2026-11-10:** a pagina `servicos.html` foi retirada da navegacao
> publica. Todo o site aponta agora para `tecnologia/tecnologia.html`, e o
> cliente navega apenas pela pagina inicial e pela pagina de Tecnologia. Os
> arquivos foram mantidos de proposito para reversao facil; `hub-app/` continua
> publicado, porem sem link no site. Nao trate a ausencia de links como defeito.

## Estrutura

- `servicos.html`, `style.css`, `script.js`: pagina publica mantida para reversao, hoje sem link no site.
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
