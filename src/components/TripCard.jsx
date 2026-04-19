import { useNavigate } from "react-router-dom"
import { deleteTrip } from "../services/tripService"

const COVERS = [
  { accent: "#6366f1", emoji: "🏖️" },
  { accent: "#8b5cf6", emoji: "🏔️" },
  { accent: "#06b6d4", emoji: "🌆" },
  { accent: "#10b981", emoji: "🌴" },
  { accent: "#f59e0b", emoji: "🏛️" },
  { accent: "#ec4899", emoji: "🗺️" },
]

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate()
  const cover = COVERS[trip.destination?.length % COVERS.length] || COVERS[0]

  async function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm("Delete this trip?")) {
      await deleteTrip(trip.id)
      onDelete(trip.id)
    }
  }

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}`)}
      style={{
        background: "#1a1828",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {/* Accent strip */}
      <div style={{
        height: 4,
        background: cover.accent,
        opacity: 0.9
      }} />

      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 42, height: 42,
            background: `${cover.accent}18`,
            border: `1px solid ${cover.accent}30`,
            borderRadius: 12,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20
          }}>{cover.emoji}</div>
          <button
            onClick={handleDelete}
            style={{
              background: "none",
              border: "none",
              color: "#3d3b55",
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
              transition: "color 0.15s",
              padding: 4
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
            onMouseLeave={e => e.currentTarget.style.color = "#3d3b55"}
          >✕</button>
        </div>

        <h3 style={{
          fontSize: 15, fontWeight: 700,
          color: "#f0eeff", marginBottom: 4
        }}>{trip.name}</h3>
        <p style={{ fontSize: 13, color: "#5e5c78", marginBottom: 16 }}>
          📍 {trip.destination}
        </p>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.06)"
        }}>
          <span style={{ fontSize: 12, color: "#5e5c78" }}>
            {trip.startDate} → {trip.endDate}
          </span>
          <span style={{
            background: `${cover.accent}18`,
            color: cover.accent,
            fontSize: 12, fontWeight: 600,
            padding: "4px 10px", borderRadius: 20,
            border: `1px solid ${cover.accent}25`
          }}>
            ₹{Number(trip.budget).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}