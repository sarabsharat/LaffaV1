import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css'; // Import the new CSS file

const Profile = () => {
    const [userName, setUserName] = useState('User  Name'); // Placeholder for user's current name
    const [newName, setNewName] = useState('');
    const [userEmail, setUserEmail] = useState('user.email@example.com'); // State for user's current email
    const [newEmail, setNewEmail] = useState(''); // State for new email inputconst [userPhone, setUserPhone] = useState('+123 456 7890'); // State for user's current phone
    const [userPhone, setUserPhone] = useState('+123 456 7890'); // State for user's current phone
    const [newPhone, setNewPhone] = useState(''); // State for new phone input
    const navigate = useNavigate();

    // Placeholder for logout functionality
    const handleLogout = () => {
        console.log('Logging out...');
        navigate('/LoginSignup'); // Redirect to login page after logout
    };

    // Placeholder for viewing orders
    const handleViewOrders = () => {
        console.log('Viewing orders...');
        navigate('/orders'); // Navigate to /orders route
    };

    // Handle changing name
    const handleChangeName = () => {
        setUserName(newName); // Update the displayed name
        setNewName(''); // Clear the input field
    };

    // State and handlers for editing email
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const handleEditEmail = () => {
        setNewEmail(userEmail); // Initialize newEmail with current email
        setIsEditingEmail(true);
    };
    const handleSaveEmail = () => {
        setUserEmail(newEmail); // Update displayed email
        setIsEditingEmail(false);
    };
    const handleCancelEditEmail = () => {
        setNewEmail(''); // Clear new email input
        setIsEditingEmail(false);
    };

    // State and handlers for editing phone number
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const handleEditPhone = () => {
        setNewPhone(userPhone); // Initialize newPhone with current phone
        setIsEditingPhone(true);
    };
    const handleSavePhone = () => {
        setUserPhone(newPhone); // Update displayed phone
        setIsEditingPhone(false);
    };
    const handleCancelEditPhone = () => {
        setNewPhone(''); // Clear new phone input
        setIsEditingPhone(false);
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1 className="profile-title">Profile</h1>

                <div className="profile-info-panel">
                    <p>Current Name: <span className="current-name">{userName}</span></p>
                    <input
                        type="text"
                        placeholder="Enter new name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button className="change-name-button" onClick={handleChangeName}>Change Name</button>

                    <p>Current Email: <span className="current-email">{userEmail}</span></p>
                    {isEditingEmail ? (
                        <div>
                            <input
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button onClick={handleSaveEmail}>Save</button>
                            <button onClick={handleCancelEditEmail}>Cancel</button>
                        </div>
                    ) : (
                        <button onClick={handleEditEmail}>Edit Email</button>
                    )}

                    <p>Current Phone: <span className="current-phone">{userPhone}</span></p>
                    {isEditingPhone ? (
                        <div>
                            <input
                                type="tel"
                                placeholder="Enter new phone number"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                            />
                            <button onClick={handleSavePhone}>Save</button>
                            <button onClick={handleCancelEditPhone}>Cancel</button>
                        </div>
                    ) : (
                        <button onClick={handleEditPhone}>Edit Phone</button>
                    )}
                </div>

                <div className="profile-actions">
                    <button className="orders-button" onClick={handleViewOrders}>My Orders</button>
                    <Link to="/Cart">
                        <button className="cart-button">Go to Cart</button>
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
