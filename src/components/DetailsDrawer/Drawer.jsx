// Drawer.jsx
// Right-side drawer container (Tailwind v4, canonical classes).
// - Listens for "placeSelected" events fired by the search box
// - Computes nearby incidents
// - Renders Vehicle / Incident / Place details
// - Accessibility: role="dialog", aria labels, ESC to close

import { useEffect, useMemo, useState } from 'react';
import VehicleDetails from './VehicleDetails.jsx';
import IncidentDetails from './IncidentDetails.jsx';
import PlaceDetails from './PlaceDetails.jsx';
import { haversineKm } from '../../lib/geo.js';

const NEARBY_RADIUS_KM = 2.5;

export default function Drawer({ selected, onClose, incidents }) {
  // Local state to capture a "place" coming from the search dropdown
  const [placeFromSearch, setPlaceFromSearch] = useState(null);

  // Subscribe to "placeSelected" (from ControlPanel search)
  useEffect(() => {
    const handler = (e) => setPlaceFromSearch(e.detail);
    window.addEventListener('app:placeSelected', handler);
    return () => window.removeEventListener('app:placeSelected', handler);
  }, []);

  // Close on ESC for better UX
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pick the active "place" either from selected prop or search event
  const placeSelection = useMemo(() => {
    if (selected?.type === 'place') return selected.data;
    if (placeFromSearch) return placeFromSearch;
    return null;
  }, [selected, placeFromSearch]);

  // Compute incidents within radius (sorted by distance)
  const nearby = useMemo(() => {
    if (!placeSelection) return [];
    const lat = Number(placeSelection.lat),
      lon = Number(placeSelection.lon);
    return incidents
      .map((inc) => ({
        ...inc,
        distanceKm: haversineKm(lat, lon, inc.lat, inc.lng),
      }))
      .filter((x) => x.distanceKm <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [placeSelection, incidents]);

  const isOpen = !!selected || !!placeSelection;

  // Decide which body to render
  const body = (() => {
    if (selected?.type === 'vehicle')
      return <VehicleDetails v={selected.data} />;
    if (selected?.type === 'incident')
      return <IncidentDetails inc={selected.data} />;
    if (placeSelection)
      return (
        <PlaceDetails
          place={placeSelection}
          nearby={nearby}
          radiusKm={NEARBY_RADIUS_KM}
        />
      );
    return (
      <div className="text-sm text-slate-700">
        Select a marker or search a place.
      </div>
    );
  })();

  // Close clears both channels (prop + search)
  const handleClose = () => {
    setPlaceFromSearch(null);
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Details"
      className={`drawer z-9999 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header (cyan gradient). We force the button to have dark text on white bg. */}
      <div className="drawer-header bg-linear-to-r from-sky-500 to-sky-400">
        <div>
          {selected?.type === 'vehicle' && 'Vehicle details'}
          {selected?.type === 'incident' && 'Incident details'}
          {!selected && placeSelection && 'Place'}
          {!selected && !placeSelection && 'Details'}
        </div>

        {/* Visible Close button (white chip with dark text) */}
        <button
          type="button"
          aria-label="Close details"
          title="Close"
          onClick={handleClose}
          className="bg-white text-ink font-extrabold w-8 h-8 rounded-(--radius-lg) flex items-center justify-center shadow-card hover:shadow-pop"
        >
          {/* simple × glyph keeps bundle tiny; replace with an icon if you prefer */}
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{body}</div>
    </div>
  );
}
