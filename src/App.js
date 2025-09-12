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

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id);
      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Debug effect to track cart changes
  React.useEffect(() => {
    console.log('🛒 Cart updated:', cartItems);
  }, [cartItems]);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="app-wrapper">
          <BrowserRouter>
            <ErrorBoundary>
              <Navbar totalQuantity={totalQuantity} />
            </ErrorBoundary>
            
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="/About" element={<ErrorBoundary><About /></ErrorBoundary>} />
              <Route path="/Contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
              <Route path="/Shop" element={<ErrorBoundary><Shop addToCart={addToCart} /></ErrorBoundary>} />
              <Route path="/Product" element={<ErrorBoundary><Product /></ErrorBoundary>}>
                <Route path=':productId' element={<ErrorBoundary><Product /></ErrorBoundary>} />
              </Route>
              <Route path="/Cart" element={<ErrorBoundary><Cart cartItems={cartItems} setCartItems={setCartItems} /></ErrorBoundary>} />
              <Route path="/LoginSignup" element={<ErrorBoundary><LoginSignup /></ErrorBoundary>} />
            </Routes>
            
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </BrowserRouter>
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

// Error handling component remains the same...
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>⚠️ Application Error</h2>
          <p>Something went wrong. Please try refreshing.</p>
        </div>
      );
    }
    return <App />;
  }
}

export default AppWithErrorHandling;
