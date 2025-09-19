import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    // Also log to console
    console.error('Uncaught error:', error, info)
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    return (
      <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#b00020' }}>Application error</h1>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {String(error && (error.message || error))}
        </p>
        {info && info.componentStack && (
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>
            <summary>Component stack</summary>
            <div>{info.componentStack}</div>
          </details>
        )}
        <p style={{ marginTop: 12, color: '#666' }}>
          Open DevTools Console for more details.
        </p>
      </div>
    )
  }
}

export default ErrorBoundary
