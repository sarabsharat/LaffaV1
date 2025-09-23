import React from 'react'
import "./Navbar.css"
import navlogo from "../../assets/logo.png";
import navprofile from "../../assets/navprofile.png";
import { useState } from 'react';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
    <div className='navbar'>
        <img src={navlogo} alt="Logo" className='nav-logo'/>
        
        <button 
          className={`nav-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>

        
        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <h1>Admin Dashboard</h1>
          <img src={navprofile} alt="Profile" className='nav-profile'/>
        </div>
      </div>
    </>
  );
}
export default Navbar;


