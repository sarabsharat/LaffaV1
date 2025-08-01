import React, { useState, useEffect, useRef } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import firebase, { auth } from '../firebase';
import googleLogo from '../components/assets/google-logo.png';
import JOR_flag from '../components/assets/JOR_flag.png'; // Import the Jordanian flag image
import './LoginSignup.css'; // Ensure this file exists and is used for styling
import Image from "../components/assets/Front.png";


// Ensure Firebase is initialized before using this component

const AREAS_BY_GOV = {
  "العاصمة (Amman)": [
    "العبدلي", "الزرقاء الجديدة", "ماركا", "الدوار الرابع", "المهاجرين",
    "المدينة الرياضية", "خالد بن الوليد", "صويلح", "نقابة المهندسين", "عبدون",
    "الدوار الخامس", "الدوار السادس", "الشميساني", "جبل اللويبدة", "وادي صقرة",
    "جبل النزهة", "وسط البلد", "الجبيهة", "رأس العين", "الصويفية",
    "المدينة الصناعية", "الجامعة الأردنية", "حي نزال", "الشميساني الجديدة", "الرابية",
  ],
  "الزرقاء (Zarqa)": [
    "الوسطية", "الحمة الشرقية", "الحمة الغربية", "الزرقاء البلد", "الجبل الأزرق",
    "الزرقاء الجديدة",
  ],
  "إربد (Irbid)": [
    "إربد", "الرصيفة", "بريدة", "الجامعة الأردنية", "لواء بني كنانة",
    "لواء كفرنجة", "لواء الرمثا", "لواء الطيبة",
  ],
  "الكرك (Karak)": ["الكرك", "لواء القصر", "لواء الشوبك", "لواء المزار", "لواء البتراء"],
  "المفرق (Mafraq)": [
    "المفرق", "لواء البادية الشمالية الشرقية", "لواء البادية الشمالية الغربية", "لواء الحمرة",
  ],
  "البلقاء (Balqa)": [
    "السلط", "لواء الفحيص", "لواء عين الباشا", "لواء الأشرفية", "لواء الرمثا",
    "لواء بسطا",
  ],
  "معان (Ma'an)": ["معان", "لواء الشوبك", "لواء المريغة", "لواء القطرانة", "لواء الجفر"],
  "الطفيلة (Tafileh)": ["الطفيلة", "لواء القادسية", "لواء الحسا"],
  "العقبة (Aqaba)": ["العقبة"],
  "جرش (Jerash)": ["جرش", "لواء القادسية", "لواء المتوازن"],
  "عجلون (Ajloun)": ["عجلون", "لواء كفرنجة"],
  "المأدبة (Madaba)": ["مادبا", "لواء الشوبك"],
};

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    countryCode: '+962', // Fixed for Jordan
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

  const recaptchaContainerRef = useRef(null); // Ref for reCAPTCHA container

  const fullPhoneNumber = formData.countryCode + formData.phoneNumber;

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMessage(''); // Clear error message on input change
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  // Initialize reCAPTCHA when state changes to 'Sign Up' and container is available
  useEffect(() => {
    let verifier = null;
    if (state === 'Sign Up' && recaptchaContainerRef.current && !recaptchaVerifier) {
      verifier = new firebase.auth.RecaptchaVerifier(recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => { /* console.log('reCAPTCHA solved'); */ },
        'expired-callback': () => {
          setErrorMessage('reCAPTCHA expired. Please try sending the code again.');
          if (recaptchaVerifier) {
            try { recaptchaVerifier.clear(); } catch (e) { /* console.error("Error clearing recaptcha", e); */ }
          }
          setRecaptchaVerifier(null); // Clear verifier to force re-render or re-initialization
        },
      });
      verifier.render().then(widgetId => {
        // console.log('reCAPTCHA rendered with widgetId:', widgetId);
      }).catch(err => {
        console.error("reCAPTCHA render error:", err);
        setErrorMessage('Failed to load reCAPTCHA. Please refresh the page.');
      });
      setRecaptchaVerifier(verifier);
    }

    // Cleanup function
    return () => {
      if (verifier) {
        try { verifier.clear(); } catch (e) { /* console.error("Error clearing recaptcha on unmount", e); */ }
      }
      // If recaptchaVerifier is in state, clear it only if it's the one we created in this effect run
      // This prevents clearing a new verifier if the effect runs multiple times quickly
      // setRecaptchaVerifier(null); // Removed to avoid clearing verifier prematurely
    };
  }, [state]); // Depend only on state and recaptchaContainerRef.current implicitly

   // Effect to handle cleanup specifically when recaptchaVerifier changes
   useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
          // console.log("Recaptcha cleared on recaptchaVerifier change");
        } catch (e) {
          console.error("Error clearing recaptcha on recaptchaVerifier change", e);
        }
      }
    };
  }, [recaptchaVerifier]); // Depend on recaptchaVerifier for cleanup


  const validateSignupForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.repeatPassword || !formData.phoneNumber || !formData.province || !formData.area || !formData.street) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email)) {
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
    setErrorMessage(''); // Clear previous errors
    if (!validateSignupForm()) {
      return;
    }
    if (!formData.phoneNumber) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!recaptchaVerifier) {
      setErrorMessage('reCAPTCHA not ready yet. Please wait a moment or refresh.');
      return;
    }

    setIsCodeSending(true);
    try {
      const confirmation = await auth.signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
      setErrorMessage('Verification code sent to your WhatsApp/phone.'); // Use error message area for success
    } catch (err) {
      console.error('sendVerificationCode error', err);
      setErrorMessage('Failed to send code. Check the number and try again. (Error: ' + err.message + ')');
      // If reCAPTCHA expired, it will be handled by its callback
    } finally {
      setIsCodeSending(false);
    }
  };

  const verifyCodeAndSignup = async () => {
    setErrorMessage(''); // Clear previous errors
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
      // phone is verified — proceed to backend signup
      let responseData;
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Changed to application/json
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: fullPhoneNumber,
          phoneVerified: true,
        }),
      });
      responseData = await response.json();

      if (responseData?.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        setErrorMessage(responseData?.errors || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('verifyCodeAndSignup error', err);
      setErrorMessage('Code verification failed. Please check the code and try again. (Error: ' + err.message + ')');
    } finally {
      setIsSigningUp(false);
    }
  };

  const validateLoginForm = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required.');
      return false;
    }
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const login = async () => {
    setErrorMessage(''); // Clear previous errors
    if (!validateLoginForm()) {
      return;
    }

    let responseData;
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Changed to application/json
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();

      if (responseData?.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        setErrorMessage(responseData?.errors || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('An error occurred during login. Please try again later.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(''); // Clear previous errors
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      window.location.replace('/');
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('Google login failed: ' + error.message);
    }
  };

  // Define common styles for inputs
  const commonInputStyle = {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '12px',
    border: `1px solid #221820`, // purple2
    padding: '0.75rem 1rem',
    color: '#1f0f2e', // Dark text for contrast on light background
    fontWeight: 500,
  };

  // Define common inputProps for MDBInput
  const commonInputProps = {
    style: { background: 'transparent', color: '#1f0f2e' } // Text color inside input
  };

  const purple1 = '#432e3f';
  const purple2 = '#221820';
  const accent = '#CFA3E1'; 
  const white = '#fff';
  const inputBg = 'rgba(255,255,255,0.85)'; 

  // InputRow component with visible label
  const InputRow = ({ icon, label, children }) => (
    <div className="input-row-container"> {/* Added a class for potential CSS styling */}
      <div className="input-row-icon">
        <MDBIcon fas icon={icon + ' me-3'} size="lg" style={{ color: white , minWidth: 32 }} />
      </div>
      <div className="input-row-content">
        <label className="input-row-label" style={{ color: white, fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>{label}</label>
        {children}
      </div>
    </div>
  );

  return (
    <MDBContainer fluid className="loginsignup" style={{ padding: '2rem 1rem', background: 'linear-gradient(135deg, #221820 0%, #432e3f 100%)', minHeight: '100vh' }}>
      <MDBCard
        className="text-black m-0 mx-auto"
        style={{
          borderRadius: '30px',
          maxWidth: '1100px',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.05)',
          boxShadow: '0 30px 60px -10px rgba(108,74,121,0.4)',
          border: `1px solid rgba(255,255,255,0.08)`,
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
                  color: purple1,
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
                  <MDBInput
                    id="signupForm1"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={changeHandler}
                    placeholder="Enter your full name"
                    style={commonInputStyle}
                    inputProps={commonInputProps}
                  />
                </InputRow>

                <InputRow icon="envelope" label="Your Email">
                  <MDBInput
                    id="signupForm2"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="e.g., example@domain.com"
                    style={commonInputStyle}
                    inputProps={commonInputProps}
                  />
                </InputRow>

                {!showCodeInput ? (
                  <InputRow icon="phone" label="Phone Number">
                    <div className="phone-input-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <img src={JOR_flag} alt="Jordanian flag" style={{ height: '20px' }} /> {/* Added flag image */}
                      <MDBInput
                        id="signupFormPhoneCode"
                        type="text"
                        className="country-code-input"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={changeHandler}
                        readOnly
                        style={{ ...commonInputStyle, flex: '0 0 80px' }} // Adjusted width
                        inputProps={commonInputProps}
                      />
                      <MDBInput
                        id="signupFormPhoneNumber"
                        type="tel"
                        className="phone-number-input"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={changeHandler}
                        placeholder="e.g., 7xxxxxxx"
                        style={{ ...commonInputStyle, flex: 1 }}
                        inputProps={commonInputProps}
                      />
                    </div>
                  </InputRow>
                ) : (
                  <InputRow icon="mobile-alt" label="Verification Code">
                    <MDBInput
                      id="signupFormVerificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter SMS code"
                      style={commonInputStyle}
                      inputProps={commonInputProps}
                    />
                  </InputRow>
                )}

                <InputRow icon="lock" label="Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <MDBInput
                      id="signupForm3"
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Enter your password"
                      style={commonInputStyle}
                      inputProps={commonInputProps}
                    />
                    <MDBIcon
                      fas
                      icon={passwordVisible ? 'eye-slash' : 'eye'}
                      className="password-toggle-icon"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                      }}
                    />
                  </div>
                </InputRow>

                <InputRow icon="key" label="Repeat Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <MDBInput
                      id="signupForm4"
                      type={repeatPasswordVisible ? 'text' : 'password'}
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={changeHandler}
                      placeholder="Repeat your password"
                      style={commonInputStyle}
                      inputProps={commonInputProps}
                    />
                    <MDBIcon
                      fas
                      icon={repeatPasswordVisible ? 'eye-slash' : 'eye'}
                      className="password-toggle-icon"
                      onClick={toggleRepeatPasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                      }}
                    />
                  </div>
                </InputRow>

                <InputRow icon="globe" label="Province">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={changeHandler}
                    aria-label="Select Province"
                    style={{
                      appearance: 'none',
                      width: '100%',
                      ...commonInputStyle,
                      color: formData.province ? commonInputProps.style.color : '#888', // Grey out placeholder
                    }}
                  >
                    <option value="" disabled>
                      Select Province
                    </option>
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
                      appearance: 'none',
                      width: '100%',
                      ...commonInputStyle,
                      color: formData.area ? commonInputProps.style.color : '#888', // Grey out placeholder
                    }}
                  >
                    <option value="" disabled>
                      Select Area
                    </option>
                    {(AREAS_BY_GOV[formData.province] || []).map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </InputRow>

                <InputRow icon="road" label="Street Name">
                  <MDBInput
                    id="signupFormStreet"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={changeHandler}
                    placeholder="e.g., Main Street"
                    style={commonInputStyle}
                    inputProps={commonInputProps}
                  />
                </InputRow>

                <div style={{ marginTop: '0.5rem' }}>
                  <MDBCheckbox
                    name="agreeTerms"
                    id="signupFlexCheckDefault"
                    label={
                      <span style={{ color: '#ddd', fontSize: '0.85rem' }}>
                        By continuing, I agree to the{' '}
                        <span style={{ color: accent, textDecoration: 'underline' }}>terms of use</span> &{' '}
                        <span style={{ color: accent, textDecoration: 'underline' }}>privacy policy</span>.
                      </span>
                    }
                    checked={formData.agreeTerms}
                    onChange={changeHandler}
                  />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {!showCodeInput ? (
                    <button
                      onClick={sendVerificationCode}
                      disabled={isCodeSending}
                      className="action-button" // Added a class for potential CSS styling
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
                          Sending Code... <MDBIcon fas icon="spinner" spin />
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={verifyCodeAndSignup}
                      disabled={isSigningUp}
                      className="action-button" // Added a class for potential CSS styling
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
                          Signing Up... <MDBIcon fas icon="spinner" spin />
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
                  <MDBInput
                    id="loginForm1"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="e.g., example@domain.com"
                    style={commonInputStyle}
                    inputProps={commonInputProps}
                  />
                </InputRow>

                <InputRow icon="lock" label="Password">
                  <div style={{ position: 'relative', width: '100%' }}>
                    <MDBInput
                      id="loginForm2"
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Enter your password"
                      style={commonInputStyle}
                      inputProps={commonInputProps}
                    />
                    <MDBIcon
                      fas
                      icon={passwordVisible ? 'eye-slash' : 'eye'}
                      className="password-toggle-icon"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: purple1,
                      }}
                    />
                  </div>
                </InputRow>

                <button
                  onClick={login}
                  className="action-button" // Added a class for potential CSS styling
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
                    <span onClick={() => { setState('Login'); setErrorMessage(''); setShowCodeInput(false); }} style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}>
                      Login here
                    </span>
                  </>
                ) : (
                  <>
                    Create an account?{' '}
                    <span onClick={() => { setState('Sign Up'); setErrorMessage(''); setShowCodeInput(false); }} style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}>
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
      </MDBCard>
    </MDBContainer>
  );
};

export default LoginSignup;
