import { useRef, useState } from 'react';
import { StepHistory } from './StepHistory';

// Passos de exemplo — troquem pelos passos reais do checkout de vocês
const STEPS = [
  { label: 'Carrinho', data: {} },
  { label: 'Endereço', data: {} },
  { label: 'Pagamento', data: {} },
  { label: 'Confirmação', data: {} },
];

export function CheckoutWizard() {
  // useRef guarda a StepHistory (mutável) sem causar re-render sozinha.
  // useState (forceRender) só existe pra avisar o React "algo mudou,
  // renderiza de novo" depois que mexemos na lista por fora do estado.
  // Inicialização lazy: `new StepHistory()` só roda na 1ª renderização,
  // não em toda re-render.
  const historyRef = useRef(null);
  if (historyRef.current === null) {
    historyRef.current = new StepHistory();
    historyRef.current.push(STEPS[0].label, STEPS[0].data);
  }

  const [currentStep, setCurrentStep] = useState(0);

  function handleNext() {
    const nextStep = currentStep + 1;
    if (nextStep >= STEPS.length) return;

    historyRef.current.push(STEPS[nextStep].label, STEPS[nextStep].data);
    setCurrentStep(nextStep);
  }

  function handleReset() {
    historyRef.current.reset();
    setCurrentStep(0);
  }

  const breadcrumb = historyRef.current.getBreadcrumb();

  return (
    <div>
      <nav>{breadcrumb.join(' > ')}</nav>
      {/* TODO: renderizar o step atual (historyRef.current.current) */}
      <h1>{STEPS[currentStep].label}</h1>
      <button onClick={handleNext}>Próximo</button>
      <button onClick={handleReset}>Recomeçar</button>
    </div>
  );
}
