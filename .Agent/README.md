# Base de colaboração dos agentes

Atualizado em: 11 de junho de 2026.

## Finalidade

Esta pasta define o contrato operacional de qualquer agente que trabalhe no Site
Institucional Plena. Ela existe para preservar contexto, impedir conflitos,
registrar decisões e garantir entregas verificáveis.

Nenhum agente deve iniciar alterações antes de ler esta base.

## Ordem obrigatória de leitura

1. `GOVERNANCA.md`
2. `CONTEXTO-DO-PROJETO.md`
3. `COLABORACAO.md`
4. `REGRAS-TECNICAS.md`
5. `O-QUE-NAO-FAZER.md`
6. `FLUXO-DE-TRABALHO.md`
7. `REGISTROS/DECISOES.md`
8. `REGISTROS/FEEDBACKS.md`
9. Documento específico da tarefa, como `servicos/ROADMAP.md`

## Regra central

O repositório e o estado real do código prevalecem sobre relatórios antigos. O
agente deve conferir arquivos, testes, rotas e Git antes de afirmar que algo
está concluído.

## Hierarquia resumida

1. Pedido atual e explícito do responsável pelo projeto.
2. Regras de segurança e privacidade.
3. Esta base `.Agent`.
4. ROADMAP, plano ou prompt aprovado para a tarefa.
5. Documentação técnica da área.
6. Relatórios e handoffs anteriores.

Em caso de conflito, o agente deve parar a parte conflitante, registrar a dúvida
e solicitar decisão. Ele pode continuar apenas nas partes não afetadas.

## Estrutura

```text
.Agent/
├── README.md
├── GOVERNANCA.md
├── CONTEXTO-DO-PROJETO.md
├── COLABORACAO.md
├── REGRAS-TECNICAS.md
├── O-QUE-NAO-FAZER.md
├── FLUXO-DE-TRABALHO.md
├── MODELOS/
│   ├── FEEDBACK.md
│   ├── HANDOFF.md
│   └── REGISTRO-DE-ACAO.md
└── REGISTROS/
    ├── README.md
    ├── DECISOES.md
    └── FEEDBACKS.md
```

## Responsabilidade de manutenção

- Toda decisão permanente deve ser registrada em `REGISTROS/DECISOES.md`.
- Todo feedback recebido ou aprendizado relevante deve ser registrado em
  `REGISTROS/FEEDBACKS.md`.
- Toda ação concluída deve gerar um registro datado usando
  `MODELOS/REGISTRO-DE-ACAO.md`.
- Alterações nestas regras exigem autorização do responsável pelo projeto.
