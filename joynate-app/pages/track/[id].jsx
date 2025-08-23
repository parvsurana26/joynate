import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { donationsAPI } from '../../utils/api'
import TrackingMap from '../../components/TrackingMap'
import { Package, Clock, MapPin, User, Phone } from 'lucide-react'

export default function TrackDonation() {
  const router = useRouter()
  const { id } = router.query
  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    
    const fetchDonation = async () => {
      try {
        const data = await donationsAPI.get(id)
        setDonation(data)
      } catch (error) {
        console.error('Error fetching donation:', error)
      }
      setLoading(false)
    }

    fetchDonation()
    const interval = setInterval(fetchDonation, 10000) // Poll every 10s
    
    return () => clearInterval(interval)
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!donation) return <div>Donation not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Track Your Donation</h1>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <TrackingMap donation={donation} isLive={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donation Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{donation.name}</p>
                <p className="text-sm text-gray-600">{donation.quantity} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Status: {donation.status}</p>
                <p className="text-sm text-gray-600">Updated: {new Date(donation.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-gray-600">{donation.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Delivery Person</p>
                <p className="text-sm text-gray-600">{donation.deliveryPerson?.name || 'Not assigned yet'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}