"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  Heart, 
  Gift, 
  Users, 
  Info, 
  Home,
  Menu,
  X
} from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"
import DonationForm from "./DonationForm"

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showDonationForm, setShowDonationForm] = useState(false)

  const handleLogout = async () => {
    try {
      logout()
      setShowUserMenu(false)
      navigate("/")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  const handleDonateClick = () => {
    setShowDonationForm(true)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Joynate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/about" 
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              <Info className="h-4 w-4" />
              About Us
            </Link>
            <Link 
              to="/impact" 
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              <Users className="h-4 w-4" />
              Our Impact
            </Link>
           
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Notifications"
                  >
                    <Bell className="h-6 w-6" />
                  </button>
                  {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 text-gray-700 transition-all duration-300 border border-gray-200 hover:border-emerald-200"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block font-semibold">
                      Hello, {currentUser.name || currentUser.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-200 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{currentUser.name || currentUser.email}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-emerald-600" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slideIn">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                About Us
              </Link>
              <Link 
                to="/impact" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                Our Impact
              </Link>
              <button
                onClick={handleDonateClick}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                <Gift className="h-5 w-5" />
                Donate Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </nav>
  )
}
