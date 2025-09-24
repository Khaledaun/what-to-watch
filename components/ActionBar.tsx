'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Shuffle } from 'lucide-react'

interface ActionBarProps {
  onGetPicks?: () => void
  onSurpriseMe?: () => void
  isLoading?: boolean
}

export function ActionBar({ onGetPicks, onSurpriseMe, isLoading = false }: ActionBarProps) {
  const [selectedService, setSelectedService] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const services = [
    { id: 'netflix', name: 'Netflix', color: 'bg-red-600' },
    { id: 'prime', name: 'Prime Video', color: 'bg-blue-600' },
    { id: 'disney', name: 'Disney+', color: 'bg-blue-500' },
    { id: 'hulu', name: 'Hulu', color: 'bg-green-600' },
    { id: 'max', name: 'Max', color: 'bg-purple-600' },
    { id: 'apple', name: 'Apple TV+', color: 'bg-gray-800' }
  ]

  const moods = [
    { id: 'feel-good', name: 'Feel Good' },
    { id: 'intense', name: 'Intense' },
    { id: 'funny', name: 'Funny' },
    { id: 'romantic', name: 'Romantic' },
    { id: 'thrilling', name: 'Thrilling' },
    { id: 'thoughtful', name: 'Thoughtful' }
  ]

  const timeOptions = [
    { id: 'short', name: 'Under 90 min' },
    { id: 'medium', name: '2-3 hours' },
    { id: 'long', name: 'Binge session' },
    { id: 'any', name: 'Any length' }
  ]

  const handleGetPicks = () => {
    if (onGetPicks) {
      onGetPicks()
    }
  }

  const handleSurpriseMe = () => {
    if (onSurpriseMe) {
      onSurpriseMe()
    }
  }

  return (
    <section className="bg-background/60 backdrop-blur border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Not sure what to watch tonight?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick a service + mood → get 3 picks in 30 seconds.
            </p>
          </div>

          {/* Controls */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {/* Service Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Streaming Service
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.slice(0, 4).map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`
                          h-11 px-3 rounded-lg border text-sm font-medium transition-all
                          ${selectedService === service.id 
                            ? `${service.color} text-white border-transparent` 
                            : 'bg-background hover:bg-muted border-border'
                          }
                        `}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Mood
                  </label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Choose mood...</option>
                    {moods.map((mood) => (
                      <option key={mood.id} value={mood.id}>
                        {mood.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Time Available
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Any length</option>
                    {timeOptions.map((time) => (
                      <option key={time.id} value={time.id}>
                        {time.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Get Recommendations
                  </label>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleGetPicks}
                      disabled={isLoading}
                      className="h-11 w-full bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Finding your picks...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Get 3 picks
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSurpriseMe}
                      disabled={isLoading}
                      className="h-11 w-full"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Surprise me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
