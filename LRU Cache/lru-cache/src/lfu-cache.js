class Node {
    constructor(key = null, value = null, freq = 1) {
      this.key = key;
      this.value = value;
      this.freq = freq;
      this.prev = null;
      this.next = null;
    }
  }
  
  class DoublyLinkedList {
    constructor() {
      this.head = new Node(); // dummyHead
      this.tail = new Node(); // dummyTail
      this.head.next = this.tail;
      this.tail.prev = this.head;
      this.size = 0;
    }
  
    addToFront(newNode) {
      const firstNode = this.head.next;
      newNode.prev = this.head;
      newNode.next = firstNode;
      this.head.next = newNode;
      firstNode.prev = newNode;
      this.size++;
    }
  
    removeNode(node) {
      if (node === this.head || node === this.tail) return;
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node.prev = null;
      node.next = null;
      this.size--;
    }
  
    removeLast() {
      if (this.tail.prev === this.head) return null;
      const lastNode = this.tail.prev; // {key: 2, value: 20}
      this.removeNode(lastNode);
      return lastNode;
    }
  
    isEmpty() {
      return this.size === 0;
    }
  }
  
  export class LFUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map();      // key -> Node
      this.freqMap = new Map();    // freq -> DoublyLinkedList
      this.minFreq = 0;
    }
  
    // Move o node para a lista da próxima frequência
    _bumpFreq(node) { // 10
      const oldFreq = node.freq; // 1
      const oldList = this.freqMap.get(oldFreq); // {1: [, {key: 2, value: 20}]}}
      oldList.removeNode(node); 
  
      // Se a lista da freq mínima ficou vazia, a nova mínima sobe
      if (oldFreq === this.minFreq && oldList.isEmpty()) {
        this.minFreq++;
      }
  
      node.freq++; // node {key: 1, value: 10, freq: 2}
      if (!this.freqMap.has(node.freq)) {
        this.freqMap.set(node.freq, new DoublyLinkedList());
      }
      this.freqMap.get(node.freq).addToFront(node); // {2: [{key: 1, value: 10, freq: 2}]}   
    }
  
    get(key) {
      const node = this.cache.get(key); // key - 1, value: 10 | key - 2, value:20
      if (!node) return -1;
      this._bumpFreq(node);
      return node.value;
    }
  
    put(key, value) { // {key: 3, value: 30}
      if (this.capacity <= 0) return;//capacity = 2
  
      const existingNode = this.cache.get(key); // key - 3, value: 30
  
      if (existingNode) {
        existingNode.value = value;
        this._bumpFreq(existingNode);
        return;
      }
  
      // Cheio? Remove o LFU (o menos recente dentro da freq mínima)
      if (this.cache.size >= this.capacity) {
        const minList = this.freqMap.get(this.minFreq); // {1: [{key: 2, value: 20}]}
        const evicted = minList.removeLast();
        if (evicted) this.cache.delete(evicted.key);
      }
  
      // Novo node sempre entra com freq 1
      const newNode = new Node(key, value, 1);
      this.cache.set(key, newNode); // key - 1, value: 10 | key - 2, value:20
  
      if (!this.freqMap.has(1)) {
        this.freqMap.set(1, new DoublyLinkedList());
      }
      this.freqMap.get(1).addToFront(newNode);
  
      this.minFreq = 1;
    }
  
    has(key) {
      return this.cache.has(key);
    }
  }