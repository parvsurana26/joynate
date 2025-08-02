"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../utils/api"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token and get user profile
      authAPI
        .getProfile()
        .then((user) => {
          setCurrentUser(user)
        })
        .catch((error) => {
          console.error("Token verification failed:", error)
          // Token is invalid, remove it
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      localStorage.setItem("token", response.token)
      setCurrentUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      localStorage.setItem("token", response.token)
      setCurrentUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
  }

  const resetPassword = async (email) => {
    try {
      return await authAPI.forgotPassword(email)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData)
      setCurrentUser(updatedUser)
      return updatedUser
    } catch (error) {
      throw error
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
