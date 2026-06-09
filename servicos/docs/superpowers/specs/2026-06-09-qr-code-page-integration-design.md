# Integracao da Pagina Dedicada do QR Code

## Objetivo

Conectar o card `Gerador de QR Code` da pagina principal de Servicos a uma
pagina dedicada, mantendo a identidade visual da Plena e o processamento
inteiramente local.

## Arquitetura

O codigo-fonte React permanece isolado em `servicos/hub`. O Vite gera a versao
publicavel diretamente em `servicos/ferramentas/qr-code/`, permitindo que a
pagina institucional use um link relativo estavel e independente do servidor
de desenvolvimento.

O aplicativo preserva o dominio e a interface testados do QR Code. A rota da
ferramenta recebe um shell institucional com navegacao, retorno ao catalogo,
conteudo principal e rodape. Nenhum iframe, upload ou conexao Supabase sera
usado.

## Fluxo

1. O usuario acessa `servicos/servicos.html`.
2. O card do QR Code apresenta o CTA ativo `Usar ferramenta`.
3. O CTA abre `servicos/ferramentas/qr-code/`.
4. O usuario gera e baixa o PNG localmente.
5. A navegacao permite voltar ao catalogo de ferramentas.

## Limites

- Somente o card do QR Code sera ativado.
- As demais ferramentas permanecem desabilitadas.
- O visual da pagina principal nao sera reestruturado.
- As alteracoes paralelas existentes em `servicos.html` e `style.css` serao
  preservadas.
- Nenhum commit ou push sera realizado pelo Codex.

## Validacao

- Teste automatizado do CTA na pagina institucional.
- Teste automatizado do shell e dos links de retorno.
- Suite completa, lint e build.
- Verificacao visual desktop e mobile.
- Fluxo real entre a pagina principal e a ferramenta.
