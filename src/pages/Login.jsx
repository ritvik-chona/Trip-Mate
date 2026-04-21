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
    <>
      <style>{`
        .login-card {
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 36px 24px;
            max-width: 100%;
            border-radius: 16px !important;
          }
          .login-title { font-size: 24px !important; }
        }
      `}</style>

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
        <div style={{
          position: "absolute", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          top: "-100px", right: "-100px",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          bottom: "-50px", left: "-50px",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div className="login-card" style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24,
          position: "relative", zIndex: 1
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, margin: "0 auto 14px"
            }}>✈️</div>
            <h1 className="login-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 700,
              color: "#ffffff", marginBottom: 6
            }}>TripMate</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              Plan smarter. Travel better.
            </p>
          </div>

          <h2 style={{
            fontSize: 15, fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 20
          }}>
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#fca5a5",
              fontSize: 13, padding: "10px 14px",
              borderRadius: 10, marginBottom: 16
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Email address
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "11px 14px",
                  fontSize: 14, color: "#ffffff", outline: "none",
                  transition: "border-color 0.15s"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "11px 44px 11px 14px",
                    fontSize: 14, color: "#ffffff", outline: "none",
                    transition: "border-color 0.15s"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: 15,
                    color: "rgba(255,255,255,0.3)"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 6,
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", borderRadius: 10,
                padding: "13px", fontSize: 14, fontWeight: 600,
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s"
              }}
            >
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 24 }}>
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
    </>
  )
}