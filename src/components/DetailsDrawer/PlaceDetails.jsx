// PlaceDetails.jsx
// Shows place name/address/coords + any nearby incidents within radiusKm.

import { severityColor } from '../../lib/geo.js';

export default function PlaceDetails({ place, nearby, radiusKm }) {
  return (
    <div className="space-y-4">
      <Row label="Name" value={place.display_name.split(',')[0]} />
      <Row label="Full address" value={place.display_name} />
      <Row
        label="Coordinates"
        value={`${Number(place.lat).toFixed(5)}, ${Number(place.lon).toFixed(
          5
        )}`}
      />

      <div className="divider my-2"></div>
      <div className="flex items-center gap-2">
        <div className="font-extrabold">Nearby incidents</div>
        <span className="badge badge-outline">{radiusKm} km</span>
      </div>

      {nearby.length === 0 ? (
        <div className="alert">
          <span>All clear nearby. No incidents within {radiusKm} km.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {nearby.map((inc) => (
            <div
              key={inc.id}
              className="rounded-xl border p-3 shadow-sm bg-white"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="badge text-white"
                  style={{ background: severityColor(inc.severity) }}
                >
                  {inc.severity}
                </span>
                <span className="text-xs text-slate-500">ID: {inc.id}</span>
              </div>
              <div className="font-extrabold">{inc.description}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="badge badge-outline">
                  {inc.distanceKm.toFixed(2)} km
                </span>
                <span className="badge badge-outline">
                  Conf {(inc.confidence * 100).toFixed(0)}%
                </span>
                <span className="text-slate-500">
                  {inc.lat.toFixed(3)}, {inc.lng.toFixed(3)}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">
                  Advice
                </div>
                <div>{adviceForSeverity(inc.severity)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

// lightweight local advice (kept here to avoid extra import)
function adviceForSeverity(sev) {
  if (sev === 'high') return 'Avoid the area; expect closures and delays.';
  if (sev === 'medium')
    return 'Expect local delays; consider alternate routes.';
  return 'Minor works; proceed with caution.';
}
