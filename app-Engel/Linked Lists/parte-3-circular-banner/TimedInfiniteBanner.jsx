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

export function TimedInfiniteBanner({ slides }) {
  // TODO: montar a CircularSlideList passando durationMs de cada slide
  const listRef = useRef(null);
  if (!listRef.current) {
    listRef.current = new CircularSlideList(slides);
  }

  const [, forceRender] = useState(0);

  useEffect(() => {
    // TODO: em vez de setInterval com tempo fixo, usar setTimeout que
    // reagenda a si mesmo lendo o durationMs do slide ATUAL a cada troca
    // (setInterval não serve bem aqui porque o intervalo muda a cada nó)
    //
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
  }, []);

  return (
    <div>
      {/* TODO: renderizar listRef.current.current.content */}
    </div>
  );
}
