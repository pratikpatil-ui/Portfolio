'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Lock } from 'lucide-react'
import { SectionWrapper } from '@/components/common/section-wrapper'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { projects } from '@/data/projects'

export function ProjectsSection() {
  const categoryColors = {
    enterprise: 'bg-primary/10 text-primary border-primary/20',
    personal: 'bg-[hsl(var(--accent-gold))]/10 text-[hsl(var(--accent-gold))] border-[hsl(var(--accent-gold))]/20',
    academic: 'bg-[hsl(var(--accent-copper))]/10 text-[hsl(var(--accent-copper))] border-[hsl(var(--accent-copper))]/20',
  }

  return (
    <SectionWrapper id="projects" background="default">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Projects
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of projects showcasing my technical expertise
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className="group"
            >
              <div className="bg-card rounded-lg border border-border/50 p-6 h-full flex flex-col hover:border-primary/30 transition-colors duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${categoryColors[project.category]}`}>
                      {project.category}
                    </span>
                    {project.isEnterprise && (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Title & Role */}
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {project.role && (
                  <p className="text-xs text-primary mb-2">{project.role}</p>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1 mb-4">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2 py-0.5 text-xs text-muted-foreground">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-3 border-t border-border/50 mt-auto">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </a>
                  )}
                  {project.isEnterprise && !project.demo && !project.github && (
                    <span className="text-xs text-muted-foreground italic">
                      Enterprise product (no public link)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
