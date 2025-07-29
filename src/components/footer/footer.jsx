import React from 'react';
import './footer.css';
import logo from '../assets/logo.png';
import { FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa'; // Import icons from react-icons

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={logo} alt="" />
        <p>LAFFA</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <FaInstagram size={30} /> {/* Use Instagram icon */}
        </div>
        <div className="footer-icons-container">
          <FaTiktok size={30} /> {/* Use TikTok icon */}
        </div>
        <div className="footer-icons-container">
          <FaFacebook size={30} /> {/* Use Facebook icon */}
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2023 - All Right Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;