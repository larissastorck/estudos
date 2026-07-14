# Desafio Semana 1 — Lista Virtualizada do Zero

**Fase:** 0 — DSA aplicado ao frontend
**Tópico:** Complexidade Big O + por que `Array.includes()` em listas grandes deixa a UI lenta
**Tempo cronometrado:** 40 minutos
**Modo:** pair programming via Live Share (alternar driver a cada 10 min)

---

## Contexto do desafio

Imagine que vocês foram contratadas para resolver um bug em produção:

> "Temos uma página com uma lista de 10.000 clientes. Quando o usuário digita no campo de busca, a página inteira trava por 2-3 segundos a cada tecla. Precisamos resolver isso urgente."

Esse é um problema clássico de frontend que envolve duas coisas:
1. **Complexidade de algoritmo** — `Array.includes()` é O(n), e está sendo chamado a cada tecla
2. **Renderização excessiva** — o React está tentando renderizar 10.000 componentes ao mesmo tempo

Vocês vão resolver os dois problemas implementando uma **lista virtualizada** com **busca otimizada**, do zero, sem bibliotecas como react-window.

---

## O que é uma lista virtualizada (em 1 minuto)

Uma lista virtualizada renderiza **apenas os itens que estão visíveis na tela**, mesmo que o array tenha 10.000 itens. Os outros não existem no DOM.

```
Sem virtualização:                Com virtualização:
┌─────────────────┐               ┌─────────────────┐
│ Item 1 (DOM)    │ visível       │ Item 42 (DOM)   │ visível
│ Item 2 (DOM)    │ visível       │ Item 43 (DOM)   │ visível
│ Item 3 (DOM)    │ visível       │ Item 44 (DOM)   │ visível
├─────────────────┤               ├─────────────────┤
│ Item 4 (DOM)    │ fora da tela  │ (não existem    │
│ ...             │ mas no DOM    │  no DOM)        │
│ Item 9999 (DOM) │               │                 │
└─────────────────┘               └─────────────────┘
10.000 elementos no DOM           ~15 elementos no DOM
```

Por baixo, é matemática simples:
- A lista tem altura total fixa (n_itens × altura_item)
- O scroll informa a posição Y atual
- Calculamos quais itens deveriam estar visíveis nessa posição
- Renderizamos só esses itens, com um `padding-top` para empurrá-los para a posição certa

---

## Setup inicial (~3 min)

```bash
npm create vite@latest lista-virtualizada -- --template react-ts
cd lista-virtualizada
npm install
npm run dev
```

Substituam o conteúdo de `src/App.tsx` pelo arquivo `App-base.tsx` que está nesta pasta.

---

## O desafio em 4 partes

### Parte 1 (10 min) — Sentir o problema

Antes de otimizar, **vocês precisam ver o problema acontecer**. Comecem rodando a versão base que está no `App-base.tsx`:

1. Abram o DevTools → aba Performance
2. Cliquem em "Record" e digitem algo no campo de busca
3. Parem o recording
4. Observem: quanto tempo levou o filtro? Quantos componentes foram renderizados?

**Perguntas para discutir:**
- Por que está lento mesmo sendo só `Array.includes()` ou `Array.filter()`?
- Qual a complexidade total a cada tecla? (Dica: O(n) para filtrar × O(m) para renderizar)
- Se a lista tivesse 100.000 itens, quanto tempo levaria?

### Parte 2 (15 min) — Virtualização básica

Implementem uma versão simples da virtualização:

1. Saibam a altura de cada item (ex: 40px fixo)
2. Saibam quantos itens cabem na viewport (ex: viewport 400px / 40px = 10 itens visíveis)
3. Usem o `scrollTop` do container para calcular o `startIndex`
4. Renderizem só os itens entre `startIndex` e `startIndex + visibleCount`
5. Adicionem um `paddingTop` calculado para empurrá-los para a posição correta

**Dicas:**
- Usem `useState` para guardar o `scrollTop`
- Usem `onScroll` no container para atualizar o `scrollTop`
- Adicionem 3-5 itens de "buffer" antes e depois (overscan) para evitar tela em branco no scroll rápido

### Parte 3 (10 min) — Otimizar a busca

Agora a busca:

1. Por que `useState` recalculando o filtro a cada tecla é problemático?
2. Implementem um `useDeferredValue` ou um `debounce` manual de 200ms na busca
3. Comparem o resultado no Performance tab

**Bônus se sobrar tempo:**
- Pré-indexem os dados em um Map ou usando lowercase, para busca O(1) por prefixo
- Comparem visualmente a diferença de performance

### Parte 4 (5 min) — Análise final

1. Voltem ao Performance tab e gravem digitando na busca novamente
2. Comparem com a primeira gravação
3. **Anotem as métricas:**
   - Tempo de renderização antes / depois
   - Número de elementos no DOM antes / depois
   - Tempo de resposta ao input antes / depois

---

## Critérios de "completo"

Marquem como ✅ Resolvido se conseguiram:
- [ ] Implementar virtualização que só renderiza itens visíveis no DOM
- [ ] Funcionar com 10.000 itens sem travar
- [ ] Busca não trava a UI ao digitar rápido

Marquem como ⚠️ Parcial se:
- A virtualização funciona mas tem bugs (ex: scroll pula, itens somem)
- A busca foi otimizada mas a virtualização não

Marquem como ❌ Não terminou se:
- Não conseguiram fazer a virtualização básica funcionar

**Importante:** "não terminou" não é fracasso. As dificuldades anotadas viram conteúdo do post no LinkedIn.

---

## Perguntas para a retrospectiva (5 min finais)

1. Qual a diferença prática entre O(n) e O(1) quando n = 10.000?
2. Por que renderizar 10.000 componentes React é lento, mesmo que cada um seja simples?
3. Onde mais vocês já viram esse padrão de "renderizar só o visível"? (Dica: pensa em apps que você usa)
4. Em que situações virtualização **não** vale a pena?
5. Qual foi a parte mais difícil para vocês duas?

---

## Conteúdo do post no LinkedIn (pré-rascunho)

Estrutura sugerida para a coautoria de domingo:

```
🚀 O que aprendemos sobre virtualização de listas essa semana

Essa semana eu e [@amiga] implementamos uma lista virtualizada do zero,
sem react-window, depois de descobrir que `Array.includes()` em 10.000
itens não era exatamente o problema principal.

3 insights:

1. O(n) só dói quando n é grande — em listas pequenas, includes() é OK.
   Em 10.000 itens chamado a cada tecla, vira O(n × teclas) e a UI trava.

2. O problema real era renderizar 10.000 componentes React. Virtualizar
   resolve isso: renderiza só ~15 itens visíveis, mesmo com 10.000 no array.

3. useDeferredValue + virtualização juntos eliminam 99% do travamento.
   A combinação foi mais impactante que qualquer das duas isoladas.

Maior dificuldade: calcular o offset (paddingTop) certo no scroll.
Como resolvemos: derivando do scrollTop e itemHeight, não confiando no DOM.

Próxima semana: hash maps no frontend (cache do React Query por baixo).

#frontend #javascript #performance #devjourney
```

---

## Arquivos nesta pasta

- `README.md` — este arquivo
- `App-base.tsx` — versão lenta de partida (10.000 itens, busca naive)
- `App-solution.tsx` — solução de referência (NÃO ABRIR ANTES DE TENTAR)

> Sugestão: nem abram a pasta da solução antes de tentar. O valor está no processo, não no código pronto.

Boa sessão! ⏱️
