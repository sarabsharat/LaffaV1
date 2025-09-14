import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-section">
      <div className="content">
        <div className="panel">
          <h2>What is Laffa?</h2>
          <div className="separator"></div>
          <p>
            Laffa is the embodiment of <span className="highlight">elegance</span>, <span className="highlight">timelessness</span>, and <span className="highlight">modesty</span>.
          </p>
        </div>
        <div className="panel solid light">
          <h2>Three Words.</h2>
          <p>
          Elegant. Timeless. Modest.
          </p>
        </div>
        <div className="panel solid purple">
          <h2>About Laffa.</h2>
          <p>
            Laffa offers <span className="highlight">elegant</span> abayas designed with{" "}
            <span className="highlight">modesty</span> and <span className="highlight">timeless</span> style in mind. Inspired
            by <span className="highlight">Arabic heritage</span>, each piece blends classic details
            with modern comfort. Crafted carefully with quality fabrics and
            thoughtful design,{" "}
            <span className="highlight">Laffa lets you feel confident and graceful</span> every day—
            whether you're attending a special occasion or going about your
            routine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
