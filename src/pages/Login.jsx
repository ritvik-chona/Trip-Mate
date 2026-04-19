import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      isSignup ? await signup(email, password) : await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0e17 0%, #1a1830 50%, #0f0e17 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        top: "-100px", right: "-100px", borderRadius: "50%", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        bottom: "-50px", left: "-50px", borderRadius: "50%", pointerEvents: "none"
      }} />

      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 420,
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 16px"
          }}>✈️</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700,
            color: "#ffffff", marginBottom: 6
          }}>TripMate</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Plan smarter. Travel better.
          </p>
        </div>

        <h2 style={{
          fontSize: 16, fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
          marginBottom: 20
        }}>
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>

        {error && (
          <div style={{
            background: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#fca5a5",
            fontSize: 13, padding: "10px 14px",
            borderRadius: 10, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: 14,
                color: "#ffffff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.7)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "11px 44px 11px 14px",
                  fontSize: 14,
                  color: "#ffffff",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.7)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: 16,
                  color: "rgba(255,255,255,0.4)"
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 10,
              padding: "13px",
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              letterSpacing: "0.02em"
            }}
          >
            {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 24 }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{
              background: "none", border: "none",
              color: "#a5b4fc", fontWeight: 600,
              cursor: "pointer", fontSize: 13
            }}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  )
}