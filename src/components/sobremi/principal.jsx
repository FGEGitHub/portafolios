import React from "react";
import "./sobremi.css";

const SobreMi = () => {
  return (
    <section className="about" id="sobremi">
      <h2>Sobre mí</h2>
      <p>
        Soy desarrollador fullstack con experiencia en proyectos públicos y privados.
        He trabajado en sistemas de cobro para la Caja Municipal de Préstamos, plataformas de inscripción y asistencia para aulas virtuales, y páginas interactivas de venta de lotes con mapas y chatbots. <br /><br />
        En el ámbito personal, desarrollé mapas con recorridos de colectivos, zonas escolares y barrios de Corrientes, además de una app para fútbol 5 orientada a dispositivos móviles.
      </p>

      <div className="tech-list">
        <div className="tech-item">JavaScript</div>
        <div className="tech-item">Node.js</div>
        <div className="tech-item">React</div>
        <div className="tech-item">Vite</div>
        <div className="tech-item">MySQL / MariaDB</div>
        <div className="tech-item">APIs</div>
        <div className="tech-item">Leaflet / Mapas</div>
        <div className="tech-item">Chatbots</div>
        <div className="tech-item">DeepSel Chain</div>
      </div>
    </section>
  );
};

export default SobreMi;
