# Gestão Fit — evolução premium vitalícia

Atualização: 23/10/2026. Produto local para o personal autônomo. Plano vigente em docs/DIAGNOSTICO_E_PLANO_GESTAO_FIT_PREMIUM_VITALICIO_2026-10-21.md, na raiz do projeto.

## Implementação local

- Cofre com senha, gravação protegida, isolamento entre abas, migração e backup criptografado.
- Rotina do profissional; alunos, avaliações, arquivamento e históricos.
- Planos, pacotes e avulsas; contratação, vigência, consumo de sessões e dinheiro separados.
- Agenda diária/semanal/mensal, disponibilidade, bloqueios, séries, confirmação e faltas.
- Biblioteca e fichas com versões; execução e comparação da prescrição histórica.
- Contas a pagar/receber, pagamentos parciais, ajustes, estornos, conferência e relatórios.
- Despesas recorrentes com prévia e geração explícita, sem pagamento automático.
- Assistente local para preparar contatos, registrar ação humana e adiar pendências.
- Logo, paleta, tamanho de texto e assinatura, com preferências no backup protegido.
- Manual, roteiro de homologação e base fictícia representativa em ambiente separado.
- CRM com etapas manuais, etiquetas administrativas, próximo contato, histórico, pedidos e respostas sobre dados; lista mínima e ficha reservada sob ação explícita.
- Painel individual do aluno como primeira tela: plano, vigência, sessões/capacidade, rotina, treinos e ações; detalhes por abas com vínculos e decisões humanas preservados.
- Ficha reservada com nova conferência da senha atual do cofre a cada revelação; cancelamento, recolhimento e navegação invalidam a abertura, inclusive durante a verificação.
- Filtros operacionais com apresentação comum baseada em Treinos; data e hora local disponíveis no cabeçalho, inclusive em tela cheia.

## Homologação a concluir pelo usuário

### Próxima melhoria da Agenda e do Meu dia — solicitação de 23/10/2026

- Reduzir a rolagem e a repetição da lista completa de eventos abaixo da grade. Priorizar detalhes sob demanda, com consulta da aula sem abandonar a vista atual.
- No Meu dia, destacar aulas cujo horário previsto terminou e oferecer **Concluir aula**, **Remarcar** e **Aula não realizada**, com referência clara de aluno, data e horário e a conferência humana já exigida pelo sistema. Cada decisão deve atualizar a mesma aula da Agenda, sem exigir navegação até a listagem.
- Revisar o card “Seu próximo passo” e os atalhos que repetem o destino Agenda: reservar esse espaço para decisões úteis na rotina. A disposição final será definida após a conclusão do CRM.
- O término do intervalo apenas sinaliza a necessidade de registro. Nunca concluir presença, consumir sessão ou registrar dinheiro automaticamente.
- Preservar confirmação explícita, regras de cobertura e histórico. Cancelar, registrar falta ou corrigir continuam sendo decisões específicas do profissional.
- Implementar esse bloco depois da validação do CRM/privacidade. As novas ações diretas na Agenda/Meu dia seguem como roteiro; não foram implementadas neste bloco.

### Ajudas durante o uso — solicitação de 23/10/2026

- Incluir explicações curtas junto aos campos e ações, priorizando ficha do aluno, planos, sessões, avaliações e treinos. Apresentar o que preencher, o efeito da ação e onde consultar o detalhe.
- Usar ajudas acessíveis por teclado, foco e toque; informações essenciais também devem permanecer visíveis sem depender de passar o mouse.
- Preservar as confirmações já existentes. Este bloco fica para depois do painel individual do aluno; ainda não foi aplicado.

### Simulação do histórico de relacionamento — solicitação de 23/10/2026

- Gerar uma linha do tempo fictícia com interações, notas administrativas, mudanças de etapa e pedidos/respostas sobre dados pessoais, para homologar a visão do profissional.
- Usar arquivo de demonstração separado, preservar homônimos por código e seguir o fluxo de importação com backup prévio; não inserir dados simulados na base de trabalho automaticamente.
- O nome da área foi ajustado para **Histórico de relacionamento**. O novo cenário fictício fica para a próxima etapa e ainda não foi gerado.

A implementação e os testes de regras não substituem a validação visual. Conferir telas pequenas, impressão, instalação limpa, atualização, offline real, restauração no navegador e licença comercial do produto correto.

O resultado é candidato à homologação até esses testes. Distribuição, publicação e novos commits/pushes seguem autorização própria.

## Fora desta versão

Sincronização entre aparelhos, portal do aluno, equipe com permissões, envio automático de mensagens, cobrança bancária integrada e emissão fiscal não fazem parte desta entrega local.
