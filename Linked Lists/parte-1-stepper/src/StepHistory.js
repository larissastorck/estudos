// Parte 1 — Singly Linked List
// Cenário real: histórico de navegação de um wizard/checkout multi-step.
// Só andamos pra frente e, às vezes, resetamos do zero — não precisamos
// voltar "soltando" nós, então uma lista simples (singly) já resolve.

class StepNode {
  constructor(label, data) {
    this.label = label;
    this.data = data;
    this.next = null;
  }
}

// StepHistory é a estrutura de dados (a linked list em si) —
// não é o componente visual. Ela fica "por baixo" de um componente
// tipo Stepper/Wizard, controlando qual step é o atual e o histórico
// de navegação. O componente React (CheckoutWizard.jsx) é quem usa
// essa classe e renderiza o step + breadcrumb na tela.
class StepHistory {
  constructor() {
    this.head = null;
    this.current = null;
  }

  // TODO: adiciona um novo step depois do `current`
  // e move o `current` pra ele
  push(label, data) {
    const newNode = new StepNode(label, data);
    if(!this.head) {
      this.head = newNode;
      this.current = newNode;
    } else {
      /**.
       * o             -> 1           -> 2
       * 
       * head null     -> head = 1    -> head = 1
       * current null  -> current = 1 -> this.current.next = 2
       */
      this.current.next = newNode;
      this.current = newNode;
    }
  }

  // TODO: retorna um array com os labels do head até o current
  // (isso vira o breadcrumb visual)
  getBreadcrumb() {
    const breadcrumb = [];
    let current = this.head;
    while(current) {
      breadcrumb.push(current.label);
      current = current.next;
    }
    return breadcrumb;
  }

  // TODO: reseta tudo, current volta pro head
  reset() {
    this.current = this.head;
  }
}

export { StepNode, StepHistory };
