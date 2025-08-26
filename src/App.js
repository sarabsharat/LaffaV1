import './App.css';
import React, { useState, useContext } from 'react'; // Import useContext
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
import { LanguageProvider, LanguageContext } from './LanguageContext.js'; // Import LanguageContext
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import product images
import product1_image from './components/assets/Product1.jpg';
import product2_image from './components/assets/product2.jpg';
// Import other images as needed

function App() {
  // Cart state managed in the App component
  const [cartItems, setCartItems] = useState([
    {
        id: 1,
        name: 'Product 1',
        image: product1_image, // Use imported image
        price: 25.00,
        quantity: 2,
    },
    {
        id: 2,
        name: 'Product 2',
        image: product2_image, // Use imported image
        price: 50.00,
        quantity: 1,
    },
]);

 // Calculate total quantity of items in the cart
  const getTotalCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // LanguageContext is needed here to get the language for the lang attribute
  const { language } = useContext(LanguageContext); // Get the current language from context

  return (
    <LanguageProvider> {/* LanguageProvider wraps the content */}
      <div className="app-wrapper" lang={language}> {/* Add the lang attribute here */}
        <BrowserRouter>
          {/* Pass the total quantity to the Navbar */}
          <Navbar totalQuantity={getTotalCartQuantity()} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/Product" element={<Product />} >
            <Route path=':productId' element={<Product />} />
            </Route>
         
            <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/LoginSignup" element={<LoginSignup />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
