import { useEffect, useState, lazy, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../services/firebase"
import { getItineraryItems } from "../services/itineraryService"
import { getExpenses } from "../services/expenseService"
import Navbar from "../components/Navbar"

const ItineraryTab = lazy(() => import("../components/ItineraryTab"))
const BudgetTab = lazy(() => import("../components/BudgetTab"))

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [items, setItems] = useState([])
  const [expenses, setExpenses] = useState([])
  const [activeTab, setActiveTab] = useState("itinerary")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const tripSnap = await getDoc(doc(db, "trips", id))
      if (!tripSnap.exists()) { navigate("/dashboard"); return }
      setTrip({ id: tripSnap.id, ...tripSnap.data() })
      const [itineraryData, expensesData] = await Promise.all([
        getItineraryItems(id),
        getExpenses(id)
      ])
      setItems(itineraryData)
      setExpenses(expensesData)
      setLoading(false)
    }
    fetchAll()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <Navbar />
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center",
        height: 400, color: "#3d3b55", fontSize: 14
      }}>
        Loading trip...
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <Navbar />
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px" }}>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none", border: "none",
            fontSize: 13, color: "#5e5c78",
            cursor: "pointer", display: "flex",
            alignItems: "center", gap: 6,
            marginBottom: 32, padding: 0,
            transition: "color 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#9b98b8"}
          onMouseLeave={e => e.currentTarget.style.color = "#5e5c78"}
        >
          ← Back to dashboard
        </button>

        {/* Trip header */}
        <div style={{
          background: "#1a1828",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "28px 32px",
          marginBottom: 20
        }}>
          <p style={{
            fontSize: 12, color: "#5e5c78",
            marginBottom: 8, fontWeight: 500
          }}>📍 {trip.destination}</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700,
            color: "#f0eeff", marginBottom: 20
          }}>{trip.name}</h2>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Dates", value: `${trip.startDate} → ${trip.endDate}` },
              { label: "Budget", value: `₹${Number(trip.budget).toLocaleString()}` },
              { label: "Activities", value: `${items.length} planned` },
            ].map(info => (
              <div key={info.label} style={{
                background: "#13121f",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                padding: "10px 16px"
              }}>
                <p style={{ fontSize: 11, color: "#3d3b55", marginBottom: 3, fontWeight: 500 }}>
                  {info.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#f0eeff" }}>{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4,
          background: "#1a1828",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 22,
          width: "fit-content"
        }}>
          {[
            { key: "itinerary", label: "🗓️  Itinerary" },
            { key: "budget", label: "💰  Budget" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "transparent",
                color: activeTab === tab.key ? "#ffffff" : "#5e5c78"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <Suspense fallback={
          <div style={{ textAlign: "center", padding: 60, color: "#3d3b55" }}>Loading...</div>
        }>
          {activeTab === "itinerary"
            ? <ItineraryTab tripId={id} items={items} setItems={setItems} />
            : <BudgetTab tripId={id} budget={trip.budget} expenses={expenses} setExpenses={setExpenses} />
          }
        </Suspense>

      </div>
    </div>
  )
}