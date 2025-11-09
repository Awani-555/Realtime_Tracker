import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";
import axios from "axios";

// ✅ connect to your backend
const socket = io("http://localhost:3000");

// ✅ default Leaflet marker icon setup
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function TrackerMap() {
  const [devices, setDevices] = useState({});
  const [selected, setSelected] = useState(null);

  // ✅ Load existing devices (GET /api/devices)
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/devices")
      .then((res) => {
        const initial = {};
        res.data.devices?.forEach((d) => {
          if (d.lastLocation) initial[d.deviceId] = d.lastLocation;
        });
        setDevices(initial);
      })
      .catch((err) => console.error("Error loading devices:", err));
  }, []);

  // ✅ Listen for real-time updates
  useEffect(() => {
    socket.on("connect", () => console.log("🟢 Connected to socket"));
    socket.on("locationUpdate", (data) => {
      setDevices((prev) => ({
        ...prev,
        [data.deviceId]: { lat: data.lat, lng: data.lng },
      }));
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 shadow-md">
        <h2 className="font-semibold text-lg mb-3">Active Devices</h2>
        <ul className="space-y-2">
          {Object.keys(devices).length === 0 && (
            <p className="text-gray-500 text-sm">No devices yet...</p>
          )}
          {Object.entries(devices).map(([id, loc]) => (
            <li
              key={id}
              onClick={() => setSelected(id)}
              className={`cursor-pointer rounded-md p-2 text-sm ${
                selected === id
                  ? "bg-blue-100 border border-blue-400 font-semibold"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              📍 <b>{id}</b> — ({loc.lat.toFixed(3)}, {loc.lng.toFixed(3)})
            </li>
          ))}
        </ul>
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[20.5937, 78.9629]} // India
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* ✅ render markers */}
          {Object.entries(devices).map(([id, loc]) => (
            <Marker
              key={id}
              position={[loc.lat, loc.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <b>{id}</b>
                <br />
                Lat: {loc.lat.toFixed(3)}, Lng: {loc.lng.toFixed(3)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
