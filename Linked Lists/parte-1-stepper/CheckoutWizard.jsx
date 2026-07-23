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
  // TODO: usar StepHistory dentro de useRef (não useState!)
  // e um useState só pra forçar re-render quando o histórico muda.
  //
  // Pergunta pra discutir: por que useRef aqui e não guardar
  // a lista inteira no useState?
  const historyRef = useRef(new StepHistory());
  const [, forceRender] = useState(0);

  function handleNext() {
    // TODO: usar historyRef.current.push(...) com o próximo STEP
    // e chamar forceRender pra re-renderizar
  }

  function handleReset() {
    // TODO: historyRef.current.reset() + forceRender
  }

  const breadcrumb = []; // TODO: historyRef.current.getBreadcrumb()

  return (
    <div>
      <nav>{breadcrumb.join(' > ')}</nav>
      {/* TODO: renderizar o step atual (historyRef.current.current) */}
      <button onClick={handleNext}>Próximo</button>
      <button onClick={handleReset}>Recomeçar</button>
    </div>
  );
}
