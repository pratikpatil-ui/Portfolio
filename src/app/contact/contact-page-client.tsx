'use client'

import { useState } from 'react'
import { ContactForm } from './contact-form'

export function ContactClient() {
  const [showForm, setShowForm] = useState(false)
  return (
    <>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          {showForm ? 'Hide form' : 'Prefer a form?'} →
        </button>
      </div>

      {showForm ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-6">
          <ContactForm />
        </div>
      ) : null}
    </>
  )
}
