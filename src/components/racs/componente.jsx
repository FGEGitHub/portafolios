import React from "react";
import data from "./datos.json";
import "./diagram.css";

export default function RackDiagram() {
  const { racks, routers, fortinet, mikrotik, ups, servidores, qnap, cables } =
    data;

  // ---------------------------
  // POSICIÓN UPS SIEMPRE ABAJO
  // ---------------------------
  function getUpsCoords(upsItem, index, rack) {
    const rackHeight = 600; // altura real del rack
    const bottomPadding = 20;

    const columna = index % 2;
    const fila = Math.floor(index / 2);

    const upsHeight = 60;
    const separacionVertical = 10;

    const yBase =
      rack.posY +
      rackHeight -
      bottomPadding -
      upsHeight -
      fila * (upsHeight + separacionVertical);
console.log('calculando UPS:',  rack.posX, yBase);
    return {
      x: rack.posX + 20 + columna * 130,
      y: yBase,
    };
  }

  // ---------------------------
  // Equipos ordenados por slot
  // ---------------------------
  const equipos = [
    ...routers,
    ...fortinet,
    ...mikrotik,
    ...ups,
    ...servidores,
    ...qnap,
  ]
    .filter((e) => e.rack_id !== null)
    .map((e) => ({ ...e }));

  const equiposConSlot = racks.flatMap((rack) => {
    const eqRack = equipos
      .filter((e) => e.rack_id === rack.id)
      .sort((a, b) => (a.prioridad ?? 100) - (b.prioridad ?? 100));

    return eqRack.map((e, index) => ({
      ...e,
      slot: index + 1,
    }));
  });

  // ---------------------------
  // Rack positions
  // ---------------------------
  const rackPositions = racks.map((rack, index) => ({
    ...rack,
    posX: 80 + index * 350,
    posY: 40,
  }));

  // ---------------------------
  // Equipos comunes (no UPS)
  // ---------------------------
  const getCoords = (equipo) => {
    const rack = rackPositions.find((r) => r.id === equipo.rack_id);
    return {
      x: rack.posX + 20,
      y: rack.posY + 40 + (equipo.slot - 1) * 32,
    };
  };

  // ---------------------------
  // Lista UPS con posiciones reales
  // ---------------------------
  const upsPositions = rackPositions.flatMap((rack) => {
  const upsDeRack = equiposConSlot.filter(
    (e) => e.tipo === "ups" && e.rack_id === rack.id
  );

  return upsDeRack.map((upsItem, index) => {
    const { x, y } = getUpsCoords(upsItem, index, rack);
    console.log('guardando las coorfenadas:', x, y );
    return {
      ...upsItem,
      tipo: "ups",    // ← FIX CLAVE
      x,
      y,
      isUPS: true,
    };
  });
});


  // ---------------------------
  // LISTA GLOBAL DE EQUIPOS
  // SIN DUPLICAR UPS  ← FIX
  // ---------------------------
const equiposGlobal = [
  ...equiposConSlot
    .filter((e) => e.tipo !== "ups")
    .map((e) => ({
      ...e,
      ...getCoords(e),
      isUPS: false,
    })),
  ...upsPositions, // ya tienen x, y y isUPS: true
];

  return (
    <svg width="1800" height="1200" className="diagram-svg">

      {/* RACKS */}
      {rackPositions.map((rack) => (
        <g key={rack.id} className="rack">
          <rect
            className="rack-rect"
            x={rack.posX}
            y={rack.posY}
            width="260"
            height="600"
            rx="14"
          />
          <text className="rack-title" x={rack.posX + 130} y={rack.posY + 25}>
            {rack.nombre}
          </text>
        </g>
      ))}

      {/* EQUIPOS */}
      {equiposGlobal.map((eq) => {
        const rack = rackPositions.find((r) => r.id === eq.rack_id);
        let pos;
console.log('EQUIPO A POSICIONAR:', eq);
        if (eq.tipo === "ups") {
          const upsLista = equiposConSlot.filter(
            (e) => e.tipo === "ups" && e.rack_id === eq.rack_id
          );
          const idx = upsLista.findIndex((u) => u.id === eq.id);
          pos = getUpsCoords(eq, idx, rack);
        } else {
          pos = getCoords(eq);
        }

        const width = eq.tipo === "ups" ? 80 : 240;
        const height = eq.tipo === "ups" ? 60 : 28;
console.log('EQUIPO:', eq.tipo, 'POS:', pos);
        return (
          <g key={eq.id} className={`equipo equipo-${eq.tipo}`}>
            <rect
              className="equipo-rect"
              x={pos.x}
              y={pos.y}
              width={width}
              height={height}
              rx={eq.tipo === "ups" ? 10 : 4}
            />

            {/* Rejillas */}
            {["mikrotik", "router", "qnap"].includes(eq.tipo) && (
              <>
                {[...Array(4)].map((_, i) => (
                  <rect
                    key={`left-${i}`}
                    x={pos.x - 6}
                    y={pos.y + 4 + i * (height / 4)}
                    width="4"
                    height={height / 6}
                    fill="#666"
                    rx="1"
                  />
                ))}

                {[...Array(4)].map((_, i) => (
                  <rect
                    key={`right-${i}`}
                    x={pos.x + width + 2}
                    y={pos.y + 4 + i * (height / 4)}
                    width="4"
                    height={height / 6}
                    fill="#666"
                    rx="1"
                  />
                ))}
              </>
            )}

            <text
              className="equipo-label"
              x={pos.x + width / 2}
              y={pos.y + height / 2 + 4}
            >
              {eq.nombre}
            </text>
          </g>
        );
      })}

      {/* CABLES */}
     {cables.map((cable) => {
  // Normalizo por si viene en mayúsculas
  console.log(equiposGlobal)
  const origenTipo = cable.origen_tipo?.toLowerCase();
  const destinoTipo = cable.destino_tipo?.toLowerCase();
console.log('previo a')
  const origen = equiposGlobal.find(
    (e) => e.tipo === origenTipo && e.id === cable.origen_id
  );
console.log('despues de')
  const destino = equiposGlobal.find(
    (e) => e.tipo === destinoTipo && e.id === cable.destino_id
  );
console.log('despues ded')
  // DEBUG MUY DETALLADO
  console.log("====== CABLE DEBUG ======");
  console.log(`Cable ID: ${cable.id} - "${cable.label}"`);
  console.log("Origen declarado:", cable.origen_tipo, "ID:", cable.origen_id);
  console.log("Destino declarado:", cable.destino_tipo, "ID:", cable.destino_id);

  console.log("Origen encontrado:", origen ? origen : "❌ NO ENCONTRADO");
  console.log("Destino encontrado:", destino ? destino : "❌ NO ENCONTRADO");

  if (origen?.tipo === "ups" || destino?.tipo === "ups") {
    console.log("⚡ Este cable involucra una UPS");
  }

  if (origen && destino) {
    console.log(
      `✔ Conexión encontrada: ${origen.nombre} (${origen.tipo}) → ${destino.nombre} (${destino.tipo})`
    );
  } else {
    console.log("❌ ERROR: este cable NO se puede dibujar");
  }

  

  // Si hay error, frenamos el render
  if (!origen || !destino) return null;
console.log('origen',origen)
  // ---- resto del código del cable ----
  const p1 = origen.isUPS
    ? { x: origen.x + 40, y: origen.y + 30 }
    : { x: origen.x + 240, y: origen.y + 14 };

  const p2 = destino.isUPS
    ? { x: destino.x, y: destino.y + 30 }
    : { x: destino.x, y: destino.y + 14 };

  const fondoRacks = 40 + 605 + 80;
  const safeY = Math.max(fondoRacks, p1.y + 40, p2.y + 40);

  const path = `
    M ${p1.x} ${p1.y}
    L ${p1.x} ${safeY}
    L ${p2.x} ${safeY}
    L ${p2.x} ${p2.y}
  `;
console.log("---- CABLE COORDS ----");
console.log("p1:", p1);
console.log("p2:", p2);
console.log("safeY:", safeY);
console.log("path:", path);
console.log("-----------------------");
  return (
    <path
      key={cable.id}
      d={path}
      stroke={cable.color}
      strokeWidth="3"
      fill="none"
    />
  );
})}

    </svg>
  );
}
