"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { donationsAPI } from "../utils/api"
import { Heart, Users, Truck, CheckCircle, Gift, HandHeart, MapPin, Star, ArrowRight, Sparkles } from "lucide-react"
import DonationForm from "../components/DonationForm"
import DonationHistory from "../components/DonationHistory"

export default function LandingPage() {
  const { currentUser } = useAuth()
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [donationCount, setDonationCount] = useState(0)
  const [animatedCount, setAnimatedCount] = useState(0)

  useEffect(() => {
    // Fetch total donation count
    fetchDonationCount()
  }, [])

  useEffect(() => {
    // Animate counter
    if (donationCount > 0) {
      const duration = 2000
      const steps = 60
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

  const fetchDonationCount = async () => {
    try {
      const [countData, allDonations] = await Promise.all([donationsAPI.getCount(), donationsAPI.getAll()])

      // Calculate total items donated (sum of quantities)
      const totalItems = allDonations.reduce((sum, donation) => {
        return sum + (donation.quantity || 1)
      }, 0)

      setDonationCount(totalItems || countData.count)
    } catch (error) {
      console.error("Error fetching donation count:", error)
      setDonationCount(1247) // Fallback number
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/svg%3E')] bg-repeat bg-[length:40px_40px]"></div>


        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Share Joy,{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Spread Hope
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Connect your generosity with those in need. Donate food, clothes, and essentials with just a few clicks
              and track your impact in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setShowDonationForm(true)}
                className="group bg-white text-blue-600 hover:bg-blue-50 font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Gift className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Donate Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 backdrop-blur-sm">
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Trusted by 10,000+ donors</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm">100% Verified NGOs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-white bg-opacity-10 p-3 rounded-full backdrop-blur-sm">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="bg-white bg-opacity-10 p-3 rounded-full backdrop-blur-sm">
            <Gift className="h-6 w-6 text-white" />
          </div>
        </div>
      </section>

      {/* Donation Counter */}
      <section className="bg-white py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%23ffffff fill-opacity=0.1%3E%3Cpath d=M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z/%3E%3C/g%3E%3C/svg%3E')] bg-repeat bg-[length:40px_40px]"></div>

              </div>
              
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-6">Total Items Donated</h2>
                <div className="text-7xl md:text-8xl font-bold text-white count-animation mb-4">
                  {animatedCount.toLocaleString()}+
                </div>
                <p className="text-blue-100 text-xl">Lives touched through your generosity</p>
                
                <div className="mt-8 grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-blue-200 text-sm">NGO Partners</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-blue-200 text-sm">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-blue-200 text-sm">Transparency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation History - Only visible when logged in */}
      {currentUser && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DonationHistory />
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to make a difference in someone's life</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">1. Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">Create your account in seconds and join our community of generous hearts making a difference</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HandHeart className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">2. Donate</h3>
              <p className="text-gray-600 leading-relaxed">Fill out our simple form with your donation details and preferred pickup time</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">3. Pickup & Deliver</h3>
              <p className="text-gray-600 leading-relaxed">Our verified delivery team picks up your donation and delivers it to those who need it most</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Joynate?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the most trusted and efficient donation platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-green-100 p-4 rounded-2xl w-fit mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Track your donation journey from pickup to delivery with live updates and notifications</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-blue-100 p-4 rounded-2xl w-fit mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Convenient Pickup</h3>
              <p className="text-gray-600 leading-relaxed">Schedule pickup from your doorstep at your preferred time with zero hassle</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-red-100 p-4 rounded-2xl w-fit mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified NGOs</h3>
              <p className="text-gray-600 leading-relaxed">Your donations reach only verified NGOs and people who genuinely need them</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-purple-100 p-4 rounded-2xl w-fit mb-6">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Impact Tracking</h3>
              <p className="text-gray-600 leading-relaxed">See the real impact of your donations with detailed analytics and success stories</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-yellow-100 p-4 rounded-2xl w-fit mb-6">
                <Sparkles className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Gamified Experience</h3>
              <p className="text-gray-600 leading-relaxed">Earn impact points, unlock achievements, and compete with friends in doing good</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-indigo-100 p-4 rounded-2xl w-fit mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Join a community of like-minded individuals committed to making the world better</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">Joynate</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">Connecting hearts, spreading joy through the power of giving. Making the world a better place, one donation at a time.</p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Gift className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Connect</h3>
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
