// VehicleDetails.jsx
export default function VehicleDetails({ v }) {
  return (
    <div className="space-y-3">
      <Row label="Name" value={v.name} />
      <Row label="ID" value={v.id} />
      <Row
        label="Status"
        value={
          <span
            className={`badge ${
              v.status === 'alert' ? 'badge-error' : 'badge-success'
            } text-white`}
          >
            {v.status}
          </span>
        }
      />
      <Row label="Road type" value={v.roadType} />
      <Row label="Speed" value={`${v.speed} mph`} />
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
