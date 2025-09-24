'use client'

import { useState } from 'react'

export function TestImage() {
  const [useNextImage, setUseNextImage] = useState(true)
  
  const testImageUrl = 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Image Loading Test</h3>
      
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={useNextImage}
            onChange={(e) => setUseNextImage(e.target.checked)}
          />
          Use Next.js Image Component
        </label>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Test Image:</h4>
          {useNextImage ? (
            <div className="w-32 h-48 bg-gray-200 rounded">
              <p className="p-2 text-sm">Next.js Image Component</p>
              <p className="p-2 text-xs text-gray-600">URL: {testImageUrl}</p>
            </div>
          ) : (
            <div className="w-32 h-48">
              <img 
                src={testImageUrl}
                alt="Test TMDB Image"
                className="w-full h-full object-cover rounded"
                onLoad={() => console.log('Regular img loaded successfully')}
                onError={() => console.log('Regular img failed to load')}
              />
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Fallback Image:</h4>
          <div className="w-32 h-48">
            <img 
              src="/images/fallback/poster.svg"
              alt="Fallback Image"
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
