# Registro de ação — remoção de referências a Personalizados

- Data: 2026-07-01
- Horário: 18:30
- Agente: Codex
- Escopo: desconectar o serviço descontinuado de Produtos Personalizados das páginas públicas do site institucional, preservando a narrativa em 2 pilares.

## Arquivos alterados

- `index.html`
- `script.js`
- `blog/index.html`
- `servicos/servicos.html`
- `tecnologia/tecnologia.html`
- `produtos/gestao-gastro.html`
- `personalizados/index.html`

## O que foi feito

- Reescrita de SEO, Open Graph, Twitter Card e JSON-LD da home e do blog para remover a antiga terceira frente.
- Remoção de links ativos para `personalizados/personalizados.html` nas páginas públicas do escopo.
- Remoção do card de Personalizados na home e ajuste do grid para 2 colunas em desktop.
- Reescrita editorial da home para manter a narrativa coerente com Tecnologia + Serviços Digitais.
- Reformulação da timeline da home para preservar o histórico da empresa sem manter a oferta descontinuada como frente atual.
- Remoção de depoimentos publicados que vendiam explicitamente o serviço antigo, sem inventar substituições.
- Criação de `personalizados/index.html` como página de contingência com redirecionamento para a home.
- Ajuste em `produtos/gestao-gastro.html` porque a menção não era coincidência: havia link ativo no footer apontando para a área descontinuada.

## Validações executadas

- Busca case-insensitive por `personalizados` no repositório com exclusões combinadas.
- Busca específica por `personalizados/personalizados.html` fora da pasta `personalizados/` e das áreas excluídas.
- Checagem visual local em `http://127.0.0.1:4173/` e `http://127.0.0.1:4173/tecnologia/tecnologia.html` para validar navegação e layout após a remoção.
- `git diff --check -- index.html script.js blog/index.html servicos/servicos.html produtos/gestao-gastro.html tecnologia/tecnologia.html personalizados/index.html`

## Resultado da varredura final

- Links ativos para `personalizados/personalizados.html` nas páginas públicas do escopo: `0`
- Ocorrências restantes de `personalizados` nas páginas públicas alteradas: `5`, todas concentradas no parágrafo legal replicado.

## Decisões sinalizadas ao responsável

1. Parágrafo legal:
   Mantido sem alteração em `index.html`, `blog/index.html`, `servicos/servicos.html`, `tecnologia/tecnologia.html` e `produtos/gestao-gastro.html`, porque o texto pode precisar continuar cobrindo pedidos antigos já entregues. Depende de decisão do responsável.

2. Depoimentos:
   Em vez de substituir a fala da Joana Silva por texto novo inventado, foram removidos do carrossel todos os depoimentos que promoviam explicitamente Personalizados, Canecas, Brindes, Uniformes ou contratação conjunta desse serviço.
