// =============================================================
// SOLUÇÃO DE REFERÊNCIA — LRU Cache
// =============================================================
// ⚠️ Não abram este arquivo antes de tentarem por 40 minutos.
// O valor do desafio está em errar, desenhar no papel, e resolver.
// =============================================================
//
// Esta solução demonstra:
//   1. Hash map + doubly linked list combinados
//   2. Todas as operações em O(1)
//   3. Sentinelas (dummy head/tail) para simplificar a lógica
// =============================================================

export class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) {
      throw new Error('Capacity must be positive');
    }

    this.capacity = capacity;
    this.cache = new Map();

    // Truque: usar nós "sentinela" no head e tail elimina os
    // if (head === null) e if (tail === null) da lógica.
    // Head e tail sempre existem, os nós reais ficam entre eles.
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: null, next: null };

    // Lista começa vazia: head ↔ tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size() {
    return this.cache.size;
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return undefined;

    // Cache hit: mover para o topo (mais recente)
    this.moveToHead(node);
    return node.value;
  }

  set(key, value) {
    const existing = this.cache.get(key);

    if (existing) {
      // Atualizar valor e mover para topo
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    // Chave nova
    const node = { key, value, prev: null, next: null };
    this.cache.set(key, node);
    this.addToHead(node);

    // Evict se passou da capacidade
    if (this.cache.size > this.capacity) {
      const removed = this.removeTail();
      if (removed) this.cache.delete(removed.key);
    }
  }

  delete(key) {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  keys() {
    const result = [];
    let current = this.head.next;
    while (current && current !== this.tail) {
      result.push(current.key);
      current = current.next;
    }
    return result;
  }

  // ============================================
  // Operações da linked list (todas O(1))
  // ============================================

  addToHead(node) {
    // Inserir logo após o sentinela head
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    // Como é doubly linked, remoção do meio é O(1)
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  removeTail() {
    const lastNode = this.tail.prev;
    if (!lastNode || lastNode === this.head) return null;
    this.removeNode(lastNode);
    return lastNode;
  }
}

// =============================================================
// PONTOS DE DISCUSSÃO PÓS-IMPLEMENTAÇÃO
// =============================================================
//
// 1. Por que usar sentinelas (dummy head/tail)?
//    R: Simplifica a lógica drasticamente. Sem sentinelas, cada
//    operação precisa checar se node.prev/next é null. Com sentinelas,
//    todo nó real sempre tem vizinhos válidos. O truque vem do CLRS
//    (livro clássico de algoritmos).
//
// 2. Por que doubly linked (com prev E next)?
//    R: Para remover um nó do meio em O(1), você precisa saber tanto
//    quem aponta pra ele (prev) quanto quem ele aponta (next). Sem
//    o prev, teria que percorrer a lista pra achar quem aponta pro
//    nó — O(n).
//
// 3. Por que Map (do JS) e não objeto {}?
//    R: Map suporta chaves de qualquer tipo (número, objeto, etc.).
//    Objeto força chaves a string/symbol. Além disso, Map tem
//    performance previsível e API mais limpa (has, delete, size).
//
// 4. Complexidade final:
//    - get: O(1) → Map.get + moveToHead
//    - set: O(1) → Map.set + addToHead (+ removeTail se enche)
//    - delete: O(1) → Map.get + removeNode + Map.delete
//    - has: O(1) → Map.has
//
//    ✨ Tudo O(1). Isso só é possível pela combinação das duas
//    estruturas.
//
// 5. Como isso se conecta com SWR/TanStack Query?
//    R: Eles usam variações mais sofisticadas. TanStack Query tem:
//    - Cache com "garbage collection" (não LRU puro, mas por TTL)
//    - Invalidação por tags/queries
//    - Stale-while-revalidate (retorna cache velho + refetch)
//    Mas a base — hash map indexando entries — é a mesma.
//
// 6. Alternativas ao LRU (a fraqueza do "sujar cache"):
//    - LFU (Least Frequently Used): remove o menos usado. Bom quando
//      alguns itens são "populares" há muito tempo.
//    - MRU (Most Recently Used): remove o mais recente. Estranho, mas
//      útil quando dados novos tendem a ser lidos uma única vez.
//    - ARC (Adaptive Replacement Cache): combina LRU + LFU adaptando
//      ao acesso. Usado no ZFS e outros sistemas de arquivo.
//    - 2Q, LIRS: variações que resolvem a fraqueza clássica do LRU
//      (item usado 1000 vezes, some, nunca mais usado, mas polui cache).
//
// 7. Onde ver isso na natureza:
//    - github.com/isaacs/node-lru-cache (lib npm popular)
//    - Redis eviction policies (docs.redis.io)
//    - TanStack Query source code (github.com/TanStack/query)
// =============================================================
