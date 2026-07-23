// =============================================================
// Visualizador — Doubly Linked List
// =============================================================
// Implemente a classe em src/doubly-linked-list.js e use os botões
// abaixo para ver head ↔ nós ↔ tail atualizarem.
// =============================================================

import { useState } from 'react';
import { DoublyLinkedList } from './doubly-linked-list';

const list = new DoublyLinkedList();

/** Percorre head → next e monta um snapshot pra UI. */
function snapshot(dll) {
  const nodes = [];
  let current = dll.head;
  const visited = new Set();

  while (current && !visited.has(current)) {
    visited.add(current);
    nodes.push({
      value: current.value,
      // ids estáveis por referência (só pra React key)
      id: nodes.length,
      isHead: current === dll.head,
      isTail: current === dll.tail,
      hasPrev: current.prev != null,
      hasNext: current.next != null,
    });
    current = current.next;
  }

  return {
    nodes,
    size: dll.size ?? nodes.length,
    head: dll.head?.value ?? null,
    tail: dll.tail?.value ?? null,
  };
}

export default function App() {
  const [value, setValue] = useState('');
  const [state, setState] = useState(() => snapshot(list));
  const [log, setLog] = useState('Lista vazia — implemente os métodos e clique nos botões.');

  function refresh(message) {
    setState(snapshot(list));
    setLog(message);
  }

  function addFirst() {
    if (value === '') return;
    list.addFirst(value);
    refresh(`addFirst("${value}")`);
    setValue('');
  }

  function addLast() {
    if (value === '') return;
    list.addLast(value);
    refresh(`addLast("${value}")`);
    setValue('');
  }

  function removeFirst() {
    const removed = list.removeFirst();
    refresh(
      removed === undefined
        ? 'removeFirst() → lista vazia / ainda não implementado'
        : `removeFirst() → "${removed}"`
    );
  }

  function removeLast() {
    const removed = list.removeLast();
    refresh(
      removed === undefined
        ? 'removeLast() → lista vazia / ainda não implementado'
        : `removeLast() → "${removed}"`
    );
  }

  function clear() {
    list.clear();
    refresh('clear()');
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 900, textAlign: 'left' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Doubly Linked List</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Visualize <code>prev</code> / <code>next</code> enquanto implementa{' '}
        <code>src/doubly-linked-list.js</code>
      </p>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="valor do nó"
          style={{ flex: 1, minWidth: 140, padding: 10, fontSize: 16 }}
          onKeyDown={(e) => e.key === 'Enter' && addLast()}
        />
        <button type="button" onClick={addFirst} disabled={!value} style={btnStyle}>
          addFirst
        </button>
        <button type="button" onClick={addLast} disabled={!value} style={btnStyle}>
          addLast
        </button>
        <button type="button" onClick={removeFirst} style={btnStyle}>
          removeFirst
        </button>
        <button type="button" onClick={removeLast} style={btnStyle}>
          removeLast
        </button>
        <button type="button" onClick={clear} style={{ ...btnStyle, background: '#6c757d' }}>
          clear
        </button>
      </div>

      <p
        style={{
          padding: 10,
          background: '#f8f9fa',
          borderRadius: 6,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 13,
          marginBottom: 20,
        }}
      >
        {log}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <Meta label="size" value={state.size} />
        <Meta label="head" value={state.head ?? 'null'} accent="#28a745" />
        <Meta label="tail" value={state.tail ?? 'null'} accent="#fd7e14" />
      </div>

      {/* Lista visual */}
      <h3 style={{ marginBottom: 8 }}>Lista (head → tail)</h3>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
        ← prev | value | next →
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          flexWrap: 'wrap',
          minHeight: 100,
          padding: 12,
          background: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        {state.nodes.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
            Lista vazia — head e tail devem ser null
          </p>
        ) : (
          state.nodes.map((node, i) => (
            <div key={node.id} style={{ display: 'flex', alignItems: 'center' }}>
              <NodeBox node={node} />
              {i < state.nodes.length - 1 && (
                <span style={{ margin: '0 6px', color: '#666', fontFamily: 'monospace' }}>
                  ↔
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Checklist de implementação */}
      <div style={{ marginTop: 32, padding: 15, background: '#f8f9fa', borderRadius: 6 }}>
        <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 14 }}>Como praticar</p>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
          <li>
            Implemente <code>addLast</code> → digite um valor e clique. O nó deve aparecer.
          </li>
          <li>
            Implemente <code>addFirst</code> → o novo nó deve virar o head (esquerda).
          </li>
          <li>
            Confira se cada nó tem <code>prev</code>/<code>next</code> (badges nos cards).
          </li>
          <li>
            Implemente <code>removeFirst</code> / <code>removeLast</code> / <code>clear</code>.
          </li>
          <li>
            Casos limite: lista vazia, 1 nó, 2+ nós.
          </li>
        </ol>
      </div>
    </div>
  );
}

function Meta({ label, value, accent = '#004085' }) {
  return (
    <div style={{ padding: 12, background: '#e9ecef', borderRadius: 6, minWidth: 90 }}>
      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: accent }}>{String(value)}</p>
    </div>
  );
}

function NodeBox({ node }) {
  const border = node.isHead
    ? '#28a745'
    : node.isTail
      ? '#fd7e14'
      : '#6c757d';

  return (
    <div
      style={{
        minWidth: 88,
        padding: 10,
        borderRadius: 8,
        border: `2px solid ${border}`,
        background: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
        <PointerBadge label="prev" ok={node.hasPrev} />
        <PointerBadge label="next" ok={node.hasNext} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>{String(node.value)}</div>
      <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
        {node.isHead && node.isTail
          ? 'head + tail'
          : node.isHead
            ? 'HEAD'
            : node.isTail
              ? 'TAIL'
              : '·'}
      </div>
    </div>
  );
}

function PointerBadge({ label, ok }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 5px',
        borderRadius: 4,
        background: ok ? '#d4edda' : '#f8d7da',
        color: ok ? '#155724' : '#721c24',
        fontFamily: 'monospace',
      }}
    >
      {label}
    </span>
  );
}

const btnStyle = {
  padding: '10px 14px',
  fontSize: 14,
  cursor: 'pointer',
  background: '#343a40',
  color: 'white',
  border: 'none',
  borderRadius: 6,
};
