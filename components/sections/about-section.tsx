'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/common/section-wrapper'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { techStackIcons } from '@/data/skills'

export function AboutSection() {
  return (
    <SectionWrapper id="about" background="sage">
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
            About Me
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Bio */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-4 mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg leading-relaxed text-center text-muted-foreground"
          >
            <span className="text-foreground font-medium">7+ years of experience</span> building
            production applications. Currently the{' '}
            <span className="text-foreground font-medium">sole frontend architect at BDIPlus</span>,
            reporting directly to the VP and CEO.
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg leading-relaxed text-center text-muted-foreground"
          >
            Led a{' '}
            <span className="text-foreground font-medium">React 18 migration across 28 modules</span>{' '}
            in a 7-day sprint for Microsoft distribution. Built the{' '}
            <span className="text-foreground font-medium">SaaS subscription system with Stripe</span>{' '}
            for enterprise clients including Morgan Stanley.
          </motion.p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-medium text-muted-foreground text-center mb-6 uppercase tracking-wider">
            Tech Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStackIcons.map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 bg-card rounded-lg border border-border/50 text-sm font-medium text-foreground"
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
