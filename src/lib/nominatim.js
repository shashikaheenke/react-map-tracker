// nominatim.js
// Tiny wrapper around Nominatim search API (no key).
// NOTE: Be courteous with usage on public demos.

export async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    q
  )}&limit=5&addressdetails=1`;
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('Geocoding failed');
  return r.json();
}
