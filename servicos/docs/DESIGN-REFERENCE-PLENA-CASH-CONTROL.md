# Referência visual — Plena Cash Control (sistema modelo)

_Capturado em 29/07/2026 a partir de prints reais do app standalone
(`Plena-Controle-de-Caixa--main`), rodando localmente. Esta é a fonte de
verdade visual para o port em `AdminShell`/Gestão Escritório no Hub._

## 1. Estrutura geral (todas as telas)

- **Topo (fora da sidebar):** dois botões persistentes no canto superior
  direito, presentes em **todas** as páginas, não só no Dashboard: "Fechar
  Caixa" (pílula escura/preta, ícone de check) e "Nova Transação" (pílula
  laranja, ícone de mais). São ações globais, não por página.
- **Botão flutuante de IA:** círculo gradiente azul/roxo com ícone de
  sparkle, fixo no canto inferior direito em todas as telas (assistente
  Gemini — já sabemos que fica fora de escopo nesta fase, mas o espaço
  visual/posição está reservado no layout de referência).
- **Sidebar:** sempre escura (gradiente quase preto), com seções agrupadas
  por título em maiúsculas cinza claro. O item ativo vira uma pílula sólida
  laranja com cantos arredondados, ícone + texto em branco/negrito.
- **Sidebar é colapsável de verdade:** um print mostra a sidebar totalmente
  escondida com o conteúdo ocupando a largura inteira, só o ícone de menu
  (☰) continua visível no canto superior esquerdo para reabrir. Isso
  confirma que o colapso no desktop é comportamento real do sistema modelo
  — deixei isso fora do escopo da rodada atual por decisão de foco, mas
  fica registrado aqui para uma futura rodada.
- **Topbar interna:** fundo branco, "HOJE" (cinza, caixa alta, pequeno) +
  data por extenso em português (`quarta-feira, 29 de julho`), avatar
  circular com iniciais brancas sobre fundo escuro.

## 2. Sidebar — conteúdo exato

```
[ícone carteira laranja]  PLENA
                           CONTROLE V2.0

PRINCIPAL
  [pie-chart]      Dashboard
  [arrows]         Transações

OPERACIONAL
  [users]          Clientes
  [briefcase]      Serviços

VISÃO GERAL
  [grid]           Relatórios

SISTEMA
  [gear]           Configurações

Desenvolvido por
Plena Informática
```

## 3. Telas capturadas

### Dashboard
- Card grande "Saldo em Caixa" em gradiente laranja→vermelho, ícone de
  carteira em caixa branca translúcida, badge "ATUAL" no canto.
- Três cards brancos menores: "Serviços Hoje" (ícone maleta azul),
  "Receitas" (seta verde para cima), "Despesas" (seta vermelha para baixo).
  Cada um com uma barra de progresso fina embaixo.
- Duas seções lado a lado: "Fluxo de Caixa" (gráfico de linha, seletor
  "Últimos 7 dias") e "Top Despesas" (estado vazio: "Nenhuma despesa").

### Transações (Histórico de Transações)
- Barra de busca "Buscar..." + filtro "Todos" com ícone de funil.
- Tabela: Data (com ícone de calendário) | Descrição | Categoria (badge
  cinza claro, ex.: "Serviços Digitais") | Qtd | Método | Valor (verde,
  negrito, com seta de entrada) | Ações (lápis de editar + lixeira).

### Clientes
- Estado vazio: ícone de pasta, "Nenhum cliente encontrado" (negrito) +
  "Adicione um novo cliente para começar a organizar." (cinza).
- Busca "Buscar cliente..." + botão laranja "Novo Cliente" (ícone de mais).

### Serviços (Controle de Serviços)
- Subtítulo: "Registre rapidamente a quantidade de serviços realizados no
  dia."
- Seletor de data + botão "Catálogo" (escuro) + botão "Relatório" (azul).
- Busca "Buscar serviço no catálogo...".
- Grid de cards por serviço (Impressão PB, Impressão Colorida, Xerox,
  Encadernação, Plastificação), cada um com um stepper: botão menos
  (escuro), contador central, botão mais (laranja).

### Relatórios (Relatório por Período)
- Dois seletores de data (de/até) + botão "Consolidar" (contorno laranja,
  ícone de upload) + botão de compartilhar (laranja) + botão de documento
  (laranja).
- Banner informativo azul claro: "Consolidação de Arquivos" + texto
  explicativo.
- Três cards de resumo: Receita do Período (ícone verde), Despesa do
  Período (ícone vermelho), Saldo do Período (ícone de cifrão, borda
  destacada laranja à direita).
- Seção "Desempenho Diário" com gráfico de barras/linha.

### Configurações
- Seção "Categorias": ícone de etiqueta laranja + botão "NOVA" (laranja).
  Grid de cards de categoria, cada um com um ponto colorido (cor própria da
  categoria), nome, rótulo "Entrada"/"Saída", ícone de lixeira. Dez
  categorias reais capturadas: Impressão e Xerox (verde, Entrada),
  Personalizados (verde claro, Entrada), Papelaria e Vendas (teal, Entrada),
  Serviços Digitais (azul, Entrada), Assistência Técnica (índigo, Entrada),
  Insumos — Tinta/Papel (vermelho, Saída), Matéria-Prima (rosa, Saída),
  Reposição Loja (laranja, Saída), Custos Fixos — Luz/Net (amarelo/laranja,
  Saída), Manutenção Máquinas (marrom, Saída).
- Seção "Gerenciamento de Dados": ícone de disquete/banco de dados,
  descrição ("Faça backup... dados são salvos apenas no navegador deste
  dispositivo"), botão "Exportar Backup (JSON)" (contorno laranja, ícone de
  download) + botão "Importar Dados" (escuro, ícone de upload).

## 4. Paleta (aproximada, a validar com o Codex contra as classes Tailwind reais do zip)

- Laranja de marca / ação primária: `#F17A02` → `#D55B1A` (gradiente)
- Sidebar: gradiente quase preto, `#111827` → `#0F172A` → `#020617`
- Verde (entrada/positivo): tom próximo de `#16A34A` / fundo claro `#DCFCE7`
- Vermelho (saída/negativo): tom próximo de `#DC2626` / fundo claro `#FEE2E2`
- Azul (info, ícone de serviços/maleta): tom próximo de `#2563EB` / fundo
  claro `#DBEAFE`
- Fundo geral do conteúdo: `#F8F9FA` (cinza muito claro)

## 5. Uso deste documento

Esta captura serve de checklist visual para validar o retorno do Codex sobre
o prompt `PROMPT-CODEX-adminshell-fidelidade-zip.md` (ícones reais +
agrupamento por seção). Qualquer divergência entre o que o Codex entregar e
o que está descrito aqui deve ser tratada como gap real, não como
"suficientemente parecido".
