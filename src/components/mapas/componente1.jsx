import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
 Popup,
  useMapEvents,
} from "react-leaflet";
import {
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import ReactDOMServer from 'react-dom/server';
import SchoolIcon from '@mui/icons-material/School';
import { blue } from '@mui/material/colors';
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
const iconoEscuela = new L.DivIcon({
  html: ReactDOMServer.renderToString(
    <SchoolIcon style={{ color: blue[700], fontSize: 36 }} />
  ),
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

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

const filtrarFeature = (feature, seleccionado, tipo) => {
  if (!seleccionado) return true;

  switch (tipo) {
    case "escuela":
      return feature.properties?.nombreEsta == seleccionado.properties?.nombreEsta;

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

const MapaConCapas = () => {
  const [mostrarCapa1, setMostrarCapa1] = useState(false);
  const [mostrarCapa2, setMostrarCapa2] = useState(false);
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

  // Carga inicial de datos
  useEffect(() => {
    fetch("/escuelasgeo.geojson")
      .then((r) => r.json())
      .then(setEscuelas)
      .catch(console.error);
    fetch("/recorridogeoson.geojson")
      .then((r) => r.json())
      .then(setRecorridos)
      .catch(console.error);
    fetch("/barriosgeo.geojson")
      .then((r) => r.json())
      .then(setBarrios)
      .catch(console.error);
  }, []);

  // Calcular lineas cercanas a origen y destino
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

    if (detalles.length == 1) {
      setLineaSeleccionada(detalles[0]);
      setMostrarCapa2(true);
    } else {
      setLineaSeleccionada("");
      setMostrarCapa2(false);
    }
  }, [origen, destino, recorridos]);

  const estiloRecorrido = (feature) => {
    const desc = formatearLinea(feature.properties);
    if (desc === lineaSeleccionada) return { color: "blue", weight: 5 };
    if (lineasOk.includes(desc)) return { color: "gray", weight: 1, opacity: 0.3 };
    return { color: "green", weight: 2 };
  };

  // Cuando cambian las selecciones de escuela, barrio o recorrido, activamos la capa correspondiente y limpiamos las otras selecciones y capas
  useEffect(() => {
    if (escuelaSeleccionada) {
      setMostrarCapa1(true);
      setMostrarCapa3(false);
      setMostrarCapa2(false);
      setBarrioSeleccionado(null);
      setRecorridoSeleccionado(null);
      setLineaSeleccionada("");
    } else {
      setMostrarCapa1(false);
    }
  }, [escuelaSeleccionada]);

  useEffect(() => {
    if (barrioSeleccionado) {
      setMostrarCapa3(true);
      setMostrarCapa1(false);
      setMostrarCapa2(false);
      setEscuelaSeleccionada(null);
      setRecorridoSeleccionado(null);
      setLineaSeleccionada("");
    } else {
      setMostrarCapa3(false);
    }
  }, [barrioSeleccionado]);

  useEffect(() => {
    if (recorridoSeleccionado) {
      setMostrarCapa2(true);
      setMostrarCapa1(false);
      setMostrarCapa3(false);
      setEscuelaSeleccionada(null);
      setBarrioSeleccionado(null);
      setLineaSeleccionada(recorridoSeleccionado);
    } else {
      setMostrarCapa2(false);
      setLineaSeleccionada("");
    }
  }, [recorridoSeleccionado]);

  return (
    <div>
      {/* controles */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={mostrarCapa1}
            onChange={() => {
              if (mostrarCapa1) setEscuelaSeleccionada(null);
              setMostrarCapa1(!mostrarCapa1);
            }}
          />
         Mostrar todas las Escuelas
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={mostrarCapa2}
            onChange={() => {
              if (mostrarCapa2) {
                setRecorridoSeleccionado(null);
                setLineaSeleccionada("");
              }
              setMostrarCapa2(!mostrarCapa2);
            }}
          />
        Todos los Recorridos
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={mostrarCapa3}
            onChange={() => {
              if (mostrarCapa3) setBarrioSeleccionado(null);
              setMostrarCapa3(!mostrarCapa3);
            }}
          />
         Todos los Barrios
        </label>
      </div>

      {/* autocompletes */}
      <Box >
        <Autocomplete
          options={escuelas?.features || []}
          getOptionLabel={(option) => option?.properties?.nombreEsta || ""}
          value={escuelaSeleccionada}
          onChange={(e, val) => setEscuelaSeleccionada(val)}
          renderInput={(params) => <TextField {...params} label="Escuela" />}
          sx={{ width: 250 }}
          clearOnEscape
          isOptionEqualToValue={(option, value) =>
            option?.properties?.nombreEsta === value?.properties?.nombreEsta
          }
        />

        <Autocomplete
          options={recorridos?.features.map((f) => formatearLinea(f.properties)) || []}
          value={recorridoSeleccionado}
          onChange={(e, val) => setRecorridoSeleccionado(val)}
          renderInput={(params) => <TextField {...params} label="Recorrido" />}
          sx={{ width: 250 }}
          clearOnEscape
        />

        <Autocomplete
          options={barrios?.features.map((f) => formatearLineabarrio(f.properties)) || []}
          getOptionLabel={(option) => option.label || ""}
          value={barrioSeleccionado}
          onChange={(e, val) => setBarrioSeleccionado(val)}
          renderInput={(params) => <TextField {...params} label="Barrio" />}
          sx={{ width: 250 }}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.label === value.label}
        />
      </Box>
      <h3>Selecciona 2 puntos en el mapa para encontrar las lineas de colectivos sugeridas</h3>
      {/* líneas posibles */}
      {origen && destino && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: "#e0f7fa", borderRadius: 2 }}>
          <Typography variant="subtitle1">
            Recorridos cercanos (≤ {PROXIMITY_METERS} m):
          </Typography>
          {lineasOk.length ? (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {lineasOk.join(", ")}
              </Typography>
              {lineasOk.length > 1 && (
                <Autocomplete
                  options={lineasOk}
                  value={lineaSeleccionada}
                  onChange={(e, val) => {
                    setLineaSeleccionada(val || "");
                    setMostrarCapa2(true); // 👉 Mostrar la capa al seleccionar
                  }}
                  renderInput={(params) => <TextField {...params} label="Seleccionar línea" />}
                  clearOnEscape
                  sx={{ width: 300 }}
                />
              )}
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => {
                setOrigen(null);
                setDestino(null);
                setLineasOk([]);
                setLineaSeleccionada("");
              }}>
                Nueva búsqueda
              </Button>
            </>
          ) : (<>
            <Typography variant="body2" color="error">
              No se encontraron líneas cercanas.
            </Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => {
              setOrigen(null);
              setDestino(null);
              setLineasOk([]);
              setLineaSeleccionada("");
            }}>
              Nueva búsqueda
            </Button>
          </>
          )}
        </Box>
      )}

      {/* Mapa */}
      <MapContainer
        center={[-27.500, -58.802]}
        zoom={12}
        style={{ height: "70vh", width: "90vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
{escuelaSeleccionada && (
          (() => {
            const [lng, lat] = escuelaSeleccionada.geometry.coordinates;
            return (
              <Marker position={[lat, lng]} icon={iconoEscuela}>
                <Popup>
                  {escuelaSeleccionada.properties.nombreEsta}
                  <br />
                  {escuelaSeleccionada.properties.domicilio}
                </Popup>
              </Marker>
            );
          })()
        )}
        {/* Capa 1: Escuelas */}
        {mostrarCapa1 && escuelas && (
          <GeoJSON
            data={escuelas}
            style={() => ({
              color: "#006400",
              weight: 3,
              fillOpacity: 0.2,
            })}
            filter={(feature) => filtrarFeature(feature, escuelaSeleccionada, "escuela")}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(feature.properties.nombreEsta);
            }}
          />
        )}

        {/* Capa 2: Recorridos */}
        {mostrarCapa2 && recorridos && (
          <GeoJSON
            data={recorridos}
            style={estiloRecorrido}
            filter={(feature) =>
              filtrarFeature(feature, lineaSeleccionada, "recorrido")
            }
          />
        )}

        {/* Capa 3: Barrios */}
        {mostrarCapa3 && barrios && (
          <GeoJSON
            data={barrios}
            style={() => ({
              color: "#FF4500",
              weight: 3,
              fillOpacity: 0.3,
            })}
            filter={(feature) => filtrarFeature(feature, barrioSeleccionado, "barrio")}
            onEachFeature={(feature, layer) => {
              const label = formatearLineabarrio(feature.properties).label;
              layer.bindTooltip(label);
            }}
          />
        )}

        {/* Marcadores origen y destino */}
        {origen && <Marker position={[origen[1], origen[0]]} icon={iconoOrigen} />}
        {destino && <Marker position={[destino[1], destino[0]]} icon={iconoDestino} />}

        <MapClickHandler
          origen={origen}
          destino={destino}
          setOrigen={setOrigen}
          setDestino={setDestino}
        />
      </MapContainer>
    </div>
  );
};

export default MapaConCapas;
