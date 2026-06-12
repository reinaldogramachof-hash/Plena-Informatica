# Auditoria do Hub de Serviços Digitais
**Data:** 12 de junho de 2026  
**Foco:** Evolução funcional e entrega final ao usuário  
**Escopo:** 11 ferramentas em `servicos/hub/src/features/tools/`

---

## Resumo executivo

Todas as 11 ferramentas estão registradas no `tool-registry.ts` e com `status: 'available'`. O código-base é sólido, modular e consistente. A auditoria identificou **zero bloqueadores críticos** e mapeou **oportunidades de evolução funcionais concretas** por ferramenta.

---

## Status por ferramenta

### 1. Gerador de QR Code (`qr-code`) — roadmapOrder: 1
**Estado:** Operacional e bem estruturado.

**Pontos fortes:**
- 6 modos: Link, Texto, WhatsApp, Telefone, Wi-Fi, Pix Copia e Cola.
- Validação robusta via Zod no domínio.
- Prévia em tempo real + download PNG.
- Nota de privacidade visível.

**Lacunas de evolução:**
- Não há opção de **download em PDF** (útil para imprimir QR Code em tamanho maior para uso em lojas e vitrines).
- Não há opção de **customização de cor** do QR Code (fundo e módulos), o que diferenciaria o produto.
- O campo Pix aceita apenas "Pix Copia e Cola" — **não gera payload Pix a partir dos dados do recebedor** (nome, chave, cidade, valor). Isso é uma limitação significativa para o público MEI.
- Nenhum **upsell** para impressão na Plena (ex.: "Quer esse QR Code impresso? Leve o PNG à Plena").

**Recomendação de prioridade:** Média — adicionar geração de Pix a partir de chave é alto valor para o público-alvo.

---

### 2. Imagens para PDF (`images-to-pdf`) — roadmapOrder: 2
**Estado:** Operacional.

**Pontos fortes:**
- Aceita JPEG e PNG, reordenação drag-free (↑↓), opções de orientação e margem.
- Prévia com thumbnail de cada imagem.
- Object URLs revogadas corretamente no unmount.

**Lacunas de evolução:**
- Não suporta **WebP**, formato hoje padrão em câmeras de celular e screenshots modernos.
- Não há opção de **redimensionamento/compressão** antes de embutir (PDFs podem ficar pesados com fotos de alta resolução).
- Reordenação por seta (↑↓) é funcional mas não é tão intuitiva quanto drag-and-drop — experiência inferior para o usuário mobile.
- Estado vazio não tem CTA claro; apenas o botão de upload está disponível.

**Recomendação de prioridade:** Média — suporte a WebP é o mais urgente (impacto direto no uso mobile).

---

### 3. Unificador de PDFs (`merge-pdf`) — roadmapOrder: 3
**Estado:** Operacional.

**Pontos fortes:**
- Validação de tipo, tamanho total e quantidade de arquivos.
- Exibe contagem de páginas por arquivo (leitura assíncrona de metadados).
- Reordenação ↑↓ funcional.

**Lacunas de evolução:**
- Mesma limitação de UX: reordenação por botão, não drag-and-drop.
- Não há **prévia das primeiras páginas** dos PDFs adicionados (o usuário não sabe se selecionou o arquivo certo antes de unificar).
- Não há opção de **remover páginas individuais** — ferramenta adjacente valiosa que poderia ser um modo dentro da ferramenta.
- O limite de arquivos e o limite de tamanho total não estão visíveis na UI antes de ocorrer o erro (o usuário só descobre ao ultrapassar).

**Recomendação de prioridade:** Baixa-Média — exibir limites proativamente melhora muito a UX sem custo de desenvolvimento alto.

---

### 4. Criador de Currículo (`resume-builder`) — roadmapOrder: 4
**Estado:** Operacional e com a arquitetura mais rica do Hub (5 templates).

**Pontos fortes:**
- 5 templates: Clássico ATS, Executivo, Moderno, Primeiro Emprego, Criativo.
- Prévia ao vivo (`ResumePreview`).
- Indicador de progresso de preenchimento (X de 5 campos obrigatórios).
- Focus management no download com campos inválidos.
- Templates com badge ATS + aviso de compatibilidade.

**Lacunas de evolução:**
- Não há campo de **LinkedIn** ou **portfólio/GitHub** nos dados pessoais — cada vez mais presentes em currículos modernos.
- O campo "Resumo profissional" não tem contagem de caracteres visível (maxLength 700, sem feedback ao usuário).
- Habilidades são inseridas em texto livre (separadas por vírgula/quebra de linha) — sem **tags interativas** de competências, o que é padrão de mercado e melhora muito a UX.
- Não há orientação de conteúdo contextual (ex.: dicas de como escrever boas descrições de experiência) — seria um diferencial para o público de primeiro emprego.
- `persistence: 'optional'` no manifest, mas não há implementação de salvamento — o dado se perde ao fechar o navegador.

**Recomendação de prioridade:** Alta — o `localStorage` para persistência da sessão é o item mais impactante e está prometido no manifest.

---

### 5. Gerador de Declarações (`declaration-builder`) — roadmapOrder: 5
**Estado:** Operacional e com a maior variedade de modelos do Hub (6 templates).

**Pontos fortes:**
- 6 modelos: Residência, Trabalho e Renda, Autorização de Menor, Recibo, Orçamento, Personalizada.
- Prévia A4 ao vivo no painel lateral.
- Avisos claros de uso responsável e limitações legais por template.
- Orçamento com tabela de itens e cálculo de total.

**Lacunas de evolução:**
- O modelo **Orçamento** tem campo "Valor unitário" em texto livre — não há **formatação automática de moeda** nem validação numérica, o que pode gerar erros de digitação.
- Não há campo de **logotipo/logo** do emitente no Orçamento — muito solicitado por autônomos e MEIs.
- O Recibo não tem **numeração sequencial** ou campo de número do recibo, que é padrão em recibos profissionais.
- `persistence: 'optional'` no manifest, sem implementação. Um usuário que fecha a aba perde tudo que preencheu.
- Não há **validação de CPF/CNPJ** — o campo aceita qualquer string, o que pode gerar documentos inválidos.

**Recomendação de prioridade:** Alta — formatação de moeda no Orçamento e numeração no Recibo são quick wins de alto impacto.

---

### 6. Checklist MEI e IRPF (`mei-irpf-checklist`) — roadmapOrder: 6
**Estado:** Operacional com fluxo em 4 etapas.

**Pontos fortes:**
- Fluxo guiado por etapas (Tema → Situação → Perguntas → Checklist).
- Avisos de uso responsável em destaque.
- Progress bar de itens marcados.
- Ação de impressão disponível.

**Lacunas de evolução:**
- **Não há download em PDF** do checklist gerado — a ação de "Imprimir ou salvar em PDF" depende do usuário saber usar o recurso de impressão do navegador para salvar PDF. Isso é uma barreira para usuários não técnicos.
- Ao reiniciar (`handleReset`), não há confirmação de diálogo — um clique acidental apaga todo o progresso.
- `persistence: 'optional'` no manifest sem implementação — o progresso do checklist (itens marcados) se perde ao fechar.
- O fluxo de IRPF pula a etapa "Situação" e vai direto para as perguntas — o indicador de etapas mostra 4 passos mas o IRPF usa apenas 3, o que pode confundir.

**Recomendação de prioridade:** Alta — o download PDF do checklist é o maior gap funcional desta ferramenta.

---

### 7. Gerador de Cardápio (`menu-builder`) — roadmapOrder: 7
**Estado:** Operacional.

**Pontos fortes:**
- Suporte a categorias e itens dinâmicos.
- Opções de tamanho (A4 e meio sulfite) e colunas (1 ou 2).
- Estado vazio com ilustração e instrução clara.
- Nota de upsell para impressão na Plena.

**Lacunas de evolução:**
- **Não há prévia do PDF** antes do download — o usuário só vê o resultado final após gerar. Para um cardápio, isso é um problema: o usuário precisa baixar, abrir o PDF e voltar para corrigir.
- Não há campo de **logotipo/logo** do estabelecimento.
- Não há opção de **telefone de contato ou endereço** no cardápio, que são informações essenciais para um material impresso.
- O preço do item é campo de texto livre — sem máscara de moeda, usuários podem digitar formatos inconsistentes (ex.: "R$10", "10,00", "R$ 10.00").
- Não há **reordenação de categorias** nem de itens dentro de uma categoria.

**Recomendação de prioridade:** Alta — a prévia do PDF antes do download é o gap mais crítico (afeta diretamente a experiência de uso).

---

### 8. Gerador de Cartão de Visitas (`business-card-creator`) — roadmapOrder: 8
**Estado:** Operacional com exportação dupla (PDF e PNG) e prévia ao vivo.

**Pontos fortes:**
- 3 estilos: Clássico, Moderno, Colorido.
- Prévia CSS ao vivo atualizada em tempo real.
- Download PDF, PNG e opção de imprimir prévia.
- Nota de upsell com preço (100 cartões por R$ 50,00).

**Lacunas de evolução:**
- **Somente 3 estilos** — não há personalização de cores dentro de um estilo. Um usuário que queira uma cor específica não tem como ajustar.
- Não há campo de **QR Code no cartão** — seria uma integração natural com a ferramenta de QR Code já existente no Hub.
- A prévia CSS e o PDF gerado podem divergir visualmente — não há garantia de fidelidade (problema recorrente com Canvas vs CSS).
- Frente e **verso do cartão** não são suportados — cartões de visita têm dois lados, e isso limita o produto.
- O campo "Site ou Instagram" aceita formatos mistos (`@perfil` ou `www.site.com`) sem normalização — pode gerar dados inconsistentes no PDF.

**Recomendação de prioridade:** Média — QR Code integrado ao cartão seria um diferencial de produto único no mercado.

---

### 9. Gerador de Etiquetas (`label-generator`) — roadmapOrder: 9
**Estado:** Operacional.

**Pontos fortes:**
- 3 layouts Pimaco padrão (2x6, 3x9, 4x13).
- Prévia CSS com grid dinâmico.
- Suporte a borda opcional.
- Aviso quando a quantidade excede a capacidade do layout (sem bloquear).
- Nota de upsell para impressão na Plena.

**Lacunas de evolução:**
- Etiquetas aceitam **apenas texto simples** — não há suporte a múltiplas linhas por etiqueta (ex.: nome na linha 1, endereço na linha 2). O usuário precisa compactar tudo em uma linha.
- Não há suporte a **etiquetas com QR Code** — seria uma combinação poderosa com a ferramenta de QR Code.
- Não há **importação de lista via CSV/planilha** — usuários com muitos destinatários (ex.: escritórios, lojas) precisam digitar um a um.
- A prévia CSS não é fiel ao PDF gerado em termos de quebra de linha e fonte.

**Recomendação de prioridade:** Média — importação via CSV seria transformadora para usuários corporativos.

---

### 10. Guia DAS MEI (`mei-das-guide`) — roadmapOrder: 10
**Estado:** Operacional com valores 2026 atualizados.

**Pontos fortes:**
- Valores INSS, ICMS e ISS de 2026 com fonte oficial rastreável.
- Aviso editorial obrigatório com link para o portal gov.br.
- Controle anual de meses pagos com download PDF.
- Nota de privacidade de sessão.

**Lacunas de evolução:**
- Não cobre o tipo **"Transporte autônomo de cargas"** (INSS de 12%, não 5%) — o código tem comentário reconhecendo isso, mas a UI não exibe essa opção. É um gap real para uma parcela do público MEI.
- Não há campo de **data de vencimento visível** por mês no calendário de controle — seria útil mostrar "Vence dia 20/01", "Vence dia 20/02" etc.
- A marcação dos meses pagos se perde ao fechar a aba (`session-notice` informa isso) — sem `localStorage` o usuário perde o controle mensal a cada sessão.
- Não há **calculadora de multas por atraso** — é uma informação que o público MEI busca frequentemente.

**Recomendação de prioridade:** Média — adicionar transportador de cargas fecha uma lacuna documentada no próprio código.

---

### 11. Calculadora de Impressão (`print-cost-estimator`) — roadmapOrder: 11
**Estado:** Operacional com resultado e download PDF.

**Pontos fortes:**
- Comparativo visual Impressora Própria vs Plena com veredicto.
- Campos de custo da impressora em painel accordeon (não polui o layout inicial).
- Download PDF do comparativo.
- Disclaimer editorial claro.
- Preços da Plena hardcoded com constantes nomeadas (fácil de atualizar).

**Lacunas de evolução:**
- Os preços da Plena (`PLENA_PRICE_BLACK = 3.00`, `PLENA_PRICE_COLOR = 4.00`) estão hardcoded — se os preços mudarem, exige deploy. Não há nota de "preços atualizados em [data]" para o usuário.
- Não inclui **energia elétrica** no cálculo da impressora própria (o disclaimer menciona isso, mas seria mais preciso incluir um campo opcional de kWh).
- Não há **cenário de impressão duplex** — usuários com impressoras duplex têm custo de papel diferente.
- O campo "Páginas em preto" e "Páginas coloridas" começa vazio — o resultado inicial mostra todos os valores como R$ 0,00 sem orientação, o que pode confundir sobre o que fazer primeiro.
- Botão "Imprimir tela" usa `window.print()` diretamente — em mobile, o resultado pode ser inesperado.

**Recomendação de prioridade:** Baixa — adicionar data de atualização dos preços é o item mais simples e mais importante.

---

## Matriz de priorização

| # | Ferramenta | Gap crítico | Esforço | Impacto |
|---|---|---|---|---|
| 1 | Checklist MEI/IRPF | Download PDF do checklist | Baixo | Alto |
| 2 | Gerador de Cardápio | Prévia do PDF antes do download | Médio | Alto |
| 3 | Criador de Currículo | Persistência via localStorage | Médio | Alto |
| 4 | Declarações | Formatação de moeda no Orçamento | Baixo | Alto |
| 5 | QR Code | Geração de payload Pix por chave | Médio | Alto |
| 6 | Guia DAS MEI | Transportador de cargas (12% INSS) | Baixo | Médio |
| 7 | Etiquetas | Importação via CSV | Alto | Alto |
| 8 | Cartão de Visitas | QR Code integrado ao cartão | Alto | Médio |
| 9 | Imagens para PDF | Suporte a WebP | Baixo | Médio |
| 10 | Unificador de PDFs | Exibir limites proativamente | Baixo | Médio |
| 11 | Calculadora Impressão | Data de atualização dos preços | Baixo | Baixo |

---

## Padrões transversais identificados

**Positivos (consistentes em todo o Hub):**
- `triggerDownload` padronizado com `Blob` + `URL.createObjectURL` + revogação imediata.
- Separação DDD rigorosa: domínio puro sem imports React, UI sem lógica de negócio.
- Estados de loading, erro e botão desabilitado presentes em todas as ferramentas.
- Notas de privacidade e processamento local visíveis em todas as ferramentas.
- Acessibilidade: `aria-label`, `role="alert"`, `aria-live` presentes de forma consistente.

**Oportunidades transversais:**
- **Persistência de sessão via `localStorage`:** 3 ferramentas têm `persistence: 'optional'` no manifest sem implementação (`resume-builder`, `declaration-builder`, `mei-irpf-checklist`). Um hook compartilhado de `useLocalStorageState` resolveria os três de uma vez.
- **Reordenação drag-and-drop:** `merge-pdf` e `images-to-pdf` usam botões ↑↓. Uma biblioteca leve como `@dnd-kit/core` (já disponível ou a autorizar) melhoraria os dois.
- **Upsell consistente:** Algumas ferramentas têm CTA para a Plena (`label-generator`, `business-card-creator`), outras não (`qr-code`, `images-to-pdf`, `merge-pdf`). Padronizar o bloco de upsell como componente reutilizável aumentaria conversão.

---

## Conclusão

O Hub está **sólido e apto para receber tráfego**. Os gaps identificados não são bugs — são evoluções funcionais que aumentariam retenção, conversão e satisfação do usuário. Os três itens de maior retorno imediato são:

1. **Download PDF do Checklist MEI/IRPF** — esforço baixo, impacto direto na entrega da ferramenta.
2. **Prévia do PDF no Cardápio** — elimina o ciclo frustrante de gerar → baixar → corrigir → regerar.
3. **Hook de persistência localStorage** — resolve simultaneamente Currículo, Declarações e Checklist.
