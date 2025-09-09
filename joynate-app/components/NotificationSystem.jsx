import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X, Bell } from 'lucide-react'

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  // Ordered flow for progress indicator
  const steps = [
    { id: 'pending', label: 'Submitted' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'picked-up', label: 'Picked up' },
    { id: 'donated', label: 'Delivered' },
  ]

  const getStepIndex = (status) => {
    const idx = steps.findIndex((s) => s.id === status)
    return idx >= 0 ? idx : 0
  }

  const getProgressPercent = (status) => {
    const idx = getStepIndex(status)
    const max = steps.length - 1
    return (idx / max) * 100
  }

  useEffect(() => {
    const handleStatusChange = (event) => {
      const { donationId, newStatus } = event.detail
      
      let message = ''
      let type = 'info'
      
      if (newStatus === 'donated') {
        message = `🎉 Your donation has been successfully delivered to NGO!`
        type = 'success'
      } else if (newStatus === 'picked-up') {
        message = `📦 Your donation has been picked up by our delivery team!`
        type = 'info'
      } else if (newStatus === 'assigned') {
        message = `👤 A delivery person has been assigned to your donation!`
        type = 'info'
      }
      
      if (message) {
        const notification = {
          id: Date.now(),
          message,
          type,
          timestamp: new Date().toISOString(),
          status: newStatus,
        }
        
        setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Keep only last 5 notifications
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id))
        }, 5000)
      }
    }
    
    window.addEventListener('donationStatusChanged', handleStatusChange)
    
    return () => {
      window.removeEventListener('donationStatusChanged', handleStatusChange)
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-800' 
              : 'bg-blue-100 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Bell className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs opacity-75">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>

            {/* Inline progress bar reflecting current donation status */}
            {notification.status && (
              <div className="mt-3">
                <div className="relative">
                  <div className="h-2 w-full bg-white/60 rounded-full" />
                  <div
                    className="absolute left-0 top-0 h-2 bg-green-500 rounded-full"
                    style={{ width: `${getProgressPercent(notification.status)}%` }}
                  />
                  {steps.map((step, idx) => {
                    const activeIdx = getStepIndex(notification.status)
                    const left = (idx / (steps.length - 1)) * 100
                    const isDone = idx <= activeIdx
                    return (
                      <span
                        key={step.id}
                        className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 ${
                          isDone ? 'bg-green-500 border-green-500' : 'bg-white border-white/80'
                        }`}
                        style={{ left: `calc(${left}% - 6px)` }}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] leading-3">
                  {steps.map((step, idx) => {
                    const isActive = idx <= getStepIndex(notification.status)
                    return (
                      <span key={step.id} className={isActive ? 'text-green-700 font-semibold' : 'text-blue-800/60'}>
                        {step.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
} 






