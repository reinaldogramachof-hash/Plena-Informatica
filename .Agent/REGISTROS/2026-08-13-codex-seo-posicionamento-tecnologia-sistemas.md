# Registro de acao - SEO tecnologia e sistemas

Data: 2026-08-13

## Objetivo

Aplicar ajustes pontuais apos auditoria SEO para reforcar o posicionamento da
Plena como empresa de tecnologia, sistemas de gestao e solucoes digitais para
multiplos nichos.

## Arquivos modificados

- `index.html`
- `servicos/servicos.html`
- `produtos/barbearia-premium.html`
- `produtos/beleza-spa.html`
- `produtos/gestao-gastro.html`
- `produtos/assistencia-pro.html`
- `tecnologia/projetos-sob-consulta/index.html`

## Alteracoes realizadas

- Reforco de title, description, Open Graph e H1 da home para tecnologia e
  sistemas de gestao.
- Reordenacao da secao inicial de departamentos da home para priorizar
  Tecnologia e Sistemas, deixando Servicos Digitais como frente de apoio.
- Adicionado JSON-LD `SoftwareApplication` nas quatro paginas de produto:
  Gestao Barbearia Pro, Gestao Beleza Pro, Gestao Gastro Pro e Gestao
  Assistencia Pro.
- Ajustada a pagina de Servicos Digitais para se apresentar como servicos de
  apoio, com JSON-LD `Service`.
- Encurtado o title de Projetos sob Consulta para foco em Sistemas Web Sob
  Medida, ERP e CRM.

## Validacoes

- JSON-LD das paginas editadas parseado com sucesso via `ConvertFrom-Json`.
- `git diff --check` executado nos arquivos editados sem erros.
- Conferidos titles, H1s e tipos de schema por busca textual.

## Pendencias e limites

- Nao foi concluida validacao HTTP local porque o servidor estatico iniciado em
  Node nao permaneceu ativo na porta de teste.
- Validacao publica e rich results devem ser feitas apos publicacao no servidor.