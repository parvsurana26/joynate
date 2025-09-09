"use client"

import React, { useState, useEffect } from "react"
import { MapPin, User, Package, Truck, CheckCircle, Phone, Calendar, Hash, Star, Timer } from "lucide-react"

export default function DonationTracker({ donation, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      id: "pending",
      title: "Donation Submitted",
      description: "Your donation request has been received",
      icon: Package,
      color: "blue",
      timestamp: donation?.createdAt,
    },
    {
      id: "assigned",
      title: "Delivery Assigned",
      description: "A delivery person has been assigned to your donation",
      icon: User,
      color: "purple",
      timestamp: donation?.assignedAt,
    },
    {
      id: "picked-up",
      title: "Item Picked Up",
      description: "Your donation has been collected from your location",
      icon: Truck,
      color: "orange",
      timestamp: donation?.pickedUpAt,
    },
    {
      id: "donated",
      title: "Successfully Donated",
      description: donation?.deliveryNotes || "Your donation has reached those in need",
      icon: CheckCircle,
      color: "green",
      timestamp: donation?.donatedAt,
    },
  ]

  useEffect(() => {
    const statusIndex = steps.findIndex((step) => step.id === donation?.status)
    setCurrentStep(statusIndex >= 0 ? statusIndex : 0)
    setProgress(statusIndex >= 0 ? ((statusIndex + 1) / steps.length) * 100 : 25)
  }, [donation?.status])

  const getStepStatus = (index) => {
    if (index < currentStep) return "completed"
    if (index === currentStep) return "current"
    return "upcoming"
  }

  const getStatusColor = (color, status) => {
    const colors = {
      blue: {
        completed: "bg-blue-600 text-white",
        current: "bg-blue-100 text-blue-600 ring-4 ring-blue-200",
        upcoming: "bg-gray-100 text-gray-400",
      },
      purple: {
        completed: "bg-purple-600 text-white",
        current: "bg-purple-100 text-purple-600 ring-4 ring-purple-200",
        upcoming: "bg-gray-100 text-gray-400",
      },
      orange: {
        completed: "bg-orange-600 text-white",
        current: "bg-orange-100 text-orange-600 ring-4 ring-orange-200",
        upcoming: "bg-gray-100 text-gray-400",
      },
      green: {
        completed: "bg-green-600 text-white",
        current: "bg-green-100 text-green-600 ring-4 ring-green-200",
        upcoming: "bg-gray-100 text-gray-400",
      },
    }
    return colors[color][status]
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Pending"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstimatedTime = () => {
    const now = new Date()
    const created = new Date(donation?.createdAt)
    const hoursSinceCreated = (now - created) / (1000 * 60 * 60)

    switch (donation?.status) {
      case "pending":
        return "2-4 hours"
      case "assigned":
        return "1-2 hours"
      case "picked-up":
        return "30-60 minutes"
      default:
        return "Completed"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-t-3xl text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-300"
          >
            ×
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{donation?.name}</h2>
              <p className="text-blue-100">Tracking ID: #{donation?.id?.slice(-8)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="rounded-full h-3 mb-2 bg-white/25">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-0 -mt-1.5 h-6 w-6 rounded-full bg-white shadow-md border border-white/60 transition-[left] duration-700"
                style={{ left: `calc(${progress}% - 12px)` }}
              >
                <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
              </div>
            </div>
            <div className="flex justify-between text-sm text-blue-100">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Current Status Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${getStatusColor(steps[currentStep]?.color, "current")}`}>
                  {steps[currentStep] && (() => {
                    const IconComponent = steps[currentStep].icon
                    return <IconComponent className="h-6 w-6" />
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep]?.title}</h3>
                  <p className="text-gray-600">{steps[currentStep]?.description}</p>
                </div>
              </div>
              {donation?.status !== "donated" && (
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Timer className="h-4 w-4" />
                    <span>ETA: {getEstimatedTime()}</span>
                  </div>
                  <div className="text-xs text-gray-500">Estimated time</div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Donation Journey</h3>
            {steps.map((step, index) => {
              const status = getStepStatus(index)
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="relative">
                    <div
                      className={`p-3 rounded-full transition-all duration-500 ${getStatusColor(step.color, status)}`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 transition-all duration-500 ${
                          index < currentStep ? "bg-gradient-to-b from-emerald-400 to-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${status === "upcoming" ? "text-gray-400" : "text-gray-900"}`}>
                        {step.title}
                      </h4>
                      <span className={`text-sm ${status === "upcoming" ? "text-gray-400" : "text-gray-600"}`}>
                        {formatDate(step.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm ${status === "upcoming" ? "text-gray-400" : "text-gray-600"}`}>
                      {step.description}
                    </p>

                    {/* Additional Info for Current Step */}
                    {status === "current" && donation?.assignedTo && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 text-sm text-blue-800">
                          <User className="h-4 w-4" />
                          <span>Assigned to: {donation.assignedTo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Donation Details */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Item Type</p>
                    <p className="font-semibold text-gray-900">{donation?.type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold text-gray-900">{donation?.quantity} items</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Security Code</p>
                    <code className="font-mono font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {donation?.securityCode}
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Address</p>
                    <p className="font-semibold text-gray-900">{donation?.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">{donation?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-semibold text-gray-900">{formatDate(donation?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {donation?.description && (
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{donation.description}</p>
              </div>
            )}
          </div>

          {/* Impact Message */}
          {donation?.status === "donated" && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Thank You for Your Generosity!</h3>
              </div>
              <p className="text-green-800">
                Your donation has successfully reached those in need. You've made a real difference in someone's life
                today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





