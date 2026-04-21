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
    <>
      <style>{`
        .dash-container { padding: 48px 32px; }
        .dash-header { flex-direction: row; align-items: flex-end; }
        .dash-title { font-size: 36px; }
        .stats-grid { grid-template-columns: repeat(3, 1fr); }
        .trips-grid { grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); }
        @media (max-width: 768px) {
          .dash-container { padding: 32px 20px; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .trips-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        }
        @media (max-width: 600px) {
          .dash-container { padding: 24px 16px; }
          .dash-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .dash-title { font-size: 28px; }
          .stats-grid { grid-template-columns: 1fr; }
          .trips-grid { grid-template-columns: 1fr; }
          .new-trip-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
        <Navbar />

        <div className="dash-container" style={{ maxWidth: 1080, margin: "0 auto" }}>

          <div className="dash-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#6366f1",
                marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase"
              }}>My travels</p>
              <h2 className="dash-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700, color: "#f0eeff", lineHeight: 1.15
              }}>Where to next?</h2>
            </div>
            <button
              className="new-trip-btn"
              onClick={() => navigate("/trip/new")}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", borderRadius: 11,
                padding: "11px 22px",
                fontSize: 14, fontWeight: 600, color: "#fff",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                transition: "opacity 0.15s, transform 0.15s",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = "0.9"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = "1"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <span style={{ fontSize: 17 }}>+</span> New trip
            </button>
          </div>

          {trips.length > 0 && (
            <div className="stats-grid" style={{ display: "grid", gap: 14, marginBottom: 36 }}>
              {[
                { label: "Trips planned", value: trips.length, emoji: "🗺️" },
                { label: "Destinations", value: new Set(trips.map(t => t.destination)).size, emoji: "📍" },
                { label: "Total budget", value: `₹${trips.reduce((s, t) => s + Number(t.budget), 0).toLocaleString()}`, emoji: "💰" }
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "#1a1828",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 14
                }}>
                  <div style={{
                    width: 40, height: 40,
                    background: "rgba(99,102,241,0.1)",
                    borderRadius: 11,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18,
                    flexShrink: 0
                  }}>{stat.emoji}</div>
                  <div>
                    <p style={{ fontSize: 12, color: "#5e5c78", marginBottom: 3 }}>{stat.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: "#f0eeff" }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#3d3b55" }}>
              Loading your trips...
            </div>
          ) : trips.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 24px",
              background: "#1a1828", borderRadius: 20,
              border: "1px dashed rgba(255,255,255,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f0eeff", marginBottom: 8 }}>
                No trips yet
              </h3>
              <p style={{ color: "#5e5c78", fontSize: 14, marginBottom: 28 }}>
                Start planning your first adventure
              </p>
              <button
                onClick={() => navigate("/trip/new")}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", borderRadius: 10,
                  padding: "11px 26px",
                  fontSize: 14, fontWeight: 600,
                  color: "#fff", cursor: "pointer"
                }}
              >
                Plan a trip ✈️
              </button>
            </div>
          ) : (
            <div className="trips-grid" style={{ display: "grid", gap: 18 }}>
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}