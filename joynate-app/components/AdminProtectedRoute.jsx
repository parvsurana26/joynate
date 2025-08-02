import { Navigate } from "react-router-dom"
import { useAdminAuth } from "../contexts/AdminAuthContext"

export default function AdminProtectedRoute({ children }) {
  const { adminUser } = useAdminAuth()

  return adminUser ? children : <Navigate to="/admin/login" replace />
}
