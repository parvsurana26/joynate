"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import DonationHistory from "../components/DonationHistory"
import { TrendingUp, Users, Gift, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    impactScore: 0,
    livesTouched: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchUserStats()
      // Set up polling for real-time updates
      const interval = setInterval(fetchUserStats, 5000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const fetchUserStats = async () => {
    try {
      // Use the new stats endpoint for better performance
      const userStats = await donationsAPI.getUserStats(currentUser.id)

      setStats({
        totalDonations: userStats.total,
        pendingDonations: userStats.pending + userStats.assigned,
        completedDonations: userStats.completed,
        impactScore: Math.floor(userStats.impactScore),
        livesTouched: Math.floor(userStats.completed * 2.5), // Estimate lives touched
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      // Fallback to the original method if the new endpoint fails
      const donations = await donationsAPI.getByUser(currentUser.id)

      const totalDonations = donations.length
      const pendingDonations = donations.filter((d) => d.status === "pending" || d.status === "assigned").length
      const completedDonations = donations.filter((d) => d.status === "donated").length

      const impactScore = donations.reduce((score, donation) => {
        const baseScore = donation.quantity * 10
        const statusMultiplier = {
          pending: 0.25,
          assigned: 0.5,
          "picked-up": 0.75,
          donated: 1.0,
        }
        return score + baseScore * (statusMultiplier[donation.status] || 0)
      }, 0)

      const livesTouched = Math.floor(completedDonations * 2.5)

      setStats({
        totalDonations,
        pendingDonations,
        completedDonations,
        impactScore: Math.floor(impactScore),
        livesTouched,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser?.name || currentUser?.email?.split("@")[0]}!
          </h1>
          <p className="text-blue-100 text-lg">
            Thank you for being part of our community. Your generosity makes a difference.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div> : stats.totalDonations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.pendingDonations
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.completedDonations
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lives Touched</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div> : stats.livesTouched}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Score Card */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Impact Score</h3>
              <p className="text-3xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-white bg-opacity-20 h-10 w-20 rounded"></div>
                ) : (
                  stats.impactScore.toLocaleString()
                )}
              </p>
              <p className="text-green-100 text-sm mt-1">Points earned from your donations</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {stats.totalDonations > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((stats.completedDonations / stats.totalDonations) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(stats.completedDonations / stats.totalDonations) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-yellow-600">{stats.pendingDonations}</div>
                  <div className="text-gray-500">In Progress</div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">{stats.completedDonations}</div>
                  <div className="text-gray-500">Completed</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">{stats.totalDonations}</div>
                  <div className="text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation History */}
        <DonationHistory />
      </div>
    </div>
  )
}
