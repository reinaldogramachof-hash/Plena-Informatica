# Registro de ação

## Identificação

- Data: `2026-07-13`
- Horário e fuso: `23:52 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: Ajuste do funil de Sistemas de Gestão em Tecnologia
- Solicitação de origem: Correções de CTA, prova social e codificação em `tecnologia/tecnologia.html`
- Branch: não alterada

## Escopo

- Objetivo: restaurar o acesso direto às demos reais, preservar o acesso às páginas comerciais e substituir a prova social fictícia por cenários honestos.
- Arquivos permitidos: `tecnologia/tecnologia.html` e `.Agent/REGISTROS/*.md`.
- Arquivos reservados: `produtos/*`, `Sistemas_Gestão/*`, scripts globais, CSS global e `servicos/hub`.
- Critérios de aceite: quatro CTAs de demo com os contratos existentes, quatro CTAs comerciais preservados, ausência dos placeholders e padrões de mojibake solicitados, e destinos locais válidos.

## Estado inicial

- Git: havia alterações de outros agentes em diversas áreas, inclusive em `tecnologia/tecnologia.html`; foram preservadas.
- Testes, lint e build: não aplicáveis a esta página estática e não executados para evitar trabalho fora do escopo.
- Riscos conhecidos: `tecnologia/tecnologia.html` já possuía alterações prévias de caminho de logotipo e dos CTAs comerciais; elas não foram revertidas.

## Ações realizadas

1. Reintroduzidos os botões `Ver demo` para Assistência Pro, Barbearia Premium, Gestão Gastro e Beleza & Spa, mantendo `data-offer`, `data-category` e `data-action`.
2. Mantidos os quatro links `Ver sistema completo` para as páginas comerciais correspondentes.
3. Atualizados os indicadores dos quatro cards para informar que há demo disponível.
4. Convertida a seção de depoimentos-modelo em `Cenários que resolvemos`, sem nomes, citações ou alegações atribuídas a clientes reais.
5. Removido o marcador de comentário `TODO` para que a auditoria de placeholders fique limpa; nenhuma configuração de analytics foi alterada.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-13-2352-gptwork-ajuste-funil-tecnologia-sistemas.md`

### Modificados

- `tecnologia/tecnologia.html`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Inspeção de `tecnologia/script.js` | `openDemoModal(url, offer)` usa os caminhos recebidos, abre o modal existente e preserva o identificador da oferta. |
| Existência dos oito destinos locais | Os quatro `index.html` de demo e as quatro páginas em `produtos/` existem. |
| Validação estática dos CTAs | Os quatro caminhos exigidos para demo e o texto `Ver sistema completo` foram encontrados. |
| Busca por placeholders | `Depoimento de exemplo`, `Nome do cliente`, `TODO` e `TBD`: 0 ocorrências. |
| Busca por mojibake | `Ã`, `Â`, `�`, `&Atilde;` e `&Acirc;`: 0 ocorrências. |
| `git diff --check -- tecnologia/tecnologia.html` | Aprovado, sem erros; Git informou apenas o aviso conhecido de normalização CRLF para LF. |
| HTTP local em `http://127.0.0.1:8000` | `200` para a página Tecnologia, os quatro destinos de demo e as quatro páginas comerciais. |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- A validação visual manual em navegador e em larguras mobile não foi executada nesta ação; os destinos e o contrato do modal foram validados por inspeção e HTTP local.
- Permanecem no workspace as alterações prévias de outros agentes, inclusive alterações já existentes em `tecnologia/tecnologia.html`.

## Estado final

- Status: escopo implementado e validado estaticamente e por HTTP local.
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: pendente do responsável pelo projeto.
