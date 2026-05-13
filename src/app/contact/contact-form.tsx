'use client'

import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email').max(200),
  context: z.string().max(200).optional(),
  message: z.string().min(10, 'Tell me a bit more').max(4000),
  company: z.string().max(200).optional(),
})

type FormState = z.infer<typeof schema>

const empty: FormState = { name: '', email: '', context: '', message: '', company: '' }

export function ContactForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState
        if (!next[key]) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    setPending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Request failed (${res.status})`)
      }
      setSent(true)
      setForm(empty)
      toast.success('Message sent. I will reply within 24 hours.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setErrors({ message: msg })
      toast.error('Could not send. Try email instead: pratikpatilui@gmail.com')
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
          Received
        </p>
        <p className="mt-2 text-body text-[var(--color-fg)]">
          Message landed. I will reply within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <input
        type="text"
        name="company"
        value={form.company ?? ''}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[10000px] h-0 w-0 opacity-0"
      />

      <Field label="Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoComplete="name"
          className="input"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          className="input"
        />
      </Field>

      <Field label="Your role or company (optional)" error={errors.context}>
        <input
          type="text"
          value={form.context ?? ''}
          onChange={(e) => setForm({ ...form, context: e.target.value })}
          placeholder="e.g. Hiring manager at a fintech in NYC"
          className="input"
        />
      </Field>

      <Field label="Message" error={errors.message}>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={6}
          className="input resize-y"
        />
      </Field>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110 disabled:opacity-60"
        >
          {pending ? 'Sending...' : 'Send message'}
        </button>
      </div>

      <style>{`.input{width:100%;background:var(--color-elevated);border:1px solid var(--color-border);border-radius:var(--radius-sm);color:var(--color-fg);padding:.6rem .75rem;font-size:14px;font-family:inherit;}
      .input:focus{outline:2px solid var(--color-focus);outline-offset:1px;}`}</style>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[12px] tracking-tight text-[var(--color-fg-muted)] uppercase">
        {label}
      </span>
      {children}
      {error ? (
        <span className="font-mono text-[12px] text-[var(--color-warning,oklch(0.8_0.13_50))]">
          {error}
        </span>
      ) : null}
    </label>
  )
}
