import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Pagina1 from "../../assets/folio1.png";
import Pagina2 from "../../assets/folio2.png";
import Pagina3 from "../../assets/folio3.png";
import Pagina4 from "../../assets/folio4.png";
import Portada from "../../assets/portada2.jpeg";

import "./Folletointeractivo.css";

const paginas = [
  { id: "portada", img: Portada, texto: "Proyecto Urbano - Portada", portada: true },
  { id: 1, img: Pagina1, texto: "Desarrollo urbano sostenible — página 1" },
  { id: 2, img: Pagina2, texto: "Zonas residenciales y espacios verdes — página 2" },
  { id: 3, img: Pagina3, texto: "Infraestructura y movilidad urbana — página 3" },
  { id: 4, img: Pagina4, texto: "Áreas comunitarias y recreativas — página 4" },
];

const FolletoInteractivo = () => {
  const flipBookRef = useRef();
  const [zoomedPage, setZoomedPage] = useState(null);

  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

  const toggleZoom = (id) => {
    setZoomedPage((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`folleto-container ${zoomedPage ? "zoom-active" : ""}`}>
      <div className="folleto-book">
        <HTMLFlipBook
          width={window.innerWidth * 0.6}
          height={window.innerHeight * 0.75}
          size="stretch"
          drawShadow={true}
          flippingTime={900}
          usePortrait={false}
          startPage={0}
          showCover={true}
          className="book"
          ref={flipBookRef}
        >
          {paginas.map((p) => (
            <div
              key={p.id}
              className={`page ${p.portada ? "portada" : ""} ${zoomedPage === p.id ? "zoomed" : ""}`}
            >
              <img
                src={p.img}
                alt={`Página ${p.id}`}
                className="page-img"
              />
              <p className="page-text">{p.texto}</p>

              {/* Zonas clicables invisibles */}
              {!zoomedPage && (
                <>
                  <div className="click-zone left" onClick={prevPage}></div>
                  <div className="click-zone right" onClick={nextPage}></div>
                  <div className="zoom-zone" onClick={() => toggleZoom(p.id)}></div>
                </>
              )}

              {/* Si está en zoom, clic en cualquier parte sale del zoom */}
              {zoomedPage === p.id && (
                <div className="zoom-exit-zone" onClick={() => toggleZoom(p.id)}></div>
              )}
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {!zoomedPage && (
        <div className="buttons">
          <button className="nav-button" onClick={prevPage}>
            <ChevronLeft size={28} />
          </button>
          <button className="nav-button" onClick={nextPage}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <p className="hint-text">
        {zoomedPage ? "Haz clic nuevamente para salir del zoom 🔍" : "📘 Usa las flechas o haz clic a los lados para pasar la página"}
      </p>
    </div>
  );
};

export default FolletoInteractivo;
