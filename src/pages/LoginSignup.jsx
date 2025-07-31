import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import firebase, { auth } from '../firebase';
import googleLogo from '../components/assets/google-logo.png';
import './LoginSignup.css';

// Ensure Firebase is initialized before using this component

const AREAS_BY_GOV = {
  "العاصمة (Amman)": [
    "العبدلي",
    "الزرقاء الجديدة",
    "ماركا",
    "الدوار الرابع",
    "المهاجرين",
    "المدينة الرياضية",
    "خالد بن الوليد",
    "صويلح",
    "نقابة المهندسين",
    "عبدون",
    "الدوار الخامس",
    "الدوار السادس",
    "الشميساني",
    "جبل اللويبدة",
    "وادي صقرة",
    "جبل النزهة",
    "وسط البلد",
    "الجبيهة",
    "رأس العين",
    "الصويفية",
    "المدينة الصناعية",
    "الجامعة الأردنية",
    "حي نزال",
    "الشميساني الجديدة",
    "الرابية",
  ],
  "الزرقاء (Zarqa)": [
    "الوسطية",
    "الحمة الشرقية",
    "الحمة الغربية",
    "الزرقاء البلد",
    "الجبل الأزرق",
    "الزرقاء الجديدة",
  ],
  "إربد (Irbid)": [
    "إربد",
    "الرصيفة",
    "بريدة",
    "الجامعة الأردنية",
    "لواء بني كنانة",
    "لواء كفرنجة",
    "لواء الرمثا",
    "لواء الطيبة",
  ],
  "الكرك (Karak)": ["الكرك", "لواء القصر", "لواء الشوبك", "لواء المزار", "لواء البتراء"],
  "المفرق (Mafraq)": [
    "المفرق",
    "لواء البادية الشمالية الشرقية",
    "لواء البادية الشمالية الغربية",
    "لواء الحمرة",
  ],
  "البلقاء (Balqa)": [
    "السلط",
    "لواء الفحيص",
    "لواء عين الباشا",
    "لواء الأشرفية",
    "لواء الرمثا",
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

  const fullPhoneNumber = formData.countryCode + formData.phoneNumber;

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (state === 'Sign Up' && !recaptchaVerifier) {
      const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => { console.log('reCAPTCHA solved'); },
        'expired-callback': () => { console.log('reCAPTCHA expired'); },
      });
      verifier.render().then(widgetId => {
        console.log('reCAPTCHA rendered with widgetId:', widgetId);
      });
      setRecaptchaVerifier(verifier);
    }
    return () => {
      if (recaptchaVerifier) {
        try { recaptchaVerifier.clear(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  
  const sendVerificationCode = async () => {
    if (!formData.phoneNumber) {
      alert('Please enter your phone number.');
      return;
    }
    if (!recaptchaVerifier) {
      alert('reCAPTCHA not ready yet.');
      return;
    }

    setIsCodeSending(true);
    try {
      const confirmation = await auth.signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
      alert('Verification code sent to your WhatsApp/phone.');
    } catch (err) {
      console.error('sendVerificationCode error', err);
      alert('Failed to send code. Check the number and try again.');
      // If you get "reCAPTCHA expired" you can reset by calling recaptchaVerifier.render() again or re-initializing.
    } finally {
      setIsCodeSending(false);
    }
  };
  
  const verifyCodeAndSignup = async () => {
    if (!verificationCode) {
      alert('Enter the code.');
      return;
    }
    if (!confirmationResult) {
      alert('No pending verification. Send code first.');
      return;
    }
  
    setIsSigningUp(true);
    try {
      await confirmationResult.confirm(verificationCode);
      // phone is verified — proceed to backend signup
      let responseData;
      await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: fullPhoneNumber,
          phoneVerified: true,
        }),
      })
        .then((r) => r.json())
        .then((d) => (responseData = d));
  
      if (responseData?.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        alert(responseData?.errors || 'Signup failed');
      }
    } catch (err) {
      console.error('verifyCodeAndSignup error', err);
      alert('Code verification failed.');
    } finally {
      setIsSigningUp(false);
    }
  };
  

  const login = async () => {
    console.log('Login Function Executed', formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData?.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      alert(responseData?.errors || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      window.location.replace('/');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed.');
    }
  };
  const purple1 = '#432e3f';
  const purple2 = '#221820';
  const accent = '#CFA3E1';
  const inputBg = 'rgba(255,255,255,0.85)';
  const InputRow = ({ icon, label, children }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: 12 }}>
      <div style={{ marginTop: 8, flexShrink: 0 }}>
        <MDBIcon fas icon={icon + ' me-3'} size="lg" style={{ color: '#CFA3E1', minWidth: 32 }} />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
  
  return (
    
    <MDBContainer fluid className="loginsignup" style={{ padding: '2rem 1rem', background: 'linear-gradient(135deg, #1f0f2e 0%, #2e1c50 100%)', minHeight: '100vh' }}>
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
                  color: accent,
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
    
            {state === 'Sign Up' ? (
              <>
                <InputRow icon="user" label="Your Name">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Your Name"
                    id="signupForm1"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
                </InputRow>
    
                <InputRow icon="envelope" label="Your Email">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Your Email"
                    id="signupForm2"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
                </InputRow>
    
                {!showCodeInput ? (
                  <InputRow icon="phone" label="Phone">
                    <div className="d-flex" style={{ gap: '0.75rem', width: '100%' }}>
                      <MDBInput
                        labelClass="visually-hidden"
                        label="Code (+962)"
                        id="signupFormPhoneCode"
                        type="text"
                        className="country-code-input"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={changeHandler}
                        readOnly
                        style={{
                          background: inputBg,
                          borderRadius: '12px',
                          border: `1px solid ${purple2}`,
                          padding: '0.75rem 1rem',
                          flex: '0 0 120px',
                          color: '#fff',
                          fontWeight: 500,
                        }}
                        inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                      />
                      <MDBInput
                        labelClass="visually-hidden"
                        label="Phone Number"
                        id="signupFormPhoneNumber"
                        type="tel"
                        className="phone-number-input"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={changeHandler}
                        style={{
                          background: inputBg,
                          borderRadius: '12px',
                          border: `1px solid ${purple2}`,
                          padding: '0.75rem 1rem',
                          flex: 1,
                          color: '#fff',
                          fontWeight: 500,
                        }}
                        inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                      />
                    </div>
                  </InputRow>
                ) : (
                  <InputRow icon="mobile-alt" label="Verification Code">
                    <MDBInput
                      labelClass="visually-hidden"
                      label="Verification Code"
                      id="signupFormVerificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter SMS code"
                      style={{
                        background: inputBg,
                        borderRadius: '12px',
                        border: `1px solid ${purple2}`,
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        fontWeight: 500,
                      }}
                      inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                    />
                  </InputRow>
                )}
    
                <InputRow icon="lock" label="Password">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Password"
                    id="signupForm3"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
                </InputRow>
    
                <InputRow icon="key" label="Repeat Password">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Repeat your password"
                    id="signupForm4"
                    type="password"
                    name="repeatPassword"
                    value={formData.repeatPassword}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
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
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
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
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
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
                    labelClass="visually-hidden"
                    label="Street Name"
                    id="signupFormStreet"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
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
                      {isCodeSending ? 'Sending Code...' : 'Send Verification Code'}
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
                      {isSigningUp ? 'Signing Up...' : 'Verify Code and Register'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <InputRow icon="envelope" label="Email">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Your Email"
                    id="loginForm1"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
                </InputRow>
    
                <InputRow icon="lock" label="Password">
                  <MDBInput
                    labelClass="visually-hidden"
                    label="Password"
                    id="loginForm2"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    style={{
                      background: inputBg,
                      borderRadius: '12px',
                      border: `1px solid ${purple2}`,
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                    inputProps={{ style: { background: 'transparent', color: '#fff' } }}
                  />
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
                    <span onClick={() => setState('Login')} style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}>
                      Login here
                    </span>
                  </>
                ) : (
                  <>
                    Create an account?{' '}
                    <span onClick={() => setState('Sign Up')} style={{ cursor: 'pointer', color: accent, fontWeight: 600 }}>
                      Click here
                    </span>
                  </>
                )}
              </p>
            </div>
    
            <div id="recaptcha-container" style={{ marginTop: 8 }}></div>
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
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
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
