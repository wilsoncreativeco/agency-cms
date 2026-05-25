import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App'
import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', padding: '32px', background: '#07060a', color: '#f0ece2',
        }}>
          <div style={{ maxWidth: 600, width: '100%' }}>
            <p style={{ color: '#c5a44a', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Wilson Creative Co. — CMS Error
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Something went wrong</h1>
            <pre style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6,
              padding: '16px', fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap',
              color: '#e05c5c', lineHeight: 1.6,
            }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 16, background: '#c5a44a', color: '#07060a',
                border: 'none', borderRadius: 4, padding: '10px 20px',
                fontWeight: 700, cursor: 'pointer', fontSize: 13,
              }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
