'use client'

import { useState } from 'react'

export default function DebugImagesPage() {
  const [testResults, setTestResults] = useState<{url: string, status: string, element?: HTMLImageElement}[]>([])
  
  const testUrls = [
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
    'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', // Avengers Endgame
    'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers Infinity War
    '/images/fallback/poster.svg', // Local fallback
  ]
  
  const testImage = (url: string) => {
    const img = new Image()
    img.onload = () => {
      setTestResults(prev => [...prev, {url, status: 'SUCCESS', element: img}])
    }
    img.onerror = () => {
      setTestResults(prev => [...prev, {url, status: 'FAILED', element: img}])
    }
    img.src = url
  }
  
  const runAllTests = () => {
    setTestResults([])
    testUrls.forEach(url => testImage(url))
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Debug</h1>
      
      <button 
        onClick={runAllTests}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-8"
      >
        Test All Images
      </button>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Test Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          {testResults.length === 0 ? (
            <p>Click "Test All Images" to run tests</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`p-2 rounded ${result.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="font-mono text-sm">{result.url}</div>
                  <div className="font-bold">{result.status}</div>
                  {result.element && (
                    <div className="text-xs">
                      Natural: {result.element.naturalWidth}x{result.element.naturalHeight}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Visual Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Visual Test:</h2>
          <div className="grid grid-cols-2 gap-4">
            {testUrls.map((url, index) => (
              <div key={index} className="border rounded p-2">
                <div className="text-xs font-mono mb-2 truncate">{url}</div>
                <div className="w-full h-32 bg-gray-200 rounded relative overflow-hidden">
                  <img 
                    src={url}
                    alt={`Test ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`Image ${index + 1} loaded:`, url)}
                    onError={() => console.log(`Image ${index + 1} failed:`, url)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* MediaPoster Test */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">MediaPoster Component Test:</h2>
        <div className="grid grid-cols-4 gap-4">
          {testUrls.map((url, index) => (
            <div key={index} className="border rounded p-2">
              <div className="text-xs font-mono mb-2 truncate">{url}</div>
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                <img
                  src={url}
                  alt={`MediaPoster Test ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onLoad={() => console.log(`MediaPoster ${index + 1} loaded:`, url)}
                  onError={() => console.log(`MediaPoster ${index + 1} failed:`, url)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Console Logs:</h2>
        <p className="text-sm text-gray-600">Check the browser console (F12) for detailed loading logs</p>
      </div>
    </div>
  )
}
