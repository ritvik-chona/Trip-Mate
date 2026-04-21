import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUserTrips } from "../services/tripService"
import Navbar from "../components/Navbar"
import TripCard from "../components/TripCard"

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrips() {
      const data = await getUserTrips(currentUser.uid)
      setTrips(data)
      setLoading(false)
    }
    fetchTrips()
  }, [currentUser])

  function handleDelete(id) {
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0f0e17]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-xs font-semibold text-indigo-500 mb-2 uppercase tracking-wider">
              My travels
            </p>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#f0eeff] leading-tight">
              Where to next?
            </h2>
          </div>

          <button
            onClick={() => navigate("/trip/new")}
            className="self-start md:self-auto flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:opacity-90 hover:-translate-y-[1px] transition"
          >
            <span className="text-lg">+</span> New Trip
          </button>
        </div>

        {/* Stats */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-10">
            {[
              { label: "Trips planned", value: trips.length, emoji: "🗺️" },
              { label: "Destinations", value: new Set(trips.map(t => t.destination)).size, emoji: "📍" },
              { label: "Total budget", value: `₹${trips.reduce((s, t) => s + Number(t.budget), 0).toLocaleString()}`, emoji: "💰" }
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-[#1a1828] border border-white/10 rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg">
                  {stat.emoji}
                </div>
                <div>
                  <p className="text-xs text-[#5e5c78]">{stat.label}</p>
                  <p className="text-lg md:text-xl font-bold text-[#f0eeff]">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trips */}
        {loading ? (
          <div className="text-center py-20 text-[#3d3b55]">
            Loading your trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 md:py-20 px-6 bg-[#1a1828] rounded-xl border border-dashed border-white/10">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg md:text-xl font-bold text-[#f0eeff] mb-2">
              No trips yet
            </h3>
            <p className="text-sm text-[#5e5c78] mb-6">
              Start planning your first adventure
            </p>
            <button
              onClick={() => navigate("/trip/new")}
              className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Plan a trip ✈️
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}