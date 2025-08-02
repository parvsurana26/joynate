"use client"

import React, { createContext, useContext, useState } from "react"

const DeliveryAuthContext = createContext()

export function useDeliveryAuth() {
  const context = useContext(DeliveryAuthContext)
  if (!context) {
    throw new Error("useDeliveryAuth must be used within a DeliveryAuthProvider")
  }
  return context
}

export function DeliveryAuthProvider({ children }) {
  const [deliveryUser, setDeliveryUser] = useState(null)

  const deliveryLogin = (username, password) => {
    // Demo credentials
    if (username === "delivery" && password === "delivery123") {
      const delivery = { username: "delivery", role: "delivery" }
      setDeliveryUser(delivery)
      localStorage.setItem("deliveryUser", JSON.stringify(delivery))
      return Promise.resolve(delivery)
    }
    return Promise.reject(new Error("Invalid credentials"))
  }

  const deliveryLogout = () => {
    setDeliveryUser(null)
    localStorage.removeItem("deliveryUser")
  }

  // Check if delivery user is logged in on mount
  React.useEffect(() => {
    const storedDelivery = localStorage.getItem("deliveryUser")
    if (storedDelivery) {
      try {
        setDeliveryUser(JSON.parse(storedDelivery))
      } catch (error) {
        console.error("Failed to parse stored delivery user:", error)
        localStorage.removeItem("deliveryUser")
      }
    }
  }, [])

  const value = {
    deliveryUser,
    deliveryLogin,
    deliveryLogout,
  }

  return <DeliveryAuthContext.Provider value={value}>{children}</DeliveryAuthContext.Provider>
}
