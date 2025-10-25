import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="icon">{'</>'}</span> Developer Fullstack
      </div>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="/inicio">Inicio</a></li>
        <li><a href="/sobremi">Sobre mí</a></li>
        <li><a href="/proyectos">Proyectos</a></li>
        <li><a href="/tecnologias">Tecnologías</a></li>
        <li><a href="/contacto">Contacto</a></li>
      </ul>
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;