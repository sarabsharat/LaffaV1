import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-section">
      <section className="panel plain">
        <div className="content">
          <h2>What is Laffa?</h2>
        </div>
      </section>
      <section className="panel solid light">
        <div className="content">
          <h2>Three Words.</h2>
        </div>
      </section>
      <section className="panel solid purple">
        <div className="content">
          <h2>Elegant. Timeless. Modest.</h2>
        </div>
      </section>
      <section className="panel plain vh-60">
        <div className="content">
          <h2>About Laffa.</h2>
          <p>
            Laffa offers <span>elegant</span> abayas designed with{" "}
            <span>modesty</span> and <span>timeless</span> style in mind. Inspired
            by <span>Arabic heritage</span>, each piece blends classic details
            with modern comfort. Crafted carefully with quality fabrics and
            thoughtful design,{" "}
            <span>Laffa lets you feel confident and graceful</span> every day—
            whether you're attending a special occasion or going about your
            routine.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;