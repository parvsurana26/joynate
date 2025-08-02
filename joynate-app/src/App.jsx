import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../contexts/AuthContext"
import { AdminAuthProvider } from "../contexts/AdminAuthContext"
import { DeliveryAuthProvider } from "../contexts/DeliveryAuthContext"
import Navbar from "../components/Navbar"
import LandingPage from "../pages/LandingPage"
import LoginPage from "../pages/auth/LoginPage"
import SignUpPage from "../pages/auth/SignUpPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import DashboardPage from "../pages/DashboardPage"
import AdminLogin from "../pages/admin/AdminLogin"
import AdminDashboard from "../pages/admin/AdminDashboard"
import DeliveryLogin from "../pages/delivery/DeliveryLogin"
import DeliveryDashboard from "../pages/delivery/DeliveryDashboard"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminProtectedRoute from "../components/AdminProtectedRoute"
import DeliveryProtectedRoute from "../components/DeliveryProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <DeliveryAuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes with navbar */}
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <LandingPage />
                    </>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <>
                      <Navbar />
                      <LoginPage />
                    </>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <>
                      <Navbar />
                      <SignUpPage />
                    </>
                  }
                />
                <Route
                  path="/reset"
                  element={
                    <>
                      <Navbar />
                      <ResetPasswordPage />
                    </>
                  }
                />

                {/* Protected user routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Delivery routes */}
                <Route path="/delivery/login" element={<DeliveryLogin />} />
                <Route
                  path="/delivery"
                  element={
                    <DeliveryProtectedRoute>
                      <DeliveryDashboard />
                    </DeliveryProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </DeliveryAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
