"use client"

import { useState, useEffect } from "react"
import { useAdminAuth } from "../../contexts/AdminAuthContext"
import { donationsAPI } from "../../utils/api"
import { LogOut, Filter, Users, Package, CheckCircle, Clock } from "lucide-react"

const deliveryPersons = ["Rahul Sharama", "Rajesh Kumar", "Suresh Varma", "Virat Kohli"]

export default function AdminDashboard() {
  const { adminLogout } = useAdminAuth()
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
    const interval = setInterval(fetchDonations, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredDonations(donations)
    } else {
      setFilteredDonations(donations.filter((d) => d.status === statusFilter))
    }
  }, [donations, statusFilter])

  const fetchDonations = async () => {
    try {
      const data = await donationsAPI.getAll()
      setDonations(data)
    } catch (error) {
      console.error("Error fetching donations:", error)
    }
    setLoading(false)
  }

  const updateDonationStatus = async (id, status, assignedTo = null) => {
    try {
      await donationsAPI.update(id, { status, assignedTo })
      fetchDonations()
    } catch (error) {
      console.error("Error updating donation:", error)
    }
  }

  const deleteDonation = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await donationsAPI.delete(id)
        fetchDonations()
      } catch (error) {
        console.error("Error deleting donation:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "picked-up":
        return "bg-orange-100 text-orange-800"
      case "donated":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    assigned: donations.filter((d) => d.status === "assigned").length,
    pickedUp: donations.filter((d) => d.status === "picked-up").length,
    completed: donations.filter((d) => d.status === "donated").length,
    totalItems: donations.reduce((sum, d) => sum + (d.quantity || 1), 0),
    totalUsers: [...new Set(donations.map((d) => d.userId))].length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button onClick={adminLogout} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{stats.totalItems} items</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">Awaiting assignment</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned + stats.pickedUp}</p>
                <p className="text-xs text-gray-500">Assigned & picked up</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-gray-500">Successfully donated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-blue-100 text-sm">People making donations</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-3xl font-bold">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
            <p className="text-green-100 text-sm">Donations completed successfully</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked-up">Picked Up</option>
              <option value="donated">Donated</option>
            </select>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Donations ({filteredDonations.length})</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{donation.userName}</div>
                          <div className="text-sm text-gray-500">{donation.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{donation.name}</div>
                          <div className="text-sm text-gray-500">
                            {donation.type} • Qty: {donation.quantity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{donation.phone}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{donation.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}
                        >
                          {donation.status}
                        </span>
                        {donation.assignedTo && (
                          <div className="text-xs text-gray-500 mt-1">Assigned to: {donation.assignedTo}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                        {donation.status === "pending" && (
                          <div className="space-y-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateDonationStatus(donation.id, "assigned", e.target.value)
                                }
                              }}
                              className="block w-full text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Assign to...</option>
                              {deliveryPersons.map((person) => (
                                <option key={person} value={person}>
                                  {person}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="text-red-600 hover:text-red-900 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
