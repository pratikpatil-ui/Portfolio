'use client'

import { Github } from 'lucide-react'

/**
 * GitHub Activity Widget
 * Shows recent GitHub contributions (placeholder)
 * Can be connected to GitHub API for real-time stats
 *
 * To connect: Add GitHub personal access token to .env
 */
export function GitHubActivity() {
  // Placeholder data - replace with actual GitHub API call
  const stats = {
    contributions: 247,
    streak: 12,
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Github className="w-4 h-4 text-primary" />
      <div>
        <div className="font-medium text-foreground">
          {stats.contributions} contributions
        </div>
        <div className="text-muted-foreground">{stats.streak} day streak</div>
      </div>
    </div>
  )
}
