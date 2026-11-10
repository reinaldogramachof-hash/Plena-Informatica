# Registro de ação

## Identificação

- Data: `2026-11-10`
- Horário e fuso: `12:47 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Retirada da página de Serviços da navegação do site
- Solicitação de origem: "vamos remover a página de serviços e todas as referências sobre ela, assim focaremos todas as ações na página de tecnologia"
- Decisão complementar do responsável: remover apenas a lincagem do site, mantendo os arquivos para reversão fácil; documentação de `servicos/` preservada
- Branch: `main`

## Escopo

- Objetivo: retirar a página de Serviços da navegação e das entradas do site, deixando a página de Tecnologia como única superfície comercial.
- Arquivos alterados: `index.html`, `blog/index.html`, `produtos/gestao-gastro.html`, `tecnologia/tecnologia.html`, `sitemap.xml`, `.htaccess`, `servicos/README.md`.
- Arquivos preservados por decisão: todo o conteúdo de `servicos/` (`servicos.html`, `style.css`, `script.js`, `hub-app/`, `hub/`, `docs/`, `supabase/`, `ROADMAP.md`).
- Critérios de aceite: nenhum link público para `servicos/`; página mantida para reversão; destino antigo redireciona para Tecnologia; sitemap coerente.

## Estado inicial

- Git: `main` com alterações pendentes desta sessão em `tecnologia/` e `.htaccess`/`sitemap.xml`.
- Links para a página de Serviços no site: 2 em `index.html`, 3 em `tecnologia.html`, 1 em `blog/index.html`, 1 em `produtos/gestao-gastro.html`, 1 no `.htaccess`, 2 no `sitemap.xml`.
- Riscos conhecidos: a página era o único ponto de entrada do Hub de ferramentas (11 ferramentas em `servicos/hub-app`).

## Ações realizadas

1. `index.html`: removido o card "Serviços Digitais / Utilitários para rotinas rápidas" da seção `#services`; o grid de duas colunas virou um único card centralizado (`max-w-2xl mx-auto`). Removido o item "Serviços Digitais" do rodapé. O título da seção passou de "Tecnologia, sistemas e serviços digitais" para "Tecnologia e sistemas", coerente com o único card restante.
2. `tecnologia/tecnologia.html`: removido o link "Serviços" da navbar desktop, do menu mobile e do rodapé ("Nossas Áreas").
3. `blog/index.html` e `produtos/gestao-gastro.html`: removido o item "Serviços Digitais" do rodapé.
4. `sitemap.xml`: removidas as entradas de `servicos/servicos.html` e de `servicos/hub-app/`; `lastmod` da home e da página de Tecnologia atualizado para `2026-11-10`.
5. `.htaccess`: `/servicos/` e `/servicos/servicos.html` passam a redirecionar 301 para `tecnologia/tecnologia.html`, em vez de servirem a página aposentada.
6. `servicos/README.md`: nota de estado registrando que a página saiu da navegação, que os arquivos foram mantidos de propósito e que a ausência de links não é defeito.

## Decisões registradas

- Nenhum arquivo de `servicos/` foi apagado: a retirada é só de lincagem, para reversão em um commit.
- O Hub de ferramentas continua publicado em `servicos/hub-app/`, acessível por URL direta, porém sem nenhum link no site. Se voltar a ser oferecido, precisa de um novo ponto de entrada.
- As menções textuais a "serviços digitais" em meta descrições, rodapé, linha do tempo e Termos de Uso foram mantidas: descrevem a área de atuação da empresa, não a página removida.
- `.Agent/REGISTROS/*` e `docs/*` não foram alterados: são histórico e registros são append-only.

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Varredura de links `servicos/` nos HTML públicos | nenhum |
| Verificação de links locais: `index.html` | 7 links, 0 quebrados |
| `tecnologia/tecnologia.html` | 44 links, 0 quebrados |
| `blog/index.html` | 14 links, 0 quebrados |
| `produtos/gestao-gastro.html` | 4 links, 0 quebrados |
| Balanço de tags dos quatro HTML | todos equilibrados |
| `sitemap.xml` | XML válido, 10 URLs (eram 12) |
| Arquivos de `servicos/` preservados | confirmados |

## Pendências e riscos

- **Validação visual pendente**: a seção de serviços da home passou a ter um único card centralizado; conferir o respiro em desktop e mobile.
- O item de menu "Serviços" da home continua apontando para a âncora `#services` (agora "Tecnologia e sistemas"). Se preferir alinhar o rótulo, é uma troca de uma palavra.
- Sem link, o Hub de ferramentas fica órfão para o visitante e para o Google.
- Os redirecionamentos dependem de o servidor aplicar o `.htaccess`.
- Commit não realizado.

## Estado final

- Status: implementado, aguardando validação local.
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: pendente.
