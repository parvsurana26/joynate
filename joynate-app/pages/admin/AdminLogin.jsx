"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../contexts/AdminAuthContext"
import { Shield, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAdminAuth()
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
      await adminLogin(credentials.username, credentials.password)
      navigate("/admin")
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel Login</h2>
            <p className="text-sm text-gray-500">Secure administrative access</p>
          </div>

          {/* Demo credentials card */}
         

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Admin Email"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Admin Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Accessing..." : "Access Admin Panel"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-700">← Back to main site</a>
          </div>
        </div>
      </div>
    </div>
  )
}
