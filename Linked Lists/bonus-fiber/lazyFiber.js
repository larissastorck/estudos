// Versão "lazy" do Fiber: criação e percurso acontecem juntos, nó por
// nó, em vez de construir a árvore inteira de uma vez (createFiberTree)
// e só depois percorrer (workLoop). Isso é o que torna o processo
// pausável/retomável — ver README.md, seção "Criação preguiçosa".

class LazyFiberNode {
  constructor(type, pendingChildren = []) {
    this.type = type;
    this.pendingChildren = pendingChildren;
    this.child = null;
    this.sibling = null;
    this.return = null;
  }
}

function createFiber(node, returnFiber = null) {
  const fiber = new LazyFiberNode(node.type, node.children ?? []);
  fiber.return = returnFiber;
  return fiber;
}

function beginWork(fiber) {
  let previousSibling = null;

  fiber.pendingChildren.forEach((childNode) => {
    const childFiber = createFiber(childNode, fiber);

    if (previousSibling === null) {
      fiber.child = childFiber;
    } else {
      previousSibling.sibling = childFiber;
    }

    previousSibling = childFiber;
  });

  fiber.pendingChildren = [];
}

// Retorna o fiber onde parou (não-nulo = pausado, precisa retomar depois
// chamando workLoop de novo passando esse valor como `current`).
function workLoop(current, visit, shouldYield = () => false) {
  while (current && !shouldYield()) {
    visit(current);
    beginWork(current);

    if (current.child) {
      current = current.child;
      continue;
    }

    while (current && !current.sibling) {
      current = current.return;
    }

    if (current) {
      current = current.sibling;
    }
  }

  return current;
}

export { LazyFiberNode, createFiber, beginWork, workLoop };
