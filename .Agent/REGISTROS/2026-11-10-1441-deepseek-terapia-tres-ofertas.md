# Registro de ação

## Identificação

- Data: `2026-11-10`
- Horário e fuso: `14:41 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Evolução visual e comercial da landing page do Gestão Terapia Pro
- Solicitação de origem: "evoluir o visual e entregar de forma clara e objetiva tudo o que o sistema pode oferecer além do modo demo já embarcado, em 3 modelos de ofertas"
- Branch: `main`

## Escopo

- Arquivo alterado: `produtos/gestao-terapia.html` (único).
- Preservado: modal de demonstração local (`openDemoModal`, `#demo-modal`), todos os CTAs de demo, o conteúdo clínico e as seções `#rotina`, `#modulos`, `#privacidade`, `#faq`.

## Problema identificado

A página inteira vendia um único modelo e construía o argumento sobre a ausência de mensalidade:

- badge "Sistema Clínico Vitalício" e menu "Licença Vitalícia";
- trust item "Pagamento único de R$ 499,90. Livre de mensalidades";
- seção de investimento com título "sem o peso de mensalidades fixas" e argumento comparativo contra nuvens de R$ 150 a R$ 280/mês;
- limite ético "Sem mensalidades forçadas";
- FAQ: "Existe alguma mensalidade? Absolutamente nenhuma";
- CTA final "antes de garantir sua licença vitalícia".

Com dois modelos recorrentes e um em nuvem, esse texto passaria a ser falso. A evolução visual exigia reescrever o argumento, não só acrescentar cards.

## Ações realizadas

1. **Nova seção `#plano` com três modelos**, em grade de três colunas (duas em tablet, uma no mobile) usando as classes existentes `clinical-price-card-clean` e `--featured`, mais um bloco `<style>` local com `.therapy-plans`, `.therapy-plan__*` e `.therapy-implant`.
   - **Essencial** — R$ 499,90 pagamento único; sistema completo no computador, cofre AES-GCM, agenda, prontuário em 10 painéis, PHQ-9/GAD-7, pacotes e caixa, backup, offline.
   - **Essencial + Agenda Online** (destaque "Mais escolhido") — R$ 499,90 de licença + R$ 49,90/mês, acrescentando página de agendamento para o paciente, link próprio, horário entrando direto na agenda e nenhuma instalação para o paciente.
   - **Nuvem Completa** — R$ 129,90/mês, sistema completo hospedado, acesso de qualquer computador, sem instalação local, agenda online incluída e suporte por WhatsApp.
2. **Reconciliação do argumento**: o título da seção passou a "O sistema é seu. A nuvem e a agenda online são opcionais", com lead explicando que a licença não expira e que os modelos recorrentes são escolha do cliente — mantendo o posicionamento original sem negar as novas ofertas.
3. **Ajustes de coerência espalhados pela página**:
   - hero: eyebrow para "3 modelos de oferta", lead reposicionado e botão secundário "Ver os 3 modelos" (âncora `#plano`);
   - nota do hero sobre criptografia agora delimitada ao "modelo de licença";
   - trust item "A partir de R$ 499,90";
   - limite ético "Sem bloqueio por assinatura";
   - FAQ 03 reescrita para explicar em que casos existe mensalidade;
   - CTA final passa a convidar a comparar os modelos;
   - menu desktop e mobile: "Licença Vitalícia" → "Planos".
4. **Implantação Orientada** deixou de ser um card concorrente e virou faixa opcional sob os planos, mantendo o contato.
5. **JSON-LD**: `offers` passou de `Offer` único (499.90) para `AggregateOffer` com `lowPrice` 129.90, `highPrice` 499.90 e `offerCount` 3.
6. Demonstração local preservada: 6 chamadas a `openDemoModal()` e o `#demo-modal` intactos; o modelo em nuvem não substitui o demo.

## Validações

| Verificação | Resultado |
| --- | --- |
| Tags HTML | todas equilibradas |
| CSS inline do bloco `<style>` | 20 regras, parseadas com PostCSS |
| Cards de plano gerados | 3 |
| JSON-LD | válido, `AggregateOffer` 129.90–499.90 |
| Demonstração | `openDemoModal` em 6 pontos, modal presente |
| Âncora `#plano` sob header sticky | coberta por `scroll-margin-top: 92px` herdado de `assistencia-product-page` |
| `a.btn` | herda `a { color: inherit; text-decoration: none }`, renderiza como botão |
| `git diff --check` | limpo |
| Tamanho | 642 → 826 linhas |

## Premissas assumidas (confirmar)

- O modelo de **R$ 129,90/mês inclui a agenda online** — foi tratado como "sistema completo", portanto com a agenda do paciente.
- A etiqueta **"Mais escolhido"** no modelo intermediário é escolha editorial, não dado de venda.
- Não foram criadas regras de cancelamento, fidelidade ou reajuste: a nota abaixo dos planos mantém apenas a garantia de 7 dias já existente e remete as condições recorrentes ao atendimento.
- Os textos descrevem somente o que o sistema já declara fazer; nenhuma funcionalidade nova foi prometida.

## Pendências

- Validar visualmente em desktop, tablet e mobile: grade de três colunas, faixa de implantação e etiqueta do modelo em destaque.
- Confirmar as premissas acima antes de publicar.
- Commit não realizado nesta rodada.

## Estado final

- Status: implementado, aguardando validação local.
- Commit: não realizado.
- Push: não realizado.
