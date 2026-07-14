// =============================================================
// PONTO DE PARTIDA — Versão lenta
// =============================================================
// Esta é a versão "ingênua" que vocês vão otimizar.
// Não modifiquem ainda. Rodem primeiro e sintam o problema.
// =============================================================

import { useState, useMemo } from 'react';

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

// Constantes da virtualização
const ITEM_HEIGHT = 40;
const CONTAINER_HEIGHT = 400;
const OVERSCAN = 3; // itens extras renderizados antes/depois do range visível

export default function App() {
  const [busca, setBusca] = useState('');
  const [scrollTop, setScrollTop] = useState(0);

  // Fonte única de verdade para a lista: sempre deriva de CLIENTES,
  // nunca do resultado de um slice anterior (isso evitava o encolhimento).
  const clientesFiltrados = useMemo(() => {
    if (busca && busca.length >= 3) {
      const termo = busca.toLowerCase();
      return CLIENTES.filter((c) => c.nome.toLowerCase().includes(termo));
    }
    return CLIENTES;
  }, [busca]);

  console.log("clientesFiltrados", clientesFiltrados.length)

  // Quantos itens cabem na viewport visível
  const itensVisiveis = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);

  // startIndex: primeiro item visível, com overscan, nunca negativo
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);

  // endIndex: nunca passa do tamanho real da lista filtrada
  const endIndex = Math.min(
    clientesFiltrados.length,//10000
    startIndex + itensVisiveis + OVERSCAN * 2// 0 + 10 + 3 * 2 = 16
  );

  console.log("startIndex", startIndex)
  console.log("endIndex", endIndex)

  // Só esse pedaço vai pro DOM
  const itensRenderizados = clientesFiltrados.slice(startIndex, endIndex);

  console.log("itensRenderizados", itensRenderizados)

  // Altura "fake" total — é isso que faz o navegador achar que existem
  // clientesFiltrados.length itens, mesmo só ~itensVisiveis estando no DOM
  const alturaTotal = clientesFiltrados.length * ITEM_HEIGHT;
  console.log("alturaTotal", alturaTotal)

  // Deslocamento para empurrar o bloco renderizado para a posição certa
  const offsetY = startIndex * ITEM_HEIGHT;
  console.log("offsetY", offsetY)

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

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

      {/* Container com scroll real */}
      <div
        onScroll={handleScroll}
        style={{
          height: CONTAINER_HEIGHT,
          overflow: 'auto',
          border: '1px solid #ccc',
          position: 'relative',
        }}
      >
        {/* Espaçador: altura total "fake" para o scroll representar a lista inteira */}
        <div style={{ height: alturaTotal, position: 'relative' }}>
          {/* Bloco real de itens, empurrado para a posição correta */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {itensRenderizados.map((cliente) => (
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
    </div>
  );
}

/*
import { useState, useEffect } from 'react';

function DetectorDeScroll() {
  const [posicao, setPosicao] = useState(0);

  useEffect(() => {
    // 1. Cria a função que será executada no scroll
    const lidarComScroll = () => {
      setPosicao(window.scrollY);
    };

    // 2. Adiciona o listener quando o componente aparece na tela
    window.addEventListener('scroll', lidarComScroll);

    // 3. FUNÇÃO DE LIMPEZA (Cleanup): Remove o listener quando o componente some
    return () => {
      window.removeEventListener('scroll', lidarComScroll);
    };
  }, []); // Array vazio garante que o listener seja adicionado apenas uma vez

  return (
    <div style={{ position: 'fixed', top: 10, left: 10, background: '#fff' }}>
      Você rolou {posicao} pixels para baixo.
    </div>
  );
}
*/
