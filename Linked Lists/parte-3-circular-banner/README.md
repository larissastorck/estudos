# Parte 3 — Circular Linked List: carrossel infinito

**Cenário real:** banner de home page que roda infinitamente, ou tabs
que ciclam entre campos.

## Arquivos
- `CircularSlideList.js` — a lista circular (SlideNode + CircularSlideList)
- `InfiniteBanner.jsx` — autoplay com intervalo FIXO pra todos os slides
- `TimedInfiniteBanner.jsx` — extensão: cada slide tem sua própria duração
  (o exercício de "recebo uma lista de imagens + tempo de cada uma e devo
  passar por elas respeitando o tempo")

## Como rodar
```jsx
import { InfiniteBanner } from './parte-3-circular-banner/InfiniteBanner';
import { TimedInfiniteBanner } from './parte-3-circular-banner/TimedInfiniteBanner';

// versão simples, todos os slides com o mesmo tempo
<InfiniteBanner slides={['a.jpg', 'b.jpg', 'c.jpg']} autoPlayMs={3000} />

// versão com tempo por slide
<TimedInfiniteBanner
  slides={[
    { content: 'a.jpg', durationMs: 3000 },
    { content: 'b.jpg', durationMs: 6000 },
    { content: 'c.jpg', durationMs: 1500 },
  ]}
/>
```

## Ordem sugerida
Resolvam primeiro o `InfiniteBanner` (intervalo fixo) e só depois
evoluam pro `TimedInfiniteBanner` — a segunda fica bem mais fácil
depois que a estrutura circular básica já está funcionando.

## Extra
Incluir as bolinhas que direcionam para as imagens na posição da bolinha, temos que fazer isso em 0(1)

Dica: hash map
