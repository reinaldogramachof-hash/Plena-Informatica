# Registro de ação

## Identificação

- Data: `2026-11-10`
- Horário e fuso: `14:53 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Padronização visual dos cards de oferta das landing pages de produto
- Solicitação de origem: "aplique a mesma lapidação visual em todos os demais sistemas de gestão para ficarem padrões"
- Branch: `main`

## Diagnóstico

As 11 landing pages de produto usam **três sistemas de card de oferta diferentes**:

| Sistema | Páginas | Situação |
| --- | --- | --- |
| `clinical-price-card-clean` (card claro, seção clara) | terapia, fit, odonto | tipografia aplicada por estilo inline em cada página |
| `clinical-price-container` / `price-*` (card claro, seção escura) | lava-rápido, PDV, salas, sorveteria | **classes sem nenhuma regra no CSS** — preço e lista caíam no estilo padrão do navegador |
| `assistencia-price-card` (card escuro, seção escura) | assistência, barbearia, beleza, gastro | sistema próprio, com faixa diagonal "Mais procurado" |

Além disso, `produtos/assets/produtos.css` tinha uma **chave órfã** na linha 1978 (erro de sintaxe tolerado pelo navegador, mas inválido).

## Ações realizadas

1. **Componente compartilhado criado** em `produtos/assets/produtos.css`: `.offer-plans`, `.offer-card__name`, `.offer-card__desc`, `.offer-card__price`, `.offer-card__plus`, `.offer-card__flag`, `.offer-strip`. Ele nasceu do bloco que estava embutido na página de terapia.
2. **Grade adaptativa**: `repeat(auto-fit, minmax(0, 380px))` com `justify-content: center` — funciona com 1, 2 ou 3 ofertas sem regra por página.
3. **Terapia migrada** para o componente: 11 elementos renomeados e o bloco `<style>` local removido. A página caiu de 826 para 678 linhas.
4. **Fit e Odonto migrados**: 7 substituições por página, removendo tipografia inline de título, descrição e preço em favor das classes do componente.
5. **Lava-rápido, PDV, salas e sorveteria**: as classes `clinical-price-container`, `price-header`, `price-value`, `price-features` e `price-actions` receberam definição no CSS compartilhado — antes não existiam em lugar nenhum. Ganharam hierarquia de preço, lista com ícones alinhados, ações em largura total e ajuste para mobile.
6. **Chave órfã removida** de `produtos.css`; o arquivo passou a ser sintaticamente válido (871 regras parseadas).

## Validações

| Verificação | Resultado |
| --- | --- |
| `produtos.css` via PostCSS | válido, 871 regras |
| Terapia / Fit / Odonto | tags equilibradas, componente aplicado, sem `<style>` local |
| `git diff --check` | limpo (uma linha com espaço final corrigida) |
| CSS compartilhado | `.offer-plans` 8 ocorrências, `.offer-card__` 8, `.offer-strip` 5, `.price-value` 4 |

## O que ficou pendente

- **Assistência Pro, Barbearia Premium, Beleza & Spa e Gestão Gastro** continuam no sistema `assistencia-price-card` (card escuro, faixa diagonal). Converter essas quatro para o componente novo é uma passada própria: elas têm **quatro ofertas cada** (licença, dois planos mensais e projeto personalizado), então a conversão exige decisão sobre como mapear quatro ofertas na grade.
- `produtos/gestao-pdv.html` e `produtos/gestao-salas.html` têm alteração pendente de outro agente (uma linha final); não foram tocados.
- Validação visual pendente nas quatro páginas que ganharam estilo novo.

## Estado final

- Status: parcialmente implementado — 7 das 11 páginas padronizadas (3 migradas, 4 estilizadas), 4 pendentes.
- Commit: não realizado.
- Push: não realizado.
