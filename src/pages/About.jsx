import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const panels = gsap.utils.toArray(".panel", container);

    // initial state: move all after first off to the right
    gsap.set(panels.slice(1), { xPercent: 100 });

    // timeline to move panels in sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => {
          // pin duration: enough to show the horizontal swipe + allow the last tall panel to scroll vertically
          const last = panels[panels.length - 1];
          return `+=${window.innerHeight + last.offsetHeight}`;
        },
        scrub: 0.5,
        pin: true,
        onUpdate(self) {
          // nothing special here; timeline handles the horizontal transitions
        },
        onLeave: () => {
          // when leaving the pinned section (past last panel), nothing extra needed
        },
      },
    });

    // create panel transitions: each panel slides in, pushing previous out
    panels.forEach((panel, i) => {
      if (i === 0) return; // first is already visible
      tl.to(
        panel,
        {
          xPercent: 0,
          duration: 1,
          ease: "power2.out",
        },
        // stagger so each takes roughly equal portion of the first part
        (i - 1) * 1
      );
    });

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
    };
  }, []);

  return (
    <>
      <div className="about-section" ref={containerRef}>
        <section className="panel plain">
          <div className="content">
            <h2>What is Laffa?</h2>
          </div>
        </section>
        <section className="panel solid light x-100">
          <div className="content">
            <h2>Three Words.</h2>
          </div>
        </section>
        <section className="panel solid purple x-100">
          <div className="content">
            <h2>Elegant.  Timeless. Modest.</h2>
          </div>
        </section>
        <section className="panel plain x-100 vh-60">
          <div className="content">
            <h2>About Laffa.</h2>
            <p> Laffa offers <span>elegant</span> abayas designed with <span>modesty</span> and <span>timeless</span> style in mind. Inspired by <span>Arabic heritage</span>, each piece blends classic details with modern comfort.
Crafted carefully with quality fabrics and thoughtful design, <span>Laffa lets you feel confident and graceful</span> every day—whether you’re attending a special occasion or going about your routine.</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
