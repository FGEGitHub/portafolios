import React from "react";
import "./principal.css";
import profile from "../../assets/it.jpeg"; // Asegurate que el archivo exista
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Soy Pipo <span className="highlight">Web Developer</span></h1>
        <p>Especializado en soluciones web modernas, interactivas y escalables.</p>
        <Button variant="contained" onClick={() => navigate('/sobremi/')} className="btn">Ver portafolio →</Button>
      </div>
      <div className="hero-image">
        <img src={profile} alt="Pipo - Web Developer" />
      </div>
    </section>
  );
};

export default HeroSection;
