import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import CheckoutWizard from '../Linked Lists/parte-1-stepper/CheckoutWizard.jsx'
//import ProductCarousel from '../Linked Lists/parte-2-carousel/ProductCarousel.jsx'
//import InfiniteBanner from '../Linked Lists/parte-3-circular-banner/InfiniteBanner.jsx'
import TimedInfiniteBanner from '../Linked Lists/parte-3-circular-banner/TimedInfiniteBanner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TimedInfiniteBanner />
  </StrictMode>,
)
