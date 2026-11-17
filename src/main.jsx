import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/projects.css';
import './styles/demos.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
