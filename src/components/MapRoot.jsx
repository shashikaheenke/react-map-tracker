// MapRoot.jsx
// Owns the Leaflet map instance and renders vehicles + incidents.
// Listens for global 'app:flyto' events for search results (from ControlPanel).
// Tailwind handles overall look; Leaflet handles tiles; DaisyUI used in popups subtly.

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet base styles
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';

import VehicleMarker from './VehicleMarker.jsx';
import IncidentMarker from './IncidentMarker.jsx';
import IncidentZone from './IncidentZone.jsx';

const LONDON_CENTER = [51.505, -0.11];

function FitToVehicles({ vehicles, trigger, userMoved }) {
  const map = useMap();
  useEffect(() => {
    if (!trigger || !map || vehicles.length === 0 || userMoved) return;
    const bounds = vehicles.map((v) => [v.lat, v.lng]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [trigger, vehicles, map, userMoved]);
  return null;
}

export default function MapRoot({
  visibleVehicles,
  incidents,
  showIncidents,
  clusteringOn,
  fitTrigger,
  userMoved,
  setUserMoved,
  onSelect,
}) {
  return (
    <MapContainer
      center={LONDON_CENTER}
      zoom={11}
      scrollWheelZoom
      className="absolute inset-0 z-0"
      // When created, wire up flyTo + user interaction listeners
      whenCreated={(map) => {
        map.on('zoomstart', () => setUserMoved(true));
        map.on('dragstart', () => setUserMoved(true));
        window.addEventListener('app:flyto', (e) => {
          const { lat, lon, zoom } = e.detail;
          setUserMoved(true);
          map.flyTo([lat, lon], zoom || 14, { duration: 0.8 });
        });
      }}
    >
      {/* Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      {/* Fit-to-all vehicles (only when triggered) */}
      <FitToVehicles
        vehicles={visibleVehicles}
        trigger={fitTrigger}
        userMoved={userMoved}
      />

      {/* Vehicles: clustered or not */}
      {clusteringOn ? (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {visibleVehicles.map((v) => (
            <VehicleMarker
              key={v.id}
              v={v}
              onClick={() => onSelect({ type: 'vehicle', data: v })}
            />
          ))}
        </MarkerClusterGroup>
      ) : (
        visibleVehicles.map((v) => (
          <VehicleMarker
            key={v.id}
            v={v}
            onClick={() => onSelect({ type: 'vehicle', data: v })}
          />
        ))
      )}

      {/* Incidents + soft radius zones */}
      {showIncidents &&
        incidents.map((inc) => (
          <div key={inc.id}>
            <IncidentZone inc={inc} />
            <IncidentMarker
              inc={inc}
              onClick={() => onSelect({ type: 'incident', data: inc })}
            />
          </div>
        ))}
    </MapContainer>
  );
}
