// src/components/MapaBasico.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaBasico = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    fetch("/manazanasmates.geojson")
      .then((res) => res.json())
      .then(setGeojsonData)
      .catch(console.error);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
        dasdas
      <MapContainer
        center={[-34.6, -58.4]} // Buenos Aires como ejemplo
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojsonData && (
          <GeoJSON data={geojsonData} style={{ color: "blue", weight: 2 }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapaBasico;
