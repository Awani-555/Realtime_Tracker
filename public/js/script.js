const token = localStorage.getItem("token");

if (!token) {
  alert("You must be logged in to access real-time tracking.");
  window.location.href = "/login";
} else {
  // Connect socket with auth token
  const socket = io({
    auth: { token }
  });

  // Handle socket connection errors
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    alert("Socket connection failed, please refresh the page or login again.");
  });

  // Initialize map centered on [0,0] with zoom 2 (world view)
  const map = L.map("map").setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
  }).addTo(map);

  const markers = {};

  // Flag to check if we have centered map on user's first location
  let mapCentered = false;

  // Watch user's location and send updates to server
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Emit location to server
        socket.emit("send-location", { latitude, longitude });

        // Center map on user's location only once
        if (!mapCentered) {
          map.setView([latitude, longitude], 16);
          mapCentered = true;
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }

  // Listen for location updates from other users
  socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // If marker exists, update its position
    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      // Create new marker for new user
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  });

  // Remove marker when user disconnects
  socket.on("user-disconnected", (id) => {
    if (markers[id]) {
      map.removeLayer(markers[id]);
      delete markers[id];
    }
  });
}