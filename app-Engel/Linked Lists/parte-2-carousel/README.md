# Parte 2 — Doubly Linked List: carrossel de produto (prev/next O(1))

**Cenário real:** carrossel de imagens de produto, tipo página de e-commerce.

## Arquivos
- `ImageCarouselList.js` — a doubly linked list (ImageNode + ImageCarouselList)
- `ProductCarousel.jsx` — componente React que usa a lista e renderiza a UI

## Como rodar
```jsx
import { ProductCarousel } from './parte-2-carousel/ProductCarousel';

function App() {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
  return <ProductCarousel images={images} />;
}
```

## Pergunta pra retrospectiva
O que muda se vocês quisessem um carrossel que "gruda" no fim (não deixa
passar do último) vs um que dá a volta (vira circular)? Esse é o gancho
pra Parte 3.
