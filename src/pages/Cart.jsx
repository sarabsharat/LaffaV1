import React from 'react';
import './Cart.css';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon

// Import your product images here
import product1_image from "../components/assets/Product1.jpg";
import product2_image from '../components/assets/product2.jpg';
// Import other images as needed

const Cart = ({ cartItems, setCartItems }) => {

    // Function to handle quantity increase
    const increaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Function to handle quantity decrease
    const decreaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    // Function to handle item deletion
    const deleteItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className='cart-container'>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className='cart-items'>
                    {cartItems.map(item => (
                        <div key={item.id} className='cart-item'>
                            <img src={item.image} alt={item.name} className='cart-item-image' />
                            <div className='cart-item-details'>
                                <h3>{item.name}</h3>
                                {/* Changed currency symbol and added 'JOD' */}
                                <p>Price: JOD {item.price.toFixed(2)}</p>
                                <div className='cart-item-quantity-control'>
                                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                            </div>
                             {/* Delete button with trash icon */}
                            <button onClick={() => deleteItem(item.id)} className='cart-item-delete'>
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className='cart-summary'>
                <h2>Order Summary</h2>
                {/* Changed currency symbol and added 'JOD' */}
                <p>Total: JOD {calculateTotal().toFixed(2)}</p>
            </div>
        </div>
    );
};

export default Cart;