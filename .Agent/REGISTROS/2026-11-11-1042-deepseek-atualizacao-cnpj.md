# Registro de ação

## Identificação

- Data: `2026-11-11`
- Horário e fuso: `10:42 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Atualização do CNPJ da empresa no site
- Solicitação de origem: "substitua todas as referências do atual CNPJ para o CNPJ: 59.779.242/0001-78"
- Branch: `main`

## Escopo

- CNPJ anterior: `14.549.923/0001-35`
- CNPJ novo: `59.779.242/0001-78`
- Arquivos alterados: 12, todos no site ativo.

## Ações realizadas

Substituição em 12 arquivos (uma ocorrência em cada):

- `produtos/gestao-fit.html`, `gestao-gastro.html`, `gestao-lavarapido.html`, `gestao-odonto.html`, `gestao-pdv.html`, `gestao-salas.html`, `gestao-sorveteria.html`, `gestao-terapia.html` — rodapé "Plena Informática · Produto · CNPJ · São José dos Campos";
- `tecnologia/tecnologia.html` e `servicos/servicos.html` — linha de copyright do rodapé;
- `tecnologia/demos/gestao-odonto/assets/js/demo-seed.js` e `tecnologia/demos/gestao-sorveteria/assets/js/demo-seed.js` — campo CNPJ das empresas fictícias usadas nas demonstrações.

## Verificações

| Verificação | Resultado |
| --- | --- |
| Ocorrências do CNPJ antigo no site ativo | 0 |
| Arquivos com o CNPJ novo | 12 |
| Rodapés das páginas alteradas | íntegros, `</footer>` balanceado |
| `git diff --check` | limpo |

## Observações e pendências

- **Pacotes históricos em `deploy/`** (4 pastas de 2026-08-13) mantêm o CNPJ antigo por serem snapshots datados de publicações anteriores. Não foram alterados. Se algum deles for reutilizado para publicar, levará o número antigo.
- **Três páginas não têm CNPJ no rodapé**: `produtos/assistencia-pro.html`, `barbearia-premium.html` e `beleza-spa.html` usam o rodapé mínimo ("Plena Informática - Produto"), enquanto as outras oito trazem CNPJ e cidade. Não acrescentei o dado — é decisão editorial acrescentar.
- Os dois arquivos de demo usam o CNPJ da Plena como dado de empresas fictícias nos sistemas demonstrativos. Foi atualizado por consistência, mas vale avaliar se um dado fictício deveria carregar o CNPJ real da empresa.
- Commit e push não realizados nesta rodada.

## Estado final

- Status: implementado, aguardando validação local.
- Commit: não realizado.
- Push: não realizado.
