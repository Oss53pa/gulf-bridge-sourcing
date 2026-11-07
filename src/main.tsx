import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ContentProvider } from './content/ContentProvider';
import './index.css';

const el = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <ContentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContentProvider>
  </StrictMode>
);

// Les pages sont générées à l'avance : on reprend le HTML existant au lieu
// de le reconstruire, pour que le contenu reste affiché sans attente.
if (el.hasChildNodes()) hydrateRoot(el, tree);
else createRoot(el).render(tree);
