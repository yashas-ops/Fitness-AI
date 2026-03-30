import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '24px'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '480px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '48px 32px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: '64px', height: '64px',
                borderRadius: '16px',
                background: 'rgba(248, 113, 113, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '28px'
              }}
            >
              ⚠️
            </div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.6 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: 'var(--gradient-accent)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--accent-glow)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
