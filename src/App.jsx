// App.jsx
// High-level composition: lays out the ControlPanel (left), MapRoot (center), and DetailsDrawer (right).
// Holds shared state like selected entity, vehicles list, toggles, etc.

import { useEffect, useMemo, useState } from 'react';
import MapRoot from './components/MapRoot.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import Drawer from './components/DetailsDrawer/Drawer.jsx';

import { seedVehicles, nudgeVehicles } from './lib/geo.js';
import { buildSpreadIncidents } from './data/incidents.js';

export default function App() {
  // Vehicles: seeded once, then “nudged” every 5s to simulate motion
  const [vehicles, setVehicles] = useState(() => seedVehicles(80));

  // Incidents: 7 nicely spread around London (generated once per load)
  const [incidents] = useState(() => buildSpreadIncidents());

  // UI toggles
  const [showVehicles, setShowVehicles] = useState(true);
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [showIncidents, setShowIncidents] = useState(true);
  const [clusteringOn, setClusteringOn] = useState(true);

  // Fit trigger + user movement flag so we don’t keep re-fitting after manual zoom
  const [fitTrigger, setFitTrigger] = useState(0);
  const [userMoved, setUserMoved] = useState(false);

  // Drawer selection: { type: 'vehicle' | 'incident' | 'place', data: {...} }
  const [selected, setSelected] = useState(null);

  // Search state (ControlPanel -> Drawer)
  const [searchQuery, setSearchQuery] = useState('');

  // Move vehicles every 5 seconds
  useEffect(() => {
    const id = setInterval(
      () => setVehicles((prev) => nudgeVehicles(prev)),
      5000
    );
    return () => clearInterval(id);
  }, []);

  // Visible vehicles depending on filters
  const visibleVehicles = useMemo(() => {
    if (!showVehicles) return [];
    return alertsOnly ? vehicles.filter((v) => v.status === 'alert') : vehicles;
  }, [vehicles, showVehicles, alertsOnly]);

  // Tiny stats for panel
  const okCount = vehicles.filter((v) => v.status === 'ok').length;
  const alertCount = vehicles.length - okCount;

  // Fit-to-all button handler
  const handleFitAll = () => {
    setUserMoved(false);
    setFitTrigger((n) => n + 1);
  };

  return (
    <div className="relative h-screen w-full bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Left control panel */}
      <ControlPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        vehiclesCount={vehicles.length}
        okCount={okCount}
        alertCount={alertCount}
        showVehicles={showVehicles}
        onToggleVehicles={() => setShowVehicles((v) => !v)}
        alertsOnly={alertsOnly}
        onToggleAlerts={() => setAlertsOnly((v) => !v)}
        showIncidents={showIncidents}
        onToggleIncidents={() => setShowIncidents((v) => !v)}
        clusteringOn={clusteringOn}
        onToggleClustering={() => setClusteringOn((v) => !v)}
        onFitAll={handleFitAll}
      />

      {/* Map root (center) */}
      <MapRoot
        visibleVehicles={visibleVehicles}
        incidents={incidents}
        showIncidents={showIncidents}
        clusteringOn={clusteringOn}
        fitTrigger={fitTrigger}
        userMoved={userMoved}
        setUserMoved={setUserMoved}
        onSelect={setSelected}
      />

      {/* Right drawer with details */}
      <Drawer
        selected={selected}
        onClose={() => setSelected(null)}
        incidents={incidents}
      />
    </div>
  );
}
