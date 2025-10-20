// Chat.jsx
import React, { useState } from "react";
import servicio1 from "../../services/servicio1"; // tu servicio real

const Chat = () => {
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [enviando, setEnviando] = useState(false); // 👈 evita dobles envíos

  const handleSend = async () => {
    const texto = input.trim();
    if (!texto || enviando) return; // 👈 bloquea si está vacío o en proceso

    setEnviando(true);

    const nuevoMensajes = [...mensajes, { de: "usuario", texto }];
    setMensajes(nuevoMensajes);

    try {
      // 👇 mandamos todo el historial
      const respuesta = await servicio1.preguntar(nuevoMensajes);
      setMensajes(prev => [...prev, { de: "bot", texto: respuesta.respuesta }]);
    } catch (err) {
      setMensajes(prev => [...prev, { de: "bot", texto: "Error al conectar con el servicio" }]);
    }

    setInput("");
    setEnviando(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 👈 evita envío doble por submit
      handleSend();
    }
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
                background: msg.de === "usuario" ? "#007bff" : "#e0e0e0",
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
        <button type="button" onClick={handleSend} disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
