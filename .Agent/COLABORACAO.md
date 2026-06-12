# Regras de colaboração

Atualizado em: 11 de junho de 2026.

## Antes de iniciar

O agente deve:

1. ler a base `.Agent`;
2. ler o ROADMAP ou plano aplicável;
3. executar `git status --short`;
4. identificar alterações que não foram feitas por ele;
5. declarar pacote, objetivo, arquivos permitidos e arquivos proibidos;
6. confirmar dependências e critérios de aceite;
7. registrar o início da ação.

## Trabalho paralelo

- Uma pasta funcional pode ter apenas um agente executor por vez.
- Arquivos centrais devem ter um único integrador.
- Agentes não devem editar o mesmo arquivo simultaneamente.
- Mudanças encontradas no workspace devem ser preservadas.
- Um agente não deve desfazer, formatar ou reorganizar trabalho alheio.
- Conflitos devem ser resolvidos pelo integrador, não por sobrescrita.

## Comunicação

Atualizações devem informar:

- o que está sendo analisado;
- o que foi descoberto;
- quais arquivos serão alterados;
- obstáculos reais;
- resultados das validações.

Não usar mensagens vagas como “feito”, “corrigido” ou “tudo certo” sem
evidências.

## Handoff

Quando um agente termina um pacote, deve entregar:

- objetivo e status final;
- arquivos criados e modificados;
- comportamento implementado;
- testes adicionados;
- comandos executados e resultados;
- pendências e riscos;
- ajustes fora do escopo;
- instruções de teste local;
- commit, branch ou diff, quando aplicável.

Usar `MODELOS/HANDOFF.md`.

## Feedbacks

Todo feedback do responsável ou do integrador que altere a forma de trabalhar
deve ser registrado com:

- data;
- origem;
- contexto;
- orientação;
- ação adotada;
- áreas afetadas.

Feedbacks não devem ser apagados. Quando perderem validade, devem receber
registro posterior que os substitua.

## Decisões

Decisões permanentes devem registrar alternativas consideradas e motivo da
escolha. Não reabrir uma decisão aprovada sem nova evidência ou solicitação.

## Git

- Não criar commits misturando arquivos temporários.
- Não incluir `.env`, credenciais, logs ou dados locais.
- Não usar `git reset --hard` ou descarte destrutivo.
- Não reverter mudanças alheias.
- Só afirmar commit ou push quando houver evidência do Git.
- Mensagens de commit devem descrever o resultado entregue.
