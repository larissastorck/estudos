import { useRef, useState, useEffect } from 'react';
import { CircularSlideList } from './CircularSlideList';

export function InfiniteBanner({ slides, autoPlayMs = 3000 }) {
  // TODO: usar CircularSlideList + useRef
  const listRef = useRef(null);
  if (!listRef.current) {
    listRef.current = new CircularSlideList(slides);
  }

  const [, forceRender] = useState(0);

  useEffect(() => {
    // TODO: setInterval chamando next() a cada autoPlayMs
    // Pergunta: por que autoplay com lista circular é mais simples
    // do que autoplay com array + módulo (%)?
    const id = setInterval(() => {
      // listRef.current.next();
      // forceRender((n) => n + 1);
    }, autoPlayMs);

    return () => clearInterval(id);
  }, [autoPlayMs]);

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.content */}
    </div>
  );
}
