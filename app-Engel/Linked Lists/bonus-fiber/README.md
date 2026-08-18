# Bônus — Fiber simplificado

O desafio oficial sugerido da fase (Semanas 9–10 do plano).

## Arquivos
- `FiberNode.js` — a estrutura (FiberNode + createFiberTree)
- `workLoop.js` — o percurso que visita child → sibling → return

## Como testar
```js
import { createFiberTree } from './FiberNode';
import { workLoop } from './workLoop';

const tree = {
  type: 'div',
  children: [
    { type: 'h1' },
    { type: 'p', children: [{ type: 'span' }] },
  ],
};

const root = createFiberTree(tree);
workLoop(root, (fiber) => console.log(fiber.type));
// esperado: div, h1, p, span (ordem de visita depth-first)
```

Esse é o mesmo algoritmo (em miniatura) que o React usa pra percorrer
a árvore de componentes durante a reconciliation.
