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

// TODO: dado um objeto tipo:
// { type: 'div', children: [{type:'h1'}, {type:'p', children:[{type:'span'}]}] }
// construir a árvore de Fiber (child/sibling/return)
function createFiberTree(node, returnFiber = null) {}

export { FiberNode, createFiberTree };
