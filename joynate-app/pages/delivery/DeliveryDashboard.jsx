"use client"

import { useState, useEffect } from "react"
import { useDeliveryAuth } from "../../contexts/DeliveryAuthContext"
import { donationsAPI } from "../../utils/api"
import {
  LogOut,
  MapPin,
  CheckCircle,
  Package,
  Phone,
  User,
  Navigation,
  Clock,
  Route,
  Car,
  Timer,
  Star,
  Hash,
} from "lucide-react"
import DeliveryMap from "../../components/DeliveryMap"

export default function DeliveryDashboard() {
  const { deliveryLogout } = useDeliveryAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [securityCode, setSecurityCode] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    fetchAssignedDonations()
    getCurrentLocation()
    const interval = setInterval(fetchAssignedDonations, 5000)
    return () => clearInterval(interval)
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to a central location if geolocation fails
          setCurrentLocation({ lat: 40.7128, lng: -74.006 }) // New York
        },
      )
    }
  }

  const fetchAssignedDonations = async () => {
    try {
      const data = await donationsAPI.getAssigned()
      // Add mock coordinates and distance/time calculations
      const enhancedData = data.map((donation) => ({
        ...donation,
        coordinates: generateCoordinates(donation.address),
        distance: calculateDistance(donation.address),
        estimatedTime: calculateTime(donation.address),
        priority: donation.urgency === "very-urgent" ? "high" : donation.urgency === "urgent" ? "medium" : "low",
      }))
      setDonations(enhancedData)
    } catch (error) {
      console.error("Error fetching donations:", error)
    }
    setLoading(false)
  }

  // Mock function to generate coordinates based on address
  const generateCoordinates = (address) => {
    const hash = address.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    return {
      lat: 40.7128 + (hash % 1000) / 10000, // NYC area
      lng: -74.006 + (hash % 1000) / 10000,
    }
  }

  // Mock distance calculation
  const calculateDistance = (address) => {
    const distances = ["0.8 km", "1.2 km", "2.1 km", "3.5 km", "1.7 km", "2.8 km"]
    return distances[Math.floor(Math.random() * distances.length)]
  }

  // Mock time calculation
  const calculateTime = (address) => {
    const times = ["5 min", "8 min", "12 min", "18 min", "10 min", "15 min"]
    return times[Math.floor(Math.random() * times.length)]
  }

  const updateDonationStatus = async (id, status, securityCode = null) => {
    try {
      await donationsAPI.update(id, { status, securityCode })
      fetchAssignedDonations()
      setSelectedDonation(null)
      setSecurityCode("")
    } catch (error) {
      console.error("Error updating donation:", error)
    }
  }

  const handlePickup = (donation) => {
    setSelectedDonation(donation)
  }

  const confirmPickup = () => {
    if (securityCode === selectedDonation.securityCode) {
      updateDonationStatus(selectedDonation.id, "picked-up", securityCode)
    } else {
      alert("Invalid security code!")
    }
  }

  const markAsDonated = (donation) => {
    if (window.confirm("Mark this donation as delivered to NGO?")) {
      updateDonationStatus(donation.id, "donated")
    }
  }

  const openNavigation = (donation) => {
    const query = encodeURIComponent(donation.address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, "_blank")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const assignedDonations = donations.filter((d) => d.status === "assigned")
  const pickedUpDonations = donations.filter((d) => d.status === "picked-up")
  const totalItemsToPickup = assignedDonations.reduce((sum, d) => sum + (d.quantity || 1), 0)
  const totalItemsReady = pickedUpDonations.reduce((sum, d) => sum + (d.quantity || 1), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
                <Car className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
                <p className="text-gray-600">Manage your pickup and delivery routes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>{showMap ? "Hide Map" : "Show Map"}</span>
              </button>
              <button
                onClick={deliveryLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Pickups</p>
                <p className="text-3xl font-bold text-gray-900">{assignedDonations.length}</p>
                <p className="text-xs text-blue-600 font-medium">{totalItemsToPickup} items to collect</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready to Donate</p>
                <p className="text-3xl font-bold text-gray-900">{pickedUpDonations.length}</p>
                <p className="text-xs text-green-600 font-medium">{totalItemsReady} items ready</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Route className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignedDonations.reduce((total, d) => total + Number.parseFloat(d.distance), 0).toFixed(1)} km
                </p>
                <p className="text-xs text-purple-600 font-medium">Estimated route</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Timer className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Est. Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.max(...assignedDonations.map((d) => Number.parseInt(d.estimatedTime)))} min
                </p>
                <p className="text-xs text-orange-600 font-medium">To complete all</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && currentLocation && (
          <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                Delivery Route Map
              </h2>
            </div>
            <div className="h-96">
              <DeliveryMap donations={assignedDonations} currentLocation={currentLocation} />
            </div>
          </div>
        )}

        {/* Assigned Donations */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-3 text-blue-600" />
              Assigned Pickups ({assignedDonations.length})
            </h2>
            <p className="text-gray-600 mt-1">Items waiting for pickup</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assignments...</p>
            </div>
          ) : assignedDonations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assigned pickups</h3>
              <p className="text-gray-600">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {assignedDonations.map((donation) => (
                <div key={donation.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{donation.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(donation.priority)}`}
                        >
                          {donation.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* Donor Info */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Donor Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-blue-800">
                              <span className="font-medium">Name:</span> {donation.userName}
                            </p>
                            <p className="text-blue-800">
                              <span className="font-medium">Phone:</span> {donation.phone}
                            </p>
                            <p className="text-blue-800">
                              <span className="font-medium">Type:</span> {donation.type}
                            </p>
                            <p className="text-blue-800">
                              <span className="font-medium">Qty:</span> {donation.quantity} items
                            </p>
                          </div>
                        </div>

                        {/* Location Info */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Location Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-green-800">
                              <span className="font-medium">Distance:</span> {donation.distance}
                            </p>
                            <p className="text-green-800">
                              <span className="font-medium">ETA:</span> {donation.estimatedTime}
                            </p>
                            <p className="text-green-800 text-xs">{donation.address}</p>
                          </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                            <Hash className="h-4 w-4 mr-2" />
                            Security Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-purple-800">
                              <span className="font-medium">Code:</span>
                            </p>
                            <code className="bg-white px-2 py-1 rounded text-purple-900 font-mono text-lg">
                              {donation.securityCode}
                            </code>
                            <p className="text-purple-700 text-xs">Required for pickup verification</p>
                          </div>
                        </div>
                      </div>

                      {donation.description && (
                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-700 text-sm">{donation.description}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => openNavigation(donation)}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Navigation className="h-5 w-5" />
                          <span>Navigate</span>
                        </button>

                        <button
                          onClick={() => handlePickup(donation)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Mark as Picked Up</span>
                        </button>

                        <a
                          href={`tel:${donation.phone}`}
                          className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Phone className="h-5 w-5" />
                          <span>Call Donor</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Picked Up Donations */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
              Ready to Donate ({pickedUpDonations.length})
            </h2>
            <p className="text-gray-600 mt-1">Items ready for final delivery</p>
          </div>

          {pickedUpDonations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items ready for donation</h3>
              <p className="text-gray-600">Complete pickups to see items here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pickedUpDonations.map((donation) => (
                <div key={donation.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{donation.name}</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          READY FOR DONATION
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">Picked up from {donation.userName}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          {donation.quantity} items
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Picked up {new Date(donation.updatedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => markAsDonated(donation)}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <Star className="h-5 w-5" />
                      <span>Mark as Donated</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pickup Confirmation Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Pickup</h3>
              <p className="text-gray-600">
                Please enter the security code to confirm pickup of "{selectedDonation.name}"
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Security Code</label>
                <input
                  type="text"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-center text-lg font-mono"
                  placeholder="Enter security code"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Expected: {selectedDonation.securityCode}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPickup}
                  disabled={!securityCode}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Confirm Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
