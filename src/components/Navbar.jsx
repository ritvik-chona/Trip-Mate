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
    <nav className="bg-[#13121f] border-b border-white/10 px-4 md:px-8 h-14 md:h-[60px] flex items-center justify-between sticky top-0 z-50">
      
      {/* Left Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br from-indigo-500 to-purple-500">
          ✈️
        </div>
        <span className="font-bold text-base md:text-lg text-[#f0eeff] font-serif">
          TripMate
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Avatar */}
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
          {currentUser?.email?.[0]?.toUpperCase()}
        </div>

        {/* Email (hidden on small screens) */}
        <span className="hidden sm:block text-xs md:text-sm text-[#5e5c78] max-w-[120px] truncate">
          {currentUser?.email}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs md:text-sm px-2 md:px-4 py-1 border border-white/10 rounded-md text-[#9b98b8] hover:text-red-400 hover:border-red-400 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}