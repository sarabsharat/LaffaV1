import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css'; // We will create this CSS file

const Profile = () => {
    const [userName, setUserName] = useState('User Name'); // Placeholder for user's current name
    const [newName, setNewName] = useState('');
    const navigate = useNavigate();

    // Placeholder for logout functionality - REPLACE WITH YOUR ACTUAL LOGIC
    const handleLogout = () => {
        console.log('Logging out...');
        // Implement your logout logic here (e.g., clearing authentication tokens, redirecting to login page)
        navigate('/LoginSignup'); // Example: Redirect to login page after logout
    };

    // Placeholder for viewing orders - REPLACE WITH YOUR ACTUAL LOGIC
    const handleViewOrders = () => {
        console.log('Viewing orders...');
        // Implement your logic to navigate to the orders page
        navigate('/orders'); // Example: Navigate to /orders route
    };

    // Placeholder for changing name - REPLACE WITH YOUR ACTUAL LOGIC
    const handleChangeName = () => {
        console.log(`Changing name to: ${newName}`);
        // Implement your logic to update the user's name
        setUserName(newName); // Example: Update the displayed name
        setNewName(''); // Clear the input field
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>

            <div className="profile-info">
                <p>Current Name: {userName}</p>
                <input 
                    type="text" 
                    placeholder="Enter new name" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                />
                <button onClick={handleChangeName}>Change Name</button>
            </div>

            <div className="profile-actions">
                <button className="orders-button" onClick={handleViewOrders}>My Orders</button>
                <Link to="/Cart"><button className="cart-button">Go to Cart</button></Link>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;
