export interface Project {
  id: string
  title: string
  description: string
  role?: string
  technologies: string[]
  highlights: string[]
  github?: string
  demo?: string
  isEnterprise: boolean
  category: 'enterprise' | 'personal' | 'academic'
}

export const projects: Project[] = [
  {
    id: "chatcdp",
    title: "ChatCDP.ai",
    description: "Multi-tenant AI SaaS product for enterprise data analytics",
    role: "Sole Frontend Architect",
    technologies: ["React 18", "Redux", "D3.js", "SSE", "Stripe", "SSO", "Redis"],
    highlights: [
      "Real-time chat UI with streaming responses",
      "1000+ data point rendering via D3.js",
      "Multi-tenant theming and admin hierarchy",
    ],
    isEnterprise: true,
    category: "enterprise",
  },
  {
    id: "biomaker",
    title: "Bio Maker",
    description: "Biodata builder for Indian matrimonial profiles",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "jsPDF"],
    highlights: [
      "200+ biodatas generated",
      "Sub-2s mobile load time",
      "PDF export functionality",
    ],
    demo: "https://bio-maker-in.vercel.app",
    github: "https://github.com/pratikpatil-ui/bio-maker",
    isEnterprise: false,
    category: "personal",
  },
  {
    id: "tulsee",
    title: "TULSEE",
    description: "Real-time collaboration and project management platform",
    technologies: ["React", "Redux", "Next.js", "Node.js", "Socket.IO", "Firebase"],
    highlights: [
      "Group chat with E2E encryption",
      "Zoom API integration for meetings",
      "Google SSO authentication",
    ],
    github: "https://github.com/pratikpatil-ui/tulsee",
    isEnterprise: false,
    category: "personal",
  },
  {
    id: "mobile-app",
    title: "React Native Mobile App",
    description: "Cross-platform mobile app for iOS and Android",
    role: "Lead Developer (5-person team)",
    technologies: ["React Native", "Redux"],
    highlights: [
      "Shipped in 3 months",
      "Full lifecycle from architecture to App Store deployment",
      "Memory management and OS compatibility optimization",
    ],
    isEnterprise: true,
    category: "enterprise",
  },
  {
    id: "workflow-dashboard",
    title: "Workflow Dashboard",
    description: "Interactive workflow visualization for task management",
    technologies: ["React Flow", "React"],
    highlights: [
      "Real-time task tracking",
      "Improved team visibility by 30%",
      "Drag-and-drop workflow editing",
    ],
    isEnterprise: true,
    category: "enterprise",
  },
  {
    id: "marketplace",
    title: "Marketplace Feature",
    description: "Comprehensive marketplace feature in the web UI",
    technologies: ["React", "Redux"],
    highlights: [
      "Shipped to production",
      "Presented to stakeholders",
      "Seamless user experience",
    ],
    isEnterprise: true,
    category: "enterprise",
  },
  {
    id: "data-viz-engine",
    title: "Data Visualization Engine",
    description: "Rendering engine for complex data queries",
    technologies: ["D3.js", "React", "Virtual Scrolling"],
    highlights: [
      "Renders 1,000+ data points per query",
      "Charts, tables, and markdown support",
      "Optimized for performance",
    ],
    isEnterprise: true,
    category: "enterprise",
  },
  {
    id: "youid",
    title: "NFC-based YouID",
    description: "NFC tag-based identification and data management system",
    technologies: ["Android Studio", "Java", "Cloud Services"],
    highlights: [
      "Bio-compatible NFC tag integration",
      "Cloud-based data storage",
      "University capstone project",
    ],
    isEnterprise: false,
    category: "academic",
  },
]
