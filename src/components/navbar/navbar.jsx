import './navbar.css'
import logo from '../assets/logo.png'
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";
import translations from '../translations';
import { LanguageContext } from '../../LanguageContext';
import JORflag from "./../assets/JOR_flag.png";
import UKflag from "./../assets/UK_flag.png";

const Navbar = ({ totalQuantity }) => {
    const [menu, setMenu] = useState("Home");
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const { language, changeLanguage } = useContext(LanguageContext);
    const t = translations[language];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const userIsAuthenticated = true;

    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
        setShowLanguageDropdown(false);
    };

    const toggleDropdown = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

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

            <div className="hamburger-icon" onClick={toggleMobileMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <ul className="nav-menu">
                <li onClick={()=>{setMenu("Home")}}><Link style={{ textDecoration:"none"}} to="/">{t.home || 'HOME'}</Link>{menu==="Home"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("About")}}><Link style={{ textDecoration:"none"}} to="/About">{t.about || 'ABOUT'}</Link>{menu==="About"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Contact")}}><Link style={{ textDecoration:"none"}} to="/Contact">{t.contact || 'CONTACT'}</Link>{menu==="Contact"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Shop")}}><Link style={{ textDecoration:"none"}} to="/Shop">{t.shop || 'SHOP'}</Link>{menu==="Shop"?<hr/>:<></>}</li>
            </ul>

            {isMobileMenuOpen && (
                <ul className="nav-menu-mobile open">
                    <li onClick={()=>{setMenu("Home"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/">{t.home || 'HOME'}</Link></li>
                    <li onClick={()=>{setMenu("About"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/About">{t.about || 'ABOUT'}</Link></li>
                    <li onClick={()=>{setMenu("Contact"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/Contact">{t.contact || 'CONTACT'}</Link></li>
                    <li onClick={()=>{setMenu("Shop"); setIsMobileMenuOpen(false);}}><Link style={{ textDecoration:"none"}} to="/Shop">{t.shop || 'SHOP'}</Link></li>
                </ul>
            )}

            <div className="nav-login-cart">
                <div className="language-switcher" ref={dropdownRef}>
                    <div className="language-display" onClick={toggleDropdown}>
                        <FaGlobe className="language-icon" />
                        <span className="language-code">{language.toUpperCase()}</span>
                    </div>

                    {showLanguageDropdown && (
                        <div className="language-dropdown">
                            <div onClick={() => handleLanguageChange('en')} className="language-option">
                                <img src={UKflag} alt="UK Flag" className="flag-image" />
                                <span>English</span>
                            </div>
                            <div onClick={() => handleLanguageChange('ar')} className="language-option">
                                <img src={JORflag} alt="Jordan Flag" className="flag-image" />
                                <span>العربية</span>
                            </div>
                        </div>
                    )}
                </div>

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
                   {totalQuantity > 0 && (
                        <span className="cart-count">{totalQuantity}</span>
                    )}
                </div>
            </div>
        </div>  
    )
}
export default Navbar;
