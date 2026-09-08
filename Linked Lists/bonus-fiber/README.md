# Bônus — Fiber simplificado

O desafio oficial sugerido da fase (Semanas 9–10 do plano).

## Arquivos
- `FiberNode.js` — a estrutura (FiberNode + createFiberTree)
- `workLoop.js` — o percurso que visita child → sibling → return

## Como testar

### Via Node (sem React)
```js
import { createFiberTree } from './FiberNode';
import { workLoop } from './workLoop';

const tree = {
  type: 'div',
  children: [
    { type: 'h1' },
    { type: 'p', children: [{ type: 'span' }] },
  ],
};

const root = createFiberTree(tree);
workLoop(root, (fiber) => console.log(fiber.type));
// esperado: div, h1, p, span (ordem de visita depth-first)
```

### Via mini app React (visual)
A pasta já tem um mini projeto Vite + React (`src/App.jsx`) que importa
`FiberNode.js` e `workLoop.js` direto e renderiza a árvore de fibers
(`child` desce, `sibling` vai pro lado) junto com a ordem de visita:

```bash
cd "Linked Lists/bonus-fiber"
npm install
npm run dev
```

Abra a URL que o Vite mostrar no terminal (geralmente
`http://localhost:5173`). A tela mostra o objeto de entrada, a
sequência `div → h1 → p → span` e a árvore desenhada com um número em
cada nó indicando a ordem em que o `workLoop` visitou ele.

> Importante: esse código não usa nenhuma API do React (`useState`,
> JSX de verdade virando elementos, etc.) — é puro JS simulando a
> estrutura interna do Fiber. O React só entra aqui como "moldura" pra
> renderizar o resultado na tela; a lógica de árvore/percurso é 100%
> independente dele.

## Criação preguiçosa (lazy) — por que dá pra pausar e retomar

`createFiberTree` + `workLoop` são dois passos separados: primeiro a
árvore inteira é construída (recursivamente, do topo até as folhas),
só depois ela é percorrida. Isso é simples de entender, mas tem uma
limitação: **a criação da árvore não pode ser pausada**. Uma vez que
`createFiberTree` começa a recursão, ela só devolve o fiber quando
toda a subárvore dele (filhos, netos, bisnetos...) já foi criada — não
tem como "congelar" no meio de uma call stack e continuar depois.

O React de verdade não separa esses dois passos. Criação e percurso
acontecem **juntos**, fiber por fiber, dentro do mesmo laço — é isso
que faz a renderização ser interruptível (o famoso "time slicing" do
Fiber): o navegador pode pedir a vez de volta (pra não travar a UI) e o
React retoma exatamente de onde parou.

[`lazyFiber.js`](./lazyFiber.js) implementa essa versão:

- `createFiber(node, returnFiber)` cria **só o fiber do nó atual**,
  guardando os filhos "crus" (ainda não processados) em
  `fiber.pendingChildren` — sem recursão nenhuma.
- `beginWork(fiber)` materializa os filhos **diretos** desse fiber
  (não os netos!) e limpa `pendingChildren`. É chamada uma vez por nó,
  logo antes de descer pra ele.
- `workLoop(current, visit, shouldYield)` é o mesmo percurso
  `child → sibling → return` de sempre, mas agora chama `beginWork`
  em cada passo (a árvore vai sendo criada sob demanda) e checa
  `shouldYield()` a cada iteração. Se `shouldYield` disser "para",
  a função **retorna o fiber onde parou** em vez de continuar.

Pra retomar depois, é só chamar `workLoop` de novo passando esse fiber
retornado como `current` — ele continua dali, sem repetir nem pular
nenhum nó. Veja [`lazyFiber.demo.js`](./lazyFiber.demo.js): ele simula
uma pausa a cada 2 nós visitados e mostra que a ordem final continua
idêntica à do percurso sem pausas:

```bash
node "Linked Lists/bonus-fiber/lazyFiber.demo.js"
```

```
rodada 1: visitou div, header
rodada 2: visitou h1, nav
rodada 3: visitou main, section
rodada 4: visitou footer
ordem final: div -> header -> h1 -> nav -> main -> section -> footer
```

Repare que a ordem é idêntica à do `workLoop.js` original — só que
agora dá pra parar e continuar em qualquer ponto entre dois nós,
guardando apenas uma referência (o fiber atual), sem precisar de
nenhuma estrutura de dados extra pra "lembrar onde estava". É o
`return` da própria árvore que faz esse papel.

Esse é o mesmo algoritmo (em miniatura) que o React usa pra percorrer
a árvore de componentes durante a reconciliation.

## Como foi resolvido

### `createFiberTree`

Fiber não guarda uma lista de filhos — guarda só o **primeiro filho**
(`child`), e os demais filhos viram uma lista ligada de `sibling` a
partir dele. `return` sempre aponta pro pai.

Para cada nó de entrada:
1. Cria um `FiberNode` e liga `fiber.return` ao pai recebido por parâmetro.
2. Percorre `node.children` (se existir) chamando `createFiberTree`
   recursivamente para cada filho, passando o fiber atual como pai.
3. Encadeia os fibers filhos entre si: o primeiro vira `fiber.child`,
   e cada próximo vira o `.sibling` do filho anterior (guardando uma
   referência ao "último filho criado" durante o loop).

### `workLoop`

Percurso depth-first clássico do Fiber: desce por `child`, quando não
tem mais filho tenta ir pro `sibling`, e se não tem `sibling` sobe por
`return` até achar um irmão ou chegar na raiz.

1. Visita o fiber atual (`visit(fiber)`).
2. Se tem `child`, desce recursivamente para ele.
3. Senão, sobe a partir do fiber atual: em cada nível, se existir
   `sibling`, vai para ele; senão sobe mais um nível via `return`.
   O percurso termina quando não há mais `sibling` nem `return` (ou
   seja, voltou à raiz sem achar mais nada).

Com a árvore de exemplo do topo, a ordem de visita é
`div → h1 → p → span`, confirmando o comportamento depth-first.
