import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'katex/dist/katex.min.css'
import './index.css'

// Always ensure the application starts from the beginning upon refresh/update
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
