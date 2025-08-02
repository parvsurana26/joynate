"use client"

import React, { createContext, useContext, useState } from "react"

const AdminAuthContext = createContext()

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)

  const adminLogin = (username, password) => {
    // Demo credentials
    if (username === "admin" && password === "admin123") {
      const admin = { username: "admin", role: "admin" }
      setAdminUser(admin)
      localStorage.setItem("adminUser", JSON.stringify(admin))
      return Promise.resolve(admin)
    }
    return Promise.reject(new Error("Invalid credentials"))
  }

  const adminLogout = () => {
    setAdminUser(null)
    localStorage.removeItem("adminUser")
  }

  // Check if admin is logged in on mount
  React.useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser")
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin))
      } catch (error) {
        console.error("Failed to parse stored admin user:", error)
        localStorage.removeItem("adminUser")
      }
    }
  }, [])

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
