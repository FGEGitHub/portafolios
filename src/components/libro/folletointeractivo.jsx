import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Pagina1 from "../../assets/folio1.png";
import Pagina2 from "../../assets/folio2.png";
import PaginaExtendida from "../../assets/folio3.png"; // Esta imagen ocupará ambas caras
import Portada from "../../assets/portada2.jpeg";

import "./Folletointeractivo.css";

const paginas = [
  { id: "portada", img: Portada, texto: "Proyecto Urbano - Portada", portada: true },
  { id: 1, img: Pagina1, texto: "Desarrollo urbano sostenible — página 1" },
  { id: 2, img: Pagina2, texto: "Zonas residenciales y espacios verdes — página 2" },
  { id: 3, img: PaginaExtendida, texto: "Imagen extendida que ocupa páginas 3 y 4", doble: true },
];

const FolletoInteractivo = () => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

  const onPageChange = (e) => setCurrentPage(e.data);

  return (
    <div className="folleto-container">
      <div className="folleto-book">
        <HTMLFlipBook
          width={window.innerWidth * 0.4} // ancho de una página
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
          {paginas.map((p) =>
            p.doble ? (
              <div key={p.id} className="page doble">
                <img src={p.img} alt="Imagen doble" className="page-img-extendida" />
              </div>
            ) : (
              <div key={p.id} className={`page ${p.portada ? "portada" : ""}`}>
                <img src={p.img} alt={`Página ${p.id}`} className="page-img" />
                <p className="page-text">{p.texto}</p>
                <div className="click-zone left" onClick={prevPage}></div>
                <div className="click-zone right" onClick={nextPage}></div>
              </div>
            )
          )}
        </HTMLFlipBook>
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
