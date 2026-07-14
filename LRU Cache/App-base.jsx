// =============================================================
// PONTO DE PARTIDA — App para conectar o cache
// =============================================================
// Este é o esqueleto do App que você vai completar na Parte 3
// do desafio. A implementação do cache vai em src/lru-cache.js
// =============================================================

import { useState } from 'react';
// import { LRUCache } from './lru-cache'; // 👈 descomente quando implementar

// "API" simulada — 1 segundo de delay para vocês verem o efeito do cache
function buscarUsuarioNaAPI(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        nome: `Usuário ${id}`,
        email: `user${id}@example.com`,
      });
    }, 1000);
  });
}

// TODO Parte 3: criar uma instância do cache aqui
// const cache = new LRUCache(5);

export default function App() {
  const [inputId, setInputId] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [ultimoResultado, setUltimoResultado] = useState(null);

  // Stats para visualizar o cache funcionando
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [ordemCache, setOrdemCache] = useState([]);

  async function buscar() {
    const id = Number(inputId);
    if (!id) return;

    // TODO Parte 3:
    //   1. Tentar buscar do cache primeiro
    //   2. Se estiver no cache → hit (setHits, marcar veioDeCache = true)
    //   3. Se não estiver → miss, chamar API, salvar no cache
    //   4. Atualizar setOrdemCache com cache.keys()

    setCarregando(true);

    // Placeholder — vocês vão substituir por lógica com cache
    const usuario = await buscarUsuarioNaAPI(id);
    setUltimoResultado({ usuario, veioDeCache: false });

    setCarregando(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 700 }}>
      <h1>Busca de Usuário com Cache LRU</h1>
      <p style={{ color: '#666' }}>
        Capacidade do cache: 5 | Simulação de API: 1s de delay
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="number"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Digite um ID (1-20)"
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          onKeyDown={(e) => e.key === 'Enter' && buscar()}
        />
        <button
          onClick={buscar}
          disabled={carregando || !inputId}
          style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
        >
          {carregando ? 'Carregando...' : 'Buscar'}
        </button>
      </div>

      {/* Resultado */}
      {ultimoResultado && (
        <div
          style={{
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            background: ultimoResultado.veioDeCache ? '#d4edda' : '#fff3cd',
            border: `1px solid ${
              ultimoResultado.veioDeCache ? '#c3e6cb' : '#ffeaa7'
            }`,
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {ultimoResultado.veioDeCache
              ? '⚡ Cache HIT — retorno instantâneo!'
              : '🐌 Cache MISS — buscou na API (1s)'}
          </p>
          <p style={{ margin: '4px 0 0' }}>
            <strong>{ultimoResultado.usuario.nome}</strong> —{' '}
            {ultimoResultado.usuario.email}
          </p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ padding: 12, background: '#d4edda', borderRadius: 6, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#155724' }}>Cache Hits</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#155724' }}>
            {hits}
          </p>
        </div>
        <div style={{ padding: 12, background: '#fff3cd', borderRadius: 6, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#856404' }}>Cache Misses</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#856404' }}>
            {misses}
          </p>
        </div>
        <div style={{ padding: 12, background: '#cce5ff', borderRadius: 6, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#004085' }}>Tempo economizado</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#004085' }}>
            {hits}s
          </p>
        </div>
      </div>

      {/* Visualização do cache */}
      <div>
        <h3>Estado atual do cache</h3>
        <p style={{ fontSize: 13, color: '#666' }}>
          ← Mais recente | Mais antigo →
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 60 }}>
          {ordemCache.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Cache vazio</p>
          ) : (
            ordemCache.map((id, i) => (
              <div
                key={id}
                style={{
                  padding: '8px 14px',
                  background: i === 0 ? '#28a745' : '#6c757d',
                  color: 'white',
                  borderRadius: 6,
                  fontWeight: 'bold',
                }}
              >
                ID {id}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dica de teste */}
      <div style={{ marginTop: 40, padding: 15, background: '#f8f9fa', borderRadius: 6 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
          💡 Para testar: busquem IDs 1, 2, 3, 4, 5 (todos misses). Depois busquem
          o 1 de novo (deve ser hit). Depois busquem 6 (miss, e o 2 deve sair pois
          é o mais antigo agora).
        </p>
      </div>
    </div>
  );
}
