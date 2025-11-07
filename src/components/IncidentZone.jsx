// IncidentZone.jsx
// Draws a soft circle under an incident so the map feels balanced and “aware”.

import { Circle } from 'react-leaflet';
import { severityColor } from '../lib/geo.js';

export default function IncidentZone({ inc }) {
  const color = severityColor(inc.severity);
  return (
    <Circle
      center={[inc.lat, inc.lng]}
      radius={inc.radiusM}
      pathOptions={{
        color,
        opacity: 0.35,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.08,
      }}
    />
  );
}
