# Registro de ação

## Identificação

- Data: `2026-07-29`
- Horário e fuso: `15:58 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Tag Destacada no Topo do Hero
- Solicitação de origem: "agora no topo dentro do hero aplique um modal estilo tag destacando "mais de 20 anos de serviços digitais""
- Branch: main

## Escopo

- Objetivo: Inserir uma tag destacada (estilo badge ou modal) na parte superior do Hero com o texto "Mais de 20 anos de serviços digitais", posicionada de forma que não obstrua o centro da imagem de background e respeite o header fixo.
- Arquivos permitidos: `index.html`
- Arquivos reservados: Nenhum
- Critérios de aceite:
  - Criação de uma div posicionada de forma absoluta no topo do Hero (`top-28`) para ficar logo abaixo do menu de navegação.
  - Tag estilizada em formato de pílula (`rounded-full`) com efeito de vidro fosco (`bg-white/10 backdrop-blur-md border border-white/20`) e um ponto laranja pulsante (`bg-brand-orange/80 animate-pulse`).
  - O texto deve ser "Mais de 20 anos de serviços digitais" em caixa alta, fonte negrito e tamanho pequeno para manter o minimalismo e a clareza visual.

## Estado inicial

- Git: Alterações de simplificação e reposicionamento salvas, testes passando.
- Testes: Teste `tests/hero-image-contract.test.js` passava.
- Lint: Não configurado.
- Build: Não configurado.
- Riscos conhecidos: A tag pode conflitar verticalmente com o header se ficar muito acima, ou com a logo da imagem se ficar muito centralizada. O posicionamento em `top-28` resolve esse problema dando um respiro adequado.

## Ações realizadas

1. Inserida uma nova div absoluta em `index.html` posicionada em `top-28 left-0 right-0 z-20 text-center container mx-auto px-6`.
2. Adicionado o elemento de tag interna contendo o efeito de vidro (`bg-white/10 backdrop-blur-md border border-white/20`), bordas arredondadas e animação de entrada de fade-in (`animate-in` com atraso de `0.1s`).
3. Adicionado o ponto indicador laranja pulsante (`bg-brand-orange/80 animate-pulse`) para atração visual sutil.
4. Definido o texto "Mais de 20 anos de serviços digitais" estilizado com `text-white text-xs font-bold tracking-widest uppercase`.
5. Executados testes de contrato automatizados locais.

## Arquivos

### Criados

- Nenhum.

### Modificados

- [index.html](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/index.html)

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --test tests/hero-image-contract.test.js` | 1 pass, 0 fail (Sucesso) |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Nenhum.

## Estado final

- Status: Concluído.
- Commit: Pendente de commit pelo usuário.
- Push: Não realizado.
- Aprovação local: Aguardando verificação manual do responsável.
