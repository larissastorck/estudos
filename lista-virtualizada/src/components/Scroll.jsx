import { useState, useEffect, useMemo } from 'react';

export function ScrollWindow() {
  const [posicao, setPosicao] = useState(0);

  /*const throttle = (func, delay) => {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        func(...args);
      }
    };
  }
  */

  const throttle = (func, delay) => {
    let waiting = false;

    return (...args) => {
      if (waiting) return;

      func(...args);
      waiting = true;

      setTimeout(() => {
        waiting = false;
      }, delay);
    };
  }

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        console.log(window.scrollY);

        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
        ) {
          console.log("Load next page");
        }
      }, 100),
    []
  );

  useEffect(() => {
    // 1. Adiciona o listener quando o componente aparece na tela
    window.addEventListener('scroll', handleScroll);

    // 2. FUNÇÃO DE LIMPEZA (Cleanup): Remove o listener quando o componente some
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);//O handleScroll nunca muda, porque o useMemo tem dependências vazias ([]), só executa uma vez.

  return (
    <div style={{ position: 'fixed', top: 10, left: 10, background: '#fff' }}>
      Você rolou {posicao} pixels para baixo.
    </div>
  );
}