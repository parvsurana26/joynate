"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import {
  Package,
  Clock,
  User,
  CheckCircle,
  Truck,
  Calendar,
  Hash,
  MapPin,
  Phone,
  AlertCircle,
  Eye,
  TrendingUp,
} from "lucide-react"
import DonationTracker from "./DonationTracker"

export default function DonationHistory() {
  const { currentUser } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [showTracker, setShowTracker] = useState(false)

  useEffect(() => {
    if (currentUser) {
      fetchDonations()
      // Set up polling for real-time updates
      const interval = setInterval(fetchDonations, 5000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const fetchDonations = async () => {
    try {
      const data = await donationsAPI.getByUser(currentUser.id)
      setDonations(data)
    } catch (error) {
      console.error("Error fetching donations:", error)
    }
    setLoading(false)
  }

  const openTracker = (donation) => {
    setSelectedDonation(donation)
    setShowTracker(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "assigned":
        return <User className="h-5 w-5 text-blue-500" />
      case "picked-up":
        return <Truck className="h-5 w-5 text-orange-500" />
      case "donated":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "picked-up":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "donated":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Waiting for assignment"
      case "assigned":
        return "Assigned to delivery person"
      case "picked-up":
        return "Picked up by delivery person"
      case "donated":
        return "Successfully donated to NGO"
      default:
        return "Unknown status"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "very-urgent":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getProgressPercentage = (status) => {
    switch (status) {
      case "pending":
        return 25
      case "assigned":
        return 50
      case "picked-up":
        return 75
      case "donated":
        return 100
      default:
        return 0
    }
  }

  const filteredDonations = donations.filter((donation) => {
    if (filter === "all") return true
    return donation.status === filter
  })

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-xl">Loading your donation journey...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Your Impact Journey</h2>
            <p className="text-gray-600 text-lg">Track your donations and see the difference you're making</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {[
            { key: "all", label: "All", count: donations.length },
            { key: "pending", label: "Pending", count: donations.filter((d) => d.status === "pending").length },
            { key: "assigned", label: "Assigned", count: donations.filter((d) => d.status === "assigned").length },
            { key: "picked-up", label: "In Transit", count: donations.filter((d) => d.status === "picked-up").length },
            { key: "donated", label: "Completed", count: donations.filter((d) => d.status === "donated").length },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === item.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {filter === "all" ? "Start Your Giving Journey" : `No ${filter} donations`}
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            {filter === "all"
              ? "Every donation makes a difference. Create your first donation and start changing lives today!"
              : `You don't have any ${filter} donations at the moment.`}
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              View All Donations
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ width: `${getProgressPercentage(donation.status)}%` }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl">
                      {donation.type === "food" ? (
                        <Package className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Package className="h-8 w-8 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{donation.name}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-gray-100 px-4 py-2 rounded-full font-semibold text-gray-700">
                          {donation.type?.charAt(0).toUpperCase() + donation.type?.slice(1)}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                          {donation.quantity} items
                        </span>
                        {donation.urgency && donation.urgency !== "normal" && (
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold border ${getUrgencyColor(donation.urgency)}`}
                          >
                            {donation.urgency.replace("-", " ").toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-bold border-2 ${getStatusColor(donation.status)}`}
                    >
                      {getStatusIcon(donation.status)}
                      <span>{donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</span>
                    </div>
                    {donation.assignedTo && (
                      <p className="text-sm text-blue-600 mt-3 font-semibold">Delivery: {donation.assignedTo}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {donation.description && (
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{donation.description}</p>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{donation.userName}</p>
                        <p className="text-gray-600">{donation.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{donation.phone}</span>
                    </div>

                    {donation.preferredTime && (
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-gray-700">Preferred: {donation.preferredTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700">{donation.address}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Hash className="h-5 w-5 text-indigo-600" />
                      </div>
                      <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono font-bold text-gray-800">
                        {donation.securityCode}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Submitted{" "}
                      {new Date(donation.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <AlertCircle className="h-4 w-4" />
                    <span>{getStatusText(donation.status)}</span>
                  </div>

                  <button
                    onClick={() => openTracker(donation)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Track Journey</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Donation Tracker Modal */}
      {showTracker && selectedDonation && (
        <DonationTracker
          donation={selectedDonation}
          onClose={() => {
            setShowTracker(false)
            setSelectedDonation(null)
          }}
        />
      )}
    </div>
  )
}
