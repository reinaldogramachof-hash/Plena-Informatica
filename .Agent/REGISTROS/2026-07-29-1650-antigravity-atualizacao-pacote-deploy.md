# Registro de ação

## Identificação

- Data: `2026-07-29`
- Horário e fuso: `16:50 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Atualização e Redução do Pacote de Deploy (`deploy.zip`)
- Solicitação de origem: "Muito bom! Agora deploy.zip leia esse arquivo, compare tudo o que temos atualizado da página inicial e que não foi aplicado ao pacote de deploy focando em deixar atualizado para deixarmos o servidor atualizado, pode remover tudo o que for imagem do pacote, com excessão do novo logo e do hero, as demais imagens todas não foram alteradas no servidor então não precisamos mais das imagens neste pacote de deploy, liste para mim o que precisa ser atualizado no pacote."
- Branch: main

## Escopo

- Objetivo: Atualizar o arquivo compactado de deploy (`deploy.zip`) com os códigos mais recentes do workspace e remover arquivos de imagens/vídeos obsoletos ou não-modificados (visto que já existem no servidor) para otimizar o envio.
- Arquivos modificados no `deploy.zip`:
  - Códigos atualizados: `index.html`, `script.js`, `style.css`, `blog/index.html`, `servicos/servicos.html`, `tecnologia/tecnologia.html`.
  - Novos assets incluídos: `logoplena.svg`.
  - Assets mantidos: `plena.jpg`.
  - Arquivos removidos: Todas as demais 79 imagens (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.mp4`) que já estão salvas no servidor ou estão obsoletas (como a antiga logo `logo-plena.png` e o vídeo `hero.mp4`).

## Ações realizadas

1. Desenvolvido e executado um script automatizado em PowerShell (`prepare_deploy.ps1`) para orquestrar as seguintes etapas:
   - Extração temporária do `deploy.zip` anterior para `deploy_extracted`.
   - Cópia dos 8 arquivos atualizados do workspace diretamente sobre os arquivos da pasta extraída (garantindo que o código de deploy é 100% igual ao validado localmente).
   - Varredura e exclusão de **79 arquivos** de mídia (imagens e o vídeo `hero.mp4`), preservando unicamente no root o novo logo `logoplena.svg` e a imagem de fundo do hero `plena.jpg`.
   - Compactação e recriação do pacote `deploy.zip` limpo e otimizado.
   - Remoção da pasta de extração temporária.

## Arquivos Atualizados no Pacote de Deploy

| Arquivo no Pacote | Motivo da Atualização |
| --- | --- |
| `index.html` | Novo Hero (imagem estática), reposicionamento do texto, tag no topo, nova seção de departamentos, seção de diferenciais ajustada (chatbot) e logo SVG aplicada. |
| `script.js` | Atualização do carrossel infinito com os 10 depoimentos reais do Google. |
| `style.css` | Efeito slow zoom no hero, nova máscara do carrossel para desktop/mobile e micro-interações de elevação/deslocamento nos cards. |
| `blog/index.html` | Logo da barra de navegação principal atualizada para `../logoplena.svg`. |
| `servicos/servicos.html` | Logo da barra de navegação principal atualizada para `../logoplena.svg`. |
| `tecnologia/tecnologia.html` | Logo do cabeçalho atualizado para a versão SVG branca de tamanho padronizado (`h-20`). |
| `logoplena.svg` | **[NOVO]** Vetor do novo logo Plena Informática. |
| `plena.jpg` | **[NOVO/MANTIDO]** Imagem de plano de fundo do Hero. |

## Tamanho e Otimização do Pacote
- **Total de mídias deletadas**: 79 arquivos (incluindo o vídeo de 6.2MB e imagens pesadas de ~2MB cada).
- **Resultado**: O pacote ficou extremamente leve e otimizado para subida no servidor de hospedagem.
