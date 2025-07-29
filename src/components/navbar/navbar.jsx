import './navbar.css'
import logo from '../assets/logo.png'
import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { FaCartShopping } from "react-icons/fa6";

// Receive totalQuantity as a prop
 const Navbar = ({ totalQuantity }) => {

    const [menu, setMenu] = useState("Home");

  return (
    <div className='navbar'> 
        <div className='nav-logo'>
            <Link to="/"><img src={logo} alt="logo" /></Link>
            
    </div>
    <ul className="nav-menu">
        <li onClick={()=>{setMenu("Home")}}><Link style={{ textDecoration:"none"}} to="/">HOME</Link>{menu==="Home"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("About")}}><Link style={{ textDecoration:"none"}} to="/About">ABOUT</Link>{menu==="About"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Contact")}}><Link style={{ textDecoration:"none"}} to="/Contact">CONTACT</Link>{menu==="Contact"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Shop")}}><Link style={{ textDecoration:"none"}} to="/Shop">SHOP</Link>{menu==="Shop"?<hr/>:<></>}</li>
    </ul>
    <div className="nav-login-cart">
      <Link to="/LoginSignup"><button className='login-btn' lang='ar'>تسجيل الدخول</button></Link>
        
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
 