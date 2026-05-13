'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      toastOptions={{
        style: {
          background: 'var(--color-elevated)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-fg)',
        },
      }}
    />
  )
}
