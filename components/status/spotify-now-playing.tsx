'use client'

import { Music } from 'lucide-react'

/**
 * Spotify Now Playing Widget
 * Displays currently playing track (placeholder)
 * Can be connected to Spotify API with proper credentials
 *
 * To connect: Set up Spotify Developer App and add credentials to .env
 */
export function SpotifyNowPlaying() {
  // Placeholder data - replace with actual API call
  const isPlaying = false
  const track = {
    title: 'Coding Vibes',
    artist: 'Lo-Fi Beats',
  }

  if (!isPlaying) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Music className="w-4 h-4" />
        <span>Not playing</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Music className="w-4 h-4 text-primary animate-pulse" />
      <div>
        <div className="font-medium text-foreground">{track.title}</div>
        <div className="text-muted-foreground">{track.artist}</div>
      </div>
    </div>
  )
}
