# Integração do Controle de Caixa ao Painel Administrativo

Data: 11 de junho de 2026.

Status: planejamento aprovado para uma próxima sessão.

## Objetivo

Incorporar ao painel administrativo da Plena as funções operacionais úteis do
sistema `Plena-Controle-de-Caixa--main.zip`, preservando a autenticação, a
persistência Supabase, a RLS, os testes e o padrão visual já adotados no Hub.

A integração deve evoluir o painel atual, não incorporar o aplicativo legado
como uma segunda aplicação independente.

## Fontes analisadas

- `Plena-Controle-de-Caixa--main.zip`
- `servicos/hub/src/admin/`
- `servicos/hub/src/App.tsx`
- `HANDOFF-CODEX-PAINEL-ADMIN.md`, quando disponível
- documentação de segurança e Supabase em `servicos/docs/`

O ZIP foi auditado a partir de uma cópia temporária, sem extração no workspace
principal e sem alteração do código existente.

## Diagnóstico do sistema legado

### Funcionalidades úteis

- registro de entradas e despesas;
- categorias financeiras personalizadas;
- edição e exclusão de transações;
- busca por descrição e tags;
- fechamento diário;
- totalização por forma de pagamento;
- compartilhamento do fechamento pelo WhatsApp;
- dashboard de receitas, despesas e saldo;
- gráficos de fluxo de caixa;
- relatório por intervalo livre de datas;
- identificação do serviço com maior receita;
- cadastro de clientes;
- anotações e tarefas por cliente;
- backup e restauração em JSON.

### Arquitetura encontrada

- React e TypeScript;
- React Router;
- Recharts;
- Lucide React;
- Tailwind carregado por CDN;
- persistência integral em `localStorage`;
- PWA básica com service worker;
- integração direta do frontend com Gemini.

### Riscos encontrados

1. Senha administrativa fixa `plena123` no frontend.
2. Transações, clientes e CPF/CNPJ armazenados em `localStorage`.
3. Ausência de autenticação e RLS.
4. Importação JSON sem validação estrutural.
5. Exclusões sem trilha de auditoria.
6. Chave Gemini incorporada ao bundle cliente.
7. Envio de resumos financeiros para um serviço externo.
8. Dependência de Tailwind, fontes e módulos por CDN.
9. Uso frequente de `alert`, `confirm` e `prompt`.
10. Ausência de testes automatizados.
11. `localStorage.clear()` remove dados sem segmentação.
12. Backup baseado em IDs gerados localmente, sem garantia transacional.

## Decisão de arquitetura

### Abordagem escolhida

Reconstruir os recursos selecionados dentro do painel atual.

Serão reaproveitados:

- fluxos operacionais;
- regras de totalização;
- conceitos de categorias;
- fechamento diário;
- relatórios;
- ideias de experiência do usuário.

Não serão copiados diretamente:

- persistência em `localStorage`;
- senha fixa;
- integração Gemini no cliente;
- Tailwind CDN;
- componentes sem testes;
- importação irrestrita de JSON;
- coleta automática de CPF/CNPJ.

### Motivos

- o painel atual já possui autenticação Supabase;
- a tabela atual já registra receitas de atendimentos;
- o design administrativo já está integrado ao Hub;
- a suíte de testes já existe;
- uma segunda aplicação duplicaria login, dados, navegação e manutenção;
- a migração progressiva reduz risco operacional.

## Escopo funcional recomendado

### Fase 1 — Núcleo financeiro

Objetivo: transformar o painel de atendimentos em um caixa real.

- manter atendimentos existentes como receitas;
- adicionar o tipo `expense`;
- adicionar descrição financeira e categoria;
- aceitar dinheiro, Pix, cartão, transferência e outro;
- permitir edição segura;
- manter exclusão com confirmação;
- registrar data de criação e atualização;
- preservar compatibilidade com registros existentes.

Resultado esperado:

- receitas e despesas no mesmo fluxo financeiro;
- saldo calculado corretamente;
- nenhuma perda dos atendimentos já cadastrados.

### Fase 2 — Categorias financeiras

Objetivo: retirar categorias financeiras do código estático.

- tabela de categorias por usuário;
- tipos `income` e `expense`;
- nome e cor;
- categorias iniciais da operação Plena;
- impedir exclusão quando houver transações vinculadas;
- permitir desativação em vez de exclusão destrutiva.

Categorias iniciais sugeridas:

Receitas:

- Impressão e Xerox;
- Personalizados;
- Papelaria e Vendas;
- Serviços Digitais;
- Assistência Técnica;
- MEI e IRPF.

Despesas:

- Insumos;
- Matéria-prima;
- Reposição da loja;
- Custos fixos;
- Manutenção de máquinas;
- Taxas e serviços.

### Fase 3 — Fechamento diário

Objetivo: permitir conferência real do caixa.

- total de entradas;
- total de despesas;
- saldo do dia;
- totais por forma de pagamento;
- valor informado em dinheiro contado;
- diferença entre sistema e dinheiro contado;
- observação;
- horário e usuário responsável;
- fechamento imutável após confirmação;
- reabertura somente com justificativa e auditoria;
- compartilhamento por WhatsApp sem dados sensíveis.

O fechamento não deve ser apenas uma janela calculada em memória. Deve gerar um
registro persistido e auditável.

### Fase 4 — Dashboard financeiro

Objetivo: substituir os indicadores exclusivamente de faturamento por visão
financeira.

- receitas do dia, mês e ano;
- despesas do dia, mês e ano;
- saldo;
- quantidade de lançamentos;
- fluxo dos últimos sete dias;
- despesas por categoria;
- serviço ou categoria de maior receita;
- indicadores vazios e carregamento acessíveis.

Gráficos podem usar Recharts, mas a dependência deve ser avaliada e instalada
formalmente, sem CDN.

### Fase 5 — Relatórios

Objetivo: ampliar o relatório atual.

- período livre entre duas datas;
- filtro por tipo, categoria e pagamento;
- totais de entrada, despesa e saldo;
- média por receita;
- agrupamento diário;
- agrupamento por categoria;
- agrupamento por forma de pagamento;
- exportação CSV;
- resumo para WhatsApp;
- impressão responsiva.

Não incluir consolidação automática de backups JSON nesta fase.

### Fase 6 — Clientes e tarefas

Objetivo: trazer o módulo somente após o caixa estar estabilizado.

- cadastro mínimo de cliente;
- nome obrigatório;
- telefone e e-mail opcionais;
- anotações;
- tarefas com prazo e conclusão;
- vínculo opcional entre cliente e transação;
- busca;
- edição;
- arquivamento.

CPF/CNPJ não deve fazer parte da primeira entrega. Sua inclusão futura exige:

- necessidade operacional comprovada;
- política de retenção;
- controle de acesso;
- mascaramento;
- análise de privacidade.

### Fase 7 — Backup e auditoria

Objetivo: permitir segurança operacional sem restaurar dados inválidos.

- exportação de dados pertencentes ao usuário autenticado;
- schema versionado;
- validação Zod na importação;
- modo de prévia antes de importar;
- detecção de duplicidade;
- importação transacional;
- relatório de itens aceitos e rejeitados;
- trilha de criação, edição, exclusão e reabertura.

## Modelo de dados proposto

O modelo definitivo deve ser criado como migração Supabase versionada.

### Evolução de `transactions`

Campos existentes devem ser preservados.

Campos candidatos:

```text
type              text not null default 'income'
category_id       uuid null
client_id         uuid null
description       text
tags              text[] not null default '{}'
updated_at        timestamptz not null default now()
deleted_at        timestamptz null
```

Regras:

- `type` aceita apenas `income` e `expense`;
- despesas não usam `service_name` como conceito obrigatório;
- registros existentes recebem `type = 'income'`;
- exclusão financeira deve preferir soft delete;
- consultas devem continuar limitadas por `user_id`.

### `financial_categories`

```text
id
user_id
name
type
color
is_active
created_at
updated_at
```

### `cash_closings`

```text
id
user_id
closing_date
income_total
expense_total
expected_cash
counted_cash
difference
notes
closed_at
reopened_at
reopen_reason
```

### `clients`

```text
id
user_id
name
phone
email
address
notes
is_archived
created_at
updated_at
```

### `client_tasks`

```text
id
user_id
client_id
text
due_date
completed_at
created_at
updated_at
```

### `audit_log`

```text
id
actor_user_id
entity_type
entity_id
action
before_data
after_data
created_at
```

O conteúdo do log deve evitar segredos e dados pessoais desnecessários.

## Segurança

- RLS obrigatória em todas as novas tabelas.
- Índice nas colunas usadas pelas políticas, especialmente `user_id`.
- Testes de isolamento entre dois usuários.
- Nenhuma senha adicional no frontend.
- A autenticação Supabase existente é a única barreira de acesso.
- Operações críticas devem usar confirmação contextual.
- Exclusão e reabertura devem produzir auditoria.
- Não integrar Gemini nesta etapa.
- Uma IA futura deve operar no servidor e receber apenas agregados consentidos.

## Migração de dados do sistema legado

A migração deve ser opcional e executada somente com backup fornecido pelo
responsável.

Fluxo recomendado:

1. selecionar arquivo JSON legado;
2. validar versão e estrutura com Zod;
3. mostrar contagem de transações, categorias e clientes;
4. mapear categorias antigas para categorias novas;
5. identificar duplicidades;
6. importar em transação;
7. gerar relatório final;
8. manter o arquivo original intacto.

O importador não deve aceitar objetos adicionais desconhecidos sem validação.

## Dependências

Não instalar dependências antes do plano de implementação.

Possíveis necessidades:

- `recharts` para gráficos;
- `lucide-react` para ícones.

Antes de instalar:

- verificar se gráficos CSS ou SVG simples atendem;
- verificar impacto no bundle;
- obter autorização;
- adicionar testes e executar auditoria.

Tailwind CDN e Google Fonts externas não serão incorporados.

## Estratégia de testes

### Domínio

- cálculo de receitas, despesas e saldo;
- agrupamento por pagamento;
- agrupamento por categoria;
- fechamento diário;
- diferença de dinheiro;
- filtros de período;
- validação de importação.

### Serviços

- CRUD com Supabase mockado;
- mapeamento entre banco e domínio;
- erros de autenticação;
- soft delete;
- isolamento por usuário;
- migrações e políticas RLS.

### Interface

- criação e edição de receitas e despesas;
- filtros;
- fechamento;
- estados vazios;
- mensagens de erro;
- teclado;
- telas mobile.

### Regressão

- atendimentos existentes continuam aparecendo;
- relatórios atuais continuam funcionando;
- login e logout permanecem protegidos;
- ferramentas públicas não são afetadas.

## Ordem recomendada de implementação

1. Especificação final do núcleo financeiro.
2. Migração segura da tabela `transactions`.
3. Serviço e schema de receitas e despesas.
4. Formulário e listagem financeira.
5. Categorias financeiras.
6. Dashboard.
7. Fechamento diário.
8. Relatórios por período.
9. Auditoria.
10. Clientes e tarefas.
11. Importador do legado.

## Critérios de aceite da primeira entrega

- registros existentes preservados como receitas;
- nova despesa pode ser criada, editada e listada;
- saldo corresponde a receitas menos despesas;
- filtros distinguem entradas e saídas;
- RLS testada;
- nenhuma senha fixa;
- nenhuma dependência de `localStorage`;
- nenhuma chave de IA no cliente;
- testes, lint e build aprovados;
- desktop e mobile validados;
- responsável aprova o fluxo localmente.

## Fora do escopo inicial

- assistente de IA;
- sincronização offline;
- PWA e service worker;
- CPF/CNPJ;
- conciliação bancária;
- emissão fiscal;
- contas a pagar recorrentes;
- estoque;
- integração automática com WhatsApp API;
- importação de múltiplos dispositivos sem revisão.

## Riscos e decisões pendentes

1. Definir se atendimento e transação financeira continuarão sendo a mesma
   entidade ou terão vínculo separado.
2. Definir se cartão será dividido em débito e crédito.
3. Definir se taxas de cartão serão registradas.
4. Definir regra de reabertura de caixa.
5. Obter um backup real do sistema legado para testar migração.
6. Confirmar se clientes devem ser vinculados a todos os atendimentos ou apenas
   quando necessário.

## Checklist para retomar na próxima sessão

1. Ler `.Agent/`.
2. Ler este documento.
3. Conferir `git status` e branch.
4. Conferir o esquema Supabase atual.
5. Verificar se há backup JSON real do caixa.
6. Responder às decisões pendentes do núcleo financeiro.
7. Criar especificação detalhada da Fase 1.
8. Criar plano TDD com migração, arquivos e testes.
9. Não implementar clientes ou IA antes de concluir o núcleo financeiro.

## Resultado esperado

Ao final do ciclo completo, o painel administrativo será a única aplicação
operacional da Plena para atendimentos, receitas, despesas, fechamento,
relatórios e clientes, com autenticação, persistência central, rastreabilidade e
uso seguro em mais de um dispositivo.
