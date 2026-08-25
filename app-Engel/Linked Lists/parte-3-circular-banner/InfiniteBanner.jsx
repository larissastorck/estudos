import { useRef, useState, useEffect } from 'react';
import { CircularSlideList } from './CircularSlideList';

const slides = [
  {
    id: "slide-1",
    content: "https://picsum.photos/id/1015/800/500",
    duration: 3000,
  },
  {
    id: "slide-2",
    content: "https://picsum.photos/id/1016/800/500",
    duration: 5000,
  },
  {
    id: "slide-3",
    content: "https://picsum.photos/id/1018/800/500",
    duration: 2000,
  },
  {
    id: "slide-4",
    content: "https://picsum.photos/id/1020/800/500",
    duration: 2000,
  },
  {
    id: "slide-5",
    content: "https://picsum.photos/id/1024/800/500",
    duration: 3500,
  },
];

export default function InfiniteBanner() {
  // TODO: usar CircularSlideList + useRef
  const listRef = useRef(new CircularSlideList(slides));

  const [, forceRender] = useState(0);

  const currentNode = listRef.current.currentNode;
  const ids = [...listRef.current.map.keys()];
  const currentImg = currentNode.content;
  const autoPlayMs = 50000;


  useEffect(() => {
    // TODO: setInterval chamando next() a cada autoPlayMs
    // Pergunta: por que autoplay com lista circular é mais simples
    // do que autoplay com array + módulo (%)?

    const id = setInterval(() => {
      listRef.current.next();
      forceRender((n) => n + 1);
    }, autoPlayMs);

    return () => clearInterval(id);
  }, [autoPlayMs]);

  const handleSelect = (id) => {
    listRef.current.selectSlide(id)
    //listRef.current.currentNode = listRef.current.map.get(id);
    forceRender(n => n + 1);
  }

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.content */}
      <img src={currentImg} alt="Image" />
      <div>
        {ids.map(id => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
          >
            ●
          </button>
        ))}
      </div>
    </div>
  );
}
