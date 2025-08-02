import { Navigate } from "react-router-dom"
import { useDeliveryAuth } from "../contexts/DeliveryAuthContext"

export default function DeliveryProtectedRoute({ children }) {
  const { deliveryUser } = useDeliveryAuth()

  return deliveryUser ? children : <Navigate to="/delivery/login" replace />
}
