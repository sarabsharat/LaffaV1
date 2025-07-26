import React from 'react'
import './Hero.css'
import heroImage from '../assets/Front.png'

export const Hero = () => {
  return (
    <div lang='ar' class Name="hero">
      <section className="hero-section">
      <div className="hero-content">
        <h1>بأناقتك ....و بأسلوبك</h1>
        <p>تعرفي على تشكيلة من العبايات الأنيقة</p>
        <button lang="en" className="shop-btn">Shop Now</button>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Stylish Abaya" />
      </div>
    </section>
    </div>
  )
}
export default Hero