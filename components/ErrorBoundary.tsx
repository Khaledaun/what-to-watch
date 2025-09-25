'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
              <p className="text-gray-300 mb-6">
                We encountered an unexpected error. Our team has been notified and is working to fix it.
              </p>
              
              {this.state.error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-red-200 font-semibold mb-2">Error Details:</h3>
                  <p className="text-red-100 text-sm font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-red-200 text-xs cursor-pointer">Stack Trace</summary>
                      <pre className="text-red-100 text-xs mt-2 whitespace-pre-wrap break-all">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.resetError}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
              
              <div className="mt-6 text-yellow-200">
                <h3 className="text-sm font-semibold mb-2">Need Help?</h3>
                <p className="text-xs text-gray-300 mb-3">
                  If this problem persists, please contact our support team with the error details above.
                </p>
                <div className="flex gap-4 justify-center text-sm">
                  <a href="/blog" className="text-yellow-200 hover:text-yellow-100">Read our blog</a>
                  <a href="/" className="text-yellow-200 hover:text-yellow-100">Browse recommendations</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}