import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Tooltip,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import {
  Modal,
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";

/**********************************
 * CONFIGURACIÓN GENERAL
 *********************************/
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

const formatearLinea = (props) => {
  const num = props.linea || props.Linea || props.Name || "?";
  const ramal = props.ramal ? ` - ${props.ramal}` : "";
  const descrip = props.descrip ? ` (${props.descrip})` : "";
  return `${num}${ramal}${descrip}`.replace(/\s+/g, " ").trim();
};
function formatearLineabarrio(props) {
  return {
    ...props,
    label: props.description, // asegúrate que esto existe
  };
}

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

const MapaConCapas = () => {
  const [mostrarCapa1, setMostrarCapa1] = useState(false);
  const [mostrarCapa2, setMostrarCapa2] = useState(false); // 🔁 inicial false
  const [mostrarCapa3, setMostrarCapa3] = useState(false);

  const [escuelas, setEscuelas] = useState(null);
  const [recorridos, setRecorridos] = useState(null);
  const [barrios, setBarrios] = useState(null);

  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [lineasOk, setLineasOk] = useState([]);
  const [lineaSeleccionada, setLineaSeleccionada] = useState("");

  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [recorridoSeleccionado, setRecorridoSeleccionado] = useState(null);
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);

  useEffect(() => {
    fetch("/escuelasgeo.geojson").then((r) => r.json()).then(setEscuelas).catch(console.error);
    fetch("/recorridogeoson.geojson").then((r) => r.json()).then(setRecorridos).catch(console.error);
    fetch("/barriosgeo.geojson").then((r) => r.json()).then(setBarrios).catch(console.error);
  }, []);

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

    if (detalles.length === 1) {
      setLineaSeleccionada(detalles[0]);
      setMostrarCapa2(true);
    }
  }, [origen, destino, recorridos]);

  const estiloRecorrido = (feature) => {
    const desc = formatearLinea(feature.properties);
    if (desc === lineaSeleccionada) return { color: "blue", weight: 5 };
    if (lineasOk.includes(desc)) return { color: "gray", weight: 1, opacity: 0.3 };
    return { color: "green", weight: 2 };
  };
const filtrarFeature = (feature, seleccionado, tipo) => {
  if (!seleccionado) return true;

  switch (tipo) {
    case "escuela":
      return feature.properties?.nombreEsta === seleccionado.properties?.nombreEsta;

    case "barrio":
      const nombreFeature = formatearLineabarrio(feature.properties).label;
      const barrioLabelSeleccionado = seleccionado.label;
      return nombreFeature === barrioLabelSeleccionado;

    case "recorrido":
    default:
      const nombreRecorrido = formatearLinea(feature.properties);
      return nombreRecorrido === seleccionado;
  }
};




  return (
    <div>
      {/* controles */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input type="checkbox" checked={mostrarCapa1} onChange={() => setMostrarCapa1(!mostrarCapa1)} />
          Escuelas
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={mostrarCapa2} onChange={() => setMostrarCapa2(!mostrarCapa2)} />
          Recorridos
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={mostrarCapa3} onChange={() => setMostrarCapa3(!mostrarCapa3)} />
          Barrios
        </label>
      </div>

      {/* autocompletes */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
 <Autocomplete
  options={escuelas?.features || []}
  getOptionLabel={(option) => option?.properties?.nombreEsta || ''}
  value={escuelaSeleccionada}
  onChange={(e, val) => setEscuelaSeleccionada(val)}
  renderInput={(params) => <TextField {...params} label="Escuela" />}
  sx={{ width: 250 }}
/>

        <Autocomplete
          options={recorridos?.features.map((f) => formatearLinea(f.properties)) || []}
          value={recorridoSeleccionado}
          onChange={(e, val) => {
            setRecorridoSeleccionado(val);
            setLineaSeleccionada(val);
            setMostrarCapa2(true);
          }}
          renderInput={(params) => <TextField {...params} label="Recorrido" />}
          sx={{ width: 250 }}
        />
     <Autocomplete
  options={barrios?.features.map((f) => formatearLineabarrio(f.properties)) || []}
  getOptionLabel={(option) => option.label || ''}
  value={barrioSeleccionado}
  onChange={(e, val) => setBarrioSeleccionado(val)}
  renderInput={(params) => <TextField {...params} label="Barrio" />}
  sx={{ width: 250 }}
/>

      </Box>

      {/* líneas posibles */}
      {origen && destino && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: "#e0f7fa", borderRadius: 2 }}>
          <Typography variant="subtitle1">Recorridos cercanos (≤ {PROXIMITY_METERS} m):</Typography>
          {lineasOk.length ? (
            <>
              <Autocomplete
                options={lineasOk}
                value={lineaSeleccionada}
                onChange={(e, val) => {
                  setLineaSeleccionada(val);
                  setMostrarCapa2(true);
                }}
                renderInput={(params) => <TextField {...params} label="Seleccionar línea" />}
                sx={{ mt: 1, width: 300 }}
              />
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => {
                setOrigen(null);
                setDestino(null);
                setLineasOk([]);
                setLineaSeleccionada("");
              }}>
                Nueva búsqueda
              </Button>
            </>
          ) : (
            <Typography>No se encontraron líneas que conecten ambos puntos.</Typography>
          )}
        </Box>
      )}

      {/* mapa */}
      <MapContainer center={[-27.467, -58.835]} zoom={14} style={{ height: "600px", width: "90vw" }}>
        <MapClickHandler origen={origen} destino={destino} setOrigen={setOrigen} setDestino={setDestino} />
        <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {origen && <Marker position={[origen[1], origen[0]]} icon={iconoOrigen}><Tooltip permanent>Origen</Tooltip></Marker>}
        {destino && <Marker position={[destino[1], destino[0]]} icon={iconoDestino}><Tooltip permanent>Destino</Tooltip></Marker>}
        {origen && destino && <Polyline positions={[[origen[1], origen[0]], [destino[1], destino[0]]]} color="red" />}

        {mostrarCapa1 && escuelas && (
          <GeoJSON
            data={{
              ...escuelas,
              features: escuelas.features.filter(f => filtrarFeature(f, escuelaSeleccionada, "escuela"))
            }}
            style={estiloBase}
          />
        )}

        {mostrarCapa2 && recorridos && (
          <GeoJSON
            data={{
              ...recorridos,
              features: recorridos.features.filter(f => filtrarFeature(f, recorridoSeleccionado || lineaSeleccionada, "recorrido"))
            }}
            style={estiloRecorrido}
          />
        )}

        {mostrarCapa3 && barrios && (
          <GeoJSON
            data={{
              ...barrios,
              features: barrios.features.filter(f => filtrarFeature(f, barrioSeleccionado, "barrio"))
            }}
            style={estiloBase}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapaConCapas;
