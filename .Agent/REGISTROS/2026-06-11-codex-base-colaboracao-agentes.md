# Registro de ação

## Identificação

- Data: `2026-06-11`
- Fuso: `America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: criação da base permanente de colaboração dos agentes
- Solicitação de origem: responsável pelo projeto
- Branch: `wip-jules-2026-06-10T13-43-47-928Z`

## Escopo

- Objetivo: criar uma pasta `.Agent` com instruções, regras de colaboração,
  proibições e registros datados.
- Arquivos permitidos: `.Agent/**` e `AGENTS.md`.
- Arquivos reservados: código-fonte e documentos não relacionados.
- Critérios de aceite: base legível, versionável, sem credenciais, com modelos e
  histórico inicial.

## Estado inicial

- Não existia `AGENTS.md` nem pasta `.Agent`.
- Existia documentação dispersa em README, ROADMAP e handoffs.
- O workspace já possuía alterações e artefatos de outros trabalhos.

## Ações realizadas

1. Criado `AGENTS.md` como porta de entrada.
2. Criadas regras de governança, colaboração, técnica e segurança.
3. Criado fluxo obrigatório de trabalho.
4. Criada lista explícita do que não fazer.
5. Criado contexto resumido do projeto.
6. Criados modelos de ação, feedback e handoff.
7. Criados registros iniciais de decisões e feedbacks.
8. Auditados estrutura, placeholders, codificação e integridade do diff.

## Arquivos criados

- `AGENTS.md`
- `.Agent/README.md`
- `.Agent/GOVERNANCA.md`
- `.Agent/CONTEXTO-DO-PROJETO.md`
- `.Agent/COLABORACAO.md`
- `.Agent/REGRAS-TECNICAS.md`
- `.Agent/O-QUE-NAO-FAZER.md`
- `.Agent/FLUXO-DE-TRABALHO.md`
- `.Agent/MODELOS/REGISTRO-DE-ACAO.md`
- `.Agent/MODELOS/HANDOFF.md`
- `.Agent/MODELOS/FEEDBACK.md`
- `.Agent/REGISTROS/README.md`
- `.Agent/REGISTROS/DECISOES.md`
- `.Agent/REGISTROS/FEEDBACKS.md`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Listagem recursiva de `.Agent` | Estrutura completa |
| Auditoria de mojibake | Nenhuma ocorrência inválida |
| Busca de placeholders | Somente menção normativa a `TODO` |
| `git diff --check -- AGENTS.md .Agent servicos/ROADMAP.md` | Aprovado |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Foram observadas exclusões preexistentes de documentos na raiz. Elas não foram
  restauradas nem modificadas por esta ação.

## Estado final

- Status: concluído.
- Commit: não solicitado nesta ação.
- Push: não solicitado nesta ação.
- Aprovação local: aguardando ciência do responsável.
