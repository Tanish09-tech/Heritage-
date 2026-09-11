import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-stone-800 border border-stone-700 rounded-3xl p-8 shadow-2xl">
            <div className="text-4xl mb-4">🏛️</div>
            <h1 className="text-xl font-bold mb-2">Sanskriti Suraksha</h1>
            <p className="text-sm text-stone-300 mb-6">
              An unexpected runtime error occurred. You can reset your session to restore full access.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs tracking-wide transition cursor-pointer"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 font-semibold text-xs tracking-wide transition cursor-pointer"
              >
                Clear Cache & Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)

