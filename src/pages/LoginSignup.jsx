import React, { useState, useEffect, useRef } from 'react';
import firebase, { auth, db } from '../firebase';
import googleLogo from '../components/assets/google-logo.png';
import JOR_flag from '../components/assets/JOR_flag.png';
import './LoginSignup.css';
import { FaUser, FaEnvelope, FaPhone, FaMobileAlt, FaLock, FaKey, FaGlobe, FaCity, FaRoad } from "react-icons/fa";
import Image from "../components/assets/Front.png";


const AREAS_BY_GOV = {
  "العاصمة (Amman)": [
    "العبدلي", "ماركا", "الدوار الرابع", "المهاجرين",
    "المدينة الرياضية", "خالد بن الوليد", "صويلح", "نقابة المهندسين", "عبدون",
    "الدوار الخامس", "الدوار السادس", "الشميساني", "جبل اللويبدة", "وادي صقرة",
    "جبل النزهة", "وسط البلد", "الجبيهة", "رأس العين", "الصويفية",
    "المدينة الصناعية", "الجامعة الأردنية", "حي نزال", "الشميساني الجديدة", "الرابية",
  ],
  "الزرقاء (Zarqa)": [
    "الزرقاء البلد", "الزرقاء الجديدة", "الرصيفة", "الجبل الأزرق", "الوسطية",
    "الحمة الشرقية", "الحمة الغربية",
  ],
  "إربد (Irbid)": [
    "إربد", "لواء بني كنانة", "لواء الرمثا", "لواء الطيبة", "لواء الكورة",
    "لواء المزار الشمالي",
  ],
  "الكرك (Karak)": [
    "الكرك", "لواء القصر", "لواء المزار", "لواء عي", "لواء الأغوار الجنوبية"
  ],
  "المفرق (Mafraq)": [
    "المفرق", "لواء البادية الشمالية الشرقية", "لواء البادية الشمالية الغربية", "لواء الحمرة"
  ],
  "البلقاء (Balqa)": [
    "السلط", "الفحيص", "عين الباشا", "دير علا", "الأشرفية"
  ],
  "معان (Ma'an)": [
    "معان", "لواء الشوبك", "لواء المريغة", "لواء القطرانة", "لواء الجفر"
  ],
  "الطفيلة (Tafileh)": [
    "الطفيلة", "لواء القادسية", "لواء الحسا"
  ],
  "العقبة (Aqaba)": [
    "العقبة"
  ],
  "جرش (Jerash)": [
    "جرش", "برما", "ساكب"
  ],
  "عجلون (Ajloun)": [
    "عجلون", "لواء كفرنجة", "عنجرة"
  ],
  "مادبا (Madaba)": [
    "مادبا", "ذيبان"
  ],
};

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    countryCode: '+962', 
    phoneNumber: '',
    province: '',
    area: '',
    street: '',
    agreeTerms: false,
  });

  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const recaptchaContainerRef = useRef(null);
  const fullPhoneNumber = formData.countryCode + formData.phoneNumber;

  const changeHandler = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  // Initialize reCAPTCHA when state changes to 'Sign Up'
  useEffect(() => {
    if (state === 'Sign Up' && recaptchaContainerRef.current && !recaptchaVerifier) {
      try {
        const verifier = new firebase.auth.RecaptchaVerifier(recaptchaContainerRef.current, {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => {
            setErrorMessage('reCAPTCHA expired. Please try sending the code again.');
            setRecaptchaVerifier(null);
          },
        });
        
        verifier.render().then(widgetId => {
          console.log('reCAPTCHA rendered with widgetId:', widgetId);
          setRecaptchaVerifier(verifier);
        }).catch(err => {
          console.error("reCAPTCHA render error:", err);
          setErrorMessage('Failed to load reCAPTCHA. Please refresh the page.');
        });
      } catch (error) {
        console.error("Error creating reCAPTCHA verifier:", error);
        setErrorMessage('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    }
  }, [state, recaptchaVerifier]);

  // Cleanup reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {
          console.error("Error clearing recaptcha:", e);
        }
      }
    };
  }, [recaptchaVerifier]);

  const validateSignupForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.repeatPassword || !formData.phoneNumber || !formData.province || !formData.area || !formData.street) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('You must agree to the terms and privacy policy.');
      return false;
    }
    return true;
  };

  const sendVerificationCode = async () => {
    setErrorMessage('');
    if (!validateSignupForm()) return;
    
    if (!recaptchaVerifier) {
      setErrorMessage('reCAPTCHA not ready yet. Please wait a moment or refresh.');
      return;
    }

    setIsCodeSending(true);
    try {
      const confirmation = await auth.signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
      setErrorMessage('Verification code sent to your WhatsApp/phone.');
    } catch (err) {
      console.error('sendVerificationCode error', err);
      setErrorMessage('Failed to send code. Check the number and try again.');
    } finally {
      setIsCodeSending(false);
    }
  };

  const verifyCodeAndSignup = async () => {
    setErrorMessage('');
    if (!verificationCode) {
      setErrorMessage('Enter the verification code.');
      return;
    }
    if (!confirmationResult) {
      setErrorMessage('No pending verification. Send code first.');
      return;
    }

    setIsSigningUp(true);
    try {
      await confirmationResult.confirm(verificationCode);
      
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await db.collection("users").doc(user.uid).set({
        name: formData.username,
        email: user.email,
        phone: fullPhoneNumber,
        province: formData.province,
        area: formData.area,
        street: formData.street,
        createdAt: new Date()
      });

      window.location.replace("/profile");
    } catch (err) {
      console.error('verifyCodeAndSignup error', err);
      setErrorMessage('Code verification failed. Please check the code and try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const validateLoginForm = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const login = async () => {
    setErrorMessage('');
    if (!validateLoginForm()) return;

    try {
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      window.location.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      window.location.replace('/');
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('Google login failed: ' + error.message);
    }
  };

  const handleEmailPasswordSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateSignupForm()) return;

    try {
      // Create user in Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;

      // Save extra profile data in Firestore
      await db.collection("users").doc(user.uid).set({
        name: formData.username,
        email: user.email,
        phone: fullPhoneNumber,
        province: formData.province,
        area: formData.area,
        street: formData.street,
        createdAt: new Date()
      });

      window.location.replace("/profile");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Common styles
  const commonInputStyle = {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '12px',
    border: '1px solid #221820',
    padding: '0.75rem 1rem',
    color: '#1f0f2e',
    fontWeight: 500,
    width: '100%'
  };

  const purple1 = '#432e3f';
  const purple2 = '#221820';
  const accent = '#CFA3E1'; 
  const white = '#fff';

const iconEmoji = (icon) => {
  if (icon === "user") return <FaUser />;
  if (icon === "envelope") return <FaEnvelope />;
  if (icon === "phone") return <FaPhone />;
  if (icon === "mobile-alt") return <FaMobileAlt />;
  if (icon === "lock") return <FaLock />;
  if (icon === "key") return <FaKey />;
  if (icon === "globe") return <FaGlobe />;
  if (icon === "city") return <FaCity />;
  if (icon === "road") return <FaRoad />;
  return null;
};


  // InputRow component

  const InputRow = ({ icon, label, children }) => (
    <div className="input-row-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <div className="input-row-icon" style={{ minWidth: 32, textAlign: 'center', fontSize: '1.5rem', color: white }}>
        {iconEmoji(icon)}
      </div>
      <div className="input-row-content" style={{ flex: 1, marginLeft: '1rem' }}>
        <label className="input-row-label" style={{ color: white, fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
          {label}
        </label>
        {children}
      </div>
    </div>
  );

return (
    <div className="loginsignup" style={{ padding: '2rem 1rem', background: 'linear-gradient(135deg, #221820 0%, #432e3f 100%)', minHeight: '100vh' }}>
      <div
        className="text-black m-0 mx-auto"
        style={{
          borderRadius: '30px',
          maxWidth: '1100px',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.05)',
          boxShadow: '0 30px 60px -10px rgba(108,74,121,0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 500px',
              padding: '2rem 2rem 2rem 3rem',
              minWidth: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <h1
                className="fw-bold"
                style={{
                  color: "#e0e0e0",
                  padding: '0.5rem 0',
                  fontSize: '1.75rem',
                  margin: 0,
                  letterSpacing: '0.5px',
                }}
              >
                {state}
              </h1>
              <div
                style={{
                  height: 4,
                  width: 120,
                  background: `linear-gradient(90deg, ${purple1}, ${purple2})`,
                  borderRadius: 2,
                  marginTop: 6,
                }}
              />
            </div>

            {errorMessage && (
              <div className="error-message" style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}

            {state === 'Sign Up' ? (
              <>
                <InputRow icon="user" label="Your Name">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={changeHandler}
                    placeholder="Enter your full name"
                    style={commonInputStyle}
                  />
                </InputRow>

                <InputRow icon="envelope" label="Your Email">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="e.g., example@domain.com"
                    style={commonInputStyle}
                  />
                </InputRow>

                {!showCodeInput ? (
                  <InputRow icon="phone" label="Phone Number">
                    <div
                      className="phone-input-container"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '48px',
                        backgroundColor: '#f2f2f2',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexBasis: '30%',
                          justifyContent: 'center',
                          borderRight: '1px solid #ccc',
                          backgroundColor: '#eaeaea',
                          padding: '0 0.5rem',
                          height: '100%',
                        }}
                      >
                        <img src={JOR_flag} alt="Jordanian flag" style={{ height: '20px', marginRight: '0.25rem' }} />
                        <span style={{ fontWeight: 600 }}>{formData.countryCode}</span>
                      </div>
                  
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={changeHandler}
                        placeholder="e.g., 7xxxxxxx"
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          padding: '0 0.75rem',
                          fontSize: '1rem',
                          backgroundColor: 'transparent',
                          height: '100%',
                        }}
                      />
                    </div>
                  </InputRow>
                ) : (
                  <InputRow icon="mobile-alt" label="Verification Code">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter SMS code"
                      style={commonInputStyle}
                    />
                  </InputRow>
                )}

                <InputRow icon="lock" label="Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Enter your password"
                      style={commonInputStyle}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                        fontSize: '1.2rem'
                      }}
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </span>
                  </div>
                </InputRow>

                <InputRow icon="key" label="Repeat Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={repeatPasswordVisible ? 'text' : 'password'}
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={changeHandler}
                      placeholder="Repeat your password"
                      style={commonInputStyle}
                    />
                    <span
                      onClick={toggleRepeatPasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                        fontSize: '1.2rem'
                      }}
                    >
                      {repeatPasswordVisible ? '🙈' : '👁️'}
                    </span>
                  </div>
                </InputRow>

                <InputRow icon="globe" label="Province">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={changeHandler}
                    aria-label="Select Province"
                    style={{
                      ...commonInputStyle,
                      appearance: "none",
                      color: formData.province ? "#1f0f2e" : "#888",
                    }}
                  >
                    <option value="">Select Province</option>
                    {Object.keys(AREAS_BY_GOV).map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </InputRow>

                <InputRow icon="city" label="Area">
                  <select
                    name="area"
                    value={formData.area}
                    onChange={changeHandler}
                    disabled={!formData.province}
                    aria-label="Select Area"
                    style={{
                      ...commonInputStyle,
                      appearance: "none",
                      color: formData.area ? "#1f0f2e" : "#888",
                    }}
                  >
                    <option value="">Select Area</option>
                    {(AREAS_BY_GOV[formData.province] || []).map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </InputRow>
                
                <InputRow icon="road" label="Street Name">
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={changeHandler}
                    placeholder="e.g., Main Street"
                    style={commonInputStyle}
                  />
                </InputRow>

                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="signupFlexCheckDefault"
                    checked={formData.agreeTerms}
                    onChange={changeHandler}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="signupFlexCheckDefault" style={{ color: '#ddd', fontSize: '0.85rem' }}>
                    By continuing, I agree to the{' '}
                    <span style={{ color: accent, textDecoration: 'underline' }}>terms of use</span> &{' '}
                    <span style={{ color: accent, textDecoration: 'underline' }}>privacy policy</span>.
                  </label>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {!showCodeInput ? (
                    <button
                      onClick={sendVerificationCode}
                      disabled={isCodeSending}
                      style={{
                        flex: '1 1 100%',
                        padding: '0.9rem',
                        borderRadius: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                        color: '#fff',
                        boxShadow: '0 15px 40px -10px rgba(138,101,175,0.5)',
                        transition: 'transform .15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isCodeSending ? (
                        <>
                          Sending Code... <span role="img" aria-label="spinner">⏳</span>
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={verifyCodeAndSignup}
                      disabled={isSigningUp}
                      style={{
                        flex: '1 1 100%',
                        padding: '0.9rem',
                        borderRadius: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${purple2}, ${accent})`,
                        color: '#1f0f2e',
                        boxShadow: '0 15px 40px -10px rgba(207,163,225,0.5)',
                        transition: 'transform .15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isSigningUp ? (
                        <>
                          Signing Up... <span role="img" aria-label="spinner">⏳</span>
                        </>
                      ) : (
                        'Verify Code and Register'
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <InputRow icon="envelope" label="Email">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="e.g., example@domain.com"
                    style={commonInputStyle}
                  />
                </InputRow>

                <InputRow icon="lock" label="Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Enter your password"
                      style={commonInputStyle}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                        fontSize: '1.2rem'
                      }}
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </span>
                  </div>
                </InputRow>

                <button
                  onClick={login}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${purple1}, ${purple2})`,
                    color: '#fff',
                    width: '100%',
                    boxShadow: '0 15px 40px -10px rgba(138,101,175,0.5)',
                    transition: 'transform .15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Login
                </button>
              </>
            )}

            {state === 'Sign Up' && !showCodeInput && (
              <button
                onClick={handleEmailPasswordSignup}
                type="button"
                style={{
                  flex: '1 1 100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${purple2}, ${accent})`,
                  color: '#1f0f2e',
                  boxShadow: '0 15px 40px -10px rgba(207,163,225,0.5)',
                  marginTop: '0.5rem'
                }}
              >
                Sign Up with Email & Password
              </button>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="loginsignup-google-btn"
                onClick={handleGoogleLogin}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <img src={googleLogo} alt="Google logo" style={{ height: 18 }} />
                Continue with Google
              </button>

              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
                {state === 'Sign Up' ? (
                  <>
                    Already have an account?{' '}
                    <span 
                      onClick={() => { 
                        setState('Login'); 
                        setErrorMessage(''); 
                        setShowCodeInput(false); 
                      }} 
                      style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}
                    >
                      Login here
                    </span>
                  </>
                ) : (
                  <>
                    Create an account?{' '}
                    <span 
                      onClick={() => { 
                        setState('Sign Up'); 
                        setErrorMessage(''); 
                        setShowCodeInput(false); 
                      }} 
                      style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}
                    >
                      Click here
                    </span>
                  </>
                )}
              </p>
            </div>

            <div id="recaptcha-container" ref={recaptchaContainerRef} style={{ marginTop: 8 }}></div>
          </div>

          <div
            style={{
              flex: '1 1 400px',
              position: 'relative',
              overflow: 'hidden',
              minWidth: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${purple2}20, ${purple1}60)`,
            }}
          >
            <img
              src={Image}
              alt="Illustration"
              style={{
                maxWidth: '100%',
                objectFit: 'cover',
                borderRadius: '0 30px 30px 0',
                filter: 'drop-shadow(0 20px 50px rgba(108,74,121,0.4))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.15)',
                mixBlendMode: 'overlay',
                borderRadius: '0 30px 30px 0',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;