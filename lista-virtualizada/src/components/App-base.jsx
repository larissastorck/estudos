// =============================================================
// PONTO DE PARTIDA — Versão lenta
// =============================================================
// Esta é a versão "ingênua" que vocês vão otimizar.
// Não modifiquem ainda. Rodem primeiro e sintam o problema.
// =============================================================


/*
Fazer calculando quantos itens cabem na div
*/

import { useState, useMemo, useEffect } from 'react';

// Gerador de 10.000 clientes fake
function gerarClientes(quantidade) {
  const nomes = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eva', 'Felipe', 'Gabriela', 'Hugo', 'Isabela', 'João'];
  const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Costa', 'Santos', 'Lima', 'Pereira', 'Rodrigues'];

  return Array.from({ length: quantidade }, (_, i) => ({
    id: i,
    nome: `${nomes[i % nomes.length]} ${sobrenomes[i % sobrenomes.length]} ${i}`,
    email: `cliente${i}@example.com`,
  }));
}

const CLIENTES = gerarClientes(10000);

const throttle = (func, delay) => {
  let waiting = false;

  return (...args) => {
    if (waiting) return;

    func(...args);
    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, delay);
  };
}

export default function App() {
  const [busca, setBusca] = useState('');
  const [start, setStart] = useState(0);
  //const [currentResult, setCurrentResult] = useState(CLIENTES)

  const ITEM_HEIGHT = 40;
  const PAGE_SIZE = 10;


  // 🐌 PROBLEMA: este filtro roda a cada tecla, percorrendo 10.000 itens
  /*const clientesFiltrados = useMemo(() => {
    console.log("Fora busca")
    if (busca && busca.length > 5) {
      console.log("busca")
      return CLIENTES.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }
    return CLIENTES;
  }, [busca]);*/

  /*useEffect(() => {
    if (busca && busca.length >= 3) {
      const result = CLIENTES.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase())
      );
      setCurrentResult(result)
    } else {
      setCurrentResult(CLIENTES);
    }
  }, [busca])
*/
  const handleScroll = useMemo(() =>
    throttle((event) => {
      const scrollTop = event.currentTarget.scrollTop;

      setStart(Math.floor(scrollTop / ITEM_HEIGHT));
    }, 50),
    []
  );

  const currentResult = useMemo(() => {
    if (busca.length < 3) {
      return CLIENTES;
    }

    return CLIENTES.filter((c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);


  const visibleItems = currentResult.slice(start, start + PAGE_SIZE);
  const paddingTop = start * ITEM_HEIGHT;
  const paddingBottom = Math.max(0, (currentResult.length - (start + PAGE_SIZE)) * ITEM_HEIGHT);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Lista de Clientes ({CLIENTES.length.toLocaleString()})</h1>

      <input
        type="text"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setStart(0);
        }}
        placeholder="Digite para buscar..."
        style={{
          width: '100%',
          padding: 10,
          fontSize: 16,
          marginBottom: 20,
        }}
      />

      <p>{currentResult && currentResult.length.toLocaleString()} resultados</p>

      {/* 🐌 PROBLEMA: renderiza TODOS os itens filtrados, mesmo fora da tela */}
      <div onScroll={handleScroll}
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #ccc",
        }}
      >
        <div
          style={{
            paddingTop,
            paddingBottom,
          }}
        >
          {visibleItems && visibleItems.map((cliente) => (
            <div
              key={cliente.id}
              style={{
                height: ITEM_HEIGHT,
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
    </div>
  );
}
