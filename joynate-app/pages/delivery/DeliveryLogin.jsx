"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeliveryAuth } from "../../contexts/DeliveryAuthContext"
import { Truck, AlertCircle } from "lucide-react"

export default function DeliveryLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { deliveryLogin } = useDeliveryAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await deliveryLogin(credentials.username, credentials.password)
      navigate("/delivery")
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-900 to-black">
      <div className="bg-white/95 shadow-2xl rounded-2xl p-10 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 shadow-md">
            <Truck className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Delivery Login</h2>
          <p className="mt-1 text-sm text-gray-500">Access the delivery dashboard</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-md p-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="ml-2 text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Username (demo: delivery)"
              value={credentials.username}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Password (demo: delivery123)"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Access Delivery Panel"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Demo credentials: <span className="font-semibold">delivery / delivery123</span>
          </p>
        </form>
      </div>
    </div>
  )
}
