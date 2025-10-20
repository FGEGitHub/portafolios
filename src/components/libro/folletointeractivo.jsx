import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";




import Pagina1 from "../../assets/folio1.png";
import Pagina2 from "../../assets/folio2.png";
import Pagina3 from "../../assets/folio2.png";
import Pagina4 from "../../assets/folio2.png";
import Portada from "../../assets/portada2.jpeg";

import "./Folletointeractivo.css"; // 👈 Importamos el CSS

const paginas = [
  { id: "portada", img: Portada, texto: "Proyecto Urbano - Portada", portada: true },
  { id: 1, img: Pagina1, texto: "Desarrollo urbano sostenible — página 1" },
  { id: 2, img: Pagina2, texto: "Zonas residenciales y espacios verdes — página 2" },
  { id: 3, img: Pagina3, texto: "Infraestructura y movilidad urbana — página 3" },
  { id: 4, img: Pagina4, texto: "Áreas comunitarias y recreativas — página 4" },
];

const FolletoInteractivo = () => {
  const flipBookRef = useRef();

  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

  return (
    <div className="folleto-container">
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
              className={`page ${p.portada ? "portada" : ""}`}
            >
              <img src={p.img} alt={`Página ${p.id}`} className="page-img" />
              <p className="page-text">{p.texto}</p>
            </div>
          ))}
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

      <p className="hint-text">📘 Usá las flechas o arrastrá para pasar la página</p>
    </div>
  );
};

export default FolletoInteractivo;
