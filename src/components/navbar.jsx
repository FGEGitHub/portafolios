// Chat.jsx
import React, { useState } from "react";

// Simulación del servicio
const servicio1 = {
  preguntas: async (texto) => {
    // acá podrías hacer un fetch/axios al backend
    return { respuesta: `Recibido: ${texto}` };
  },
};

const Chat = () => {
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // agregamos el mensaje del usuario
    const nuevoMensaje = { de: "usuario", texto: input };
    setMensajes((prev) => [...prev, nuevoMensaje]);

    // enviamos al servicio
    const respuesta = await servicio1.preguntas(input);

    // agregamos la respuesta
    setMensajes((prev) => [
      ...prev,
      { de: "bot", texto: respuesta.respuesta },
    ]);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {mensajes.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.de === "usuario" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "12px",
                background:
                  msg.de === "usuario" ? "#007bff" : "#e0e0e0",
                color: msg.de === "usuario" ? "#fff" : "#000",
              }}
            >
              {msg.texto}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
