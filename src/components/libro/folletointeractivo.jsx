import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Pagina1 from "../../assets/folio1.png";
import Pagina2 from "../../assets/folio2.png";
import Pagina3 from "../../assets/folio3.png";
import Pagina4 from "../../assets/folio4.png";
import PaginaDoble from "../../assets/folio3_4.png"; // 🆕 imagen fusionada
import Portada from "../../assets/portada2.jpeg";

import "./Folletointeractivo.css";

const paginas = [
  { id: "portada", img: Portada, texto: "Proyecto Urbano - Portada", portada: true },
  { id: 1, img: Pagina1, texto: "Desarrollo urbano sostenible — página 1" },
  { id: 2, img: Pagina2, texto: "Zonas residenciales y espacios verdes — página 2" },
  { id: 3, img: Pagina3, texto: "Infraestructura y movilidad urbana — página 3" },
  { id: 4, img: Pagina4, texto: "Vista panorámica — páginas 3 y 4 unidas" },
];

const FolletoInteractivo = () => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

  const onPageChange = (e) => setCurrentPage(e.data);

  // Mostrar imagen panorámica cuando se abre la vista 3–4
  const mostrarDoble = currentPage === 2;

  return (
    <div className="folleto-container">
      <div className="folleto-book">
        <HTMLFlipBook
          width={window.innerWidth * 0.8}
          height={window.innerHeight * 0.85}
          size="stretch"
          drawShadow={true}
          flippingTime={900}
          usePortrait={false}
          showCover={true}
          startPage={0}
          className="book"
          ref={flipBookRef}
          onFlip={onPageChange}
        >
          {paginas.map((p) => (
            <div key={p.id} className={`page ${p.portada ? "portada" : ""}`}>
              <img src={p.img} alt={`Página ${p.id}`} className="page-img" />
              <p className="page-text">{p.texto}</p>
              <div className="click-zone left" onClick={prevPage}></div>
              <div className="click-zone right" onClick={nextPage}></div>
            </div>
          ))}
        </HTMLFlipBook>

        {/* 🔥 Superposición panorámica cuando se muestran páginas 3 y 4 */}
        {mostrarDoble && (
          <div className="doble-overlay">
            <img src={PaginaDoble} alt="Vista panorámica páginas 3 y 4" className="doble-img" />
          </div>
        )}
      </div>

      <div className="buttons">
        <button className="nav-button" onClick={prevPage}>
          <ChevronLeft size={28} />
        </button>
        <button className="nav-button" onClick={nextPage}>
          <ChevronRight size={28} />
        </button>
      </div>

      <p className="hint-text">📘 Usa las flechas o haz clic a los lados para pasar la página</p>
    </div>
  );
};

export default FolletoInteractivo;
