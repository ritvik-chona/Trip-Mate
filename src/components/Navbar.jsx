import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <>
      <style>{`
        .navbar { padding: 0 32px; }
        .navbar-email { display: block; }
        @media (max-width: 600px) {
          .navbar { padding: 0 16px; }
          .navbar-email { display: none; }
        }
      `}</style>

      <nav className="navbar" style={{
        background: "#13121f",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div
          onClick={() => navigate("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 9,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 15
          }}>✈️</div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: 19,
            color: "#f0eeff"
          }}>TripMate</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#6366f1"
          }}>
            {currentUser?.email?.[0]?.toUpperCase()}
          </div>
          <span className="navbar-email" style={{ fontSize: 13, color: "#5e5c78" }}>
            {currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "5px 14px",
              fontSize: 13,
              fontWeight: 500,
              color: "#9b98b8",
              cursor: "pointer",
              transition: "all 0.15s"
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = "rgba(248,113,113,0.4)"
              e.target.style.color = "#f87171"
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)"
              e.target.style.color = "#9b98b8"
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  )
}