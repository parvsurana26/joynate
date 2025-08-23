"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Package } from "lucide-react"

export default function DeliveryMap({ donations, currentLocation }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize map with a simple implementation
    if (mapRef.current && !mapInstanceRef.current) {
      setIsLoading(true)
      try {
        initializeMap()
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentLocation, donations])

  const initializeMap = () => {
    try {
      // Simple map implementation using HTML5 Canvas or div elements
      const mapContainer = mapRef.current
      if (!mapContainer) return
      
      mapContainer.innerHTML = "" // Clear existing content

      // Create a simple visual map representation
      const mapDiv = document.createElement("div")
      mapDiv.className = "relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"

    // Add current location marker
    if (currentLocation && currentLocation.lat && currentLocation.lng) {
      const currentMarker = document.createElement("div")
      currentMarker.className = "absolute bg-blue-600 rounded-full w-4 h-4 border-2 border-white shadow-lg"
      currentMarker.style.left = "20%"
      currentMarker.style.top = "30%"
      currentMarker.innerHTML =
        '<div class="absolute -top-8 -left-6 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Your Location</div>'
      mapDiv.appendChild(currentMarker)
    }

    // Add donation markers
    if (!donations || !Array.isArray(donations)) {
      console.warn("Donations is not an array:", donations)
      return
    }
    
    donations.forEach((donation, index) => {
      const marker = document.createElement("div")
      marker.className =
        "absolute bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"

      // Position markers in a scattered pattern
      const positions = [
        { left: "40%", top: "20%" },
        { left: "60%", top: "40%" },
        { left: "30%", top: "60%" },
        { left: "70%", top: "25%" },
        { left: "45%", top: "70%" },
        { left: "80%", top: "50%" },
      ]

      const position = positions[index % positions.length]
      marker.style.left = position.left
      marker.style.top = position.top

      // Add tooltip
      const tooltip = document.createElement("div")
      tooltip.className =
        "absolute -top-12 -left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10"
      tooltip.innerHTML = `${donation.name}<br/>${donation.distance} • ${donation.estimatedTime}`
      marker.appendChild(tooltip)

      marker.addEventListener("mouseenter", () => {
        tooltip.classList.remove("opacity-0")
        tooltip.classList.add("opacity-100")
      })

      marker.addEventListener("mouseleave", () => {
        tooltip.classList.add("opacity-0")
        tooltip.classList.remove("opacity-100")
      })

      mapDiv.appendChild(marker)
    })

    // Add route lines (simplified)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("class", "absolute inset-0 w-full h-full pointer-events-none")
    svg.innerHTML = `
      <defs>
        <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M0,4 L8,4" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,4"/>
        </pattern>
      </defs>
      <path d="M 20% 30% Q 30% 20% 40% 20%" fill="none" stroke="url(#dashed)" strokeWidth="2"/>
      <path d="M 40% 20% Q 50% 30% 60% 40%" fill="none" stroke="url(#dashed)" strokeWidth="2"/>
      <path d="M 60% 40% Q 45% 50% 30% 60%" fill="none" stroke="url(#dashed)" strokeWidth="2"/>
    `
    mapDiv.appendChild(svg)

      mapContainer.appendChild(mapDiv)
      mapInstanceRef.current = mapDiv
    } catch (error) {
      console.error("Error initializing map:", error)
      // Fallback: show a simple message
      const mapContainer = mapRef.current
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
            <div class="text-center text-gray-600">
              <div class="text-2xl mb-2">🗺️</div>
              <div class="text-sm">Map loading...</div>
            </div>
          </div>
        `
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center text-gray-600">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm">Loading map...</div>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
            <span className="text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span className="text-gray-700">Pickup Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-0.5 bg-blue-500"
              style={{
                background:
                  "repeating-linear-gradient(to right, #3B82F6 0, #3B82F6 4px, transparent 4px, transparent 8px)",
              }}
            ></div>
            <span className="text-gray-700">Suggested Route</span>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Route Summary</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>{donations.length} pickups</span>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>{donations.reduce((total, d) => total + Number.parseFloat(d.distance), 0).toFixed(1)} km total</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>~{Math.max(...donations.map((d) => Number.parseInt(d.estimatedTime) || 0))} min</span>
          </div>
        </div>
      </div>
    </div>
  )
}
