import React from "react";
import "./proyectos.css";
import Fotodone from "../../assets/done.png"
import Fotofe from "../../assets/cuotas.png"
import Fotorecc from "../../assets/recorrido.png"

const proyectos = [
  {
    titulo: "Mapa Interactivo Desarrollo urbano",
    descripcion: "Mapa con zoom, chatbot y búsqueda de lotes con React ",
    tecnologias: ["React", "Node", "MySQL"],
    imagen: Fotodone,
    //enlace: "",
    privado: true,
  },
  {
    titulo: "Sistema de Cobros",
    descripcion: "Sistema de cobros y préstamos usado en la Caja Municipal.",
    tecnologias: ["React", "Node", "MariaDB"],
    imagen: Fotofe,
    enlace: "",
    privado: true,
  },
  {
    titulo: "Mapa Colectivos Corrientes",
    descripcion: "Ubicación de colectivos y paradas, recorrido, proximidad a escuelas.",
    tecnologias: ["React", "Leaflet", "Vite"],
    imagen: Fotorecc,
    enlace: "https://portafolios-three-opal.vercel.app/mapas",
    privado: false,
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
      {p.privado ? (
  <button className="btn disabled" disabled>
    Proyecto Privado 🔒
  </button>
) : (
  <a href={p.enlace} className="btn" target="_blank" rel="noreferrer">
    Ver Proyecto →
  </a>
)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Proyectos;
