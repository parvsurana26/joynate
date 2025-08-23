import React from 'react'

export default function ExampleComponent() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gradient mb-8">
        Tailwind CSS v4 Setup Complete!
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Custom Button Classes */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Custom Button Classes</h2>
          <div className="space-y-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
          </div>
        </div>
        
        {/* Custom Animations */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Custom Animations</h2>
          <div className="space-y-4">
            <div className="animate-float bg-blue-100 p-4 rounded-lg">
              Floating Animation
            </div>
            <div className="animate-float-delayed bg-purple-100 p-4 rounded-lg">
              Delayed Float
            </div>
          </div>
        </div>
        
        {/* Custom Colors */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Custom Colors</h2>
          <div className="space-y-2">
            <div className="bg-primary-500 text-white p-3 rounded">Primary Color</div>
            <div className="bg-secondary-500 text-white p-3 rounded">Secondary Color</div>
          </div>
        </div>
        
        {/* Gradient Background */}
        <div className="gradient-bg text-white p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Gradient Background</h2>
          <p>This uses the custom gradient-bg class</p>
        </div>
      </div>
      
      {/* Custom Spacing */}
      <div className="mt-18 p-8 bg-gray-100 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Custom Spacing</h2>
        <p>This uses custom spacing (18 = 4.5rem)</p>
      </div>
    </div>
  )
} 