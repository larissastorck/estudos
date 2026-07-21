class Node {
    constructor(key = null, value = null) {
      this.key = key;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
  }
  
  class DoublyLinkedList {
    constructor() {
      this.head = new Node();//dummyHead
      this.tail = new Node();//dummyTail
  
      this.head.next = this.tail;
      this.tail.prev = this.head;
    }
  
    addToFront(newNode) {
      const firstNode = this.head.next;//primeiro Node da lista depois do dummyHead
  
      newNode.prev = this.head;
      newNode.next = firstNode
  
      this.head.next = newNode;
      firstNode.prev = newNode;
    }
  
    removeNode(node) {
      if (node === this.head || node === this.tail) {
        return;
      }
      node.prev.next = node.next    
      node.next.prev = node.prev
  
      //limpar o nó
      node.prev = null;
      node.next = null;
    }
  
    moveToFront(node) {
      if (this.head.next === node) {
        return;
      }
      this.removeNode(node)
      this.addToFront(node)
    }
  
    removeLast() {
      if (this.tail.prev === this.head) {
        return null;
      }
  
      const lastNode = this.tail.prev;
      this.removeNode(lastNode);
      return lastNode;
    }

    getKeys() {
        const keys = [];
        let currentNode = this.head.next;
        while(currentNode !== this.tail) {
            keys.push(currentNode.key);
            currentNode = currentNode.next;
        }
        return keys;
    }

    getValues() {
        const values = [];
        let currentNode = this.head.next;
        while(currentNode !== this.tail) {
            values.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return values;
    }
  }
  
  
  
 export class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map();
      this.list = new DoublyLinkedList();
    }
  
    get(key) {
      const node = this.cache.get(key)
      if (!node) return -1
      this.list.moveToFront(node)
      return node.value
    }
  
    put(key, value) {
      const node = this.cache.get(key)
      //A chave existe
      if (node) {
        node.value = value;
        this.list.moveToFront(node)
        return;
      }
  
      //A chave não existe
      const newNode = new Node(key, value);
  
      this.cache.set(key, newNode);
      this.list.addToFront(newNode);
  
      //Checar capacidade
      if (this.cache.size > this.capacity) {
        const lastNode = this.list.removeLast();
        if (lastNode) {
          this.cache.delete(lastNode.key)
        }
      }
    }

    keys() {
        return this.list.getKeys();
    }

    values() {
        return this.list.getValues();
    }

    has(key) {
      return this.cache.has(key);
    }
  }