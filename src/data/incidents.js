// incidents.js
// Create 7 spread incidents around London with slight jitter and variable radius.

const ZONES = [
  { key: 'NW', lat: 51.55, lng: -0.25 }, // Wembley/Kensal
  { key: 'W', lat: 51.51, lng: -0.28 }, // Hammersmith
  { key: 'C', lat: 51.51, lng: -0.1 }, // City/West End
  { key: 'NE', lat: 51.55, lng: -0.02 }, // Hackney
  { key: 'E', lat: 51.52, lng: 0.03 }, // Stratford/E
  { key: 'SE', lat: 51.47, lng: 0.03 }, // Greenwich
  { key: 'SW', lat: 51.44, lng: -0.17 }, // Wandsworth/Clapham
];

const SEVERITIES = ['low', 'medium', 'high', 'medium', 'low', 'high', 'low'];
const DESCRIPTIONS = [
  'Minor disruption reported',
  'Roadworks causing lane closures',
  'Gas leak reported',
  'Congestion due to local event',
  'Maintenance works in progress',
  'Emergency services on scene',
  'Signal outage affecting junction',
];

export function buildSpreadIncidents() {
  return ZONES.map((z, i) => {
    const jLat = z.lat + (Math.random() - 0.5) * 0.02; // ~±1.1km jitter
    const jLng = z.lng + (Math.random() - 0.5) * 0.02;
    return {
      id: `INC-${z.key}`,
      severity: SEVERITIES[i],
      description: DESCRIPTIONS[i],
      lat: jLat,
      lng: jLng,
      confidence: 0.7 + Math.random() * 0.2,
      radiusM: 600 + Math.round(Math.random() * 800),
    };
  });
}
