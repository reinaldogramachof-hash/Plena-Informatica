# Registro de Execução - Reversão do Ajuste de Escala Visual do Modo Demonstração

- **Data/Hora**: 2026-11-10 09:55 BRT
- **Agente**: Antigravity
- **Solicitação**: "pode desfazer a alteração por favor, o sistema não ficou ajustado a tela."

---

## 1. Motivação
- A alteração experimental de escala (`zoom: 0.88`/`0.82`) aplicada no commit `23a28b1` aos arquivos `demo-bypass.js` e `produtos/assets/produtos.css` não produziu o enquadramento desejado pelo usuário em tela.
- Atendendo prontamente à solicitação, a alteração foi revertida na íntegra, restaurando o comportamento visual nativo anterior (commit `951b99d`).

---

## 2. Ações Implementadas
- Executado `git revert 23a28b1 --no-edit` gerando o commit `06f37e4`.
- Sincronizado com o repositório remoto `origin/main`.
- Os arquivos `produtos/assets/produtos.css`, `tecnologia/demos/gestao-fit/demo-bypass.js`, `tecnologia/demos/gestao-odonto/demo-bypass.js` e `tecnologia/demos/gestao-terapia/demo-bypass.js` voltaram ao estado estável anterior.
