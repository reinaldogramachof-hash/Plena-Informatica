# Registro de ação

## Identificação

- Data: 2026-07-31
- Horário e fuso: 15:30 America/Sao_Paulo
- Agente: Codex
- Pacote ou tarefa: Portal comercial de Sites Premium
- Solicitação de origem: aprovação do responsável para construir a landing e validar visualmente
- Branch: `main`

## Escopo aprovado

- Criar `tecnologia/sites-premium/index.html` como portal comercial dedicado.
- Criar os recursos locais de estilo, interação e imagem do portal.
- Conectar a vitrine e a navegação de Tecnologia ao portal, preservando a aba e os modelos existentes.
- Implementar uma cena 3D progressiva, com fallback estático e respeito a redução de movimento.

## Limites

- Não alterar páginas de produtos, modelos existentes ou arquivos fora do fluxo Sites Premium.
- Não inventar depoimentos, clientes, métricas ou preços não aprovados.
- Não publicar, criar commit ou fazer push sem nova autorização.

## Critérios de aceite

1. Portal com hero, catálogo de segmentos, método, diagnóstico e CTAs contextuais.
2. Cena 3D com fallback, acessível e sem bloquear a leitura ou o mobile.
3. Rotas entre Tecnologia, portal e os dois modelos navegáveis funcionando.
4. Validação de sintaxe, links, responsividade e visual em navegador local.

## Execução concluída

- Criados `tecnologia/sites-premium/index.html`, `portal.css` e `portal.js`.
- Incluída a arte autoral `assets/portal-hero.png` como hero e fallback visual.
- Incluído `assets/three.min.js` (Three.js 0.160.1) para a cena 3D procedural do hero.
- A cena é desativada em telas até 760 px, quando há preferência por redução de movimento ou quando WebGL não está disponível.
- Atualizados os links desktop e mobile de `tecnologia/tecnologia.html` e incluído um card de entrada do portal na aba Sites Premium.

## Validações

| Verificação | Resultado |
| --- | --- |
| HTTP local: portal e dois modelos | `200` para as três rotas |
| Sintaxe de `portal.js` | Aprovada por `node --check` |
| Referências locais do portal | CSS, JS, Three.js, arte e links dos modelos conferidos |
| `git diff --check` | Sem erros |
| Captura visual desktop | Hero 3D e catálogo renderizados corretamente |
| Captura visual 390 px | Hero estático, CTAs e tipografia sem corte horizontal |

## Observações

- Nenhum preço, prova social ou cliente foi inventado.
- A working tree já continha alterações de outros agentes em produtos, scripts, modelos e registros; elas foram preservadas.
- Commit e push continuam pendentes de autorização explícita do responsável.
