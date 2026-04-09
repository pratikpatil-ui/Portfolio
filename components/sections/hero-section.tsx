'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { GradientText } from '@/components/common/gradient-text'
import { TypingEffect } from '@/components/animated/typing-effect'
import { FloatingCodeScene } from '@/components/three/floating-code-scene'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const roles = [
    'Software Engineer',
    'Frontend Specialist',
    'React Expert',
    'Performance Engineer',
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Floating Background */}
      <FloatingCodeScene />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(var(--sage-wash))]/30 pointer-events-none" />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Name */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <GradientText variant="sage">
              Pratik Patil
            </GradientText>
          </h1>

          {/* Typing effect for role */}
          <div className="h-12 md:h-14 mb-6">
            <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground/80">
              <TypingEffect texts={roles} typingSpeed={80} deletingSpeed={40} />
            </p>
          </div>

          {/* One-liner */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            I build real-time, data-heavy interfaces for enterprise clients.
            Currently the sole frontend architect at BDIPlus, shipping{' '}
            <span className="text-primary font-medium">ChatCDP.ai</span> for Morgan Stanley.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <a
              href="#projects"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              View My Work
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="/resume.pdf"
              download
              className="px-8 py-3 border border-border hover:border-primary text-foreground hover:text-primary font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator - positioned relative to section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: Math.max(0, 1 - scrollY / 150) }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xs">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </motion.div>
    </section>
  )
}
