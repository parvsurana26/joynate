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

  // Derived values for visuals (no custom hooks)
  const impactMax = Math.max(500, Math.ceil((stats.impactScore + 100) / 100) * 100)
  const impactPercent = Math.min(100, (stats.impactScore / impactMax) * 100)
  const completion = stats.totalDonations
    ? (stats.completedDonations / stats.totalDonations) * 100
    : 0

  useEffect(() => {
    if (currentUser) {
      fetchUserStats()
      // Set up polling for real-time updates
      const interval = setInterval(fetchUserStats, 5000)
      
      // Listen for real-time status changes
      const handleStatusChange = (event) => {
        const { donationId, newStatus } = event.detail
        console.log(`Dashboard: Donation ${donationId} status changed to ${newStatus}`)
        // Refresh stats immediately when status changes
        fetchUserStats()
      }
      
      window.addEventListener('donationStatusChanged', handleStatusChange)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('donationStatusChanged', handleStatusChange)
      }
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
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div> : stats.totalDonations}
                </div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.pendingDonations
                  )}
                </div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.completedDonations
                  )}
                </div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div> : stats.livesTouched}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Score - enhanced visual with radial progress */}
        <div className="relative overflow-hidden rounded-2xl mb-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600" />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 opacity-90" />
                  <h3 className="text-lg font-semibold">Your Impact Score</h3>
                </div>
                <div className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
                  {loading ? (
                    <span className="inline-block h-10 w-24 rounded bg-white/30 animate-pulse" />
                  ) : (
                    stats.impactScore.toLocaleString()
                  )}
                </div>
                <p className="text-white/80 text-sm mt-1">Points earned from your donations</p>
                <div className="mt-3 text-xs text-white/80">Goal: {impactMax.toLocaleString()} • {Math.round(impactPercent)}% of goal</div>
              </div>
              {/* Simple radial progress */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e ${impactPercent}%, rgba(255,255,255,0.25) ${impactPercent}% 100%)`,
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm opacity-80">of goal</div>
                    <div className="text-xl font-bold">{Math.round(impactPercent)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {stats.totalDonations > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Donation Progress</h3>
              <span className="text-sm font-semibold text-gray-900">{Math.round(completion)}%</span>
            </div>
            <div className="relative h-3 rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 shadow-inner transition-[width] duration-700"
                style={{ width: `${completion}%` }}
              />
              {/* moving thumb */}
              <div
                className="absolute -top-1.5 h-6 w-6 rounded-full bg-white shadow-md border border-emerald-200 transition-[left] duration-700"
                style={{ left: `calc(${completion}% - 12px)` }}
              >
                <div className="h-full w-full rounded-full bg-emerald-500/10 animate-ping" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="text-yellow-600 font-semibold">{stats.pendingDonations}</div>
                <div className="text-yellow-700/70">In Progress</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="text-green-600 font-semibold">{stats.completedDonations}</div>
                <div className="text-green-700/70">Completed</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-blue-600 font-semibold">{stats.totalDonations}</div>
                <div className="text-blue-700/70">Total</div>
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
