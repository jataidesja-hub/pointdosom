import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

class ErrorBoundary extends React.Component<

  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#09090b', color: '#fafafa', fontFamily: 'Inter, sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Erro ao carregar o sistema
          </h1>
          <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#0284c7', color: 'white', border: 'none',
              borderRadius: '0.75rem', padding: '0.75rem 1.5rem',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            Recarregar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
