// =============================================================
// MOCK — Doubly Linked List
// =============================================================
// Implemente os métodos abaixo. O App-dll.jsx só chama essa API
// e percorre head → next para desenhar a lista.
//
// Cada nó deve ter: { value, prev, next }
// Lista vazia: head === null && tail === null
//
// Dica (quando for pro LRU): sentinelas (dummy head/tail) simplificam
// a lógica — mas comece sem eles se preferir.
// =============================================================

export class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = new Node(null);
    this.tail = new Node(null);
    this.size = 0;

    this.head.next = this.tail
    this.tail.prev = this.head
  }

  /** Insere no início (novo head). */
  addFirst(value) {
    // TODO: criar Node, ajustar prev/next, atualizar head/tail/size

    
    const newNode = new Node(value);
    const firstNode = this.head.next;

    newNode.next = firstNode;
    newNode.prev = this.head;
    
    firstNode.prev = newNode;
    this.head.next = newNode;
  
    this.size++;

    
    

    /**
     * 
     * 
     * head  node  tail
     *     ->    -> head.next = node | node.next = tail
     *     <-    <- node.prev = head | tail.prev = node
     * 
     */
    
    /*if(this.head) {
      node.next = this.head;
      this.head.prev = node
      this.head = node;
      this.size++;
    } else {
      this.head = node;
      this.tail = node;
      this.size++;
    }*/


    /**
     * se head existe 
     * node    head
     *      -> node.next = head
     *      <- head.prev = node
     * 
     * se NAO existe head
     * 
     * 
     */
  }

  /** Insere no fim (novo tail). */
  addLast(value) {
    // TODO
  }

  /** Remove e retorna o value do head (ou undefined se vazia). */
  removeFirst() {
    // TODO
  }

  /** Remove e retorna o value do tail (ou undefined se vazia). */
  removeLast() {
    // TODO
  }

  /** Esvazia a lista. */
  clear() {
    // TODO
  }
}
