import { useRef, useState } from 'react';
import { ImageCarouselList } from './ImageCarouselList';

export function ProductCarousel({ images }) {
  // TODO: instanciar ImageCarouselList com useRef
  const listRef = useRef(null);
  if (!listRef.current) {
    listRef.current = new ImageCarouselList(images);
  }

  const [, forceRender] = useState(0);

  function handleNext() {
    // TODO: listRef.current.next() + forceRender
  }

  function handlePrev() {
    // TODO: listRef.current.prev() + forceRender
  }

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.src */}
      <button onClick={handlePrev} disabled={false /* TODO: !hasPrev() */}>
        ‹ Anterior
      </button>
      <button onClick={handleNext} disabled={false /* TODO: !hasNext() */}>
        Próxima ›
      </button>
    </div>
  );
}
