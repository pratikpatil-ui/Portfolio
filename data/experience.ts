export interface Experience {
  company: string
  role: string
  product?: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  highlights: string[]
  technologies: string[]
  awards?: string[]
  clients?: string[]
  partnership?: string
}

export const experiences: Experience[] = [
  {
    company: "BDIPlus",
    product: "ChatCDP.ai",
    role: "Software Engineer III (Frontend)",
    location: "New York City",
    startDate: "Jul 2022",
    endDate: "Present",
    current: true,
    highlights: [
      "Led React 18 migration across 28 modules in 7-day sprint for Microsoft distribution",
      "Sole frontend architect — own all UI architecture, design decisions, and delivery",
      "Built SaaS subscription system: Stripe, SSO, multi-tenant admin-user hierarchy",
      "Developed real-time chat interface rendering 1,000 data points via D3.js charts, tables, markdown",
      "Reduced page load by 40% via React.lazy, memoization, eliminating re-renders",
      "Implemented pagination, virtual scrolling, error boundaries, skeleton loading, permission-based UI",
      "Designed workflow dashboard with React Flow for real-time task visualization",
      "Created marketplace feature shipped to production",
      "Shipped React Native mobile app (iOS + Android) in 3 months",
      "Mentored 3 junior engineers through code reviews and pair programming",
    ],
    technologies: [
      "React",
      "Redux",
      "D3.js",
      "SSE",
      "Stripe",
      "SSO",
      "React Native",
      "React Flow",
    ],
    clients: ["Morgan Stanley", "Afficiency"],
    partnership: "Product prepared for Microsoft distribution",
  },
  {
    company: "Accenture",
    role: "Application Development Analyst",
    location: "Pune, India",
    startDate: "Oct 2018",
    endDate: "Jul 2021",
    current: false,
    highlights: [
      "Automated address validation for 1.2M records across 195 countries (400% throughput increase)",
      "Python Scripting Subject Matter Expert — enhanced data quality solution by 96%",
      "Built location-analytics reporting system for global research parks",
    ],
    technologies: [
      "Python",
      "Pandas",
      "Selenium",
      "Flask",
      "Automation",
      "Data Quality",
    ],
    awards: [
      "Apex Award for Innovation",
      "BT Spark Award",
    ],
  },
]
