import React from "react";
import "./principal.css";
import profile from "../../assets/it.jpeg"; // Asegurate que el archivo exista

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Soy Pipo <span className="highlight">Web Developer</span></h1>
        <p>Especializado en soluciones web modernas, interactivas y escalables.</p>
        <a href="#portfolio" className="btn">Ver portafolio →</a>
      </div>
      <div className="hero-image">
        <img src={profile} alt="Pipo - Web Developer" />
      </div>
    </section>
  );
};

export default HeroSection;
