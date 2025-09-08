import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      componentStack: ''
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
      componentStack: errorInfo.componentStack
    });
    
    console.error('🔥 ERROR BOUNDARY CAUGHT:', error);
    console.error('📋 Error Info:', errorInfo);
    console.error('🧩 Component Stack:', errorInfo.componentStack);
    
    // Log additional debugging info
    this.logDebugInfo();
  }

  logDebugInfo() {
    console.group('🔍 DEBUG INFORMATION');
    console.log('📍 Current URL:', window.location.href);
    console.log('🖥️ User Agent:', navigator.userAgent);
    console.log('📱 Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('💾 Memory Usage:', performance.memory ? 
      `Used: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB / Total: ${Math.round(performance.memory.totalJSHeapSize / 1048576)}MB` 
      : 'Not available');
    console.groupEnd();
  }

  reloadPage = () => {
    window.location.reload();
  };

  goHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#fff5f5',
          border: '2px solid #fed7d7',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#e53e3e' }}>🚨 Something went wrong!</h2>
          
          <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <h4 style={{ color: '#718096' }}>Error Details:</h4>
            <pre style={{ 
              fontSize: '12px', 
              overflow: 'auto', 
              backgroundColor: '#f7fafc',
              padding: '10px',
              border: '1px solid #e2e8f0'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>

          {this.state.componentStack && (
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <h4 style={{ color: '#718096' }}>Component Stack:</h4>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                backgroundColor: '#f7fafc',
                padding: '10px',
                border: '1px solid #e2e8f0'
              }}>
                {this.state.componentStack}
              </pre>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={this.reloadPage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button 
              onClick={this.goHome}
              style={{
                padding: '10px 20px',
                backgroundColor: '#38a169',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🏠 Go Home
            </button>
          </div>

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', color: '#3182ce' }}>📋 Technical Details (for developers)</summary>
            <pre style={{ 
              fontSize: '10px', 
              overflow: 'auto',
              backgroundColor: '#f7fafc',
              padding: '10px',
              border: '1px solid #e2e8f0',
              marginTop: '10px'
            }}>
              {JSON.stringify(this.state.errorInfo, null, 2)}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;