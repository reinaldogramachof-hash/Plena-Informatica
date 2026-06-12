# Governança

Atualizado em: 11 de junho de 2026.

## Papéis

### Responsável pelo projeto

- aprova direção, escopo e liberação pública;
- realiza ou coordena a validação local;
- decide conflitos comerciais, jurídicos e de produto;
- autoriza dependências, serviços externos e mudanças estruturais.

### Agente coordenador ou integrador

- distribui pacotes de trabalho;
- protege arquivos centrais durante execução paralela;
- revisa relatórios e alterações fora do escopo;
- integra apenas entregas aprovadas;
- libera cards, rotas e builds públicos;
- atualiza ROADMAP e registros.

### Agente executor

- trabalha somente no pacote atribuído;
- respeita arquivos proprietários e reservados;
- implementa, testa e documenta;
- não libera a própria ferramenta publicamente;
- informa qualquer desvio ou necessidade fora do escopo.

### Agente revisor

- prioriza falhas, riscos, regressões e testes ausentes;
- não implementa quando a solicitação for apenas revisão;
- fundamenta apontamentos em arquivos, linhas, testes ou comportamento observado.

## Autoridade sobre arquivos

Antes de editar, o agente deve identificar:

- arquivos proprietários do seu pacote;
- arquivos compartilhados;
- arquivos reservados ao integrador;
- alterações já existentes de outros agentes.

Arquivos compartilhados não podem ser alterados durante trabalho paralelo sem
autorização explícita.

No Hub de Serviços, a lista vigente de arquivos reservados está em
`servicos/ROADMAP.md`.

## Mudança de escopo

Uma descoberta não autoriza expansão automática do trabalho.

O agente deve:

1. registrar o problema encontrado;
2. explicar impacto e urgência;
3. indicar se bloqueia a tarefa atual;
4. aguardar autorização antes de implementar fora do escopo.

Correções estritamente necessárias para compilar ou testar podem ser realizadas,
mas devem ser relatadas como ajuste fora do escopo.

## Aprovação e liberação

Implementado não significa liberado.

Uma funcionalidade só pode ser marcada como disponível quando:

- critérios de aceite foram cumpridos;
- testes, lint e build foram aprovados;
- validação visual e mobile foi realizada quando aplicável;
- o responsável aprovou o teste local;
- o integrador atualizou os pontos públicos;
- o registro datado foi criado.

## Alteração desta base

Nenhum agente pode reduzir regras de segurança, remover histórico ou flexibilizar
proibições sem autorização explícita do responsável.
