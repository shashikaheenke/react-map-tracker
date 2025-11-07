// IncidentMarker.jsx
// Renders incident pointer icon; color driven by severity.

import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { severityColor } from '../lib/geo.js';

function incidentIcon({ severity = 'medium' }) {
  const color = severityColor(severity);
  const html = `
    <div style="position:relative; width:0; height:0;
                border-left:12px solid transparent; border-right:12px solid transparent;
                border-bottom:20px solid ${color};
                filter: drop-shadow(0 8px 18px rgba(2,6,23,0.18));">
      <div style="position:absolute; top:18px; left:-10px; width:20px; height:6px; border-radius:4px; background:rgba(0,0,0,0.06)"></div>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 18],
  });
}

export default function IncidentMarker({ inc, onClick }) {
  return (
    <Marker
      position={[inc.lat, inc.lng]}
      icon={incidentIcon({ severity: inc.severity })}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="text-sm leading-snug font-sans">
          <strong>Incident</strong>
          <br />
          ID: {inc.id}
          <br />
          Severity: {inc.severity}
          <br />
          {inc.description}
          <br />
          Confidence: {(inc.confidence * 100).toFixed(0)}%
        </div>
      </Popup>
    </Marker>
  );
}
