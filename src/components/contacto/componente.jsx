import React from "react";
import "./contacto.css";
import { TextField, Button } from "@mui/material";

const Contacto = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Acá podés agregar lógica para enviar a backend o servicio externo
    alert("Mensaje enviado 🎉 (esto es de prueba)");
  };

  return (
    <section className="contacto">
      <div className="contacto-contenido">
        <h2 className="titulo">Contacto</h2>
        <p className="descripcion">
          ¿Tenés un proyecto en mente o simplemente querés saludar? ¡Completá el formulario!
        </p>
        <form className="formulario" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            variant="outlined"
            required
            InputProps={{ style: { backgroundColor: "#1e293b", color: "white" } }}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
          />
          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
            variant="outlined"
            required
            InputProps={{ style: { backgroundColor: "#1e293b", color: "white" } }}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
          />
          <TextField
            fullWidth
            label="Mensaje"
            name="mensaje"
            multiline
            rows={5}
            variant="outlined"
            required
            InputProps={{ style: { backgroundColor: "#1e293b", color: "white" } }}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
          />
          <Button type="submit" variant="contained" fullWidth className="boton-enviar">
            Enviar mensaje
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contacto;
