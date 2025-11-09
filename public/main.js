const socket = io("http://localhost:3000");

// Initialize map
const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const statusDiv = document.getElementById("status");
const deviceList = document.getElementById("deviceList");
const markers = {};
let selectedDevice = null;

socket.on("connect", () => {
  statusDiv.textContent = "🟢 Connected";
  statusDiv.classList.replace("text-red-500", "text-green-400");
});

socket.on("disconnect", () => {
  statusDiv.textContent = "🔴 Disconnected";
  statusDiv.classList.replace("text-green-400", "text-red-500");
});

// Listen for location updates
socket.on("locationUpdate", (data) => {
  const { deviceId, lat, lng } = data;
  if (!lat || !lng) return;

  // Update or add marker
  if (markers[deviceId]) {
    markers[deviceId].setLatLng([lat, lng]);
  } else {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>${deviceId}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
    markers[deviceId] = marker;
  }

  // Update sidebar
  const existing = document.getElementById(`dev-${deviceId}`);
  if (existing) {
    existing.innerHTML = `📍 <b>${deviceId}</b> → (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  } else {
    const li = document.createElement("li");
    li.id = `dev-${deviceId}`;
    li.className =
      "bg-blue-50 border border-blue-100 rounded-md p-2 hover:bg-blue-100 transition cursor-pointer";
    li.innerHTML = `📍 <b>${deviceId}</b> → (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
    li.addEventListener("click", () => focusOnDevice(deviceId));
    deviceList.appendChild(li);
  }
});

function focusOnDevice(deviceId) {
  const marker = markers[deviceId];
  if (!marker) return;

  // Highlight sidebar item
  document.querySelectorAll("#deviceList li").forEach((el) => {
    el.classList.remove("bg-blue-200", "font-bold");
  });
  const li = document.getElementById(`dev-${deviceId}`);
  if (li) {
    li.classList.add("bg-blue-200", "font-bold");
  }

  // Highlight marker
  if (selectedDevice && selectedDevice !== deviceId) {
    markers[selectedDevice].setIcon(new L.Icon.Default());
  }
  selectedDevice = deviceId;
  const redIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  marker.setIcon(redIcon);

  // Focus map on selected marker
  map.setView(marker.getLatLng(), 12);
  marker.openPopup();
}
