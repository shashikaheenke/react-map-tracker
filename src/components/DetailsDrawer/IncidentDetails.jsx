// IncidentDetails.jsx
import { severityColor } from '../../lib/geo.js';

export default function IncidentDetails({ inc }) {
  return (
    <div className="space-y-3">
      <Row label="Incident ID" value={inc.id} />
      <Row
        label="Severity"
        value={
          <span
            className="badge text-white"
            style={{ background: severityColor(inc.severity) }}
          >
            {inc.severity}
          </span>
        }
      />
      <Row label="Summary" value={inc.description} />
      <Row
        label="Location"
        value={`${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}`}
      />
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
