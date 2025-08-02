"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import { X, Package, Shirt, Copy, CheckCircle, Truck, User, Phone, MapPin, Hash } from "lucide-react"

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
    phone: "",
    preferredTime: "",
    urgency: "normal",
  })
  const [securityCode, setSecurityCode] = useState("")
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (step === 1 && formData.type) {
      setStep(2)
    } else if (step === 2 && formData.name && formData.quantity && formData.description) {
      setStep(3)
    } else if (step === 3 && formData.address && formData.phone) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h2>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-center">What would you like to donate?</h3>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setFormData({ ...formData, type: "food" })}
                    className={`group p-6 border-2 rounded-xl flex flex-col items-center space-y-4 transition-all duration-300 hover:shadow-lg ${
                      formData.type === "food"
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-full transition-all duration-300 ${
                        formData.type === "food" ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-100"
                      }`}
                    >
                      <Package className="h-8 w-8" />
                    </div>
                    <span className="font-semibold text-lg">Food Items</span>
                    <span className="text-sm text-gray-500 text-center">Rice, vegetables, cooked meals, etc.</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: "clothes" })}
                    className={`group p-6 border-2 rounded-xl flex flex-col items-center space-y-4 transition-all duration-300 hover:shadow-lg ${
                      formData.type === "clothes"
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-full transition-all duration-300 ${
                        formData.type === "clothes" ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-100"
                      }`}
                    >
                      <Shirt className="h-8 w-8" />
                    </div>
                    <span className="font-semibold text-lg">Clothing</span>
                    <span className="text-sm text-gray-500 text-center">Shirts, pants, winter wear, etc.</span>
                  </button>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!formData.type}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-center">Tell us about your donation</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Rice bags, Winter jackets"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="5"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="very-urgent">Very Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    rows="3"
                    placeholder="Describe the condition, expiry date (for food), size (for clothes), etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Pickup Time</label>
                  <input
                    type="text"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Morning 9-12 AM, Evening 5-7 PM"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.quantity || !formData.description}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-center">Pickup Information</h3>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">{currentUser?.name}</p>
                    <p className="text-sm text-blue-700">{currentUser?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Pickup Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    rows="3"
                    placeholder="Enter your complete address with landmarks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your contact number"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.address || !formData.phone || loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Donation"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8">
              <div className="animate-bounce">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Donation Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Your donation has been received and will be processed soon.</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <Hash className="h-5 w-5 mr-2" />
                  Security Code
                </h4>
                <div className="flex items-center justify-center space-x-3">
                  <code className="bg-white px-4 py-3 rounded-lg border-2 border-dashed border-blue-300 text-xl font-mono font-bold text-blue-600">
                    {securityCode}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-300"
                  >
                    {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  {copied ? "Copied to clipboard!" : "Save this code. You'll need it for pickup verification."}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center justify-center">
                  <Truck className="h-5 w-5 mr-2" />
                  What's Next?
                </h4>
                <ul className="text-sm text-green-800 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Our team will review your donation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>A delivery person will be assigned
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    You'll receive pickup notifications
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Track your donation's journey
                  </li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
