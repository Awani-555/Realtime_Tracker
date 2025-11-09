import React from "react";
import TrackerMap from "./components/TrackerMap";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white px-6 py-4 text-lg font-semibold shadow-md">
        📡 Realtime Tracker Dashboard
      </header>
      <TrackerMap />
    </div>
  );
}

export default App;
