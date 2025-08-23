"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI, authAPI } from "../utils/api"
import { 
  X, 
  Package, 
  Shirt, 
  Copy, 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Hash,
  Clock,
  Utensils,
  Heart,
  Sparkles,
  Gift,
  Users,
  ChevronDown,
  Search
} from "lucide-react"

// Lightweight enhanced dropdown used within this form only
function EnhancedSelect({ options, value, onChange, placeholder = "Select...", searchable = false }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const normalized = (options || []).map((opt) =>
    typeof opt === "string" || typeof opt === "number"
      ? { value: String(opt), label: String(opt) }
      : opt,
  )

  const filtered = !searchable || !query
    ? normalized
    : normalized.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))

  const selected = normalized.find((o) => String(o.value) === String(value))

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-left flex items-center justify-between ${open ? "ring-2 ring-blue-500 border-transparent" : ""}`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {searchable && (
            <div className="p-2 border-b bg-white sticky top-0">
              <div className="flex items-center space-x-2 px-2 py-2 rounded-lg border">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
          )}
          <ul className="max-h-56 overflow-auto py-2">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">No results</li>
            )}
            {filtered.map((opt) => {
              const isSelected = String(opt.value) === String(value)
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                      setQuery("")
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 ${
                      isSelected ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function DonationForm({ onClose }) {
  const { currentUser } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quantity: "",
    description: "",
    address: "",
    phone: "+91 ",
    preferredTime: "",
    urgency: "normal",
  })
  const [securityCode, setSecurityCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [addressFetched, setAddressFetched] = useState(false)
  const [originalAddress, setOriginalAddress] = useState("")

  // Predefined item names based on type
  const foodItems = [
    "Rice & Grains", "Fresh Vegetables", "Canned Food", "Bread & Bakery",
    "Dairy Products", "Fruits", "Cooking Oil", "Pulses & Lentils",
    "Snacks & Biscuits", "Baby Food", "Ready-to-Eat Meals", "Beverages"
  ]

  const clothingItems = [
    "Winter Jackets", "T-Shirts & Shirts", "Pants & Jeans", "Dresses & Skirts",
    "Sweaters & Hoodies", "Shoes & Sandals", "Baby Clothes", "School Uniforms",
    "Formal Wear", "Sports Wear", "Traditional Clothes", "Accessories"
  ]

  const quantityOptions = Array.from({ length: 20 }, (_, i) => i + 1)

  const timeSlots = [
    "09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM"
  ]

  useEffect(() => {
    // Auto-fetch address when component mounts, but only if user is logged in
    if (currentUser) {
      fetchUserAddress()
    }
  }, [currentUser])

  const fetchUserAddress = async () => {
    if (!currentUser) {
      console.log("User not logged in, skipping address fetch")
      return
    }

    setIsAddressLoading(true)
    try {
      // Fetch the latest user profile which includes address and phone
      const userProfile = await authAPI.getProfile()
      
      if (userProfile?.address) {
        setFormData(prev => ({ 
          ...prev, 
          address: userProfile.address,
          phone: userProfile.phone || "+91 "
        }))
        setOriginalAddress(userProfile.address)
        setAddressFetched(true)
      } else {
        // If no saved address, show empty field
        setFormData(prev => ({ ...prev, address: "" }))
        setAddressFetched(false)
      }
      setIsAddressLoading(false)
    } catch (error) {
      console.error("Error fetching address:", error)
      setIsAddressLoading(false)
      setAddressFetched(false)
      
      // Show user-friendly error message
      if (error.message.includes("401") || error.message.includes("Access token")) {
        console.log("Authentication required for address fetching")
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (step === 1 && formData.type) {
      setStep(2)
    } else if (step === 2 && formData.name && formData.quantity) {
      setStep(3)
    } else if (step === 3 && formData.address && formData.phone.length >= 15) {
      handleSubmit()
    }
  }

  const generateSecurityCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleSubmit = async () => {
    if (!currentUser) {
      alert("Please login to make a donation")
      return
    }

    // Debug logging
    console.log("Submitting donation with data:", formData)
    console.log("Current user:", currentUser)

    setLoading(true)
    const code = generateSecurityCode()
    setSecurityCode(code)

    try {
      const donationData = {
        ...formData,
        quantity: Number.parseInt(formData.quantity),
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        securityCode: code,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      console.log("Donation data to submit:", donationData)
      await donationsAPI.create(donationData)
      setStep(4)
    } catch (error) {
      console.error("Error submitting donation:", error)
      alert("Failed to submit donation. Please try again.")
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(securityCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveUserAddress = async () => {
    if (!currentUser) {
      alert("Please login to save your address")
      return
    }

    try {
      const addressData = {
        address: formData.address,
        phone: formData.phone
      }
      
      const updatedUser = await authAPI.saveAddress(addressData)
      console.log("Address saved successfully:", updatedUser)
      
      // Update the current user context with new address
      if (updatedUser) {
        setOriginalAddress(updatedUser.address)
        setAddressFetched(true)
      }
    } catch (error) {
      console.error("Error saving address:", error)
      if (error.message.includes("401") || error.message.includes("Access token")) {
        alert("Please login to save your address")
      } else {
        alert("Failed to save address. Please try again.")
      }
    }
  }

  // Celebration confetti on final Done click
  const launchConfetti = (burstX, burstY, particleCount = 160) => {
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.inset = "0"
    canvas.style.width = "100vw"
    canvas.style.height = "100vh"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "999999"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    const DPR = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * DPR
      canvas.height = window.innerHeight * DPR
    }
    resize()

    const colors = ["#22c55e", "#14b8a6", "#3b82f6", "#a78bfa", "#f97316", "#eab308"]
    const particles = []
    const origin = { x: burstX * DPR, y: burstY * DPR }

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 6 + Math.random() * 6
      particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed * DPR,
        vy: Math.sin(angle) * speed * DPR,
        size: 2 + Math.random() * 3,
        color: colors[i % colors.length],
        life: 60 + Math.random() * 40,
      })
    }

    let frameId
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.vy += 0.15 * DPR // gravity
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.life -= 1
        ctx.globalAlpha = Math.max(p.life / 80, 0)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * DPR, 0, Math.PI * 2)
        ctx.fill()
      })
      if (particles.some((p) => p.life > 0)) {
        frameId = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frameId)
        canvas.remove()
      }
    }
    frameId = requestAnimationFrame(tick)
  }

  const celebrate = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    // Three bursts across the screen
    launchConfetti(w * 0.25, h * 0.4, 140)
    setTimeout(() => launchConfetti(w * 0.5, h * 0.35, 180), 180)
    setTimeout(() => launchConfetti(w * 0.75, h * 0.4, 140), 360)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Make a Donation
                </h2>
                <p className="text-gray-600 text-sm">Help others with your generosity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 p-3 hover:bg-gray-100 rounded-2xl hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      i <= step 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110" 
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < step ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{i}</span>
                    )}
                  </div>
                  {i < 4 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-500 ${
                      i < step ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Donation Type */}
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">What would you like to donate?</h3>
                <p className="text-gray-600">Choose the type of donation you want to make</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Food Option */}
                <button
                  onClick={() => setFormData({ ...formData, type: "food" })}
                  className={`group relative p-8 border-2 rounded-3xl flex flex-col items-center space-y-6 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                    formData.type === "food"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-2xl scale-105"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <Sparkles className={`h-5 w-5 transition-all duration-300 ${
                      formData.type === "food" ? "text-blue-500 animate-pulse" : "text-gray-300"
                    }`} />
                  </div>
                  
                  <div
                    className={`p-6 rounded-3xl transition-all duration-500 ${
                      formData.type === "food" 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg" 
                        : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200"
                    }`}
                  >
                    <Utensils className={`h-12 w-12 transition-all duration-500 ${
                      formData.type === "food" ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  
                  <div className="text-center">
                    <span className="font-bold text-xl mb-2 block">Food Items</span>
                    <span className="text-sm text-gray-500">Rice, vegetables, cooked meals, etc.</span>
                  </div>
                  
                  {formData.type === "food" && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold animate-bounce">
                        Selected
                      </div>
                    </div>
                  )}
                </button>

                {/* Clothing Option */}
                <button
                  onClick={() => setFormData({ ...formData, type: "clothes" })}
                  className={`group relative p-8 border-2 rounded-3xl flex flex-col items-center space-y-6 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                    formData.type === "clothes"
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 shadow-2xl scale-105"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <Heart className={`h-5 w-5 transition-all duration-300 ${
                      formData.type === "clothes" ? "text-purple-500 animate-pulse" : "text-gray-300"
                    }`} />
                  </div>
                  
                  <div
                    className={`p-6 rounded-3xl transition-all duration-500 ${
                      formData.type === "clothes" 
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg" 
                        : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-purple-200"
                    }`}
                  >
                    <Shirt className={`h-12 w-12 transition-all duration-500 ${
                      formData.type === "clothes" ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  
                  <div className="text-center">
                    <span className="font-bold text-xl mb-2 block">Clothing</span>
                    <span className="text-sm text-gray-500">Shirts, pants, winter wear, etc.</span>
                  </div>
                  
                  {formData.type === "clothes" && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold animate-bounce">
                        Selected
                      </div>
                    </div>
                  )}
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.type}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-lg"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 2: Item Details */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your donation</h3>
                <p className="text-gray-600">Provide details about what you're donating</p>
              </div>

              <div className="space-y-6">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {formData.type === "food" ? "🍽️ Food Item" : "👕 Clothing Item"} *
                  </label>
                  <EnhancedSelect
                    options={(formData.type === "food" ? foodItems : clothingItems)}
                    value={formData.name}
                    onChange={(val) => setFormData({ ...formData, name: val })}
                    placeholder="Select an item..."
                    searchable
                  />
                </div>

                {/* Quantity and Urgency */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Quantity *</label>
                    <EnhancedSelect
                      options={quantityOptions.map((n) => ({ value: n, label: String(n) }))}
                      value={formData.quantity}
                      onChange={(val) => setFormData({ ...formData, quantity: val })}
                      placeholder="Select quantity..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Urgency Level</label>
                    <EnhancedSelect
                      options={[
                        { value: "normal", label: "Normal" },
                        { value: "urgent", label: "Urgent" },
                        { value: "very-urgent", label: "Very Urgent" },
                      ]}
                      value={formData.urgency}
                      onChange={(val) => setFormData({ ...formData, urgency: val })}
                      placeholder="Select urgency..."
                    />
                  </div>
                </div>

                {/* Description - Optional */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    rows="3"
                    placeholder="Describe the condition, expiry date (for food), size (for clothes), etc."
                  />
                </div>

                {/* Preferred Pickup Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Preferred Pickup Time
                  </label>
                  <EnhancedSelect
                    options={timeSlots}
                    value={formData.preferredTime}
                    onChange={(val) => setFormData({ ...formData, preferredTime: val })}
                    placeholder="Select preferred time..."
                    searchable
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.quantity}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  Continue to Pickup
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Information */}
          {step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pickup Information</h3>
                <p className="text-gray-600">Where should we collect your donation?</p>
              </div>

              {/* User Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-lg">{currentUser?.name}</p>
                    <p className="text-blue-700">{currentUser?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Pickup Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Pickup Address *
                  </label>
                  
                  {/* Address Status Indicator */}
                  {addressFetched && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-semibold">
                        ✅ Address auto-filled from your profile
                      </span>
                    </div>
                  )}
                  
                  <div className="relative">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        addressFetched && formData.address !== originalAddress 
                          ? "border-orange-300 bg-orange-50" 
                          : addressFetched 
                          ? "border-green-300 bg-green-50" 
                          : "border-gray-200"
                      }`}
                      rows="3"
                      placeholder={isAddressLoading ? "Loading your address..." : "Enter your complete address with landmarks"}
                      required
                    />
                    
                    {/* Loading Indicator */}
                    {isAddressLoading && (
                      <div className="absolute top-4 right-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    
                    {/* Edit Indicator */}
                    {addressFetched && formData.address !== originalAddress && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-orange-500 text-white p-1 rounded-full">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={fetchUserAddress}
                      disabled={isAddressLoading || !currentUser}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddressLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span>Loading...</span>
                        </>
                      ) : !currentUser ? (
                        <>
                          <span>🔒</span>
                          <span>Login Required</span>
                        </>
                      ) : (
                        <>
                          <span>🔄</span>
                          <span>Load Saved Address</span>
                        </>
                      )}
                    </button>
                    
                    {formData.address && (
                      <button
                        onClick={saveUserAddress}
                        disabled={!currentUser}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {!currentUser ? (
                          <>
                            <span>🔒</span>
                            <span>Login to Save</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>Save This Address</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {addressFetched && formData.address !== originalAddress && (
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, address: originalAddress }))
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-all duration-300 text-sm font-semibold"
                      >
                        <span>↩️</span>
                        <span>Restore Original</span>
                      </button>
                    )}
                    
                    {addressFetched && (
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, address: "" }))
                          setAddressFetched(false)
                          setOriginalAddress("")
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm font-semibold"
                      >
                        <span>✏️</span>
                        <span>Clear & Edit Manually</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Help Text */}
                  <p className="text-sm text-gray-500 mt-2">
                    {addressFetched 
                      ? "You can edit the loaded address if needed. Changes are highlighted in orange. Save your address for future donations."
                      : "Enter your complete address with landmarks for easy pickup location. You can save this address for future use."
                    }
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="+91 98765 43210"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: +91 followed by your 10-digit number (e.g., +91 98765 43210)
                  </p>
                  {formData.phone.length > 0 && formData.phone.length < 15 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Please enter a complete phone number (should be at least 15 characters including +91)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Back
                </button>
                                  <button
                    onClick={handleNext}
                    disabled={!formData.address || formData.phone.length < 15 || loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                  >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Donation"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-8 animate-fadeIn">
              {/* Success Animation */}
              <div className="relative">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Donation Submitted Successfully!
                </h3>
                <p className="text-gray-600 text-lg mb-6">Your donation has been received and will be processed soon.</p>
              </div>

              {/* Security Code */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center justify-center text-lg">
                  <Hash className="h-6 w-6 mr-3 text-blue-600" />
                  Security Code
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  <code className="bg-white px-6 py-4 rounded-2xl border-2 border-dashed border-blue-300 text-2xl font-mono font-bold text-blue-600 shadow-lg">
                    {securityCode}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-4 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-2xl transition-all duration-300 transform hover:scale-110"
                  >
                    {copied ? <CheckCircle className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                  </button>
                </div>
                <p className="text-sm text-blue-700 mt-4 font-semibold">
                  {copied ? "✅ Copied to clipboard!" : "💾 Save this code. You'll need it for pickup verification."}
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl border-2 border-green-200">
                <h4 className="font-bold text-green-900 mb-6 flex items-center justify-center text-lg">
                  <Truck className="h-6 w-6 mr-3" />
                  What's Next?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-800 font-semibold">Our team will review your donation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-800 font-semibold">A delivery person will be assigned</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-800 font-semibold">You'll receive pickup notifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-800 font-semibold">Track your donation's journey</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  celebrate()
                  setTimeout(() => onClose && onClose(), 600)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
