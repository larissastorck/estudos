// =============================================================
// TESTES — LRU Cache
// =============================================================
// Usem `npm test` para rodar. Comecem pelos testes mais simples
// e vão até os edge cases.
//
// Instalar Vitest primeiro:
//   npm install -D vitest
//
// Adicionar ao package.json:
//   "scripts": { "test": "vitest" }
// =============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { LRUCache } from './lru-cache';

describe('LRUCache', () => {
  let cache;

  beforeEach(() => {
    cache = new LRUCache(3);
  });

  // ============================================
  // Nível 1 — Operações básicas
  // ============================================
  describe('operações básicas', () => {
    it('deve começar com tamanho 0', () => {
      expect(cache.size).toBe(0);
    });

    it('deve armazenar e recuperar um valor', () => {
      cache.set('a', 1);
      expect(cache.get('a')).toBe(1);
    });

    it('deve retornar undefined para chave inexistente', () => {
      expect(cache.get('nao-existe')).toBeUndefined();
    });

    it('has() deve indicar corretamente se a chave existe', () => {
      cache.set('a', 1);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });

    it('size deve refletir o número de itens', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.size).toBe(2);
    });

    it('deve atualizar o valor de uma chave existente', () => {
      cache.set('a', 1);
      cache.set('a', 100);
      expect(cache.get('a')).toBe(100);
      expect(cache.size).toBe(1);
    });
  });

  // ============================================
  // Nível 2 — Ordenação LRU
  // ============================================
  describe('ordem LRU (mais recente → mais antigo)', () => {
    it('inserções devem ir para o topo (mais recente)', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(cache.keys()).toEqual(['c', 'b', 'a']);
    });

    it('get() deve mover a chave para o topo', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.get('a');
      expect(cache.keys()).toEqual(['a', 'c', 'b']);
    });

    it('set() em chave existente deve mover para o topo', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('a', 999);
      expect(cache.keys()).toEqual(['a', 'c', 'b']);
    });
  });

  // ============================================
  // Nível 3 — Eviction (limite de capacidade)
  // ============================================
  describe('eviction ao atingir capacidade', () => {
    it('deve remover o item mais antigo quando enche', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4); // enche, 'a' deve sair

      expect(cache.size).toBe(3);
      expect(cache.has('a')).toBe(false);
      expect(cache.keys()).toEqual(['d', 'c', 'b']);
    });

    it('get() em item recém-usado deve protegê-lo da eviction', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.get('a'); // 'a' vira o mais recente
      cache.set('d', 4); // agora 'b' deve sair, não 'a'

      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });

    it('deve funcionar com muitas inserções', () => {
      const c = new LRUCache(3);
      for (let i = 0; i < 100; i++) {
        c.set(i, i * 10);
      }
      expect(c.size).toBe(3);
      expect(c.keys()).toEqual([99, 98, 97]);
    });
  });

  // ============================================
  // Nível 4 — Delete
  // ============================================
  describe('delete', () => {
    it('deve deletar uma chave existente e retornar true', () => {
      cache.set('a', 1);
      expect(cache.delete('a')).toBe(true);
      expect(cache.has('a')).toBe(false);
      expect(cache.size).toBe(0);
    });

    it('deve retornar false ao deletar chave inexistente', () => {
      expect(cache.delete('nao-existe')).toBe(false);
    });

    it('deve manter ordenação correta após delete do meio', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.delete('b');
      expect(cache.keys()).toEqual(['c', 'a']);
      expect(cache.size).toBe(2);
    });

    it('deve permitir inserir após delete', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.delete('a');
      cache.set('d', 4);
      expect(cache.size).toBe(3);
      expect(cache.keys()).toEqual(['d', 'c', 'b']);
    });
  });

  // ============================================
  // Nível 5 — Edge cases
  // ============================================
  describe('edge cases', () => {
    it('deve funcionar com capacidade 1', () => {
      const c = new LRUCache(1);
      c.set('a', 1);
      c.set('b', 2);
      expect(c.size).toBe(1);
      expect(c.has('a')).toBe(false);
      expect(c.get('b')).toBe(2);
    });

    it('deve funcionar com chaves numéricas', () => {
      const c = new LRUCache(2);
      c.set(1, 'um');
      c.set(2, 'dois');
      expect(c.get(1)).toBe('um');
      expect(c.keys()).toEqual([1, 2]);
    });

    it('deve funcionar com objetos como valores', () => {
      const c = new LRUCache(2);
      const obj = { id: 42 };
      c.set('user', obj);
      expect(c.get('user')).toBe(obj);
    });

    it('não deve permitir capacidade zero ou negativa (lançar erro)', () => {
      expect(() => new LRUCache(0)).toThrow();
      expect(() => new LRUCache(-1)).toThrow();
    });
  });

  // ============================================
  // Nível 6 — Sequência complexa (do enunciado)
  // ============================================
  describe('sequência do enunciado', () => {
    it('cenário mostrado no README', () => {
      const c = new LRUCache(3);

      c.set('a', 1);
      expect(c.keys()).toEqual(['a']);

      c.set('b', 2);
      expect(c.keys()).toEqual(['b', 'a']);

      c.set('c', 3);
      expect(c.keys()).toEqual(['c', 'b', 'a']);

      c.get('a');
      expect(c.keys()).toEqual(['a', 'c', 'b']);

      c.set('d', 4);
      expect(c.keys()).toEqual(['d', 'a', 'c']);
      expect(c.has('b')).toBe(false); // 'b' foi descartado
    });
  });

  // ============================================
  // Nível 7 — "Sujar o cache" (fraqueza do LRU)
  // ============================================
  // Cenário do README: item muito usado no passado continua
  // ocupando espaço mesmo depois de parar de ser útil.
  // O LRU só o remove quando outros itens o empurram para fora.
  describe('sujar o cache (README)', () => {
    it('item muito acessado no passado ocupa espaço até ser empurrado para fora', () => {
      const c = new LRUCache(3);

      // --- Hora 1: usuário olha o perfil 42 mil vezes ---
      // Cada get renova o 42 → ele fica sempre no topo, protegido.
      c.set(42, 'perfil-42');
      c.set(1, 'outro');
      c.set(2, 'outro');
      for (let i = 0; i < 1000; i++) c.get(42);

      expect(c.keys()[0]).toBe(42); // 42 ainda é o mais recente

      // --- Hora 2: fecha a tela. Nunca mais vai olhar o 42. ---
      // Começa a olhar outros usuários. O 42 "suja" o cache:
      // ainda ocupa 1 dos 3 slots, mesmo sem ser útil.

      c.set(10, 'perfil-10');
      expect(c.keys()).toEqual([10, 42, 2]); // 1 saiu; 42 ainda lá

      c.set(11, 'perfil-11');
      expect(c.keys()).toEqual([11, 10, 42]); // 42 desceu, mas ainda ocupa espaço
      expect(c.has(42)).toBe(true); // ← aqui está o "sujar": inútil, mas presente

      // Só agora, com o 3º acesso novo, o 42 finalmente sai
      c.set(12, 'perfil-12');
      expect(c.keys()).toEqual([12, 11, 10]);
      expect(c.has(42)).toBe(false);
    });
  });
});
