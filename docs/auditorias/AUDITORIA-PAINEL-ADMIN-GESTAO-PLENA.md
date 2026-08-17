# Auditoria: Painel Administrativo e Gestão do Site Plena Informática

_Preparado em: 28 de julho de 2026_

## 1. O que a Plena realmente vende (e por que isso importa)

Antes de desenhar o admin, é preciso admitir que a Plena não é um negócio, são **quatro
negócios operando sob a mesma marca**, com ciclos de venda completamente diferentes:

1. **Atendimento presencial** (documentos, impressão, MEI, IRPF) — ciclo de minutos,
   pagamento na hora. Já tem preço fixo em `../comercial/TABELA-DE-PRECOS-E-FERRAMENTAS.md`.
2. **Hub de ferramentas digitais gratuitas** (`servicos/hub`) — não vende nada
   diretamente, existe para funilar gente para o item 1.
3. **Tecnologia sob medida** (sites, landing pages, ERPs, CRMs, portais — ver
   `tecnologia/tecnologia.html`) — ciclo de semanas/meses, orçamento caso a caso.
   É onde o caso do TechTower Coworking se encaixa.
4. **Sistemas de Gestão verticais prontos** (Assistência Pro, Barbearia Premium,
   Gestão Gastro, Beleza & Spa, e os 26 templates em `Sistemas_Gestão/`) — meio-termo:
   produto semi-pronto, customizado e licenciado por cliente.

> **Atualização (28/07/2026, após leitura do repositório "Sistemas De Gestão"):**
> o item 4 acima **não é controlado por este site nem pelo Hub**. Existe um
> repositório separado, maduro, com clientes reais pagantes, APIs próprias em PHP
> (licenças, vendas, notificações), Supabase próprio (`lxaframzkwmhjiamipsv`) e
> governança formal própria (papéis de Arquiteto/Codex/Antigravity). A decisão de
> arquitetura documentada lá é explícita: **"Painel Admin único, um funil de dado
> só"** — ou seja, os Sistemas de Gestão não devem ser geridos por um segundo
> painel. Todo o desenho deste documento a partir daqui trata **só dos itens 1 e
> 3** (atendimento presencial e Tecnologia sob medida) — o item 4 fica de fora por
> decisão consciente, não por esquecimento.
>
> Ponto em aberto sinalizado: o painel do repositório "Sistemas De Gestão" tem um
> módulo "Leads Evolução" que foi manualmente ampliado em 26/07/2026 para também
> aceitar leads do "site institucional e outras entregas Plena" — um uso informal
> que se sobrepõe ao que este documento propõe. O responsável confirmou que fará
> a remoção desses itens na próxima sessão de desenvolvimento daquele repositório,
> deixando o Hub da Plena como o único lugar de controle para Tecnologia sob
> medida daqui para frente.

### Mapa de responsabilidade

| O quê | Onde vive | Sistema |
| --- | --- | --- |
| Assistência Pro, Barbearia Premium, Beleza & Spa, Gestão Gastro (vitalício/SaaS) | Licenças, planos, cobrança, leads de upgrade | Repositório "Sistemas De Gestão" (já existe, maduro, não mexer) |
| Sites, landing pages, e-commerces, ERPs/CRMs sob medida, portais (tudo de `tecnologia.html` exceto os 4 produtos acima) | Propostas, aceite, acompanhamento de projeto | Hub da Plena (`servicos/hub`) — Propostas em construção, Clientes/Projetos como próximo passo |
| Atendimento de balcão (documentos, impressão, MEI) | Caixa/Atendimentos | Hub da Plena — já existe, sem mudança |

O painel administrativo que existe hoje (Dashboard, Atendimentos, Relatórios) cobre
**só o negócio 1**. Os negócios 3 e 4 — que são os de maior ticket — não têm nenhuma
gestão interna além de planilhas/conversas soltas, até a gente começar o módulo
Propostas. Isso é o buraco real que a sua pergunta está apontando.

## 2. O funil que o próprio site já promete (e ninguém rastreia)

Em `tecnologia/tecnologia.html` a Plena já publica um funil de 5 etapas para o
negócio de Tecnologia sob medida:

**Diagnóstico → Demonstração → Proposta → Implantação → Suporte**

Isso é ótimo: significa que não preciso inventar um funil do zero, só preciso fazer o
admin rastrear o que a página institucional já promete ao cliente. Hoje, o módulo
Propostas (em construção pelo Codex) cobre exatamente **uma etapa das cinco**. As
etapas de Diagnóstico, Demonstração, Implantação e Suporte não têm nenhum registro
estruturado — vivem na cabeça de quem atende ou em conversa de WhatsApp.

## 3. Lacunas identificadas

### 3.1 Não existe entidade "Cliente"

A tabela `proposals` (que estamos criando agora) guarda `client_name`/`client_email`
soltos em cada proposta. Isso funciona para uma proposta isolada, mas quebra assim que
um cliente tiver mais de uma proposta ao longo do tempo (ex.: TechTower pede uma
segunda evolução em 2027) — não há como ver o histórico de um cliente num lugar só,
nem amarrar propostas + projetos entregues + suporte ao mesmo cliente.

**Falta:** uma tabela `clients` central, com `proposals`, futuros `projects` e
`support_records` todos referenciando `client_id`.

### 3.2 Catálogo de serviços e preços é um arquivo Markdown estático

`../comercial/TABELA-DE-PRECOS-E-FERRAMENTAS.md` é a fonte de verdade dos preços do negócio 1, mas
é um arquivo de texto que só quem mexe no repositório consegue atualizar. Se o preço
da plastificação mudar, alguém edita Markdown e depende de um deploy. Isso não
escala e não é "gestão pelo painel".

**Falta:** tabela `service_catalog` (categoria, nome, preço, ativo/inativo) editável
pelo admin, que o Dashboard/Relatórios já existentes passariam a consultar em vez do
enum fixo `SERVICE_CATEGORIES` hardcoded em `transaction-schema.ts`.

### 3.3 Catálogo de Tecnologia sob medida também é estático

**Correção pós-leitura do repositório "Sistemas De Gestão":** os 4 produtos
verticais (`produtos/*.html`) e os 26 templates de `Sistemas_Gestão/` **ficam de
fora** deste módulo — já têm controle próprio e maduro no outro repositório (ver
mapa de responsabilidade na seção 1). O que falta gerir aqui é só a vitrine de
Tecnologia sob medida (`tecnologia/tecnologia.html`): sites, landing pages,
e-commerces, ERPs/CRMs sob medida, portais. Hoje são páginas HTML mantidas
manualmente, sem lugar no admin para ver "qual oferta está ativa, qual está em
desenvolvimento".

**Falta:** tabela `tech_offerings` (nome, tipo — site / landing page / e-commerce /
erp_crm_sob_medida / portal —, status, descrição, link da demo), restrita à linha
de Tecnologia sob medida.

### 3.4 Nenhum rastreio de projeto após a proposta ser aceita

Isso é o item que mais bate na sua pergunta original ("acompanhamentos necessários").
Quando uma proposta é aceita (como a do TechTower), o que acontece hoje? Nada é
registrado. Não há como responder "quantos projetos estão em implantação agora",
"qual cliente está sem contato há 3 semanas", "quando vence o suporte de 3 meses que
prometemos no TechTower".

**Falta:** tabela `engagements` (ou `projetos`) ligada a `clients` e opcionalmente a
`proposals`, com status nas 5 etapas do funil já publicado (diagnóstico, demonstração,
proposta, implantação, suporte), datas-chave e histórico de eventos.

### 3.5 Licenciamento dos Sistemas de Gestão é um stub

Cada pasta em `Sistemas_Gestão/*/lock.js` hoje só imprime "Demo Mode" — não tem
nenhum controle real de licença por cliente. Isso é esperado nesta fase (são demos),
mas se a Plena realmente vender um desses templates para um cliente pagante, vai
precisar de alguma forma de ativar/desativar por instância. Não é urgente agora, mas
é uma lacuna estrutural que vai aparecer assim que o primeiro "Sistema de Gestão"
for vendido de verdade — vale já nascer conectado ao `client_id`/`engagement_id`
quando isso for desenhado, em vez de ser um retrofit depois.

## 4. Nomenclatura — cuidado para não colidir com o que já existe

O item de menu "Atendimentos" já existe e significa **transação de caixa do
atendimento presencial** (documentos, impressão). Se o novo módulo de
acompanhamento de clientes de Tecnologia usar um nome parecido, vai confundir quem
usa o painel todo dia. Sugiro nomes claros e distintos:

| Já existe | Significa | Novo módulo | Significa |
| --- | --- | --- | --- |
| Atendimentos | Caixa do balcão (documentos/impressão) | **Clientes** | Cadastro central de cliente (pessoa/empresa) |
| Propostas (em construção) | Proposta comercial enviada | **Projetos** | Acompanhamento pós-proposta (as 5 etapas do funil) |
| — | — | **Catálogo** | Serviços de balcão + produtos de tecnologia editáveis |

## 5. Modelo de dados proposto (incremental, não reescreve o que já existe)

```
clients
  id, name, email, whatsapp, document (CPF/CNPJ opcional),
  origin (balcão / tecnologia / indicação), created_at

-- proposals ganha uma coluna nova:
proposals.client_id -> clients.id (nullable no início, preenchido por e-mail
  como já fazemos hoje com client_user_id; client_email pode ficar como
  cache de leitura)

engagements
  id, client_id, proposal_id (nullable), tech_offering_id (nullable),
  stage (diagnostico | demonstracao | proposta | implantacao | suporte),
  status (ativo | pausado | concluido | cancelado),
  support_ends_at, created_at, updated_at

tech_offerings
  id, name, type (produto_vertical | template_gestao | sob_medida),
  status (ativo | em_desenvolvimento | descontinuado), description, demo_url

service_catalog
  id, category, name, price, active
```

Isso não conflita com nada que o Codex já está construindo — `proposals`,
`consent_records` e `audit_events` continuam exatamente como estão. É uma extensão,
não uma reescrita.

## 6. Nova IA sugerida para o painel

```
Dashboard      (já existe — mantém foco no caixa presencial)
Atendimentos   (já existe — sem mudança)
Relatórios     (já existe — sem mudança)
Propostas      (em construção pelo Codex — sem mudança de escopo agora)
Clientes       (novo — cadastro central)
Projetos       (novo — acompanhamento das 5 etapas do funil de Tecnologia)
Catálogo       (novo — serviços de balcão + ofertas de tecnologia editáveis)
```

## 7. Priorização honesta — o que eu faria e o que eu seguraria

Isso importa mais do que a lista de tabelas: você tem o Codex no meio da implementação
do módulo Propostas agora. Antes de jogar tudo isso em cima dele, eu dividiria assim:

**Fazer agora, baixo risco, não conflita com o Propostas em andamento:**
- `clients` (tabela nova, isolada) e ligar `proposals.client_id` — é uma migração
  aditiva simples.
- Ecrã "Clientes" no admin (lista + cadastro) — reaproveita o mesmo padrão de
  `TransactionListPage`.

**Fazer em seguida, depois do Propostas estar 100% validado:**
- `engagements`/Projetos — depende de `clients` existir e faz mais sentido desenhar
  depois que o fluxo de aceite de proposta estiver testado de ponta a ponta (você
  ainda está fechando essa validação com o Codex).

**Pode esperar, não é urgente:**
- `tech_offerings` e `service_catalog` — resolvem um problema real (catálogo
  estático em Markdown/HTML), mas não bloqueiam nada do que você está fazendo agora
  com o TechTower. Eu não misturaria isso na mesma rodada do Codex para não
  fragmentar o foco dele.
- Licenciamento real do `lock.js` — só vira urgente quando o primeiro Sistema de
  Gestão for vendido para valer.

## 8. Pergunta em aberto para você decidir

Meu maior receio aqui não é técnico, é de prioridade: você pediu "gestão completa" —
isso é um projeto de várias semanas se for feito todo de uma vez, e o Codex ainda
nem terminou de validar o Propostas. Antes de eu gerar o próximo prompt, prefiro
que você diga: quer que eu já desenhe o pacote completo (Clientes + Projetos +
Catálogo) para o Codex enfileirar depois do Propostas, ou quer que eu foque só no
próximo passo imediato (Clientes, que é o que menos risco traz) e deixamos o resto
para depois de validar tudo?

## 9. Atualização — Pacote F9: Gestão Escritório (28/07/2026)

Um quinto sistema paralelo foi identificado: "Plena Cash Control", app React/Vite
standalone (Google AI Studio + Gemini), usado hoje pela colaboradora do
atendimento presencial. Decisão tomada: absorver esse sistema dentro do Hub como
uma nova área "Gestão Escritório", ao lado de "Gestão Digital" (Propostas e o que
vier depois), sob um único login com dois cards de acesso.

**Regras fixadas:**

- Só a tabela `clients` é compartilhada entre Escritório e Digital. Controle
  financeiro fica **sempre separado** — `office_transactions` (Escritório) e o
  valor de `proposals` (Digital) nunca devem ser somados ou combinados em um
  relatório único, dado que a Tecnologia sob medida tem ticket e estrutura de
  custo muito diferentes do atendimento de balcão.
- Assistente de IA (Gemini) do Cash Control fica fora desta fase.
- Troca direta (sem período de paralelismo), com exportação/backup do JSON atual
  antes da migração de dados.
- O "Atendimentos" atual (que dependia de uma tabela `transactions` nunca criada)
  é aposentado em favor do novo schema de Gestão Escritório.
- O Codex está autorizado a aplicar migrações diretamente neste projeto Supabase
  (`nnckpyzjllqsdcwlnxei`) a partir de 28/07/2026 — o padrão anterior de aplicação
  manual pelo responsável fica descontinuado por decisão explícita, após
  validação repetida de comportamento correto do Codex.

**Item de backlog, sem ação imediata:** o novo painel admin deve nascer como PWA
bem desenhado, com responsividade estruturada para todos os dispositivos. Não
está sendo trabalhado agora — fica registrado para entrar quando a Gestão
Escritório e o login unificado estiverem estáveis.

## 10. Atualização — Correção de rotas do Hub e limpeza do caminho qr-code (29/07/2026)

Confirmado, por leitura direta dos arquivos (não suposição): o registro
`2026-07-28-2202-codex-ajustes-portais-e-pendencias-banco.md` mostra que o
Codex já entregou, sem relatório formal prévio, praticamente todas as
pendências do Pacote F9: `proposals.client_id` aplicado com backfill (0
correspondências porque `clients` ainda estava vazia — resultado esperado, não
falha), os 10 índices de FK criados (0 avisos remanescentes), `rls_auto_enable()`
investigado e confirmado como eventotrigger legítimo de hardening (revogado
`EXECUTE` de `anon`/`authenticated`, mantido para `postgres`/`service_role`),
os dois logins segregados (`/portais`, `/escritorio/login`, `/digital/login`)
e a sidebar inspirada no Cash Control implementados. Nada commitado/pushado
ainda. As 8 falhas de teste seguem isoladas em `mei-das-guide`, fora de escopo.

**Problema real identificado:** `servicos/hub/vite.config.ts` ainda compila
para `outDir: '../ferramentas/qr-code'` — resquício de quando o Hub era só o
gerador de QR Code. Isso faz com que login, portais e propostas sejam servidos
fisicamente dentro do endereço de uma ferramenta específica
(`servicos/ferramentas/qr-code/#/portais`), o que já gerou confusão e um teste
de login em ambiente que parecia quebrado. O rodapé de `index.html` (link
"Área Administrativa") e todos os cards de ferramenta em `servicos/servicos.html`
apontam manualmente para esse mesmo caminho físico.

**Decisões tomadas (confirmadas com Reinaldo em 29/07):**

- Trocar o `outDir` para uma pasta neutra fora do nome "qr-code" (ex.:
  `servicos/hub-app`, já que `servicos/hub` é a pasta do código-fonte e não
  pode ser sobrescrita pelo build).
- Atualizar o link do rodapé de `index.html` e os links de ferramentas em
  `servicos.html` para o novo caminho.
- Atualizar a suíte `institutional-integration.test.tsx`, que hoje afirma
  literalmente o caminho antigo — senão os testes ficam falso-positivos ou
  quebram.
- Deixar um redirect leve no caminho antigo (`servicos/ferramentas/qr-code/`)
  por um período de transição, para não quebrar links já indexados/salvos.
- A rota órfã `/catalogo` do Hub (só alcançada abrindo a raiz do app
  diretamente — `servicos.html` nunca linka para ela) passa a redirecionar
  para `servicos/servicos.html`, a fonte pública real do catálogo de
  ferramentas.
- Verificar em `auth.users` do projeto `nnckpyzjllqsdcwlnxei` se o e-mail
  usado no teste de login (pessoal, fora de `tecnologia@plenainformatica.com.br`)
  realmente existe como usuário — o erro 400 observado é provavelmente
  credencial inexistente, não bug de rota.
