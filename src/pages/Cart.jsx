import React from 'react';
import './Cart.css';
import { FaTrash } from 'react-icons/fa';

const Cart = ({ cartItems, setCartItems }) => {
  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-content">
        {/* LEFT SIDE - Cart Items */}
        <div className="cart-items-section">
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>JOD {item.price.toFixed(2)}</p>
                  <div className="cart-item-quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                </div>
                <button
                  className="cart-item-delete"
                  onClick={() => deleteItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="cart-summary-section">
          <div className="coupon-box">
            <h3>Apply Coupon</h3>
           <div className="coupon-section">
  <input type="text" placeholder="COUPON CODE" className="coupon-input" />
  <button className="apply-btn">APPLY</button>
</div>
          </div>

          <div className="summary-box">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>JOD {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>JOD {calculateTotal().toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
