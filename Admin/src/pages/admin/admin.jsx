import React from 'react'
import "./Admin.css"
import Sidebar from '../../components/Sidebar/Sidebar'
import {Routes, Route} from "react-router-dom"
import AddProduct from '../../components/AddProduct/AddProduct'
import ListProduct from '../../components/ListProduct/ListProduct'  

export const Admin = () => {
  return (
    <div className='admin-layout'>
        <Sidebar/>
        <Routes className="admin-content">
            <Route path='/addproduct' element={<AddProduct/>}/>
            <Route path='/listproduct' element={<ListProduct/>}/>
        </Routes>
    </div>
  )
}

export default Admin;
