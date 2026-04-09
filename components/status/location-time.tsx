'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock } from 'lucide-react'

/**
 * Location and Time Widget
 * Displays current location and local time
 */
export function LocationTime() {
  const [time, setTime] = useState('')
  const location = 'New York, USA'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">{location}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">{time || 'Loading...'}</span>
      </div>
    </div>
  )
}
