class StepNode {
  constructor(label = null, data = null) {
    this.label = label;
    this.data = data;
    this.next = null;
  }
}

class StepHistory {
  constructor() {
    this.head = new StepNode();
    this.current = this.head;
    this.size = 0
  }

  push(label, data) {
    const newNode = new StepNode(label, data)
    this.current.next = newNode
    this.current = newNode
    this.size++
  }

  getBreadcrumb() {
    const labels = [];
    let currentNode = this.head.next;

    while (currentNode) {
      labels.push(currentNode.label);

      if (currentNode === this.current) {
        break;
      }

      currentNode = currentNode.next;
    }

    return labels;
  }

  getCurrentLabel() {
    return this.current.label
  }


  resetAll() {
    this.head.next = null
    this.current = this.head
    this.size = 0
  }

  reset() {
    this.current = this.head
    this.size = 0
  }
}

export { StepNode, StepHistory };
