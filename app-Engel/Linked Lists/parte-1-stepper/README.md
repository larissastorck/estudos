# Parte 1 — Singly Linked List: histórico de navegação (stepper)

**Cenário real:** wizard/checkout multi-step (só avança, às vezes reseta do zero).

## Arquivos
- `StepHistory.js` — a linked list em si (StepNode + StepHistory), com os TODOs
- `CheckoutWizard.jsx` — componente React que usa StepHistory e renderiza a UI

## Como rodar
Coloquem os dois arquivos dentro de um projeto React (Vite, CRA, Next — tanto faz)
e importem `CheckoutWizard` em algum lugar da árvore, ex:

```jsx
import { CheckoutWizard } from './parte-1-stepper/CheckoutWizard';

function App() {
  return <CheckoutWizard />;
}
```

## Cronômetro: 40 min
Ver o desafio completo (contexto, perguntas de discussão, template de
dificuldades/retrospectiva) no arquivo `desafio-semanas-9-10-linked-lists.md`.
