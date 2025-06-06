import React from "react";
import "./principal.css";
import profile from "../../assets/it.jpeg"; // cambia esto a tu ruta real

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>I’m John, a <span className="highlight">Web Developer</span></h1>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit leo quis ullamcorper.</p>
        <a href="#portfolio" className="btn">Browse Portfolio →</a>
      </div>
      <div className="hero-image">
        <img src={profile} alt="John - Web Developer" />
      </div>
    </section>
  );
};

export default HeroSection;
