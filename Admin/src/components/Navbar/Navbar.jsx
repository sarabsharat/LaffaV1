import React from 'react'
import "./Navbar.css"
import navlogo from "../../assets/logo.png";
import navprofile from "../../assets/navprofile.png";


export const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} className='nav-logo'/> 
        <h1>Admin Dashboard</h1>
        <img src={navprofile} className='nav-profile'/>
    </div>
  )
}
export default Navbar;
