# Registro de Ação - Auditoria UX e Técnica da Página Inicial (index.html)

## Identificação

- Data: `2026-07-01`
- Horário e fuso: `19:40 America/Sao_Paulo`
- Agente: `Antigravity`
- Pacote ou tarefa: `Auditoria técnica e UX da página inicial do Site Institucional Plena`
- Solicitação de origem: Realizar uma auditoria técnica e UX da página inicial em viewports Desktop e Mobile e salvar os achados e classificação de severidade.
- Branch: `main` (local)

## Escopo

- Objetivo: Realizar auditoria da página `http://localhost:8080/index.html` nos viewports Desktop (1440x900) e Mobile (375x812), capturando evidências de rede, console, usabilidade, acessibilidade e responsividade.
- Arquivos permitidos: `.Agent/REGISTROS/2026-07-01-auditoria-ux-index.md`
- Arquivos reservados: Arquivos de produção do site
- Critérios de aceitação:
  - Relatório contendo análise técnica de console, rede e carregamento.
  - Análise de UX da proposta de valor, hierarquia e CTAs.
  - Registro detalhado das seções em screenshots para ambos os viewports.
  - Classificação de severidade dos problemas encontrados.
  - Resumo de 5-8 linhas listando os 3 problemas prioritários.

---

## 1. Auditoria Desktop (1440x900)

### Comportamento e Carregamento
A página inicial carrega com boa velocidade visual. Não foram notados travamentos ou Layout Shifts severos na renderização das seções iniciais.

### Console e Rede
- **Erros graves:** Nenhum erro de carregamento de scripts ou recursos (imagens/CSS/JS).
- **Warnings:** O console apresenta o seguinte alerta recorrente relacionado ao carregamento do Tailwind CSS em tempo de execução:
  `"cdn.tailwindcss.com should not be used in production"`
- **Requisições de Rede:** Todas as requisições estáticas locais de assets foram atendidas sem erros 404.

### Análise de UX e Conteúdo
- **Proposta de Valor:** Clara e visível acima da dobra. O subtítulo deixa claro que a Plena é um hub de multisserviços atuante em SJC.
- **CTAs:** Bem posicionados e com cores contrastantes (laranja para soluções e verde para o botão flutuante/secundário do WhatsApp). Os textos são explicativos ("Conhecer Soluções", "Falar no WhatsApp").
- **Navegação:** O menu principal possui links de âncora que rolam suavemente até as seções correspondentes (`#services`, `#journey`, `#testimonials`, `#contact`). O link para o `/blog/` está configurado corretamente.

### Evidências Fotográficas (Desktop)
- **Hero/Dobra Principal:** [desktop_hero_clean.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_hero_clean_1782945328640.png)
- **Cards de Serviços:** [desktop_services_cards.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_services_cards_1782945344319.png)
- **Diferenciais:** [desktop_differentiators.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_differentiators_1782945353201.png)
- **Linha do Tempo (História - P1):** [desktop_history_part1.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_history_part1_1782945366638.png)
- **Linha do Tempo (História - P2):** [desktop_history_part2.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_history_part2_1782945374867.png)
- **Depoimentos:** [desktop_testimonials.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_testimonials_1782945382392.png)
- **Footer/Rodapé & Contatos:** [desktop_footer.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/desktop_footer_1782945395918.png)

---

## 2. Auditoria Mobile (375x812 - iPhone padrão)

### Responsividade e Adaptabilidade
- **Overflow Horizontal:** Não foram identificados elementos vazando lateralmente. A largura da página se adapta de forma sólida.
- **Leitura:** O tamanho das fontes em títulos e parágrafos mantém-se legível sem necessidade de zoom.
- **Áreas de Toque (CTAs):** A maior parte dos botões atende ao padrão mínimo de 44x44px de área de toque.
- **Menu Mobile (Hambúrguer):** Funciona perfeitamente. Ao clicar, a gaveta expande suavemente e exibe os links do menu e o CTA do WhatsApp de forma limpa.
- **Imagens:** O logotipo e demais ícones redimensionam sem distorção. A disposição de blocos em zigue-zague da linha do tempo é convertida para uma coluna linear vertical simples que faz bastante sentido no mobile.

### Evidências Fotográficas (Mobile)
- **Hero/Dobra Principal:** [mobile_hero.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_hero_1782945426771.png)
- **Menu Hambúrguer (Aberto):** [mobile_menu_open.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_menu_open_1782945435072.png)
- **Estatísticas:** [mobile_statistics.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_statistics_1782945445387.png)
- **Serviços (Digitais/Cards):** [mobile_service_card_1.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_service_card_1_1782945456613.png)
- **Serviços (Personalizados/Cards):** [mobile_service_card_2.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_service_card_2_1782945464070.png)
- **Serviços (Tecnologia/Cards):** [mobile_service_card_3.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_service_card_3_1782945470963.png)
- **Diferenciais:** [mobile_differentiators.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_differentiators_1782945481540.png)
- **Linha do Tempo (P1):** [mobile_history_part1.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_history_part1_1782945493517.png)
- **Linha do Tempo (P2):** [mobile_history_part2.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_history_part2_1782945506221.png)
- **Depoimentos (P1):** [mobile_testimonials_part1.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_testimonials_part1_1782945519132.png)
- **Depoimentos (P2):** [mobile_testimonials_part2.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_testimonials_part2_1782945531792.png)
- **Footer/Rodapé:** [mobile_footer.png](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/mobile_footer_1782945548965.png)

---

## 3. Auditoria Técnica Geral

- **Acessibilidade:** A tag `<img>` do logotipo principal no cabeçalho não possui um atributo `alt` definido ou ele está vazio, dificultando a leitura da marca principal para deficientes visuais.
- **Links Suspeitos/Quebrados:**
  - O link para a seção de personalizados aponta diretamente para o arquivo `personalizados/personalizados.html`. Se o usuário tentar acessar a URL da pasta (`/personalizados/`), o servidor estático local gera listagem de diretório aberta devido à ausência de um arquivo `index.html` na raiz do diretório.
- **Performance:** O carregamento do Tailwind CSS em tempo de execução (`cdn.tailwindcss.com`) é prático para desenvolvimento local, mas causa atrasos e avisos de console em produção. Recomenda-se compilar os estilos e gerar uma folha de estilos CSS pura para produção.

---

## 4. Classificação dos Achados

### [ALTO] Exposição de Árvore de Diretórios em `/personalizados/`
* **Localização:** Estrutura de pastas do repositório.
* **Problema:** A pasta `/personalizados/` carece de um arquivo `index.html`, o que expõe a árvore de diretórios quando acessada diretamente via URL raiz da pasta no servidor.
* **Impacto:** Segurança e visual do site ao navegar diretamente para a subpasta.
* **Evidência:** [Diretório Personalizados](file:///C:/Users/reina/.gemini/antigravity-ide/brain/95807bcb-3cd7-4653-af71-5bd935e6e9dd/personalizados_dir_1782943893125.png)

### [MÉDIO] Dependência de Tailwind CSS CDN em Produção
* **Localização:** `<head>` do documento `index.html` (e páginas filhas).
* **Problema:** Uso da tag de script do Tailwind em tempo de execução que gera warnings no console do desenvolvedor.
* **Impacto:** Atraso na compilação do estilo CSS final e potencial Layout Shift no carregamento.
* **Evidência:** Console warning do navegador.

### [MÉDIO] Falta de Atributo `alt` na Imagem de Logo
* **Localização:** Cabeçalho do site (`<header> -> <nav> -> <a> -> <img>`).
* **Problema:** A tag `<img>` do logotipo não tem uma descrição `alt` definida.
* **Impacto:** Acessibilidade prejudicada para leitores de tela.
* **Evidência:** Inspeção do DOM da página.

### [SUGESTÃO] Redirecionamento de URLs de Serviços
* **Localização:** Seção de Serviços/Cards.
* **Problema:** Links diretos para arquivos `.html` (ex: `tecnologia/tecnologia.html`).
* **Impacto:** URLs limpas e sem extensão melhoram a experiência do usuário e SEO.

---

## Resumo dos 3 Problemas Principais a Corrigir Primeiro

1. **Adicionar arquivo `index.html` com redirecionamento de segurança em `/personalizados/`:** Evita que usuários acessem a árvore aberta de arquivos de mídia e stubs caso entrem na URL da subpasta diretamente.
2. **Substituir o Tailwind CSS em tempo de execução por um build estático:** Elimina o script da CDN de desenvolvimento do `<head>`, melhorando sensivelmente a performance de renderização inicial da página.
3. **Adicionar o atributo de acessibilidade `alt` na imagem do header:** Resolve o único problema pontual detectado de semântica e acessibilidade da página inicial para leitores de tela.
