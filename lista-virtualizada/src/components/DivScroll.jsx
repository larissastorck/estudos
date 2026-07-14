import { useMemo } from 'react';

export function ScrollDiv() {
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
      throttle((event) => {
        const container = event.currentTarget;

        console.log(container.scrollTop);

        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 100
        ) {
          console.log("Load next page");
        }
      }, 100),
    []
  );

  return (
    <div
      onScroll={handleScroll}
      style={{
        height: 400,
        overflowY: "auto",
        border: "1px solid black",
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => (
        <div
          key={index}
          style={{
            height: 50,
            borderBottom: "1px solid #ccc",
          }}
        >
          Item {index}
        </div>
      ))}
    </div>
  );
}