"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

export default function NotificationDropdown({ onClose }) {
  const { currentUser } = useAuth()
  const [donations, setDonations] = useState([])  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchUserDonations()
    }
  }, [currentUser])

  const fetchUserDonations = async () => {
    try {
      const data = await donationsAPI.getByUser(currentUser.id)
      setDonations(data.slice(0, 5)) // Show only recent 5
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "assigned":
        return <Package className="h-4 w-4 text-blue-500" />
      case "picked-up":
        return <Truck className="h-4 w-4 text-orange-500" />
      case "donated":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status, donation = null) => {
    switch (status) {
      case "pending":
        return "Waiting for assignment"
      case "assigned":
        return "Assigned to delivery person"
      case "picked-up":
        return "Picked up by delivery person"
      case "donated":
        return donation?.deliveryNotes ? "Successfully delivered to NGO" : "Successfully donated to NGO"
      default:
        return "Unknown status"
    }
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Donation Updates</h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : donations.length > 0 ? (
          donations.map((donation) => (
            <div key={donation.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start space-x-3">
                {getStatusIcon(donation.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{donation.name}</p>
                                      <p className="text-xs text-gray-500">{getStatusText(donation.status, donation)}</p>
                  {donation.assignedTo && <p className="text-xs text-blue-600">Assigned to: {donation.assignedTo}</p>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500">No donations yet</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-200">
        <button onClick={onClose} className="text-xs text-blue-600 hover:text-blue-800">
          Close
        </button>
      </div>
    </div>
  )
}
