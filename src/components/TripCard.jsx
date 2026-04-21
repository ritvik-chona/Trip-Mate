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
      className="bg-[#1a1828] rounded-xl border border-white/10 overflow-hidden cursor-pointer transition hover:border-indigo-500/40 hover:-translate-y-1"
    >
      {/* Accent strip */}
      <div
        className="h-1"
        style={{ background: cover.accent }}
      />

      <div className="p-4 md:p-5">

        {/* Top section */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div
            className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: `${cover.accent}18`,
              border: `1px solid ${cover.accent}30`,
            }}
          >
            {cover.emoji}
          </div>

          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-400 text-sm md:text-base p-1 transition"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold text-[#f0eeff] truncate">
          {trip.name}
        </h3>

        {/* Destination */}
        <p className="text-xs md:text-sm text-[#5e5c78] mb-3 md:mb-4 truncate">
          📍 {trip.destination}
        </p>

        {/* Bottom section */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 md:pt-4">

          {/* Dates */}
          <span className="text-[10px] md:text-xs text-[#5e5c78]">
            {trip.startDate} → {trip.endDate}
          </span>

          {/* Budget */}
          <span
            className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-full"
            style={{
              background: `${cover.accent}18`,
              color: cover.accent,
              border: `1px solid ${cover.accent}25`,
            }}
          >
            ₹{Number(trip.budget).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}