import React from 'react'
import "./Sidebar.css"
import { Link } from 'react-router-dom'
import { FaCartShopping, FaList } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to="/addproduct"  style={{textDecoration:"none"}}>
        <div className='sidebarItem'>
           <FaCartShopping />
           <span>Add Product</span>
          </div>
        </Link>
        <Link to="/listproduct"  style={{textDecoration:"none"}}>
        <div className='sidebarItem'>
           <FaList />
           <span>Products List</span>
          </div>
        </Link>
    </div>
  )
}
export default Sidebar;