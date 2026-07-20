# Registro de ação

## Identificação

- Data: `2026-07-13`
- Horário e fuso: `23:33 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: I1 - integração e liberação pública das ferramentas digitais
- Solicitação de origem: autorização explícita do responsável pelo projeto nesta conversa
- Branch: `main`

## Escopo

- Objetivo: comprovar a funcionalidade das ferramentas ainda bloqueadas, corrigir bloqueadores estritamente necessários e liberar no Hub somente os pacotes que atendam aos critérios técnicos.
- Arquivos permitidos: pastas das 11 ferramentas; arquivos centrais do pacote I1; vitrine `servicos/servicos.html`; `servicos/ROADMAP.md`; build publicado; este registro.
- Arquivos reservados: nenhum dentro do pacote I1, reaberto pelo responsável; alterações preexistentes de outras áreas permanecem protegidas.
- Critérios de aceite: resultado final real; testes focados e suíte completa; lint; build; `git diff --check`; auditoria de acentuação e privacidade; validação em 1440, 768, 375 e 320 px.

## Estado inicial

- Git: branch `main` com alterações preexistentes em áreas institucionais, administrativas, currículo, calculadora, vitrine e build publicado; todas serão preservadas.
- Testes: última evidência registrada com 56 arquivos, 480 testes aprovados e 3 suspensos; será refeita no estado atual.
- Lint: última evidência registrada aprovada; será refeita.
- Build: última evidência registrada aprovada com aviso de tamanho do bundle; será refeita.
- Riscos conhecidos: ROADMAP e estados públicos defasados; cinco manifestos ainda `building`; três testes institucionais suspensos; privacidade da vitrine contradiz a proibição de credenciais governamentais; overflow global relatado em 320 px.

## Ações realizadas

1. Leitura da governança obrigatória, ROADMAP, registro técnico mais recente e estado atual do Git.
2. Consulta ao grafo existente para mapear os fluxos entre interfaces e geradores de resultado das ferramentas.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-13-2333-codex-integracao-liberacao-ferramentas-digitais.md`.

### Modificados

- Em andamento.

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `git status -sb` | branch `main` com alterações preexistentes identificadas e preservadas |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Validação técnica e visual em andamento.

## Estado final

- Status: em andamento.
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: autorização de integração recebida; validação final do resultado ainda pendente.
