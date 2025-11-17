

import { useNavigate, useParams } from "react-router-dom";
import Formulario from '../../components/racs/componente.jsx'
//import Formulario from '../../components/componenteinscripcion/cerrado'
import Nav from "../../components/navbar.jsx"; // cambia esto a tu ruta real
import React, { useEffect, useState } from "react";
import {
    Button,
 
  } from "@mui/material";
  import {
    useMediaQuery,
    useTheme,
} from "@mui/material";

export default function Paginas() {
    const navigate = useNavigate();
const theme = useTheme();
useEffect(() => {
    document.title = "Pipao";
    const updateMeta = (property, content) => {
        let element = document.querySelector(`meta[property='${property}']`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.getElementsByTagName('head')[0].appendChild(element);
        }
        element.setAttribute('content', content);
      };
  
      // Actualiza las etiquetas meta de Open Graph para WhatsApp
      updateMeta('og:FGE', 'Pipao');
      updateMeta('og:FGE', 'Pipao');
      updateMeta('og:image', '../../Assets/portafolios.jpeg'); // Asegúrate de que la ruta sea correcta
  
      // Opcionalmente, puedes actualizar otras etiquetas
      updateMeta('og:url', window.location.href);
      updateMeta('og:type', 'website');
  }, []);


            
            return (
                <>
               
                   <Formulario/>
                </>
           
            );
        
        }