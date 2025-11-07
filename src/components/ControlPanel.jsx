// ControlPanel.jsx
// Left “glass” panel built with Tailwind + DaisyUI.
// Handles search box, toggles, simple stats, and Fit-to-all.

import { useEffect, useState } from 'react';
import { geocode } from '../lib/nominatim.js';

export default function ControlPanel({
  searchQuery,
  setSearchQuery,
  vehiclesCount,
  okCount,
  alertCount,
  showVehicles,
  onToggleVehicles,
  alertsOnly,
  onToggleAlerts,
  showIncidents,
  onToggleIncidents,
  clusteringOn,
  onToggleClustering,
  onFitAll,
}) {
  // local async search results + busy state
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);

  // simple debounce search: run 500ms after typing stops
  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setBusy(true);
        const data = await geocode(searchQuery);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setBusy(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="absolute left-5 top-5 z-9999 w-[360px] max-w-[calc(100%-40px)]">
      {/* Panel */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-blue-700 via-blue-500 to-blue-400 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <div>
              <div className="font-bold">Live Map Tracker</div>
              <div className="text-xs opacity-90">React + Leaflet • London</div>
            </div>
          </div>
          <button className="btn btn-sm btn-primary shadow" onClick={onFitAll}>
            Fit to all
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              className="input input-bordered w-full font-semibold"
              placeholder="Search places (e.g., London Bridge)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {!!searchQuery && (
              <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white shadow">
                {busy && <div className="px-3 py-2 text-sm">Searching…</div>}
                {!busy && results.length === 0 && (
                  <div className="px-3 py-2 text-sm">No results</div>
                )}
                {!busy &&
                  results.map((r) => (
                    <div
                      key={r.place_id}
                      className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        // Inform map to fly to the selection
                        const lat = parseFloat(r.lat),
                          lon = parseFloat(r.lon);
                        window.dispatchEvent(
                          new CustomEvent('app:flyto', {
                            detail: { lat, lon, zoom: 14 },
                          })
                        );
                        // Clear dropdown and keep the chosen label in the input
                        setResults([]);
                        setSearchQuery(r.display_name);
                        // Also raise a 'place' selection to the right drawer via global event
                        // (Drawer computes nearby incidents on its own)
                        window.dispatchEvent(
                          new CustomEvent('app:placeSelected', { detail: r })
                        );
                      }}
                    >
                      <div className="font-bold">
                        {r.display_name.split(',')[0]}
                      </div>
                      <div className="text-xs text-slate-500">
                        {r.display_name}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border bg-white p-3 text-center">
              <div className="text-[11px] text-slate-500">Total</div>
              <div className="text-xl font-extrabold">{vehiclesCount}</div>
            </div>
            <div className="rounded-xl border bg-white p-3 text-center">
              <div className="text-[11px] text-slate-500">OK</div>
              <div className="text-xl font-extrabold">{okCount}</div>
            </div>
            <div className="rounded-xl border bg-white p-3 text-center">
              <div className="text-[11px] text-slate-500">Alerts</div>
              <div className="text-xl font-extrabold text-red-500">
                {alertCount}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Show vehicles</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={showVehicles}
              onChange={onToggleVehicles}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Show alerts only</span>
            <input
              type="checkbox"
              className="toggle"
              checked={alertsOnly}
              onChange={onToggleAlerts}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Show incidents</span>
            <input
              type="checkbox"
              className="toggle"
              checked={showIncidents}
              onChange={onToggleIncidents}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Enable clustering</span>
            <input
              type="checkbox"
              className="toggle"
              checked={clusteringOn}
              onChange={onToggleClustering}
            />
          </div>

          <div className="text-xs text-slate-600">
            Positions update every 5 seconds. All speeds in mph (UK standard).
            Click any point to view details.
          </div>
        </div>
      </div>
    </div>
  );
}
