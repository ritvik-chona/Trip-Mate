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

const inputStyle = {
  width: "100%",
  background: "#13121f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  color: "#f0eeff",
  outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "Inter, sans-serif"
}

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
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <Navbar />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 24px" }}>

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

        <div style={{
          background: "#1a1828",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "28px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.07)"
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600,
              color: "#6366f1", marginBottom: 6,
              letterSpacing: "0.1em", textTransform: "uppercase"
            }}>New adventure</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, fontWeight: 700,
              color: "#f0eeff"
            }}>Plan your trip ✈️</h2>
          </div>

          <form onSubmit={handleSubmit} style={{
            padding: "28px 32px",
            display: "flex", flexDirection: "column", gap: 20
          }}>
            {fields.map(field => (
              <div key={field.name}>
                <label style={{
                  display: "block", fontSize: 11,
                  fontWeight: 600, color: "#5e5c78",
                  marginBottom: 7, textTransform: "uppercase",
                  letterSpacing: "0.07em"
                }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  style={{ ...inputStyle }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: 11,
                padding: "13px",
                fontSize: 14, fontWeight: 600,
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s"
              }}
            >
              {loading ? "Creating..." : "Create trip 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}