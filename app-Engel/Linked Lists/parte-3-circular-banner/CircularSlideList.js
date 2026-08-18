// Parte 3 — Circular Linked List
// Cenário real: banner/slider de home page que roda infinitamente
// (chega no último e volta pro primeiro sem "travar"), ou tabs que
// ciclam infinitamente entre os campos.
//
// A única diferença estrutural de uma doubly list pra uma circular é
// o que acontece nas pontas: o `next` do último nó aponta pro
// primeiro, e o `prev` do primeiro aponta pro último.

class SlideNode {
  constructor(content, durationMs = null) {
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
    this.current = null;
  }

  next() {
    // TODO: nunca deveria "travar" nas pontas aqui
  }

  prev() {
    // TODO: idem, sempre existe um próximo/anterior
  }
}

export { SlideNode, CircularSlideList };
