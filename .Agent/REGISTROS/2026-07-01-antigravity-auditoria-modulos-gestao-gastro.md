# Auditoria de Funcionalidade: Demo Gestão Gastro

**Data:** 1 de julho de 2026
**Foco:** Verificação funcional de todos os módulos na demo pública
**Ambiente:** Servidor Local (`python -m http.server 8080`) no diretório `tecnologia/demos/gestao-restaurantes/`

---

## Resumo Executivo

- **Total de Módulos Avaliados:** 18
- **Módulos 100% Funcionais:** 0
- **Módulos com Estado Vazio / Quebrado (Sem Supabase):** 0
- **Módulos Quebrados por Erro de Build/Rotas (404):** 18

**Diagnóstico Geral:**
Nenhum módulo interno conseguiu renderizar além da estrutura principal e barra lateral. Todos os 18 módulos investigados sofrem de um erro crítico de falha de carregamento dinâmico (`Failed to load resource: the server responded with a status of 404`). 

O App principal (`index.js`) é carregado corretamente, porém, como todos os componentes são encapsulados em `React.lazy()` (Lazy Loading), o navegador tenta buscar os arquivos de chunk (ex: `assets/PDV-BOM6CQN7.js`), mas o React Router/Vite não consegue resolver os paths relativos devido a uma possível configuração incorreta de `base` no momento do build do `vite.demo.config.ts`, resultando em um erro fatal que redireciona o app para o estado de erro/fallback ou exibe uma tela vazia.

*Nenhuma chamada de rede foi registrada para domínios `*.supabase.co` durante a auditoria em nenhum dos módulos, dado que as dependências não conseguiram ser injetadas.*

---

## Auditoria por Módulo

### 1. Dashboard
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Dashboard-Dga7QqSU.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Dashboard](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_dashboard.png)

### 2. PDV
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/PDV-BOM6CQN7.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![PDV](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_pdv.png)

### 3. Mesas
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Tables-BHZixu7A.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Mesas](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_mesas.png)

### 4. Cozinha
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Kitchen-COvycyHn.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Cozinha](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_cozinha.png)

### 5. Caixa
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Cashier-BdcuizML.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Caixa](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_caixa.png)

### 6. Delivery
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Delivery-BhBQqXC7.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Delivery](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_delivery.png)

### 7. Pedidos Online
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/OnlineOrders-BH8ndGIG.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Pedidos Online](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_pedidos-online.png)

### 8. Cardápio Digital
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/MenuDigital-JXD9S6BN.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Cardápio Digital](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_cardapio-digital.png)

### 9. Estoque
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Stock-Ds2fiE3S.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Estoque](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_estoque.png)

### 10. Produtos
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Products-CGfEy07p.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Produtos](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_produtos.png)

### 11. Clientes
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Customers-BgwTSOaD.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Clientes](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_clientes.png)

### 12. Colaboradores
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Collaborators-DZwvUWBF.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Colaboradores](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_colaboradores.png)

### 13. Fornecedores
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Suppliers-BsJUJ0AA.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Fornecedores](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_fornecedores.png)

### 14. Relatórios
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Reports-DKARSBQC.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Relatórios](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_relatorios.png)

### 15. Inteligência
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Intelligence-Sn8DeGfp.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Inteligência](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_inteligencia.png)

### 16. Diário Operacional
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Diario-Cdt0a5cJ.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Diário Operacional](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_diario.png)

### 17. Configurações
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/Settings-Dj228wVX.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Configurações](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_configuracoes.png)

### 18. Comanda Mobile
- **Renderiza:** NÃO (falha crítica antes da montagem)
- **Dado exibido:** erro (404 no chunk JS)
- **Console limpo:** NÃO
  ```text
  TypeError: Failed to fetch dynamically imported module: http://localhost:8080/tecnologia/demos/gestao-restaurantes/assets/ComandaMobile-BLeIIOrF.js
  ```
- **Chamada de rede pra supabase.co:** NÃO
- **Screenshot:** ![Comanda Mobile](/C:/Users/reina/.gemini/antigravity-ide/brain/1e9ae528-4554-4aa6-a51e-238ab8f2f9d8/screenshot_comanda.png)
