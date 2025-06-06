import React, { useState } from "react";
import "./sobremi.css";
import fotoPerfil from "../../assets/perfil.jpg";

// Íconos (miniaturas en la lista)
import jsIcon from "../../assets/javascript.png";
import nodeIcon from "../../assets/nodejs.jpg";
import reactIcon from "../../assets/react.png";
import viteIcon from "../../assets/vite.jpg";
import mysqlIcon from "../../assets/mysql.png";
import apiIcon from "../../assets/mantenimiento.jpeg";
import mapIcon from "../../assets/mantenimiento.jpeg";
import chatbotIcon from "../../assets/mantenimiento.jpeg";
import deepIcon from "../../assets/mantenimiento.jpeg";

// Imágenes grandes que se muestran al seleccionar
import jsCode from "../../assets/mantenimiento.jpeg";
import nodeCode from "../../assets/mantenimiento.jpeg";
import reactCode from "../../assets/mantenimiento.jpeg";
import viteCode from "../../assets/mantenimiento.jpeg";
import mysqlCode from "../../assets/mantenimiento.jpeg";
import apiCode from "../../assets/mantenimiento.jpeg";
import mapCode from "../../assets/mantenimiento.jpeg";
import chatbotCode from "../../assets/mantenimiento.jpeg";
import deepCode from "../../assets/mantenimiento.jpeg";

// Relación entre tecnología y sus imágenes
const techData = {
  "JavaScript": { icon: jsIcon, code: jsCode },
  "Node.js": { icon: nodeIcon, code: nodeCode },
  "React": { icon: reactIcon, code: reactCode },
  "Vite": { icon: viteIcon, code: viteCode },
  "MySQL / MariaDB": { icon: mysqlIcon, code: mysqlCode },
  "APIs": { icon: apiIcon, code: apiCode },
  "Leaflet / Mapas": { icon: mapIcon, code: mapCode },
  "Chatbots": { icon: chatbotIcon, code: chatbotCode },
  "DeepSel Chain": { icon: deepIcon, code: deepCode },
};

const SobreMi = () => {
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);

  const handleClick = (nombre) => {
    setTecnologiaSeleccionada((prev) => (prev === nombre ? null : nombre));
  };

  return (
    <section className="about" id="sobremi">
      <h2>Sobre mí</h2>
      <div className="about-content">
        <img src={fotoPerfil} alt="Foto de perfil" className="about-photo" />
        <p>
          Soy desarrollador fullstack con experiencia en proyectos públicos y privados.
          He trabajado en sistemas de cobro para la Caja Municipal de Préstamos, plataformas de inscripción y asistencia para aulas virtuales, y páginas interactivas de venta de lotes con mapas y chatbots.
          <br /><br />
          En el ámbito personal, desarrollé mapas con recorridos de colectivos, zonas escolares y barrios de Corrientes, además de una app para fútbol 5 orientada a dispositivos móviles.
        </p>
      </div>

      <div className="tech-list">
        {Object.entries(techData).map(([nombre, { icon }]) => (
          <div
            key={nombre}
            className={`tech-item ${tecnologiaSeleccionada === nombre ? 'active' : ''}`}
            onClick={() => handleClick(nombre)}
          >
            <img src={icon} alt={nombre} className="tech-icon" />
            {nombre}
          </div>
        ))}
      </div>

      <div className={`code-preview ${tecnologiaSeleccionada ? 'show' : 'hide'}`}>
        {tecnologiaSeleccionada && (
          <>
            <h4>{tecnologiaSeleccionada}</h4>
            <img
              src={techData[tecnologiaSeleccionada].code}
              alt={`Código de ${tecnologiaSeleccionada}`}
              className="preview-img"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default SobreMi;
