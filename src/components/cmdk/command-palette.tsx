'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  Home,
  Briefcase,
  FlaskConical,
  BookOpen,
  Compass,
  User,
  FileText,
  Mail,
  Bot,
  Copy,
  Phone,
  Download,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react'
import { OPEN_PALETTE_EVENT, openAssistant } from '@/lib/events'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { SOCIAL, RESUME_PDF_PATH } from '@/lib/constants'
import { caseStudies } from '@/content/case-studies'

const NAV = [
  { value: 'nav-home', label: 'Home', href: '/', Icon: Home },
  { value: 'nav-work', label: 'Work', href: '/work', Icon: Briefcase },
  { value: 'nav-lab', label: 'Lab', href: '/lab', Icon: FlaskConical },
  { value: 'nav-writing', label: 'Writing', href: '/writing', Icon: BookOpen },
  { value: 'nav-now', label: 'Now', href: '/now', Icon: Compass },
  { value: 'nav-about', label: 'About', href: '/about', Icon: User },
  { value: 'nav-resume', label: 'Resume', href: '/resume', Icon: FileText },
  { value: 'nav-contact', label: 'Contact', href: '/contact', Icon: Mail },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  useBodyScrollLock(open)
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const inEditable =
        tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable === true
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (inEditable && !open) return
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }
  function external(url: string) {
    setOpen(false)
    window.open(url, '_blank', 'noreferrer')
  }
  async function copy(text: string, msg: string) {
    setOpen(false)
    try {
      await navigator.clipboard.writeText(text)
      toast.success(msg)
    } catch {
      toast.error('Could not copy')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 pt-[10vh]"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] shadow-2xl"
      >
        <Command label="Command palette">
          <Command.Input
            autoFocus
            placeholder="Search pages, case studies, actions..."
            className="w-full border-b border-[var(--color-border-muted)] bg-transparent px-4 py-3 text-body text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)]"
          />
          <Command.List className="max-h-[60vh] overflow-y-auto px-2 py-2">
            <Command.Empty className="px-3 py-6 text-center text-caption text-[var(--color-fg-subtle)]">
              No matches.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="text-[var(--color-fg-subtle)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              {NAV.map(({ value, label, href, Icon }) => (
                <Item key={value} value={value} onSelect={() => go(href)} Icon={Icon}>
                  {label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Case studies"
              className="text-[var(--color-fg-subtle)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              {caseStudies.map((c) => (
                <Item
                  key={`cs-${c.slug}`}
                  value={`cs-${c.slug} ${c.title}`}
                  onSelect={() => go(`/work/${c.slug}`)}
                  Icon={Briefcase}
                  hint={c.eyebrow}
                >
                  {c.title}
                </Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Actions"
              className="text-[var(--color-fg-subtle)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              <Item
                value="theme-toggle"
                onSelect={() => {
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                  setOpen(false)
                }}
                Icon={resolvedTheme === 'dark' ? Sun : Moon}
              >
                Toggle theme
              </Item>
              <Item
                value="open-assistant"
                onSelect={() => {
                  setOpen(false)
                  openAssistant()
                }}
                Icon={Bot}
              >
                Ask the assistant
              </Item>
              <Item
                value="copy-email"
                onSelect={() => {
                  void copy(SOCIAL.email, 'Email copied')
                }}
                Icon={Copy}
                hint={SOCIAL.email}
              >
                Copy email
              </Item>
              <Item
                value="copy-phone"
                onSelect={() => {
                  void copy(SOCIAL.phone, 'Phone copied')
                }}
                Icon={Phone}
                hint={SOCIAL.phone}
              >
                Copy phone
              </Item>
              <Item
                value="download-resume"
                onSelect={() => {
                  setOpen(false)
                  window.location.href = RESUME_PDF_PATH
                }}
                Icon={Download}
              >
                Download resume
              </Item>
            </Command.Group>

            <Command.Group
              heading="External"
              className="text-[var(--color-fg-subtle)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              <Item value="ext-linkedin" onSelect={() => external(SOCIAL.linkedin)} Icon={ExternalLink}>
                LinkedIn
              </Item>
              <Item value="ext-github" onSelect={() => external(SOCIAL.github)} Icon={ExternalLink}>
                GitHub
              </Item>
              <Item value="ext-biomaker" onSelect={() => external(SOCIAL.bioMaker)} Icon={ExternalLink}>
                Bio Maker (live)
              </Item>
              <Item
                value="ext-email"
                onSelect={() => {
                  setOpen(false)
                  window.location.href = `mailto:${SOCIAL.email}`
                }}
                Icon={Mail}
              >
                Email mailto
              </Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}

function Item({
  value,
  onSelect,
  children,
  Icon,
  hint,
}: {
  value: string
  onSelect: () => void
  children: React.ReactNode
  Icon: React.ComponentType<{ className?: string }>
  hint?: string
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-caption text-[var(--color-fg-muted)] data-[selected=true]:bg-[var(--color-surface)] data-[selected=true]:text-[var(--color-fg)]"
    >
      <Icon className="h-4 w-4 text-[var(--color-fg-subtle)]" />
      <span className="flex-1">{children}</span>
      {hint ? (
        <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{hint}</span>
      ) : null}
    </Command.Item>
  )
}
