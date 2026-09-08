import { createFiber, workLoop } from './lazyFiber.js';

const tree = {
  type: 'div',
  children: [
    { type: 'header', children: [{ type: 'h1' }, { type: 'nav' }] },
    { type: 'main', children: [{ type: 'section' }] },
    { type: 'footer' },
  ],
};

const root = createFiber(tree);
const visited = [];

let current = root;
let round = 0;

while (current) {
  round += 1;
  let stepsInThisRound = 0;

  current = workLoop(
    current,
    (fiber) => visited.push(fiber.type),
    () => {
      if (stepsInThisRound >= 4) return true;
      stepsInThisRound += 1;
      return false;
    },
  );

  console.log(`rodada ${round}: visitou ${visited.slice(-stepsInThisRound).join(', ')}`);
}

console.log('ordem final:', visited.join(' -> '));
