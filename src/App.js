import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar.jsx';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product';
import Cart from './pages/Cart';
import LoginSignup from './pages/LoginSignup';
import Footer from './components/footer/footer.jsx';
import Profile from './pages/Profile';
import { LanguageProvider } from './LanguageContext.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ErrorBoundary from './components/ErrorBoundary';

// Import product images
import product1_image from './components/assets/Product1.jpg';
import product2_image from './components/assets/product2.jpg';

function App() {
  console.log('🔄 App component rendering');
  
  // Cart state managed in the App component
  const [cartItems, setCartItems] = useState([
    {
        id: 1,
        name: 'Product 1',
        image: product1_image,
        price: 25.00,
        quantity: 2,
    },
    {
        id: 2,
        name: 'Product 2',
        image: product2_image,
        price: 50.00,
        quantity: 1,
    },
  ]);

const [cartCount, setCartCount] = useState(0);

  // Debug effect to track cart changes
  React.useEffect(() => {
    console.log('🛒 Cart updated:', cartItems);
  }, [cartItems]);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="app-wrapper">
          <BrowserRouter>
            {/* Wrap Navbar with ErrorBoundary for isolation */}
            <ErrorBoundary>
              <Navbar totalQuantity={cartCount} />
            </ErrorBoundary>
            
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              } />
              
              <Route path="/profile" element={
                <ErrorBoundary>
                  <Profile />
                </ErrorBoundary>
              } />
              
              <Route path="/About" element={
                <ErrorBoundary>
                  <About />
                </ErrorBoundary>
              } />
              
              <Route path="/Contact" element={
                <ErrorBoundary>
                  <Contact />
                </ErrorBoundary>
              } />
              
              <Route path="/Shop" element={
                <ErrorBoundary>
                  <Shop updateCartCount={setCartCount}  />
                </ErrorBoundary>
              } />
              
              <Route path="/Product" element={
                <ErrorBoundary>
                  <Product />
                </ErrorBoundary>
              }>
                <Route path=':productId' element={
                  <ErrorBoundary>
                    <Product />
                  </ErrorBoundary>
                } />
              </Route>
              
              <Route path="/Cart" element={
                <ErrorBoundary>
                  <Cart cartItems={cartItems} setCartItems={setCartItems} />
                </ErrorBoundary>
              } />
              
              <Route path="/LoginSignup" element={
                <ErrorBoundary>
                  <LoginSignup />
                </ErrorBoundary>
              } />
            </Routes>
            
            {/* Wrap Footer with ErrorBoundary */}
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </BrowserRouter>
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

// Add error handling for the entire app
class AppWithErrorHandling extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('💥 APP LEVEL ERROR:', error);
    console.error('📋 Error Info:', errorInfo);
    
    // Log additional app state for debugging
    console.log('🔍 App State at time of error:', {
      cartItems: this.props.cartItems,
      location: window.location.href
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#e53e3e' }}>⚠️ Application Error</h2>
          <p>Something went wrong with the application. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          
          {this.state.errorInfo && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Technical Details</summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                backgroundColor: '#f7fafc',
                padding: '10px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return <App />;
  }
}

export default AppWithErrorHandling;