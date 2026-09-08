import { createFiberTree } from '../FiberNode.js'
import { workLoop } from '../workLoop.js'

const tree = {
  type: 'div',
  children: [
    {
      type: 'header',
      children: [
        { type: 'h1' },
        { type: 'nav' },
        { type: 'button' }
      ]
    },
    {
      type: 'main',
      children: [
        { type: 'h2' },
        {
          type: 'section',
          children: [
            { type: 'p' },
            { type: 'span' }
          ]
        },
        { type: 'button' }
      ]
    },
    {
      type: 'footer',
      children: [
        { type: 'small' },
        { type: 'a' }
      ]
    }
  ]
};

const root = createFiberTree(tree)

const orderMap = new Map()
let step = 0
workLoop(root, (fiber) => {
  step += 1
  orderMap.set(fiber, step)
})

function FiberLevel({ fiber }) {
  const siblings = []
  let node = fiber
  while (node) {
    siblings.push(node)
    node = node.sibling
  }

  return (
    <div className="level-row">
      {siblings.map((s) => (
        <div className="node-col" key={orderMap.get(s)}>
          <div className="node-box">
            <span className="order-badge">{orderMap.get(s)}</span>
            {s.type}
          </div>
          {s.child && <FiberLevel fiber={s.child} />}
        </div>
      ))}
    </div>
  )
}

function App() {
  const visitedOrder = [...orderMap.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([fiber]) => fiber.type)

  return (
    <div className="app">
      <h1>Fiber tree — demo</h1>
      <p>Árvore de entrada:</p>
      <pre>{JSON.stringify(tree, null, 2)}</pre>

      <p>Ordem de visita do workLoop:</p>
      <div className="order-list">
        {visitedOrder.map((type, i) => (
          <span key={i}>
            {type}
            {i < visitedOrder.length - 1 && <span className="arrow"> → </span>}
          </span>
        ))}
      </div>

      <p>Árvore de fibers (child desce, sibling vai pro lado):</p>
      <FiberLevel fiber={root} />
    </div>
  )
}

export default App
