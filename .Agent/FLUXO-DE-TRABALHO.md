# Fluxo obrigatório de trabalho

Atualizado em: 11 de junho de 2026.

## 1. Entrada

- Ler `.Agent/README.md` e documentos obrigatórios.
- Ler o pedido atual e o documento específico da tarefa.
- Conferir branch e `git status`.
- Identificar escopo, arquivos e critérios de aceite.
- Criar registro de início da ação.

## 2. Diagnóstico

- Ler o código antes de propor mudanças.
- Reproduzir falhas quando houver bug.
- Conferir testes e comportamento atual.
- Distinguir lógica real, stub, interface e build publicado.
- Registrar riscos ou conflitos encontrados.

## 3. Plano

- Dividir o trabalho em passos verificáveis.
- Definir arquivos criados e modificados.
- Definir testes antes da implementação.
- Identificar arquivos reservados e dependências.
- Solicitar aprovação quando houver decisão de produto ou expansão de escopo.

## 4. Implementação

- Escrever teste que demonstre a necessidade.
- Confirmar a falha esperada.
- Implementar a menor solução completa.
- Executar o teste focado.
- Repetir em pequenos incrementos.
- Preservar trabalho existente.

## 5. Validação

- Executar testes focados.
- Executar suíte completa.
- Executar lint.
- Executar build.
- Executar `git diff --check`.
- Auditar acentuação.
- Validar UI em desktop e mobile quando aplicável.
- Validar resultado final, como PDF, PNG, CSV ou rota.

## 6. Relatório

- Preencher `MODELOS/HANDOFF.md`.
- Registrar números reais dos testes.
- Listar arquivos e alterações fora do escopo.
- Explicar pendências e riscos.
- Fornecer instruções objetivas para o teste local.

## 7. Aprovação

- O responsável testa localmente.
- Correções retornam ao mesmo pacote.
- Somente após aprovação o integrador libera pontos públicos.

## 8. Integração

- Atualizar registros, manifestos, rotas e cards autorizados.
- Gerar build publicado.
- Repetir validação completa.
- Atualizar ROADMAP.
- Registrar data da entrega e evidências.

## 9. Encerramento

- Conferir `git status`.
- Criar commit apenas com o escopo aprovado.
- Fazer push quando solicitado.
- Registrar a ação concluída em `REGISTROS/`.
- Não remover artefatos ou mudanças alheias.
