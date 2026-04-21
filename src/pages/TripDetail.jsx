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
    <div className="min-h-screen bg-[#0f0e17]">
      <Navbar />
      <div className="flex items-center justify-center h-[300px] text-[#3d3b55] text-sm">
        Loading trip...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f0e17]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs md:text-sm text-[#5e5c78] hover:text-[#9b98b8] flex items-center gap-2 mb-6 md:mb-8"
        >
          ← Back to dashboard
        </button>

        {/* Trip Header */}
        <div className="bg-[#1a1828] border border-white/10 rounded-xl p-5 md:p-8 mb-6">

          <p className="text-xs text-[#5e5c78] mb-2">
            📍 {trip.destination}
          </p>

          <h2 className="font-serif text-xl md:text-3xl font-bold text-[#f0eeff] mb-4 md:mb-6">
            {trip.name}
          </h2>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {[
              { label: "Dates", value: `${trip.startDate} → ${trip.endDate}` },
              { label: "Budget", value: `₹${Number(trip.budget).toLocaleString()}` },
              { label: "Activities", value: `${items.length} planned` },
            ].map(info => (
              <div
                key={info.label}
                className="bg-[#13121f] border border-white/10 rounded-lg px-3 md:px-4 py-2"
              >
                <p className="text-[10px] md:text-xs text-[#3d3b55]">
                  {info.label}
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#f0eeff]">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#1a1828] border border-white/10 rounded-lg p-1 mb-5 w-fit">
          {[
            { key: "itinerary", label: "🗓️ Itinerary" },
            { key: "budget", label: "💰 Budget" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 md:px-5 py-2 text-xs md:text-sm font-semibold rounded-md transition ${
                activeTab === tab.key
                  ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                  : "text-[#5e5c78]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <Suspense
          fallback={
            <div className="text-center py-10 text-[#3d3b55]">
              Loading...
            </div>
          }
        >
          {activeTab === "itinerary" ? (
            <ItineraryTab tripId={id} items={items} setItems={setItems} />
          ) : (
            <BudgetTab
              tripId={id}
              budget={trip.budget}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}