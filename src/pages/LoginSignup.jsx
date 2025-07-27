import React, { useState } from 'react';
import './LoginSignup.css';
import googleLogo from '../components/assets/google-logo.png';

const LoginSignup = () => {

    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async () => {
        console.log("Login Function Executed", formData);
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace('/');
        } else {
            alert(responseData.errors);
        }

    };

    const signup = async () => {
        console.log("Signup Function Executed", formData);
        let responseData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace('/');
        } else {
            alert(responseData.errors);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Login with Google clicked");
        // Add your Google login logic here
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" /> : <></>}
                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
                    <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                </div>
                <button onClick={() => { state === "Login" ? login() : signup(); }}>Continue</button>
                <button className="loginsignup-google-btn" onClick={handleGoogleLogin}>
                    <img src={googleLogo} alt="Google logo" />
                    Login with Google
                </button>
                {state === "Sign Up"
                    ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login"); }}>Login here</span></p>
                    : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up"); }}>Click here</span></p>}
                <div className="loginsignup-agree">
                    <input type="checkbox" name="agreeTerms" id="agreeTerms" required />
                    <p htmlFor="agreeTerms">By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
