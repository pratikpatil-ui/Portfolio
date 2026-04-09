'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { SectionWrapper } from '@/components/common/section-wrapper'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { SITE_CONFIG } from '@/lib/constants'

export function ContactSection() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('loading')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setFormState('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setFormState('idle'), 5000)
      } else {
        setFormState('error')
        setTimeout(() => setFormState('idle'), 5000)
      }
    } catch (error) {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 5000)
    }
  }

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: SITE_CONFIG.author.email,
      href: `mailto:${SITE_CONFIG.author.email}`,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'pratik-patil-dev',
      href: SITE_CONFIG.author.linkedin,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'pratikpatil-ui',
      href: SITE_CONFIG.author.github,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: SITE_CONFIG.author.location,
      href: null,
    },
  ]

  return (
    <SectionWrapper id="contact" background="default">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Open to full-time opportunities and interesting projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                  placeholder="Your name"
                  disabled={formState === 'loading'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                  placeholder="your.email@example.com"
                  disabled={formState === 'loading'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none resize-none"
                  placeholder="Tell me about your project..."
                  disabled={formState === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'loading' || formState === 'success'}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formState === 'loading' && (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                )}
                {formState === 'success' && (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Message Sent!
                  </>
                )}
                {formState === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Failed - Try Again
                  </>
                )}
                {formState === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Links */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactLinks.map((link) => (
              <motion.div key={link.label} variants={fadeInUp}>
                {link.href ? (
                  <a
                    href={link.href}
                    target={link.label !== 'Email' ? '_blank' : undefined}
                    rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{link.label}</p>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {link.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/50">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{link.label}</p>
                      <p className="font-medium">{link.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
