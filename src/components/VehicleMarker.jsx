// VehicleMarker.jsx
// Renders a custom Leaflet divIcon for a vehicle (with direction arrow + optional label).

import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

function vehicleIcon({ status = 'ok', heading = 0, label = '' }) {
  const color = status === 'alert' ? '#ef4444' : '#22c55e';
  const html = `
    <div style="position:relative; width:26px; height:26px; border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                background:${color};
                box-shadow:0 0 0 4px rgba(255,255,255,0.9), 0 8px 22px rgba(2,6,23,0.18);
                transform: rotate(${heading}deg);">
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
                  border-bottom:10px solid white; position:absolute; top:-2px; left:50%; transform:translateX(-50%);
                  filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2));"></div>
      ${
        label
          ? `<div style="position:absolute; bottom:-16px; left:50%; transform:translateX(-50%);
                            background:rgba(255,255,255,0.96); color:#0f172a; padding:1px 6px; border-radius:8px;
                            border:1px solid rgba(15,23,42,0.08); font-size:11px; font-weight:800; line-height:16px;
                            box-shadow:0 2px 6px rgba(2,6,23,0.08);">${label}</div>`
          : ``
      }
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function VehicleMarker({ v, onClick }) {
  return (
    <Marker
      position={[v.lat, v.lng]}
      icon={vehicleIcon({ status: v.status, heading: v.heading, label: v.id })}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="text-sm leading-snug font-sans">
          <strong>{v.name}</strong>
          <br />
          ID: {v.id}
          <br />
          Status: {v.status}
          <br />
          Road: {v.roadType}
          <br />
          Speed: {v.speed} mph
        </div>
      </Popup>
    </Marker>
  );
}
