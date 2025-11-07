// geo.js
// Helpers for vehicle seeding, movement, distance math, and severity color.

const LONDON_BOUNDS = [
  [51.2867602, -0.5103751], // SW
  [51.6918741, 0.3340155], // NE
];

// Random point within given bounds
const randomLatLngInBounds = (sw, ne) => {
  const lat = sw[0] + Math.random() * (ne[0] - sw[0]);
  const lng = sw[1] + Math.random() * (ne[1] - sw[1]);
  return [lat, lng];
};

// UK-ish speed model (mph) by road type
export function randomSpeedForRoadType(type) {
  if (type === 'motorway') return Math.round(60 + Math.random() * 10); // 60–70
  if (type === 'aroad') return Math.round(35 + Math.random() * 20); // 35–55
  return Math.round(20 + Math.random() * 15); // 20–35
}

export function pickRoadType() {
  const r = Math.random();
  if (r < 0.2) return 'motorway';
  if (r < 0.6) return 'aroad';
  return 'urban';
}

// Seed vehicles with a heading and starting speed
export function seedVehicles(n = 80) {
  const list = [];
  for (let i = 0; i < n; i++) {
    const [lat, lng] = randomLatLngInBounds(LONDON_BOUNDS[0], LONDON_BOUNDS[1]);
    const roadType = pickRoadType();
    list.push({
      id: `VH-${String(i + 1).padStart(2, '0')}`,
      name: `Vehicle ${i + 1}`,
      status: Math.random() > 0.7 ? 'alert' : 'ok',
      roadType,
      speed: randomSpeedForRoadType(roadType),
      lat,
      lng,
      heading: Math.floor(Math.random() * 360),
    });
  }
  return list;
}

// Move vehicles slightly, clamp to bounds, and jitter speed
const toDeg = (rad) => (rad * 180) / Math.PI;
export function nudgeVehicles(list) {
  return list.map((v) => {
    const dLat = (Math.random() - 0.5) * 0.01;
    const dLng = (Math.random() - 0.5) * 0.01;
    const nextLat = Math.min(
      Math.max(v.lat + dLat, LONDON_BOUNDS[0][0]),
      LONDON_BOUNDS[1][0]
    );
    const nextLng = Math.min(
      Math.max(v.lng + dLng, LONDON_BOUNDS[0][1]),
      LONDON_BOUNDS[1][1]
    );
    const heading = (toDeg(Math.atan2(dLng, dLat)) + 360) % 360;
    const base = randomSpeedForRoadType(v.roadType);
    const newSpeed = Math.max(0, base + Math.round((Math.random() - 0.5) * 2));
    return { ...v, lat: nextLat, lng: nextLng, heading, speed: newSpeed };
  });
}

// Haversine distance (km)
const toRad = (d) => (d * Math.PI) / 180;
export function haversineKm(aLat, aLng, bLat, bLng) {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Consistent color by severity
export function severityColor(sev) {
  return sev === 'high' ? '#f43f5e' : sev === 'medium' ? '#f59e0b' : '#10b981';
}
