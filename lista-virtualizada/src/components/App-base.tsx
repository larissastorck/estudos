// =============================================================
// PONTO DE PARTIDA — Versão lenta
// =============================================================
// Esta é a versão "ingênua" que vocês vão otimizar.
// Não modifiquem ainda. Rodem primeiro e sintam o problema.
// =============================================================

import { useState, useMemo } from 'react';

// Gerador de 10.000 clientes fake
function gerarClientes(quantidade: number) {
  const nomes = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eva', 'Felipe', 'Gabriela', 'Hugo', 'Isabela', 'João'];
  const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Costa', 'Santos', 'Lima', 'Pereira', 'Rodrigues'];

  return Array.from({ length: quantidade }, (_, i) => ({
    id: i,
    nome: `${nomes[i % nomes.length]} ${sobrenomes[i % sobrenomes.length]} ${i}`,
    email: `cliente${i}@example.com`,
  }));
}

const CLIENTES = gerarClientes(10000);

export default function App() {
  const [busca, setBusca] = useState('');

  // 🐌 PROBLEMA: este filtro roda a cada tecla, percorrendo 10.000 itens
  const clientesFiltrados = useMemo(() => {
    return CLIENTES.filter((c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Lista de Clientes ({CLIENTES.length.toLocaleString()})</h1>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Digite para buscar..."
        style={{
          width: '100%',
          padding: 10,
          fontSize: 16,
          marginBottom: 20,
        }}
      />

      <p>{clientesFiltrados.length.toLocaleString()} resultados</p>

      {/* 🐌 PROBLEMA: renderiza TODOS os itens filtrados, mesmo fora da tela */}
      <div
        style={{
          height: 400,
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        {clientesFiltrados.map((cliente) => (
          <div
            key={cliente.id}
            style={{
              height: 40,
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
              boxSizing: 'border-box',
            }}
          >
            <strong>{cliente.nome}</strong> — {cliente.email}
          </div>
        ))}
      </div>
    </div>
  );
}
