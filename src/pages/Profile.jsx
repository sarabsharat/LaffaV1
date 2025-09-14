import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.js';
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import './Profile.css';

const Profile = () => {
    const [userName, setUserName] = useState('User Name');
    const [newName, setNewName] = useState('');
    const [userEmail, setUserEmail] = useState('user.email@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [userPhone, setUserPhone] = useState('+962 7XXXXXXX');
    const [newPhone, setNewPhone] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserName(user.displayName || "User Name");
                setUserEmail(user.email || "user.email@example.com");
                setUserPhone(user.phoneNumber || "+962 7XXXXXXX");

                const docRef = db.collection("users").doc(user.uid);
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const data = docSnap.data();
                    setUserName(data.name || user.displayName || "User Name");
                    setUserPhone(data.phone || user.phoneNumber || "+962 7XXXXXXX");
                } else {
                    await docRef.set({
                        name: user.displayName || "User Name",
                        email: user.email,
                        phone: user.phoneNumber || ""
                    });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        navigate('/LoginSignup');
    };

    const handleViewOrders = () => {
        navigate('/orders');
    };

    const handleChangeName = async (e) => {
        e.preventDefault();
        if (newName.trim()) {
            setUserName(newName);

            const user = auth.currentUser;
            if (user) {
                await db.collection("users").doc(user.uid).update({ name: newName });
            }

            setNewName('');
            setIsEditingName(false);
            setErrorMessage('');
        }
    };

    const handleEditName = () => {
        setNewName(userName);
        setIsEditingName(true);
        setErrorMessage('');
    };

    const handleCancelEditName = () => {
        setNewName('');
        setIsEditingName(false);
        setErrorMessage('');
    };

    const handleSaveEmail = async (e) => {
        e.preventDefault();
        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        const user = auth.currentUser;
        if (user) {
            await user.updateEmail(newEmail);
            await db.collection("users").doc(user.uid).update({ email: newEmail });
        }

        setUserEmail(newEmail);
        setIsEditingEmail(false);
        setErrorMessage('');
    };

    const handleEditEmail = () => {
        setNewEmail(userEmail);
        setIsEditingEmail(true);
        setErrorMessage('');
    };

    const handleCancelEditEmail = () => {
        setNewEmail('');
        setIsEditingEmail(false);
        setErrorMessage('');
    };
    
    const handleSavePhone = async (e) => {
        e.preventDefault();
        const digitsOnly = newPhone.replace(/\D/g, '');

        if (digitsOnly.length !== 9 || !digitsOnly.startsWith('7')) {
            setErrorMessage('❌ Phone number must be exactly 9 digits and start with 7.');
            return;
        }

        const formattedPhone = `+962 ${digitsOnly}`;
        setUserPhone(formattedPhone);

        const user = auth.currentUser;
        if (user) {
            await db.collection("users").doc(user.uid).update({ phone: formattedPhone });
        }

        setIsEditingPhone(false);
        setErrorMessage('');
    };

    const handleEditPhone = () => {
        setNewPhone(userPhone);
        setIsEditingPhone(true);
        setErrorMessage('');
    };

    const handleCancelEditPhone = () => {
        setNewPhone('');
        setIsEditingPhone(false);
        setErrorMessage('');
    };

    const handleKeyPress = (e, callback) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callback(e);
        }
    };

    const InputRow = ({ icon, label, children }) => (
        <div className="input-row-container">
            <div className="input-row-icon">
                <span>
                    {icon === "user" && <FaUser />}
                    {icon === "envelope" && <FaEnvelope />}
                    {icon === "phone" && <FaPhone />}
                </span>
            </div>
            <div className="input-row-content">
                <label className="input-row-label">{label}</label>
                {children}
            </div>
        </div>
    );

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div className="profile-title-container">
                    <h1 className="profile-title fw-bold">Profile</h1>
                    <div className="profile-title-divider" />
                </div>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                {/* Name Section */}
                <div>
                    <InputRow icon="user" label="Your Name">
                        <span className="input-row-value">{userName}</span>
                    </InputRow>
                    {isEditingName ? (
                        <form onSubmit={handleChangeName} className="edit-form">
                            <div className="edit-form-row">
                                <input
                                    type="text"
                                    placeholder="Enter new name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleChangeName)}
                                    className="edit-input"
                                    autoFocus
                                />
                                <button type="submit" className="save-button">Save</button>
                                <button type="button" onClick={handleCancelEditName} className="cancel-button">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditName} className="edit-button">Edit Name</button>
                    )}
                </div>

                {/* Email Section */}
                <div>
                    <InputRow icon="envelope" label="Email Address">
                        <span className="input-row-value">{userEmail}</span>
                    </InputRow>
                    {isEditingEmail ? (
                        <form onSubmit={handleSaveEmail} className="edit-form">
                            <div className="edit-form-row">
                                <input
                                    type="email"
                                    placeholder="example@domain.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleSaveEmail)}
                                    className="edit-input"
                                    autoFocus
                                />
                                <button type="submit" className="save-button">Save</button>
                                <button type="button" onClick={handleCancelEditEmail} className="cancel-button">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditEmail} className="edit-button">Edit Email</button>
                    )}
                </div>

                {/* Phone Section */}
                <div>
                    <InputRow icon="phone" label="Phone Number">
                        <span className="input-row-value">{userPhone}</span>
                    </InputRow>
                    {isEditingPhone ? (
                        <form onSubmit={handleSavePhone} className="edit-form">
                            <div className="edit-form-row">
                                <input
                                    type="tel"
                                    placeholder="79XXXXXXX (10 digits)"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleSavePhone)}
                                    className="edit-input"
                                    autoFocus
                                />
                                <button type="submit" className="save-button">Save</button>
                                <button type="button" onClick={handleCancelEditPhone} className="cancel-button">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditPhone} className="edit-button">Edit Phone</button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button onClick={handleViewOrders} className="action-button">My Orders</button>

                    <Link to="/Cart">
                        <button className="action-button">Go to Cart</button>
                    </Link>

                    <button onClick={handleLogout} className="action-button logout-button">Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
