# Registro de ação — servidor para validação visual

## Identificação

- Data: 2026-11-12.
- Horário e fuso: início às 09:31 America/Sao_Paulo.
- Agente: Codex.
- Pacote: início da sessão de ajustes visuais e preparação de deploy.
- Solicitação: subir o servidor local para validações visuais.
- Branch: main.

## Escopo e estado inicial

- Objetivo imediato: disponibilizar o site institucional localmente.
- Arquivos permitidos nesta etapa: este registro; execução do servidor existente, sem edição de código público.
- Arquivos reservados: código público, arquivos centrais do Hub e alterações preexistentes, sem modificações nesta etapa.
- Git inicial: cinco arquivos modificados (`produtos/assets/produtos.css`, `servicos/servicos.html`, seeds das demos Odonto e Sorveteria, `tecnologia/tecnologia.html`); três registros DeepSeek e `scratch_chrome_profile/` não rastreados. Tudo preservado.
- Critério de aceite: servidor acessível em loopback e rotas principais retornando HTTP 200.

## Ações e validações

1. Leitura da base obrigatória, decisões, feedbacks, README, documentação de desenvolvimento e ROADMAP do Hub.
2. Conferência do servidor existente e do manifesto anterior de deploy, sem tratar o pacote antigo como atualizado.
3. Inicialização em segundo plano de `tools/local/__local-site-server.mjs`, na raiz do projeto, em `http://127.0.0.1:8080/`.
4. Verificação HTTP: `/`, `/tecnologia/tecnologia.html`, `/produtos/gestao-terapia.html` e `/servicos/servicos.html` retornaram 200.

## Arquivos e limites

- Criado: este registro.
- Código público modificado: nenhum.
- Testes, lint e build: não executados nesta etapa de inicialização do servidor.
- Validação visual: aguardando a revisão local do responsável; HTTP 200 não atesta aparência.
- Ajustes fora do escopo: nenhum.

## Estado final

- Servidor local disponível para a sessão.
- Pacote final de produção pendente dos ajustes e validações desta sessão.
- Publicação, commit e push: não realizados.
