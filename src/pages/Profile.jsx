import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBInput, MDBIcon } from 'mdb-react-ui-kit';
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

    // Define color variables for consistency
    const purple1 = '#432e3f';
    const purple2 = '#221820';
    const accent = '#CFA3E1';
    const white = '#fff';

    const commonInputStyle = {
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '12px',
        border: `1px solid #221820`,
        padding: '0.75rem 1rem',
        color: '#1f0f2e',
        fontWeight: 500,
    };

    const handleLogout = () => {
        console.log('Logging out...');
        navigate('/LoginSignup');
    };

    const handleViewOrders = () => {
        console.log('Viewing orders...');
        navigate('/orders');
    };

    const handleChangeName = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            setUserName(newName);
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

    const handleSaveEmail = (e) => {
        e.preventDefault();
        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            setErrorMessage('Please enter a valid email address.');
            return;
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
    
    const handleSavePhone = (e) => {
        e.preventDefault();
    
        // Strip spaces or symbols
        const digitsOnly = newPhone.replace(/\D/g, '');
    
        // --- Conditions ---
        if (digitsOnly.length !== 9) {
            setErrorMessage('❌ Phone number must be exactly 9 digits (e.g., 7XXXXXXXX).');
            return;
        }
    
        if (!digitsOnly.startsWith('7')) {
            setErrorMessage('❌ Phone number must start with 7 (e.g., 7XXXXXXXX).');
            return;
        }
    
        // --- Success ---
        const formattedPhone = `+962 ${digitsOnly}`; // Added a space for better readability
        setUserPhone(formattedPhone);
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
        <div className="input-row-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="input-row-icon" style={{ minWidth: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MDBIcon fas icon={icon} size="lg" style={{ color: white }} />
            </div>
            <div className="input-row-content" style={{ flex: 1, marginLeft: '1rem' }}>
                <label className="input-row-label" style={{ display: 'block', color: '#ccc', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{label}</label>
                {children}
            </div>
        </div>
    );

    return (
        <MDBContainer fluid className="profile-wrapper" style={{ padding: '2rem 1rem', background: 'linear-gradient(135deg, #221820 0%, #432e3f 100%)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MDBCard
                className="profile-container"
                style={{
                    borderRadius: '30px',
                    maxWidth: '900px',
                    width: '100%',
                    overflow: 'hidden',
                    backdropFilter: 'blur(12px)',
                    background: 'rgba(255,255,255,0.05)',
                    boxShadow: '0 30px 60px -10px rgba(108,74,121,0.4)',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}
            >
                <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                    <h1 className="profile-title fw-bold" style={{
                        color: "#e0e0e0",
                        padding: '0.5rem 0',
                        fontSize: '2.5rem',
                        margin: 0,
                        letterSpacing: '0.5px',
                    }}>
                        Profile
                    </h1>
                    <div style={{
                        height: 4,
                        width: 120,
                        background: `linear-gradient(90deg, ${purple1}, ${purple2})`,
                        borderRadius: 2,
                        marginTop: 6,
                        margin: '0 auto'
                    }} />
                </div>

                {errorMessage && (
                    <div style={{
                        color: '#ff6b6b',
                        backgroundColor: 'rgba(255,107,107,0.1)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(255,107,107,0.3)'
                    }}>
                        {errorMessage}
                    </div>
                )}

                {/* Name Section */}
                <div>
                    <InputRow icon="user" label="Your Name">
                        <span style={{ color: accent, fontWeight: 600, fontSize: '1.1rem' }}>{userName}</span>
                    </InputRow>
                    {isEditingName ? (
                        <form onSubmit={handleChangeName} style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <MDBInput
                                    type="text"
                                    placeholder="Enter new name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleChangeName)}
                                    style={{ ...commonInputStyle, flex: 1, minWidth: '150px' }}
                                    autoFocus
                                />
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                                    color: '#fff',
                                    whiteSpace: 'nowrap'
                                }}>Save</button>
                                <button type="button" onClick={handleCancelEditName} style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditName} style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                            color: '#fff'
                        }}>Edit Name</button>
                    )}
                </div>

                {/* Email Section */}
                <div>
                    <InputRow icon="envelope" label="Email Address">
                        <span style={{ color: accent, fontWeight: 600, fontSize: '1.1rem' }}>{userEmail}</span>
                    </InputRow>
                    {isEditingEmail ? (
                        <form onSubmit={handleSaveEmail} style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <MDBInput
                                    type="email"
                                    placeholder="example@domain.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleSaveEmail)}
                                    style={{ ...commonInputStyle, flex: 1, minWidth: '150px' }}
                                    autoFocus
                                />
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                                    color: '#fff'
                                }}>Save</button>
                                <button type="button" onClick={handleCancelEditEmail} style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditEmail} style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                            color: '#fff'
                        }}>Edit Email</button>
                    )}
                </div>

                {/* Phone Section */}
                <div>
                    <InputRow icon="phone" label="Phone Number">
                        <span style={{ color: accent, fontWeight: 600, fontSize: '1.1rem' }}>{userPhone}</span>
                    </InputRow>
                    {isEditingPhone ? (
                        <form onSubmit={handleSavePhone} style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <MDBInput
                                    type="tel"
                                    placeholder="79XXXXXXX (10 digits)"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, handleSavePhone)}
                                    style={{ ...commonInputStyle, flex: 1 }}
                                    autoFocus
                                />
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                                    color: '#fff'
                                }}>Save</button>
                                <button type="button" onClick={handleCancelEditPhone} style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={handleEditPhone} style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                            color: '#fff'
                        }}>Edit Phone</button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="profile-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={handleViewOrders} style={{
                        padding: '1rem 2rem',
                        borderRadius: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                        color: '#fff',
                        boxShadow: '0 15px 40px -10px rgba(138,101,175,0.5)',
                        minWidth: '150px'
                    }}>My Orders</button>

                    <Link to="/Cart">
                        <button style={{
                            padding: '1rem 2rem',
                            borderRadius: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                            color: '#fff',
                            boxShadow: '0 15px 40px -10px rgba(138,101,175,0.5)',
                            minWidth: '150px'
                        }}>Go to Cart</button>
                    </Link>

                    <button onClick={handleLogout} style={{
                        padding: '1rem 2rem',
                        borderRadius: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${accent}, #9c67b4)`,
                        color: '#1f0f2e',
                        boxShadow: '0 15px 40px -10px rgba(207,163,225,0.5)',
                        minWidth: '150px'
                    }}>Logout</button>
                </div>
            </MDBCard>
        </MDBContainer>
    );
};

export default Profile;
