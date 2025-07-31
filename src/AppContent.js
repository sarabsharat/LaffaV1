import React, { useContext, useState, useEffect } from 'react'; // Import useState and useEffect
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
import { LanguageContext } from './LanguageContext.js'; // Import LanguageContext

// Import product images if needed in AppContent (or pass them as props)
// import product1_image from './components/assets/Product1.jpg';
// import product2_image from './components/assets/product2.jpg';


const AppContent = ({ cartItems, setCartItems, getTotalCartQuantity }) => {
    const { language } = useContext(LanguageContext); // Get the current language
    const [_, setToggle] = useState(false); // State to force re-render

    useEffect(() => {
        setToggle(prevToggle => !prevToggle); // Toggle state to force re-render when language changes
    }, [language]);

    return (
        <div className="app-wrapper" lang={language}> {/* Add the lang attribute here */}
            <BrowserRouter>
                {/* Pass the total quantity to the Navbar */}
                <Navbar totalQuantity={getTotalCartQuantity()} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/Shop" element={<Shop />} />
                    <Route path="/Product" element={<Product />}>
                        <Route path=':productId' element={<Product />} />
                    </Route>
                    {/* Pass cart state and setter to the Cart component */}
                    <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
                    <Route path="/LoginSignup" element={<LoginSignup />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default AppContent;
