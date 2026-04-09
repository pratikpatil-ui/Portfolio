'use client'

import { motion } from 'framer-motion'
import { Palette, Server, Database, Cloud, Code, CheckCircle, BarChart, Lightbulb } from 'lucide-react'
import { SectionWrapper } from '@/components/common/section-wrapper'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { skillCategories } from '@/data/skills'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  Server,
  Database,
  Cloud,
  Code,
  CheckCircle,
  BarChart,
  Lightbulb,
}

export function SkillsSection() {
  return (
    <SectionWrapper id="skills" background="sage">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {skillCategories.map((category) => {
            const IconComponent = iconMap[category.icon]
            return (
              <motion.div
                key={category.name}
                variants={fadeInUp}
                className="bg-card rounded-lg border border-border/50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-muted rounded text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
