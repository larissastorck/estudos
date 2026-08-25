import { useRef, useState } from 'react';
import { ImageCarouselList } from './ImageCarouselList';

const images = [
  "https://picsum.photos/id/10/800/600",
  "https://picsum.photos/id/20/800/600",
  "https://picsum.photos/id/30/800/600",
  "https://picsum.photos/id/40/800/600",
  "https://picsum.photos/id/50/800/600",
  "https://picsum.photos/id/60/800/600",
  "https://picsum.photos/id/70/800/600",
];

/*
Adicionar timer pra clicar no next
*/

export default function ProductCarousel() {
  // TODO: instanciar ImageCarouselList com useRef
  const listRef = useRef(new ImageCarouselList(images));

  const [, forceRender] = useState(0);

  function handleNext() {
    // TODO: listRef.current.next() + forceRender
    listRef.current.next()
    forceRender(value => value + 1)
  }

  function handlePrev() {
    // TODO: listRef.current.prev() + forceRender
    listRef.current.prev()
    forceRender(value => value + 1)
  }

  const currentImg = listRef.current.currentNode.src;
  const disableNext = listRef.current.hasNext()
  const disablePrev = listRef.current.hasPrev()

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.src */}
      <img src={currentImg} alt="Image" />
      <button onClick={handlePrev} disabled={disablePrev}>
        ‹ Anterior
      </button>
      <button onClick={handleNext} disabled={disableNext}>
        Próxima ›
      </button>
    </div>
  );
}
