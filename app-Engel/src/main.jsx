import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CheckoutWizard from '../Linked Lists/parte-1-stepper/CheckoutWizard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CheckoutWizard />
  </StrictMode>,
)
