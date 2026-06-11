# PLAN — Checklist MEI e IRPF

## Estrutura de arquivos
- `manifest.ts` — metadados da ferramenta
- `domain/checklist-catalog.ts` — perguntas e itens estáticos
- `domain/checklist-session.ts` — estado mutável do usuário
- `domain/build-checklist.ts` — lógica de filtragem dos itens
- `ui/MeiIrpfChecklistTool.tsx` — componente principal
- `ui/mei-irpf-checklist.css` — estilos com prefixo `mic-`

## Ordem de implementação (TDD)
1. Testes do catálogo
2. Implementar catálogo
3. Testes de sessão
4. Implementar sessão
5. Testes de build
6. Implementar build
7. Testes do componente
8. Implementar componente + CSS
