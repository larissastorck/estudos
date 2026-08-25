import { useRef, useState, useEffect } from 'react';
import { CircularSlideList } from './CircularSlideList';

// Extensão da Parte 3 — duração diferente por slide
//
// Cenário real: você recebe uma lista de imagens onde cada uma tem
// seu próprio tempo de exibição (tipo um slide de 5s, outro de 2s,
// outro de 8s) — igual Instagram Stories ou um digital signage de loja.
//
// Entrada de exemplo:
// [
//   { content: 'banner1.jpg', durationMs: 3000 },
//   { content: 'banner2.jpg', durationMs: 6000 },
//   { content: 'banner3.jpg', durationMs: 1500 },
// ]

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
    duration: 4000,
  },
  {
    id: "slide-4",
    content: "https://picsum.photos/id/1020/800/500",
    duration: 4000,
  },
  {
    id: "slide-5",
    content: "https://picsum.photos/id/1024/800/500",
    duration: 3500,
  },
];

export default function TimedInfiniteBanner() {
  // TODO: montar a CircularSlideList passando durationMs de cada slide
  const listRef = useRef(new CircularSlideList(slides));

  const [, forceRender] = useState(0);

  const currentNode = listRef.current.currentNode;
  const currentImg = currentNode?.content;
  const ids = [...listRef.current.map.keys()];

  useEffect(() => {
    // TODO: em vez de setInterval com tempo fixo, usar setTimeout que
    // reagenda a si mesmo lendo o durationMs do slide ATUAL a cada troca
    // (setInterval não serve bem aqui porque o intervalo muda a cada nó)
    if (!currentNode) return;

    const id = setTimeout(() => {
      listRef.current.next();
      forceRender((n) => n + 1);
    }, currentNode.durationMs);

    return () => clearTimeout(id);

    // Esqueleto sugerido:
    // let timeoutId;
    // function scheduleNext() {
    //   const current = listRef.current.current;
    //   timeoutId = setTimeout(() => {
    //     listRef.current.next();
    //     forceRender((n) => n + 1);
    //     scheduleNext();
    //   }, current.durationMs);
    // }
    // scheduleNext();
    // return () => clearTimeout(timeoutId);
    //
    // Pergunta pra discutir: por que trocar setInterval por um
    // setTimeout recursivo resolve isso de forma mais limpa?
    // O que aconteceria se vocês tentassem "atualizar" o setInterval
    // toda vez que o slide muda?
    //
    // Pergunta 2: o que acontece se o array de slides vier vazio,
    // ou com um único slide? A lista circular ainda faz sentido?
  }, [currentNode]);
  // Uso currentNode como dependência em vez de durationMs.
  // Se dois slides consecutivos tiverem a mesma duração,
  // durationMs não mudaria (ex.: 4000 -> 4000), então o useEffect
  // não seria executado novamente. Como currentNode é um objeto
  // diferente para cada slide, a troca de nó sempre dispara o efeito.

  const handleSelect = (id) => {
    listRef.current.selectSlide(id)
    //listRef.current.currentNode = listRef.current.map.get(id);
    forceRender(n => n + 1);
  }

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.content */}
      {!currentNode ?
        (<div>Nenhum slide disponível</div>) :
        (<div>
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
        )
      }
    </div>
  );
}
