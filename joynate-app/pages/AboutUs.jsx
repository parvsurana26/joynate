"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Heart, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  Star, 
  ArrowRight, 
  Gift,
  Handshake,
  TrendingUp,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Lightbulb,
  Zap,
  Smile
} from "lucide-react"
import DonationForm from "../components/DonationForm"

export default function AboutUs() {
  const [showDonationForm, setShowDonationForm] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat bg-[length:60px_60px] animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fadeIn">
              About{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                Joynate
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-emerald-100 max-w-4xl mx-auto leading-relaxed animate-slideIn">
              We're on a mission to connect generosity with need, making the world a better place one donation at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scaleIn">
              <button
                onClick={() => setShowDonationForm(true)}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black py-5 px-10 rounded-3xl text-lg transition-all duration-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                <Gift className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Start Donating Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <Link
                to="/impact"
                className="group border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-5 px-10 rounded-3xl text-lg transition-all duration-500 backdrop-blur-sm transform hover:-translate-y-2 hover:scale-105"
              >
                <TrendingUp className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                See Our Impact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Story</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Joynate was born from a simple belief: that everyone deserves access to basic necessities, and that technology can bridge the gap between those who want to help and those who need help.
              </p>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Founded in 2024, we started as a small team of passionate individuals who witnessed the challenges of traditional donation systems. We saw that while people wanted to help, the process was often complicated, untrustworthy, or inefficient.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Today, we've created a platform that makes giving simple, transparent, and impactful. Every donation through Joynate directly reaches those in need, with full tracking and verification.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
                  <div className="text-gray-600">Happy Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                  <div className="text-gray-600">NGO Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 mb-2">100%</div>
                  <div className="text-gray-600">Transparent</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Heart className="h-12 w-12 text-emerald-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Compassion</h3>
                    <p className="text-gray-600">We believe in the power of human kindness</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Shield className="h-12 w-12 text-teal-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Trust</h3>
                    <p className="text-gray-600">Building reliable connections between donors and recipients</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Target className="h-12 w-12 text-cyan-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Impact</h3>
                    <p className="text-gray-600">Every donation makes a measurable difference</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Globe className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Community</h3>
                    <p className="text-gray-600">Creating a global network of generous hearts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Driving positive change through technology and compassion</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl w-fit mb-6">
                <Target className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To create a world where no one goes without basic necessities by connecting generous donors with those in need through a transparent, efficient, and trustworthy platform.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  Eliminate barriers to giving
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  Ensure 100% transparency
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  Build lasting community connections
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl w-fit mb-6">
                <Lightbulb className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To become the world's most trusted and impactful donation platform, where every person can easily contribute to making the world a better place.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Star className="h-5 w-5 text-cyan-600 mr-3" />
                  Global reach and impact
                </li>
                <li className="flex items-center text-gray-700">
                  <Star className="h-5 w-5 text-cyan-600 mr-3" />
                  Innovation in charitable giving
                </li>
                <li className="flex items-center text-gray-700">
                  <Star className="h-5 w-5 text-cyan-600 mr-3" />
                  Sustainable community development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-3xl border border-emerald-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-emerald-500 p-4 rounded-2xl w-fit mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Compassion First</h3>
              <p className="text-gray-600 leading-relaxed">We approach every interaction with empathy and understanding, recognizing the dignity of every individual.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-3xl border border-teal-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-teal-500 p-4 rounded-2xl w-fit mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trust & Transparency</h3>
              <p className="text-gray-600 leading-relaxed">We believe in complete transparency in all our operations, building trust with donors and recipients alike.</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-3xl border border-cyan-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-cyan-500 p-4 rounded-2xl w-fit mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">We continuously innovate to make giving easier, more efficient, and more impactful for everyone involved.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-blue-500 p-4 rounded-2xl w-fit mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Community</h3>
              <p className="text-gray-600 leading-relaxed">We foster a sense of community among donors, recipients, and partners, creating lasting connections.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border border-purple-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-purple-500 p-4 rounded-2xl w-fit mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Impact-Driven</h3>
              <p className="text-gray-600 leading-relaxed">Every decision we make is guided by our commitment to creating measurable, positive impact in communities.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl border border-orange-200 hover:shadow-xl transition-all duration-500">
              <div className="bg-orange-500 p-4 rounded-2xl w-fit mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">We strive for excellence in everything we do, from user experience to impact measurement and community support.</p>
            </div>
          </div>
        </div>
      </section>
 

      {/* Contact */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Have questions? Want to partner with us? We'd love to hear from you!</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">hello@joynate.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-teal-100 p-3 rounded-xl mr-4">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+1 (91) 89288 95176</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-100 p-3 rounded-xl mr-4">
                    <MapPin className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border border-emerald-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Ready to Make a Difference?</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join thousands of generous donors who are already making an impact through Joynate. Every donation counts, and every act of kindness matters.
              </p>
              <button
                onClick={() => setShowDonationForm(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl flex items-center justify-center"
              >
                <Gift className="mr-3 h-6 w-6" />
                Start Donating Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Modal */}
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </div>
  )
} 