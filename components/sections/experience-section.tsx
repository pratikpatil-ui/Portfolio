'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, Award, Building2 } from 'lucide-react'
import { SectionWrapper } from '@/components/common/section-wrapper'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { experiences } from '@/data/experience'

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience" background="sage">
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
            Experience
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Experience Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {experiences.map((exp) => (
            <motion.div
              key={exp.company}
              variants={fadeInUp}
              className="bg-card rounded-lg border border-border/50 p-6 md:p-8"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-primary">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">
                        {exp.company}
                        {exp.product && <span className="text-muted-foreground"> ({exp.product})</span>}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.startDate} - {exp.endDate}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-muted rounded text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 mb-6">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Clients & Partnership */}
              {(exp.clients || exp.partnership) && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  {exp.clients && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Enterprise clients: </span>
                      <span className="font-medium">{exp.clients.join(', ')}</span>
                    </p>
                  )}
                  {exp.partnership && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Partnership: </span>
                      <span className="font-medium">{exp.partnership}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Awards */}
              {exp.awards && exp.awards.length > 0 && (
                <div className="pt-4 border-t border-border/50 mt-4">
                  <div className="flex items-center gap-2 text-[hsl(var(--accent-gold))]">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {exp.awards.join(' • ')}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
