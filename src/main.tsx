import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './pwa.ts';

const mountElem = document.getElementById('weekly-trend-chart-root') || document.getElementById('root')!;
if (mountElem) {
  createRoot(mountElem).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
