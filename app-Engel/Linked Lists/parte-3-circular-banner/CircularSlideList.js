// Parte 3 — Circular Linked List
// Cenário real: banner/slider de home page que roda infinitamente
// (chega no último e volta pro primeiro sem "travar"), ou tabs que
// ciclam infinitamente entre os campos.
//
// A única diferença estrutural de uma doubly list pra uma circular é
// o que acontece nas pontas: o `next` do último nó aponta pro
// primeiro, e o `prev` do primeiro aponta pro último.

class SlideNode {
  constructor(content, durationMs = 500) {
    this.content = content;
    // durationMs é opcional — usado na versão "Timed" (ver extensão)
    this.durationMs = durationMs;
    this.prev = null;
    this.next = null;
  }
}

class CircularSlideList {
  constructor(slides) {
    // TODO: montar a lista circular — o `next` do último nó
    // deve apontar pro primeiro, e o `prev` do primeiro pro último
    //
    // `slides` pode vir como array de strings/objetos simples
    // (['img1.jpg', 'img2.jpg']) ou como array de
    // { content, durationMs } pra versão com tempo variável

    this.head = null;
    this.tail = null;
    this.currentNode = null;
    this.map = new Map();
    if (slides && slides.length > 0) {
      slides.forEach(slide => this.addMap(slide))
    }
  }

  selectSlide(id) {
    const node = this.map.get(id)
    if (node) {
      this.currentNode = node;
    }
  }

  addMap(slide) {
    const node = this.map.get(slide.id)
    if (node) {
      this.currentNode = node
      return;
    }

    const newNode = new SlideNode(slide.content, slide.duration);
    this.addList(newNode)
    this.map.set(slide.id, newNode)
  }

  addList(newNode) {
    //primeiro nó
    if (this.head === null) {
      newNode.next = newNode
      newNode.prev = newNode

      this.head = newNode;
      this.tail = newNode;
      this.currentNode = newNode;
      return;
    }

    //qualquer nó depois do primeiro
    newNode.prev = this.tail;
    newNode.next = this.head;

    this.tail.next = newNode;
    this.head.prev = newNode;

    this.tail = newNode;
  }

  next() {
    // TODO: nunca deveria "travar" nas pontas aqui
    this.currentNode = this.currentNode.next;
  }

  prev() {
    // TODO: idem, sempre existe um próximo/anterior
    this.currentNode = this.currentNode.prev;
  }
}

export { SlideNode, CircularSlideList };
