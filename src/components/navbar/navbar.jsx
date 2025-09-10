import './navbar.css'
import logo from '../assets/logo.png'
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaCartShopping, FaUser } from "react-icons/fa6"; // Import FaUser icon
import { FaGlobe } from "react-icons/fa"; // Import the globe icon
import translations from '../translations'; // Import translations
import { LanguageContext } from '../../LanguageContext'; // We will create this Context
import JORflag from "./../assets/JOR_flag.png";
import UKflag from "./../assets/UK_flag.png";


// Receive totalQuantity as a prop
 const Navbar = ({ totalQuantity }) => {
    const [menu, setMenu] = useState("Home");
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // State to control dropdown visibility
    const { language, changeLanguage } = useContext(LanguageContext); // Use LanguageContext
    const t = translations[language]; // Get translations for the current language
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

    const dropdownRef = useRef(null); // Ref for the dropdown element
    const navigate = useNavigate(); // Initialize useNavigate
 // Import flags

    // Placeholder for authentication status - REPLACE WITH YOUR ACTUAL LOGIC
    const userIsAuthenticated = true; // Example: set to true if user is signed in

    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
        setShowLanguageDropdown(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
    };

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleProfileClick = () => {
      navigate('/profile'); // Navigate to the profile page
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLanguageDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


  return (
    <div className='navbar'> 
        <div className='nav-logo'>
            <Link to="/"><img src={logo} alt="logo" /></Link>
            
    </div>

    {/* Hamburger Icon */}
    <div className="hamburger-icon" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
    </div>

    {/* Regular Menu (hidden on mobile) */}
    <ul className="nav-menu">
        <li onClick={()=>{setMenu("Home")}}><Link style={{ textDecoration:"none"}} to="/">{t.home || 'HOME'}</Link>{menu==="Home"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("About")}}><Link style={{ textDecoration:"none"}} to="/About">{t.about || 'ABOUT'}</Link>{menu==="About"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Contact")}}><Link style={{ textDecoration:"none"}} to="/Contact">{t.contact || 'CONTACT'}</Link>{menu==="Contact"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Shop")}}><Link style={{ textDecoration:"none"}} to="/Shop">{t.shop || 'SHOP'}</Link>{menu==="Shop"?<hr/>:<></>}</li>
    </ul>

    {/* Mobile Menu (shown on mobile when open) */}
    {isMobileMenuOpen && (
      <ul className="nav-menu-mobile open">
          <li onClick={()=>{setMenu("Home"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/">{t.home || 'HOME'}</Link></li>
          <li onClick={()=>{setMenu("About"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/About">{t.about || 'ABOUT'}</Link></li>
          <li onClick={()=>{setMenu("Contact"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/Contact">{t.contact || 'CONTACT'}</Link></li>
          <li onClick={()=>{setMenu("Shop"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/Shop">{t.shop || 'SHOP'}</Link></li>
      </ul>
    )}

    <div className="nav-login-cart">

        {/* Language Switcher */}
        <div className="language-switcher" ref={dropdownRef}> {/* Add ref to the switcher container */}
            <div className="language-display" onClick={toggleDropdown}> {/* Clickable area */}
                <FaGlobe className="language-icon" /> {/* React Globe Icon */}
                <span className="language-code">{language.toUpperCase()}</span> {/* Display language code */}
            </div>

            {showLanguageDropdown && ( /* Conditionally render dropdown */
                <div className="language-dropdown">
                    <div onClick={() => handleLanguageChange('en')} className="language-option">
                     <img src={UKflag} alt="UK Flag" className="flag-image" />
        <span>English</span>
    </div>
    <div onClick={() => handleLanguageChange('ar')} className="language-option">
        {/* Do the same for the other flag */}
        <img src={JORflag} alt="Jordan Flag" className="flag-image" />
        <span>العربية</span>
    </div>
                </div>
            )}
        </div>

      {/* Conditionally render login button or person icon */}
      {userIsAuthenticated ? (
        <div className="profile-icon" onClick={handleProfileClick}>
          <FaUser />
        </div>
      ) : (
        <Link to="/LoginSignup"><button className='login-btn' lang={language}>{t.login || 'Login'}</button></Link>
      )}
        
        <div className='cart-container'>
          <Link style={{ textDecoration:"none"}} to="/Cart"><button className='cart-btn'>
            <FaCartShopping />
          </button></Link>
          {/* Display the total quantity */}
          <span className='cart-count'>{totalQuantity}</span>
        </div>
      </div>
    </div>  
  )
}
export default Navbar
 