import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const CreateTrip = lazy(() => import("./pages/CreateTrip"))
const TripDetail = lazy(() => import("./pages/TripDetail"))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-400">
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/trip/new" element={
              <ProtectedRoute><CreateTrip /></ProtectedRoute>
            } />
            <Route path="/trip/:id" element={
              <ProtectedRoute><TripDetail /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App