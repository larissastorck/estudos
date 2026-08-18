import { useRef, useState } from 'react';
import { StepHistory } from './StepHistory';

const STEPS = [
  { label: 'Carrinho', data: {} },
  { label: 'Endereço', data: {} },
  { label: 'Pagamento', data: {} },
  { label: 'Confirmação', data: {} },
];

export default function CheckoutWizard() {
  const historyRef = useRef(new StepHistory());
  const [, forceRender] = useState(0);


  function handleNext() {

    const index = historyRef.current.size
    const step = STEPS[index]
    historyRef.current.push(step.label, step.data)
    forceRender(value => value + 1)
  }

  function handleReset() {
    historyRef.current.reset()
    forceRender(value => value + 1)
  }

  function handleResetAll() {
    historyRef.current.resetAll()
    forceRender(value => value + 1)
  }

  const breadcrumb = historyRef.current.getBreadcrumb()
  const disableNext = historyRef.current.size >= STEPS.length;
  const currentLabel = historyRef.current.getCurrentLabel()

  return (
    <div>
      {breadcrumb.length > 0 && breadcrumb.map(label => {
        return (
          <p
            key={label}
            style={{
              color: label === currentLabel ? 'red' : 'white',
              paddingRight: '10px'
            }}
          >
            {label}
          </p>
        )
      })}
      <button disabled={disableNext} onClick={handleNext}>Próximo</button>
      {breadcrumb.length > 0 && <button onClick={handleReset}>Recomeçar</button>}
      {breadcrumb.length > 0 && <button onClick={handleResetAll}>Recomeçar tudo</button>}
    </div>
  );
}
