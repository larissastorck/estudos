// Desafio bônus — Fiber simplificado (desafio oficial da fase)
//
// Fiber real do React usa: child, sibling, return (não next/prev).
// Um componente pode ter 1 filho direto, mas o filho pode ter irmãos.

class FiberNode {
  constructor(type) {
    this.type = type;
    this.child = null;
    this.sibling = null;
    this.return = null; // aponta pro pai
  }
}

function createFiberTree(node, returnFiber = null) {
  const fiber = new FiberNode(node.type);
  fiber.return = returnFiber;

  if (node.children && node.children.length > 0) {
    let previousSibling = null;

    node.children.forEach((child) => {
      const childFiber = createFiberTree(child, fiber);

      if (previousSibling === null) {
        fiber.child = childFiber;
      } else {
        previousSibling.sibling = childFiber; //
      }

      previousSibling = childFiber;
    });
  }

  return fiber;
}

export { FiberNode, createFiberTree };
