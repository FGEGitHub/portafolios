import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="icon">{'</>'}</span> Developer X
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#pages">Pages</a></li>
      </ul>
      <div className="menu-icon">☰</div>
    </nav>
  );
};

export default Navbar;

