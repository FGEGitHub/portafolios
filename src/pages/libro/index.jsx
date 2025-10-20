import { useNavigate } from "react-router-dom";
import Formulario from "../../components/libro/folletointeractivo";
import React, { useEffect } from "react";
import { useTheme } from "@mui/material";

export default function Paginas() {
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    document.title = "Pipao";
    const updateMeta = (property, content) => {
      let element = document.querySelector(`meta[property='${property}']`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.getElementsByTagName("head")[0].appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMeta("og:title", "Pipao");
    updateMeta("og:description", "Folleto urbano Pipao");
    updateMeta("og:image", "../../Assets/portafolios.jpeg");
    updateMeta("og:url", window.location.href);
    updateMeta("og:type", "website");
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#0b4db1", // azul fuerte personalizado
    /*     minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", */
      }}
    >
      <Formulario />
    </div>
  );
}
