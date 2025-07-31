import React, { useState } from "react";
import "./LoginSignup.css";
import googleLogo from "../components/assets/google-logo.png";

// All Jordan governorates with مناطق
const AREAS_BY_GOV = {
  "محافظة العاصمة": [
    "منطقة العبدلي", "رأس العين", "المدينة", "زهران", "اليرموك", "بدر",
    "ماركا", "النصر", "طارق", "بسمان",
    "القويسمة", "الجويدة", "أبو علندا", "الرجيب", "خريبة السوق", "جاوا",
    "اليادودة", "أم قصير", "المقابلين",
    "الجبيهة", "صويلح", "تلاع العلي", "خلدا", "أم السماق", "أبو نصير",
    "شفا بدران", "الكمالية",
    "وادي السير", "بدر الجديدة", "مرج الحمام", "البصة", "عراق الأمير", "أبو السوس",
    "سحاب", "الجيزة", "الموقر", "ناعور"
  ],
  "محافظة الزرقاء": [
    "الزرقاء", "الرصيفة", "الهاشمية", "السخنة", "بيرين", "الأزرق", "الضليل"
  ],
  "محافظة إربد": [
    "إربد", "الرمثا", "دير أبي سعيد", "الكورة", "الأغوار الشمالية", "بني عبيد",
    "الوسطية", "بني كنانة"
  ],
  "محافظة البلقاء": [
    "قصبة السلط", "ماحص", "الفحيص", "دير علا", "عين الباشا", "الشونة الجنوبية"
  ],
  "محافظة مأدبا": ["قصبة مادبا", "ذيبان"],
  "محافظة الكرك": [
    "قصبة الكرك", "المزار الجنوبي", "القصر", "غور الصافي", "عي", "فقوع", "القطرانة"
  ],
  "محافظة الطفيلة": ["قصبة الطفيلة", "بصيرا", "الحسا"],
  "محافظة معان": [
    "معان", "وادي موسى", "الشوبك", "الحسينية", "أيل", "الجفر", "المدورة"
  ],
  "محافظة العقبة": ["العقبة", "القويرة", "رم", "الدرة", "الحميمة"],
  "محافظة المفرق": [
    "المفرق", "بلعما", "الخالدية", "الصفاوي", "رحبة ركاد", "رويشد", "الأزرق الشمالي"
  ],
  "محافظة جرش": ["جرش", "ساكب", "كفر خل", "سوف"],
  "محافظة عجلون": ["عجلون", "عنجرة", "عين جنا", "الوهادنة", "كفرنجة"]
};

const LoginSignup = () => {
  const [mode, setMode] = useState("Login"); // "Login" or "Sign Up"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    subscribe: false,
    phone: "",
    province: "",
    area: "",
    street: ""
  });

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const login = async () => {
    if (!formData.email || !formData.password)
      return alert("Email and password required");
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch {
      alert("Login failed");
    }
  };

  const signup = async () => {
    const required = [
      "email",
      "password",
      "username",
      "phone",
      "province",
      "area",
      "street"
    ];
    for (const field of required) {
      if (!formData[field]) return alert(`Missing required: ${field}`);
    }
    if (formData.password !== formData.repeatPassword)
      return alert("Passwords don't match");

    const fullPhone = `+962${formData.phone.replace(/^0+/, "")}`;

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          subscribe: formData.subscribe,
          phone: fullPhone,
          address: {
            province: formData.province,
            area: formData.area,
            street: formData.street
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch {
      alert("Signup failed");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google clicked");
  };

  const submit = () => {
    mode === "Login" ? login() : signup();
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h2 className="title">{mode}</h2>

        <div className="loginsignup-fields">
          {mode === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              className="input"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            className="input"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            className="input"
          />
          {mode === "Sign Up" && (
            <>
              <input
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={changeHandler}
                type="password"
                placeholder="Repeat Password"
                className="input"
              />
              {/* Phone */}
              <div className="phone-wrapper">
                <div className="country-code">
                  <span className="country-label">Jordan</span>
                  <span className="code">+962</span>
                </div>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={changeHandler}
                  type="tel"
                  placeholder="7xxxxxxx"
                  className="input phone-input"
                  aria-label="Phone number without country code"
                />
              </div>
              {/* Address */}
              <select
                name="province"
                value={formData.province}
                onChange={changeHandler}
                className="input"
              >
                <option value="">اختر المحافظة</option>
                {Object.keys(AREAS_BY_GOV).map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              <select
                name="area"
                value={formData.area}
                onChange={changeHandler}
                className="input"
                disabled={!formData.province}
              >
                <option value="">اختر المنطقة</option>
                {(AREAS_BY_GOV[formData.province] || []).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <input
                name="street"
                value={formData.street}
                onChange={changeHandler}
                type="text"
                placeholder="Street Name"
                className="input"
              />
              <label className="newsletter">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={changeHandler}
                />
                Subscribe to our newsletter
              </label>
            </>
          )}
        </div>

        <button className="primary-btn" onClick={submit}>
          Continue
        </button>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src={googleLogo} alt="Google logo" />
          {mode === "Login" ? "Login with Google" : "Sign up with Google"}
        </button>

        <div className="switch-line">
          {mode === "Sign Up" ? (
            <span className="small-text">
              Already have an account?{" "}
              <button className="link-btn" onClick={() => setMode("Login")}>
                Login
              </button>
            </span>
          ) : (
            <span className="small-text">
              Don't have an account?{" "}
              <button className="link-btn" onClick={() => setMode("Sign Up")}>
                Sign up
              </button>
            </span>
          )}
        </div>

        <div className="agree-row">
          <input type="checkbox" name="agreeTerms" id="agreeTerms" required />
          <label htmlFor="agreeTerms" className="agree-text">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
