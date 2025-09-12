import React, { useState, useEffect, useRef } from 'react';
import firebase, { auth, db } from '../firebase';
import googleLogo from '../components/assets/google-logo.png';
import JOR_flag from '../components/assets/JOR_flag.png';
import './LoginSignup.css';
import { FaUser, FaEnvelope, FaPhone, FaMobileAlt, FaLock, FaKey, FaGlobe, FaCity, FaRoad } from "react-icons/fa";
import Image from "../components/assets/Front.png";

const AREAS_BY_GOV = {
  "العاصمة (Amman)": ["العبدلي", "ماركا", "الدوار الرابع", "المهاجرين", "المدينة الرياضية", "خالد بن الوليد", "صويلح", "نقابة المهندسين", "عبدون", "الدوار الخامس", "الدوار السادس", "الشميساني", "جبل اللويبدة", "وادي صقرة", "جبل النزهة", "وسط البلد", "الجبيهة", "رأس العين", "الصويفية", "المدينة الصناعية", "الجامعة الأردنية", "حي نزال", "الشميساني الجديدة", "الرابية"],
  "الزرقاء (Zarqa)": ["الزرقاء البلد", "الزرقاء الجديدة", "الرصيفة", "الجبل الأزرق", "الوسطية", "الحمة الشرقية", "الحمة الغربية"],
  "إربد (Irbid)": ["إربد", "لواء بني كنانة", "لواء الرمثا", "لواء الطيبة", "لواء الكورة", "لواء المزار الشمالي"],
  "الكرك (Karak)": ["الكرك", "لواء القصر", "لواء المزار", "لواء عي", "لواء الأغوار الجنوبية"],
  "المفرق (Mafraq)": ["المفرق", "لواء البادية الشمالية الشرقية", "لواء البادية الشمالية الغربية", "لواء الحمرة"],
  "البلقاء (Balqa)": ["السلط", "الفحيص", "عين الباشا", "دير علا", "الأشرفية"],
  "معان (Ma'an)": ["معان", "لواء الشوبك", "لواء المريغة", "لواء القطرانة", "لواء الجفر"],
  "الطفيلة (Tafileh)": ["الطفيلة", "لواء القادسية", "لواء الحسا"],
  "العقبة (Aqaba)": ["العقبة"],
  "جرش (Jerash)": ["جرش", "برما", "ساكب"],
  "عجلون (Ajloun)": ["عجلون", "لواء كفرنجة", "عنجرة"],
  "مادبا (Madaba)": ["مادبا", "ذيبان"],
};

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', repeatPassword: '',
    countryCode: '+962', phoneNumber: '', province: '', area: '',
    street: '', agreeTerms: false,
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
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  useEffect(() => {
    if (state !== 'Sign Up' || !recaptchaContainerRef.current || recaptchaVerifier) return;

    const verifier = new firebase.auth.RecaptchaVerifier(recaptchaContainerRef.current, {
      size: 'invisible',
      callback: () => console.log('reCAPTCHA solved'),
      'expired-callback': () => setErrorMessage('reCAPTCHA expired. Please try again.'),
    });

    verifier.render().then(() => setRecaptchaVerifier(verifier));
  }, [state, recaptchaVerifier]);

  const validateForm = (isLogin) => {
    const requiredFields = isLogin 
      ? ['email', 'password'] 
      : ['username', 'email', 'password', 'repeatPassword', 'phoneNumber', 'province', 'area', 'street'];
      
    if (requiredFields.some(field => !formData[field])) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!isLogin) {
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
    }
    return true;
  };

  const saveUserData = (user) => {
    return db.collection("users").doc(user.uid).set({
      name: formData.username,
      email: user.email,
      phone: fullPhoneNumber,
      province: formData.province,
      area: formData.area,
      street: formData.street,
      createdAt: new Date()
    }, { merge: true });
  };
  
  const sendVerificationCode = async () => {
    setErrorMessage('');
    if (!validateForm(false)) return;
    if (!recaptchaVerifier) {
      setErrorMessage('reCAPTCHA not ready. Please wait or refresh.');
      return;
    }

    setIsCodeSending(true);
    try {
      const methods = await auth.fetchSignInMethodsForEmail(formData.email);
      if (methods.length > 0) {
        setErrorMessage("This email is already in use. Please log in or use a different email.");
        setIsCodeSending(false);
        return;
      }
      const confirmation = await auth.signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
      setErrorMessage('Verification code sent to your phone.');
    } catch (err) {
      console.error('sendVerificationCode error', err);
      setErrorMessage('Failed to send code. Check number and try again.');
    } finally {
      setIsCodeSending(false);
    }
  };

  const verifyCodeAndSignup = async () => {
    setErrorMessage('');
    if (!verificationCode) return setErrorMessage('Enter the verification code.');
    if (!confirmationResult) return setErrorMessage('Send code first.');

    setIsSigningUp(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verification, verificationCode);
      const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
      await user.linkWithCredential(credential);
      await saveUserData(user);
      window.location.replace("/profile");
    } catch (err) {
      console.error('verifyCodeAndSignup error', err);
      setErrorMessage(err.message || 'Code verification failed. Try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async () => {
    setErrorMessage('');
    if (!validateForm(true)) return;
    try {
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      window.location.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                createdAt: new Date(),
            });
        }
        window.location.replace('/');
    } catch (error) {
        console.error('Google login error:', error);
        if (error.code === 'auth/account-exists-with-different-credential') {
            setErrorMessage('An account already exists with this email. Please sign in with your original method to link your Google account.');
        } else {
            setErrorMessage('Google login failed: ' + error.message);
        }
    }
  };
  
  const iconMap = {
    user: <FaUser />, envelope: <FaEnvelope />, phone: <FaPhone />, "mobile-alt": <FaMobileAlt />,
    lock: <FaLock />, key: <FaKey />, globe: <FaGlobe />, city: <FaCity />, road: <FaRoad />
  };

  const InputRow = ({ icon, label, children }) => (
    <div className="form__input-group">
      <div className="form__input-icon">{iconMap[icon]}</div>
      <div className="form__input-content">
        <label className="form__input-label">{label}</label>
        {children}
      </div>
    </div>
  );

  return (
    <div className="loginsignup">
      <div className="loginsignup__container">
        <div className="loginsignup__content-wrapper">
          <div className="loginsignup__form-section">
            <div className="form__title">
              <h1>{state}</h1>
              <div className="form__title-underline" />
            </div>

            {errorMessage && <div className="form__error-message">{errorMessage}</div>}

            {state === 'Sign Up' ? (
              <>
                <InputRow icon="user" label="Your Name">
                  <input type="text" name="username" value={formData.username} onChange={changeHandler} placeholder="Enter your full name" className="form__input" />
                </InputRow>

                <InputRow icon="envelope" label="Your Email">
                  <input type="email" name="email" value={formData.email} onChange={changeHandler} placeholder="e.g., example@domain.com" className="form__input" />
                </InputRow>

                {!showCodeInput ? (
                  <InputRow icon="phone" label="Phone Number">
                    <div className="form__phone-input-container">
                      <div className="form__country-code">
                        <img src={JOR_flag} alt="Jordanian flag" />
                        <span>{formData.countryCode}</span>
                      </div>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={changeHandler} placeholder="e.g., 7xxxxxxx" className="form__input" />
                    </div>
                  </InputRow>
                ) : (
                  <InputRow icon="mobile-alt" label="Verification Code">
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Enter SMS code" className="form__input" />
                  </InputRow>
                )}

                <InputRow icon="lock" label="Password">
                  <div className="form__password-wrapper">
                    <input type={passwordVisible ? 'text' : 'password'} name="password" value={formData.password} onChange={changeHandler} placeholder="Enter your password" className="form__input" />
                    <span className="form__password-toggle" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? '🙈' : '👁️'}</span>
                  </div>
                </InputRow>

                <InputRow icon="key" label="Repeat Password">
                   <div className="form__password-wrapper">
                    <input type={repeatPasswordVisible ? 'text' : 'password'} name="repeatPassword" value={formData.repeatPassword} onChange={changeHandler} placeholder="Repeat your password" className="form__input" />
                    <span className="form__password-toggle" onClick={() => setRepeatPasswordVisible(!repeatPasswordVisible)}>{repeatPasswordVisible ? '🙈' : '👁️'}</span>
                  </div>
                </InputRow>

                <InputRow icon="globe" label="Province">
                  <select name="province" value={formData.province} onChange={changeHandler} className="form__input form__select">
                    <option value="">Select Province</option>
                    {Object.keys(AREAS_BY_GOV).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </InputRow>

                <InputRow icon="city" label="Area">
                  <select name="area" value={formData.area} onChange={changeHandler} disabled={!formData.province} className="form__input form__select">
                    <option value="">Select Area</option>
                    {(AREAS_BY_GOV[formData.province] || []).map((area) => <option key={area} value={area}>{area}</option>)}
                  </select>
                </InputRow>
                
                <InputRow icon="road" label="Street Name">
                  <input type="text" name="street" value={formData.street} onChange={changeHandler} placeholder="e.g., Main Street" className="form__input" />
                </InputRow>

                <div className="form__terms">
                  <input type="checkbox" name="agreeTerms" id="signupFlexCheckDefault" checked={formData.agreeTerms} onChange={changeHandler} />
                  <label htmlFor="signupFlexCheckDefault">
                    By continuing, I agree to the <span className="form__link">terms of use</span> & <span className="form__link">privacy policy</span>.
                  </label>
                </div>

                <div className="form__action-buttons">
                  {!showCodeInput ? (
                    <button onClick={sendVerificationCode} disabled={isCodeSending} className="btn btn--primary">
                      {isCodeSending ? "Sending Code..." : "Send Verification Code"}
                    </button>
                  ) : (
                    <button onClick={verifyCodeAndSignup} disabled={isSigningUp} className="btn btn--accent">
                      {isSigningUp ? "Signing Up..." : "Verify Code and Register"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <InputRow icon="envelope" label="Email">
                  <input type="email" name="email" value={formData.email} onChange={changeHandler} placeholder="e.g., example@domain.com" className="form__input" />
                </InputRow>
                <InputRow icon="lock" label="Password">
                   <div className="form__password-wrapper">
                    <input type={passwordVisible ? 'text' : 'password'} name="password" value={formData.password} onChange={changeHandler} placeholder="Enter your password" className="form__input" />
                    <span className="form__password-toggle" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? '🙈' : '👁️'}</span>
                  </div>
                </InputRow>
                <button onClick={login} className="btn btn--primary">Login</button>
              </>
            )}

            <div className="form__social-logins">
              <button onClick={handleGoogleLogin} type="button" className="btn btn--google">
                <img src={googleLogo} alt="Google logo" />
                Continue with Google
              </button>
            </div>

            <p className="form__switch-state">
              {state === 'Sign Up' ? "Already have an account? " : "Create an account? "}
              <span onClick={() => { setState(state === 'Login' ? 'Sign Up' : 'Login'); setErrorMessage(''); setShowCodeInput(false); }} className="form__link">
                {state === 'Sign Up' ? "Login here" : "Click here"}
              </span>
            </p>
            <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
          </div>

          <div className="loginsignup__image-section">
            <img src={Image} alt="Illustration" className="loginsignup__image" />
            <div className="loginsignup__image-overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
