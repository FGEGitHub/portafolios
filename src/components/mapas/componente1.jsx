import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Modal, Box, Typography, Button } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Tooltip,
  Polyline,
  useMapEvents,
} from "react-leaflet";

/**********************************
 * CONFIGURACIÓN GENERAL
 *********************************/
// Radio máximo considerado “cerca” en metros
const PROXIMITY_METERS = 400;
const PROXIMITY_KM = PROXIMITY_METERS / 1000;

/**********************************
 * ÍCONOS  (origen / destino)
 *********************************/
const iconoOrigen = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const iconoDestino = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const estiloBase = {
  color: "#0077cc",
  weight: 2,
  fillOpacity: 0.4,
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

/**********************************
 * UTILS
 *********************************/
// Formatea una línea con más detalle (línea, ramal y descrip si existen)
const formatearLinea = (props) => {
  const num = props.linea || props.Linea || props.Name || "?";
  const ramal = props.ramal ? ` - ${props.ramal}` : "";
  const descrip = props.descrip ? ` (${props.descrip})` : "";
  return `${num}${ramal}${descrip}`.replace(/\s+/g, " ").trim();
};

// Calcula la distancia de un punto a una geometría LineString / MultiLineString
const distanciaPuntoLineaKm = (punto, geom) => {
  if (!geom) return Infinity;
  if (geom.type === "LineString") {
    return turf.pointToLineDistance(punto, geom, { units: "kilometers" });
  }
  if (geom.type === "MultiLineString") {
    return Math.min(
      ...geom.coordinates.map((coords) =>
        turf.pointToLineDistance(
          punto,
          { type: "LineString", coordinates: coords },
          { units: "kilometers" }
        )
      )
    );
  }
  return Infinity;
};

/**********************************
 * COMPONENTE CLICK HANDLER
 *********************************/
const MapClickHandler = ({ origen, destino, setOrigen, setDestino }) => {
  useMapEvents({
    click(e) {
      const coord = [e.latlng.lng, e.latlng.lat];
      if (!origen) setOrigen(coord);
      else if (!destino) setDestino(coord);
    },
  });
  return null;
};

/**********************************
 * COMPONENTE PRINCIPAL
 *********************************/
const MapaConCapas = () => {
  // visibilidad de capas
  const [mostrarCapa1, setMostrarCapa1] = useState(false); // Escuelas
  const [mostrarCapa2, setMostrarCapa2] = useState(false); // Recorridos
  const [mostrarCapa3, setMostrarCapa3] = useState(false); // Barrios

  // geojson
  const [escuelas, setEscuelas] = useState(null);
  const [recorridos, setRecorridos] = useState(null);
  const [barrios, setBarrios] = useState(null);

  // interacción
  const [featureSeleccionado, setFeatureSeleccionado] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [lineasOk, setLineasOk] = useState([]); // array de strings descriptivos
const [lineaSeleccionada, setLineaSeleccionada] = useState(null);

  /******** CARGA DE GEOJSON ********/
  useEffect(() => {
    fetch("/escuelasgeo.geojson").then((r) => r.json()).then(setEscuelas).catch(console.error);
    fetch("/recorridogeoson.geojson").then((r) => r.json()).then(setRecorridos).catch(console.error);
    fetch("/barriosgeo.geojson").then((r) => r.json()).then(setBarrios).catch(console.error);
  }, []);

  /******** BÚSQUEDA DE LÍNEAS CERCANAS ********/
  useEffect(() => {
    if (!origen || !destino || !recorridos) return;

    const pO = turf.point(origen);
    const pD = turf.point(destino);

    const candidatas = recorridos.features.filter((f) => {
      const dO = distanciaPuntoLineaKm(pO, f.geometry);
      const dD = distanciaPuntoLineaKm(pD, f.geometry);
      return dO <= PROXIMITY_KM && dD <= PROXIMITY_KM;
    });

    const detalles = Array.from(
      new Set(candidatas.map((f) => formatearLinea(f.properties)))
    );
    setLineasOk(detalles);
  }, [origen, destino, recorridos]);
useEffect(() => {
  if (lineasOk.length > 0) {
    setMostrarCapa2(true); // Mostrar recorridos válidos
  }
}, [lineasOk])
useEffect(() => {
  if (lineasOk.length === 1) {
    setLineaSeleccionada(lineasOk[0]);
  }
}, [lineasOk]);

  /******** STYLES DINÁMICOS ********/
  const estiloRecorrido = (feature) => {
    const desc = formatearLinea(feature.properties);
    if (lineasOk.includes(desc)) return { color: "blue", weight: 5 };
    return { color: "green", weight: 2 };
  };

  const onEachFeature = (feature, layer) => {
    const nombre = formatearLinea(feature.properties);
    const descripcion = feature.properties.description || "Sin descripción";
    layer.bindTooltip(nombre, { permanent: false, direction: "top" });
    layer.on({ click: () => setFeatureSeleccionado({ nombre, descripcion }) });
  };

  /******** RENDER ********/
  return (
    <div>
      {/* controles de capas */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input type="checkbox" checked={mostrarCapa1} onChange={() => setMostrarCapa1(!mostrarCapa1)} /> Escuelas
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={mostrarCapa2} onChange={() => setMostrarCapa2(!mostrarCapa2)} /> Recorridos
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={mostrarCapa3} onChange={() => setMostrarCapa3(!mostrarCapa3)} /> Barrios
        </label>
      </div>

      {/* recomendación */}
      {origen && destino && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: "#e0f7fa", borderRadius: 2 }}>
          <Typography variant="subtitle1">Recorridos cercanos (≤ {PROXIMITY_METERS} m):</Typography>
          {lineasOk.length ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {lineasOk.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : (
            <Typography>No se encontraron líneas que conecten ambos puntos.</Typography>
          )}
          <Button sx={{ mt: 1 }} variant="outlined" onClick={() => { setOrigen(null); setDestino(null); setLineasOk([]); }}>
            Nueva búsqueda
          </Button>
        </Box>
      )}
{lineasOk.length > 1 && (
  <div>
    <label>Seleccionar recorrido:</label>
    <select
      value={lineaSeleccionada || ''}
      onChange={(e) => setLineaSeleccionada(e.target.value)}
    >
      <option value="" disabled>Elegí una línea</option>
      {lineasOk.map((linea, index) => (
        <option key={index} value={linea}>
          {linea}
        </option>
      ))}
    </select>
  </div>
)}

      {/* mapa */}
      <MapContainer center={[-27.467, -58.835]} zoom={14} style={{ height: "600px", width: "90vw" }}>
        <MapClickHandler origen={origen} destino={destino} setOrigen={setOrigen} setDestino={setDestino} />

        <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {origen && <Marker position={[origen[1], origen[0]]} icon={iconoOrigen}><Tooltip permanent>Origen</Tooltip></Marker>}
        {destino && <Marker position={[destino[1], destino[0]]} icon={iconoDestino}><Tooltip permanent>Destino</Tooltip></Marker>}

        {origen && destino && <Polyline positions={[[origen[1], origen[0]], [destino[1], destino[0]]]} color="red" />}

        {mostrarCapa1 && escuelas && <GeoJSON data={escuelas} style={estiloBase} onEachFeature={onEachFeature} />}
      {mostrarCapa2 && recorridos && lineaSeleccionada && (
  <GeoJSON
    data={{
      ...recorridos,
      features: recorridos.features.filter(
        (f) => formatearLinea(f.properties) === lineaSeleccionada
      ),
    }}
    style={estiloRecorrido}
    onEachFeature={onEachFeature}
  />
)}



        {mostrarCapa3 && barrios && <GeoJSON data={barrios} style={estiloBase} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};

export default MapaConCapas;
