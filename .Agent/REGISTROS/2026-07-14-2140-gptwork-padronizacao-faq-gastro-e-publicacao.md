# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `21:40 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: Padronização do FAQ e publicação final — Gestão Gastro
- Solicitação de origem: ajustar o FAQ para o padrão dos demais sistemas, revisar e publicar as melhorias.
- Branch: `main`

## Escopo

- Objetivo: aplicar ao FAQ Gastro o padrão visual compacto das páginas de gestão, revisar os arquivos deste pacote e publicar apenas alterações relacionadas.
- Arquivos permitidos: landing Gastro, estilos compartilhados, demo Gastro e registros.
- Arquivos reservados: Blog, página inicial, Hub de Serviços, QR Code e demais alterações existentes.

## Ações realizadas

1. Substituí o FAQ legado pelo mesmo acordeão numerado usado nas páginas Beleza e Barbearia.
2. Mantive cinco perguntas específicas para operações gastronômicas, incluindo a orientação honesta para uso da demo em tela ampla.
3. Removi regras CSS locais que entravam em conflito com o padrão compartilhado de FAQ.
4. Removi 79 artefatos obsoletos, gerados na primeira compilação desta mesma sessão e não referenciados pelo build atual.
5. Mantive apenas os artefatos do build atual da demonstração para versionamento consciente.

## Arquivos modificados

- `produtos/gestao-gastro.html`
- `produtos/assets/produtos.css`
- `tecnologia/demos/gestao-restaurantes/index.html`
- `tecnologia/demos/gestao-restaurantes/demo-bypass.js`
- `tecnologia/demos/gestao-restaurantes/assets/*` (build oficial atual)
- `.Agent/REGISTROS/2026-07-14-2115-gptwork-dados-simulados-demo-gastro.md`
- `.Agent/REGISTROS/2026-07-14-2140-gptwork-padronizacao-faq-gastro-e-publicacao.md`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `npm.cmd run lint` na fonte Gastro | aprovado (`tsc --noEmit`) |
| `npm.cmd run build` na fonte Gastro | aprovado; avisos conhecidos de tamanho de chunk e chunk vazio do GenAI |
| HTTP da landing e demo em `127.0.0.1:8000` | respostas `200` |
| `git diff --check` dos arquivos textuais | aprovado |
| Busca por placeholders e mojibake nos arquivos textuais alterados | sem ocorrências |

## Pendências e riscos

- A validação visual automatizada não foi executada porque o utilitário de navegador não está instalado e não há sessão CDP ativa. A validação humana local permanece recomendada.

## Estado final

- Status: pronto para commit e push isolados.
- Commit: pendente no momento deste registro.
- Push: pendente no momento deste registro.
