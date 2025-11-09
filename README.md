# Realtime Tracker

A full-stack Realtime Tracker system built with Node.js, Express, MongoDB, Socket.io, React, Tailwind CSS, and Leaflet.

## Features

- Devices can register and send live location updates.
- Backend stores data and pushes updates via Socket.io.
- React + Leaflet dashboard shows live map with device markers.
- Select a device to focus and highlight its marker.
- JWT-based authentication for secure endpoints.
- Modular folder structure for scalability.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React, Tailwind CSS, Leaflet
- **Deployment:** Render / Railway / Vercel

## Installation

### Backend
```bash
cd backend
npm install
npm run dev
Frontend
bash
Copy code
cd tracker-dashboard
npm install
npm run dev
Open http://localhost:5173 to view dashboard.

API Endpoints
POST /api/devices/register — Register a device

POST /api/devices/update-location — Update device location (requires JWT)

GET /api/devices — List all devices (requires JWT)

GET /api/devices/:id/history — Get device location history (requires JWT)

Notes
Use Socket.io client for real-time updates.

Tailwind CSS for frontend styling.

Leaflet.js for map rendering.

JWT required for secure endpoints.

Folder Structure
arduino
Copy code
Realtime_Tracker/
├─ backend/
│  ├─ app.js
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
│  ├─ services/
│  └─ utils/
├─ tracker-dashboard/
│  ├─ src/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ public/
│  ├─ tailwind.config.cjs
│  └─ postcss.config.cjs
└─ README.md
Deployment
Deploy backend on Render / Railway.

Deploy frontend on Vercel / Netlify.

Connect Socket.io backend URL in React frontend for production.