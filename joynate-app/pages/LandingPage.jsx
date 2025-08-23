"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import { 
  Heart, 
  Users, 
  Truck, 
  CheckCircle, 
  Gift, 
  HandHeart, 
  MapPin, 
  Star, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Globe,
  Zap,
  Target,
  Smile,
  Coffee,
  BookOpen,
  Camera,
  Music,
  Gamepad2,
  Palette,
  Shirt,
  DollarSign,
  Handshake,
  Globe2,
  Users2,
  Calendar,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Loader2
} from "lucide-react"
import DonationForm from "../components/DonationForm"
import DonationHistory from "../components/DonationHistory"

export default function LandingPage() {
  const { currentUser } = useAuth()
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [donationCount, setDonationCount] = useState(0)
  const [animatedCount, setAnimatedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUsers: 0,
    completionRate: 0,
    foodDonations: 0,
    clothesDonations: 0
  })

  useEffect(() => {
    // Simulate loading progress
    const loadingTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingTimer)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Fetch total donation count and stats
    fetchDonationData()

    return () => clearInterval(loadingTimer)
  }, [])

  useEffect(() => {
    // Animate counter with easing
    if (donationCount > 0) {
      const duration = 2500
      const steps = 100
      const increment = donationCount / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= donationCount) {
          setAnimatedCount(donationCount)
          clearInterval(timer)
        } else {
          setAnimatedCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [donationCount])

  const fetchDonationData = async () => {
    try {
      const [countData, allDonations, statsData] = await Promise.all([
        donationsAPI.getCount(), 
        donationsAPI.getAll(),
        donationsAPI.getStats()
      ])

      // Calculate total items donated (sum of quantities)
      const totalItems = allDonations.reduce((sum, donation) => {
        return sum + (donation.quantity || 1)
      }, 0)

      setDonationCount(totalItems || countData.count)
      
      // Set stats
      setStats({
        totalDonations: statsData?.total || 0,
        totalUsers: statsData?.totalUsers || 0,
        completionRate: statsData?.completionRate || 0,
        foodDonations: statsData?.foodDonations || 0,
        clothesDonations: statsData?.clothesDonations || 0
      })
    } catch (error) {
      console.error("Error fetching donation data:", error)
      setDonationCount(1247) // Fallback number
      setStats({
        totalDonations: 1247,
        totalUsers: 456,
        completionRate: 89,
        foodDonations: 823,
        clothesDonations: 424
      })
    }
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center z-50">
        {/* Background particles for loader */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center text-white relative z-10">
          <div className="relative mb-8">
            {/* Enhanced Animated Heart */}
            <div className="relative">
              <Heart className="h-24 w-24 text-white animate-pulse mx-auto" />
              <div className="absolute inset-0">
                <Heart className="h-24 w-24 text-white/30 animate-ping" />
              </div>
              {/* Additional glow effect */}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            </div>
            
            {/* Enhanced Loading Text */}
            <h1 className="text-4xl font-black mb-4 animate-pulse bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Joynate
            </h1>
            <p className="text-xl text-emerald-100 mb-8 animate-pulse">
              Loading generosity...
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-80 bg-white/20 rounded-full h-3 mb-4 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-white to-emerald-100 h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${loadingProgress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-sm text-emerald-100 font-semibold">
            {loadingProgress}% Complete
          </div>

          {/* Enhanced Loading Animation */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Loading message */}
          <div className="mt-6 text-sm text-emerald-200">
            Preparing your donation experience...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat bg-[length:60px_60px] animate-pulse"></div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20 animate-pulse">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20 animate-pulse">
            <Gift className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float">
          <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20 animate-pulse">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20 animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/2 left-1/6 animate-float">
          <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
            <Users className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-1/6 animate-float-delayed">
          <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
            <Target className="h-4 w-4 text-white" />
          </div>
        </div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/2 left-1/6 animate-float">
          <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
            <Users className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-1/6 animate-float-delayed">
          <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
            <Target className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center">
            
            
            {/* Enhanced Main Heading */}
            <div className="mb-8 animate-slideIn">
              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
                <span className="block">Make a</span>
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                  Difference
                </span>
                <span className="block text-5xl md:text-6xl mt-4">Today!</span>
              </h1>
              
              {/* Animated underline */}
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-6 rounded-full animate-pulse"></div>
            </div>
            
            {/* Enhanced Subtitle */}
            <div className="mb-12 animate-slideIn" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl md:text-3xl mb-6 text-emerald-100 max-w-5xl mx-auto leading-relaxed">
                Your donation can change someone's life. Join thousands of generous hearts making a real impact in our community.
              </p>
              <div className="inline-block bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-2xl font-semibold text-yellow-300 animate-pulse">
                  ✨ Every item counts. Every donation matters. ✨
                </span>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-scaleIn" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={() => setShowDonationForm(true)}
                className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black py-6 px-12 rounded-3xl text-xl transition-all duration-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Gift className="mr-3 h-7 w-7 group-hover:animate-bounce relative z-10" />
                <span className="relative z-10">Start Donating</span>
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              </button>
              <button className="group border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-6 px-12 rounded-3xl text-xl transition-all duration-500 backdrop-blur-sm transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/20 transition-colors duration-300"></div>
                <Sparkles className="mr-2 h-6 w-6 group-hover:animate-spin relative z-10" />
                <span className="relative z-10">See Our Impact</span>
              </button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-emerald-200 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <Star className="h-5 w-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-semibold">Trusted by 10,000+ donors</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <CheckCircle className="h-5 w-5 text-green-300 animate-pulse" />
                <span className="text-sm font-semibold">100% Verified NGOs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <Shield className="h-5 w-5 text-blue-300 animate-pulse" />
                <span className="text-sm font-semibold">Secure & Transparent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center relative">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse"></div>
          </div>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Generosity in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">See the incredible difference our community is making every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Total Items Donated */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all duration-500 shadow-xl">
              <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 count-animation">
                {animatedCount.toLocaleString()}+
              </div>
              <div className="text-emerald-100 font-semibold">Items Donated</div>
            </div>

            {/* Total Users */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all duration-500 shadow-xl">
              <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {stats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-purple-100 font-semibold">Active Donors</div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all duration-500 shadow-xl">
              <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {stats.completionRate}%
              </div>
              <div className="text-green-100 font-semibold">Success Rate</div>
            </div>

            {/* Total Donations */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all duration-500 shadow-xl">
              <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {stats.totalDonations.toLocaleString()}+
              </div>
              <div className="text-pink-100 font-semibold">Donations Made</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.foodDonations}</div>
                  <div className="text-orange-100">Food Items</div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.foodDonations / stats.totalDonations) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Shirt className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.clothesDonations}</div>
                  <div className="text-indigo-100">Clothing Items</div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.clothesDonations / stats.totalDonations) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation History - Only visible when logged in */}
      {currentUser && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Donation Journey</h2>
              <p className="text-xl text-gray-600">Track your impact and see how your generosity is making a difference</p>
            </div>
            <DonationHistory />
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How Your Donation Helps</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple steps to make a difference in someone's life</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl w-32 h-32 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Users className="h-16 w-16 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">1. Sign Up</h3>
                <p className="text-gray-600 leading-relaxed">Create your account in seconds and join our community of generous hearts making a difference</p>
              </div>
            </div>

            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl w-32 h-32 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <HandHeart className="h-16 w-16 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">2. Donate</h3>
                <p className="text-gray-600 leading-relaxed">Fill out our simple form with your donation details and preferred pickup time</p>
              </div>
            </div>

            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl w-32 h-32 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Truck className="h-16 w-16 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">3. Pickup & Deliver</h3>
                <p className="text-gray-600 leading-relaxed">Our verified delivery team picks up your donation and delivers it to those who need it most</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-emerald-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Joynate?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the most trusted and efficient donation platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-green-100 p-4 rounded-2xl w-fit mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Track your donation journey from pickup to delivery with live updates and notifications</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-blue-100 p-4 rounded-2xl w-fit mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Convenient Pickup</h3>
              <p className="text-gray-600 leading-relaxed">Schedule pickup from your doorstep at your preferred time with zero hassle</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-red-100 p-4 rounded-2xl w-fit mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified NGOs</h3>
              <p className="text-gray-600 leading-relaxed">Your donations reach only verified NGOs and people who genuinely need them</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Impact Tracking</h3>
              <p className="text-gray-600 leading-relaxed">See the real impact of your donations with detailed analytics and success stories</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-yellow-100 p-4 rounded-2xl w-fit mb-6">
                <Sparkles className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Gamified Experience</h3>
              <p className="text-gray-600 leading-relaxed">Earn impact points, unlock achievements, and compete with friends in doing good</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
              <div className="bg-indigo-100 p-4 rounded-2xl w-fit mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Join a community of like-minded individuals committed to making the world better</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real stories of impact from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-3xl border border-emerald-200">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500 p-3 rounded-full mr-4">
                  <Smile className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah's Story</h4>
                  <p className="text-sm text-gray-600">Donated 50+ items</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Through Joynate, I've been able to help over 100 families. The tracking feature lets me see exactly where my donations go, which makes giving so much more meaningful."</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-3xl border border-teal-200">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 p-3 rounded-full mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mike's Impact</h4>
                  <p className="text-sm text-gray-600">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"As a community leader, I've organized donation drives through Joynate. The platform makes it incredibly easy to coordinate and track our collective impact."</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-3xl border border-cyan-200">
              <div className="flex items-center mb-4">
                <div className="bg-cyan-500 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Emma's Journey</h4>
                  <p className="text-sm text-gray-600">Top Donor</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"I love the gamification aspect! Earning points and seeing my impact score grow motivates me to donate more regularly. It's like a game that helps real people."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">Joynate</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">Connecting hearts, spreading joy through the power of giving. Making the world a better place, one donation at a time.</p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer transform hover:scale-110">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer transform hover:scale-110">
                  <Users className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer transform hover:scale-110">
                  <Gift className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Connect</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Joynate. Made with ❤️ for a better world. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Donation Form Modal */}
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </div>
  )
}

