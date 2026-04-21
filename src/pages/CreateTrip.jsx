import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createTrip } from "../services/tripService"
import Navbar from "../components/Navbar"

const fields = [
  { label: "Trip name", name: "name", type: "text", placeholder: "e.g. Goa Getaway" },
  { label: "Destination", name: "destination", type: "text", placeholder: "e.g. Goa, India" },
  { label: "Start date", name: "startDate", type: "date" },
  { label: "End date", name: "endDate", type: "date" },
  { label: "Total budget (₹)", name: "budget", type: "number", placeholder: "e.g. 15000" },
]

export default function CreateTrip() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", destination: "", startDate: "", endDate: "", budget: ""
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await createTrip(currentUser.uid, form)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#0f0e17]">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs md:text-sm text-[#5e5c78] hover:text-[#9b98b8] flex items-center gap-2 mb-6 md:mb-8"
        >
          ← Back to dashboard
        </button>

        <div className="bg-[#1a1828] border border-white/10 rounded-xl overflow-hidden">

          {/* Header */}
          <div className="px-5 md:px-8 py-5 md:py-7 border-b border-white/10">
            <p className="text-[10px] md:text-xs font-semibold text-indigo-500 mb-1 uppercase tracking-wider">
              New adventure
            </p>
            <h2 className="font-serif text-lg md:text-2xl font-bold text-[#f0eeff]">
              Plan your trip ✈️
            </h2>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-5 md:px-8 py-5 md:py-7 flex flex-col gap-4 md:gap-5"
          >
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-[10px] md:text-xs font-semibold text-[#5e5c78] mb-1 uppercase tracking-wide">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  className="w-full bg-[#13121f] border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-[#f0eeff] focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-2.5 md:py-3 rounded-lg text-sm font-semibold text-white transition ${
                loading
                  ? "bg-indigo-500/40 cursor-not-allowed"
                  : "bg-gradient-to-br from-indigo-500 to-purple-500 hover:opacity-90"
              }`}
            >
              {loading ? "Creating..." : "Create trip 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}