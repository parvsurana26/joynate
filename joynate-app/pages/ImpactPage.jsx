"use client"


import { useState, useEffect } from "react"
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
  Smile,
  Play,
  ChevronLeft,
  ChevronRight,
  Camera,
  Video,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  Home,
  Utensils,
  Shirt,
  Info
} from "lucide-react"
import DonationForm from "../components/DonationForm"

export default function ImpactPage() {
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(0)

  // Impact Stories with Photos
  const impactStories = [
    {
      id: 1,
      title: "Food Security for Families",
      description: "Through your donations, we've provided nutritious meals to over 5,000 families in need.",
      image: "./src/assets/1.jpg",
      stats: "5,000+ families fed",
      category: "Food Donations"
    },
    {
      id: 2,
      title: "Education for Children",
      description: "Your clothing donations have helped children attend school with dignity and confidence.",
      image: "./src/assets/2.jpg",
      stats: "2,500+ children clothed",
      category: "Clothing Donations"
    },
    {
      id: 3,
      title: "Community Development",
      description: "Together, we've built stronger communities through sustainable donation programs.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      stats: "50+ communities served",
      category: "Community Impact"
    },
    {
      id: 4,
      title: "Emergency Relief",
      description: "Your quick response helped provide immediate relief to disaster-affected areas.",
      image: "./src/assets/3.jpg",
      stats: "10,000+ emergency kits",
      category: "Emergency Response"
    }
  ]

  // Happy Faces Gallery
  const happyFaces = [
    {
      id: 1,
      name: "Aisha, 8 years old",
      story: "Received her first school uniform through Joynate donations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "8 years"
    },
    {
      id: 2,
      name: "Maria, 35 years old",
      story: "Single mother who received food supplies for her family",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "35 years"
    },
    {
      id: 3,
      name: "Ahmed, 12 years old",
      story: "Now attends school regularly thanks to clothing donations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "12 years"
    },
    {
      id: 4,
      name: "Priya, 28 years old",
      story: "Received essential items for her newborn baby",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "28 years"
    },
    {
      id: 5,
      name: "Carlos, 45 years old",
      story: "Veteran who received warm clothing for winter",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "45 years"
    },
    {
      id: 6,
      name: "Fatima, 16 years old",
      story: "Teenager who received books and school supplies",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      age: "16 years"
    }
  ]

  // Impact Videos (placeholder data)
  const impactVideos = [
    {
      id: 1,
      title: "A Day in the Life - Food Distribution",
      description: "See how your food donations reach families in need",
      thumbnail: "./src/assets/4.jpeg",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Clothing Drive Success Story",
      description: "Witness the joy when children receive new clothes",
      thumbnail: "./src/assets/5.jpeg",
      duration: "4:20"
    },
    {
      id: 3,
      title: "Community Transformation",
      description: "How donations are building stronger communities",
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      duration: "5:15"
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % impactStories.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [impactStories.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % impactStories.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + impactStories.length) % impactStories.length)
  }

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
                <Target className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fadeIn">
              Our{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                Impact
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-emerald-100 max-w-4xl mx-auto leading-relaxed animate-slideIn">
              See the real difference your donations make in people's lives. Every contribution creates lasting change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scaleIn">
              <button
                onClick={() => setShowDonationForm(true)}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black py-5 px-10 rounded-3xl text-lg transition-all duration-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                <Gift className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Make Your Impact Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <Link
                to="/about"
                className="group border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-5 px-10 rounded-3xl text-lg transition-all duration-500 backdrop-blur-sm transform hover:-translate-y-2 hover:scale-105"
              >
                <Info className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Impact by the Numbers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your generosity in action - real numbers that show real change</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl mb-4">
                <Utensils className="h-12 w-12 text-white mx-auto" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
              <div className="text-gray-600">Meals Provided</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-3xl mb-4">
                <Shirt className="h-12 w-12 text-white mx-auto" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">25,000+</div>
              <div className="text-gray-600">Clothing Items</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-3xl mb-4">
                <Users className="h-12 w-12 text-white mx-auto" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15,000+</div>
              <div className="text-gray-600">Lives Touched</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl mb-4">
                <Home className="h-12 w-12 text-white mx-auto" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories Slider */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Stories of Change</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real stories from real people whose lives have been transformed by your donations</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {impactStories.map((story) => (
                  <div key={story.id} className="w-full flex-shrink-0">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative h-96 lg:h-auto">
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <div className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                            {story.category}
                          </div>
                          <div className="text-2xl font-bold">{story.stats}</div>
                        </div>
                      </div>
                      <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">{story.title}</h3>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">{story.description}</p>
                        <button
                          onClick={() => setShowDonationForm(true)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-fit"
                        >
                          <Gift className="inline mr-2 h-5 w-5" />
                          Support This Cause
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {impactStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-emerald-500 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Happy Faces Gallery */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Faces of Joy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Meet the people whose lives have been changed by your generosity</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {happyFaces.map((person) => (
              <div key={person.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-bold text-sm mb-1">{person.name}</h4>
                    <p className="text-xs opacity-90">{person.story}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Videos */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Impact Videos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Watch how your donations create real change in communities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="bg-white/90 hover:bg-white p-4 rounded-full transition-all duration-300 hover:scale-110">
                      <Play className="h-8 w-8 text-emerald-600 ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                    Watch Video →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Make Your Impact?</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Join thousands of donors who are already making a difference. Every donation, no matter how small, creates lasting change in someone's life.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setShowDonationForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black py-5 px-10 rounded-3xl text-lg transition-all duration-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
            >
              <Gift className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Donate Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-5 px-10 rounded-3xl text-lg transition-all duration-500 backdrop-blur-sm transform hover:-translate-y-2 hover:scale-105"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Form Modal */}
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </div>
  )
} 