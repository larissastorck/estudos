// =============================================================
// SOLUÇÃO DE REFERÊNCIA
// =============================================================
// ⚠️ Não abram este arquivo antes de tentarem por 40 minutos.
// O valor do desafio está no processo, não no código pronto.
// =============================================================
//
// Esta solução demonstra:
//   1. Virtualização: renderiza apenas itens visíveis
//   2. Busca otimizada com useDeferredValue
//   3. Overscan (buffer) para evitar tela branca no scroll
//
// Notem que é menos código do que parece — virtualização é
// basicamente matemática com scrollTop.
// =============================================================

import { useState, useMemo, useDeferredValue, useRef } from 'react';

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

// Constantes da virtualização
const ITEM_HEIGHT = 40;
const CONTAINER_HEIGHT = 400;
const OVERSCAN = 3; // Quantos itens a mais renderizar antes e depois (buffer)

export default function App() {
  const [busca, setBusca] = useState('');
  const [scrollTop, setScrollTop] = useState(0);

  // ✅ useDeferredValue: o React vai priorizar o input em vez do filtro
  // O input fica responsivo, e o filtro é recalculado em background
  const buscaDeferred = useDeferredValue(busca);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filtro com busca deferida — não bloqueia o input
  const clientesFiltrados = useMemo(() => {
    if (!buscaDeferred) return CLIENTES;
    const termo = buscaDeferred.toLowerCase();
    return CLIENTES.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [buscaDeferred]);

  // ====================================
  // O CORAÇÃO DA VIRTUALIZAÇÃO
  // ====================================
  // Quantos itens cabem visíveis na viewport
  const itensVisiveis = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);

  // Calcular qual é o primeiro item visível (com base no scroll)
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);

  // Calcular o último item visível
  const endIndex = Math.min(
    clientesFiltrados.length,
    startIndex + itensVisiveis + OVERSCAN * 2
  );

  // Slice apenas dos itens que vamos realmente renderizar
  const itensRenderizados = clientesFiltrados.slice(startIndex, endIndex);

  // Altura total da lista (para o scroll funcionar como se todos estivessem lá)
  const alturaTotal = clientesFiltrados.length * ITEM_HEIGHT;

  // Offset para empurrar os itens renderizados à posição certa
  const offsetY = startIndex * ITEM_HEIGHT;

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

      <p>
        {clientesFiltrados.length.toLocaleString()} resultados
        {busca !== buscaDeferred && ' (atualizando...)'}
      </p>

      {/* Container com scroll */}
      <div
        ref={containerRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        style={{
          height: CONTAINER_HEIGHT,
          overflow: 'auto',
          border: '1px solid #ccc',
          position: 'relative',
        }}
      >
        {/* Espaçador interno — tem a altura total como se todos os itens estivessem lá */}
        <div style={{ height: alturaTotal, position: 'relative' }}>
          {/* Container dos itens renderizados, posicionado com transform */}
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

      {/* Debug info para discutir na call */}
      <div style={{ marginTop: 20, fontSize: 13, color: '#666' }}>
        <p>📊 Stats:</p>
        <ul>
          <li>Total no array: {clientesFiltrados.length.toLocaleString()}</li>
          <li>Renderizados no DOM: {itensRenderizados.length}</li>
          <li>
            Range visível: {startIndex} a {endIndex}
          </li>
          <li>Scroll position: {scrollTop}px</li>
        </ul>
      </div>
    </div>
  );
}

// =============================================================
// PONTOS DE DISCUSSÃO PÓS-IMPLEMENTAÇÃO
// =============================================================
//
// 1. Por que usar `transform: translateY` em vez de `marginTop`?
//    R: translate usa a GPU (composite layer), não dispara reflow.
//    marginTop forçaria reflow de toda a árvore a cada scroll.
//
// 2. Por que `useDeferredValue` e não `debounce`?
//    R: useDeferredValue é nativo do React 18+, integra com o scheduler
//    do React e prioriza o input automaticamente. Debounce funciona
//    mas adiciona delay fixo. useDeferredValue é "tão rápido quanto
//    possível, mas pode atrasar se necessário".
//
// 3. Quando virtualização NÃO vale a pena?
//    R: Listas pequenas (< 100 itens), itens com altura variável
//    desconhecida, conteúdo que precisa estar no DOM para SEO,
//    listas com muito CSS de hover/animação complexa.
//
// 4. Como isso se conecta com complexidade?
//    R: Antes: O(n) por filter × O(m) por render onde m = n = 10.000.
//    Depois: O(n) por filter × O(c) por render onde c = constante (~15).
//    Pulamos de O(n²) prático para O(n) prático.
//
// 5. Onde mais vemos esse padrão na vida real?
//    R: Twitter feed, Instagram, Spotify (artistas), Discord (mensagens),
//    Notion (linhas de tabela), VS Code (linhas de código), Gmail.
// =============================================================
