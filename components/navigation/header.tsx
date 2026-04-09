'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { SITE_CONFIG } from '@/lib/constants'

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect active section
  useEffect(() => {
    const sections = navigation.map(item => item.href.replace('#', ''))
    const sectionVisibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility map for each entry
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionVisibility.set(entry.target.id, entry.intersectionRatio)
          } else {
            sectionVisibility.delete(entry.target.id)
          }
        })

        // Find the section with highest visibility
        let maxRatio = 0
        let mostVisibleSection = ''

        sectionVisibility.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisibleSection = id
          }
        })

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--accent-gold))] hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <span className="text-lg font-bold text-primary-foreground tracking-tight">
              PP
            </span>
            <span className="absolute inset-0 rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const sectionId = item.href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveSection(sectionId)}
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={SITE_CONFIG.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={SITE_CONFIG.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.author.email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <ThemeToggle />
            <a
              href="/resume.pdf"
              download
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Resume
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
