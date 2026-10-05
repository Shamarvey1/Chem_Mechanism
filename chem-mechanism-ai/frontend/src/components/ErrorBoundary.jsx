import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '1.5rem',
          margin: '1.5rem 0',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#f87171' }}>
            ⚠️ Visualizer Notice
          </h3>
          <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: '#cbd5e1' }}>
            The 3D scene encountered a rendering interruption. The mechanism data and questions below are still fully accessible.
          </p>
          {this.state.error && (
            <div style={{ margin: '0 auto 1rem auto', padding: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', textAlign: 'left', maxWidth: '600px', fontSize: '11px', color: '#ef4444', wordWrap: 'break-word', fontFamily: 'monospace' }}>
              <strong>Error:</strong> {this.state.error.message || this.state.error.toString()}
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry Visualizer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
