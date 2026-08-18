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
    this.current = null;
  }

  next() {
    // TODO: mover current pro próximo, se existir
  }

  prev() {
    // TODO: mover current pro anterior, se existir
  }

  // TODO: útil pra saber se mostra a seta "prev"/"next" ou desabilita
  hasNext() {}
  hasPrev() {}
}

export { ImageNode, ImageCarouselList };
