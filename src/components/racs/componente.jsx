import React from "react";
import data from "./datos.json";
import "./diagram.css";

export default function RackDiagram() {
  const { racks, routers, fortinet, mikrotik, ups, servidores, qnap, cables } = data;

function getUpsCoords(upsItem, index, rack) {
  const rackHeight = 600;       // Altura real del rect del rack
  const bottomPadding = 20;     // Distancia desde el borde inferior del rack

  const columna = index % 2;    // columna 0 o 1
  const fila = Math.floor(index / 2);

  const upsHeight = 60;         // alto del UPS
  const separacionVertical = 10;

  const yBase =
    rack.posY +
    rackHeight -
    bottomPadding -
    upsHeight -
    (fila * (upsHeight + separacionVertical));

  return {
    x: rack.posX + 20 + columna * 130,
    y: yBase
  };
}
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

  const rackPositions = racks.map((rack, index) => ({
    ...rack,
    posX: 80 + index * 350,
    posY: 40,
  }));

  const getCoords = (equipo) => {
    const rack = rackPositions.find((r) => r.id === equipo.rack_id);
    return {
      x: rack.posX + 20,
      y: rack.posY + 40 + (equipo.slot - 1) * 32,
    };
  };
const upsPositions = racks.flatMap(rack => {
  const upsDeRack = equiposConSlot.filter(
    e => e.tipo === "ups" && e.rack_id === rack.id
  );

  return upsDeRack.map((upsItem, index) => {
    const { x, y } = getUpsCoords(upsItem, index, rack);
    return {
      ...upsItem,
      x,
      y,
      isUPS: true
    };
  });
});

// Lista global de equipos con coordenadas reales
const equiposGlobal = [
  ...equiposConSlot.map(e => ({
    ...e,
    ...getCoords(e),
    isUPS: false
  })),
  ...upsPositions
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
      {equiposConSlot.map((eq) => {
        const rack = rackPositions.find((r) => r.id === eq.rack_id);
        let pos;

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

  {/* REJILLAS laterales */}
  {["mikrotik", "router", "qnap"].includes(eq.tipo) && (
    <>
      {[...Array(4)].map((_, i) => (
        <rect
          key={`left-slot-${i}`}
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
          key={`right-slot-${i}`}
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
     {cables.map((cable, index) => {

  // Buscar origen en la lista global
  const origen = equiposGlobal.find(
    e => e.tipo === cable.origen_tipo && e.id === cable.origen_id
  );

  // Buscar destino
  const destino = equiposGlobal.find(
    e => e.tipo === cable.destino_tipo && e.id === cable.destino_id
  );

  if (!origen || !destino) return null;

  // Coordenadas correctas según tipo
  const p1 = origen.isUPS
    ? { x: origen.x + 40, y: origen.y + 30 }
    : { x: origen.x + 240, y: origen.y + 14 };

  const p2 = destino.isUPS
    ? { x: destino.x, y: destino.y + 30 }
    : { x: destino.x, y: destino.y + 14 };

  // Altura de zona inferior común
  const zona = Math.max(origen.y, destino.y) + 100;
const zonaSegura = Math.max(p1.y, p2.y) + 120;
  // Camino estilo recto con quiebre inferior
let path = "";

// Si están casi en la misma línea → recto
if (Math.abs(p1.x - p2.x) < 30) {
  path = `
    M ${p1.x} ${p1.y}
    L ${p2.x} ${p2.y}
  `;
} else {
  // Curvas con Bezier
  path = `
    M ${p1.x} ${p1.y}
    C ${p1.x} ${zonaSegura},
      ${p2.x} ${zonaSegura},
      ${p2.x} ${p2.y}
  `;
}

  return (
<path
  d={path}
  stroke={cable.color}
  strokeWidth="3"
  fill="none"
>
  <title>
    {`${cable.label || "Cable"}
Origen: ${origen.nombre} (${origen.tipo})
Destino: ${destino.nombre} (${destino.tipo})`}
  </title>
</path>
  );
})}
    </svg>
  );
}
