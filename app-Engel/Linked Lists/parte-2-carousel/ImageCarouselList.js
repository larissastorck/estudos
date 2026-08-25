// Parte 2 — Doubly Linked List
// Cenário real: carrossel de produto onde next()/prev() precisam ser
// O(1) sempre, não importa se são 5 ou 500 imagens. Com array e
// indexOf isso degrada; com doubly linked list cada nó já sabe quem
// é seu vizinho dos dois lados.

class ImageNode {
  constructor(src) {
    this.src = src;
    this.prev = null;
    this.next = null;
  }
}

class ImageCarouselList {
  constructor(images) {
    // TODO: construir a doubly linked list a partir do array `images`
    // guardar referência pro nó atual (`current`)
    this.head = new ImageNode(null)
    this.tail = new ImageNode(null)

    this.head.next = this.tail
    this.tail.prev = this.head

    images.forEach(img => this.addNode(new ImageNode(img)))

    this.currentNode = this.head.next;
  }

  addNode(newNode) {
    const lastNode = this.tail.prev//último nó real

    newNode.prev = lastNode
    newNode.next = this.tail

    lastNode.next = newNode
    this.tail.prev = newNode
  }

  next() {
    // TODO: mover current pro próximo, se existir
    this.currentNode = this.currentNode.next
  }

  prev() {
    // TODO: mover current pro anterior, se existir
    this.currentNode = this.currentNode.prev
  }

  // TODO: útil pra saber se mostra a seta "prev"/"next" ou desabilita
  hasNext() {
    return this.currentNode.next === this.tail
  }
  hasPrev() {
    return this.currentNode.prev === this.head
  }
}

export { ImageNode, ImageCarouselList };
