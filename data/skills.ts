export interface SkillCategory {
  name: string
  icon: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "Palette",
    skills: [
      "React 18",
      "Redux",
      "Next.js",
      "Material-UI",
      "React Flow",
      "D3.js",
      "React Native",
    ],
  },
  {
    name: "Languages",
    icon: "Code",
    skills: [
      "JavaScript (ES6+)",
      "TypeScript",
      "Python",
      "HTML5",
      "CSS3",
      "SQL",
    ],
  },
  {
    name: "Backend & APIs",
    icon: "Server",
    skills: [
      "Node.js",
      "Express",
      "REST APIs",
      "GraphQL",
      "Stripe API",
      "SSO",
    ],
  },
  {
    name: "Testing",
    icon: "CheckCircle",
    skills: [
      "Jest",
      "React Testing Library",
    ],
  },
  {
    name: "Data & Visualization",
    icon: "BarChart",
    skills: [
      "D3.js",
      "React Flow",
      "Virtual Scrolling",
      "Pagination",
      "Data Grids",
    ],
  },
  {
    name: "Infrastructure",
    icon: "Database",
    skills: [
      "Firebase",
      "Redis",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Webpack",
      "CI/CD",
    ],
  },
  {
    name: "Cloud",
    icon: "Cloud",
    skills: [
      "AWS",
      "Azure (AZ-900 Certified)",
      "GCP",
    ],
  },
  {
    name: "Practices",
    icon: "Lightbulb",
    skills: [
      "Performance Profiling",
      "Component Architecture",
      "Responsive Design",
      "WCAG 2.1",
      "Multi-Tenant Architecture",
      "Feature Flags",
      "Agile/Scrum",
    ],
  },
]

export const techStackIcons = [
  "React",
  "Redux",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "D3.js",
  "Node.js",
  "Tailwind",
  "Firebase",
  "Redis",
  "Git",
]
