import React from "react";
import "./proyectos.css";

const proyectos = [
  {
    titulo: "Mapa Interactivo Don Eulogio",
    descripcion: "Mapa con zoom, chatbot y búsqueda de lotes con React y Leaflet.",
    tecnologias: ["React", "Leaflet", "Node", "MySQL"],
    imagen: "/images/proyecto1.jpg",
    enlace: "https://don-eulogio.vercel.app",
  },
  {
    titulo: "Sistema de Préstamos",
    descripcion: "Sistema de cobros y préstamos usado en la Caja Municipal.",
    tecnologias: ["React", "Node", "MariaDB"],
    imagen: "/images/proyecto2.jpg",
    enlace: "https://github.com/usuario/proyecto-prestamos",
  },
  {
    titulo: "Mapa Colectivos Corrientes",
    descripcion: "Ubicación de colectivos y paradas, recorrido, proximidad a escuelas.",
    tecnologias: ["React", "Leaflet", "Vite"],
    imagen: "/images/proyecto3.jpg",
    enlace: "https://github.com/usuario/colectivos-corrientes",
  },
];

const Proyectos = () => {
  return (
    <section className="proyectos" id="portfolio">
      <h2>Proyectos Destacados</h2>
      <div className="grid">
        {proyectos.map((p, i) => (
          <div className="card" key={i}>
            <img src={p.imagen} alt={p.titulo} />
            <h3>{p.titulo}</h3>
            <p>{p.descripcion}</p>
            <div className="tecnologias">
              {p.tecnologias.map((tec, i) => (
                <span key={i}>{tec}</span>
              ))}
            </div>
            <a href={p.enlace} className="btn" target="_blank" rel="noreferrer">
              Ver Proyecto →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Proyectos;
