export interface Achievement {
  id: string
  title: string
  description: string
  metric?: string
  icon?: string
  date: string
  category: 'award' | 'certification' | 'milestone'
}

export const achievements: Achievement[] = [
  {
    id: "apex-award",
    title: "Apex Award for Innovation and Thought Leadership",
    description: "Recognized at Accenture for driving innovation and demonstrating exceptional thought leadership in technical solutions",
    icon: "🏆",
    date: "2020",
    category: "award",
  },
  {
    id: "bt-spark-award",
    title: "BT Spark Award for Standard Performer",
    description: "Awarded for consistently delivering high-quality work and meeting performance standards at Accenture",
    icon: "⭐",
    date: "2020",
    category: "award",
  },
  {
    id: "azure-certified",
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    description: "Demonstrated foundational knowledge of cloud services and how those services are provided with Microsoft Azure",
    icon: "☁️",
    date: "January 2021",
    category: "certification",
  },
]

export interface Education {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa: number
  highlights?: string[]
}

export const education: Education[] = [
  {
    degree: "M.S. Computer Science",
    institution: "Stevens Institute of Technology",
    location: "Hoboken, NJ, USA",
    startDate: "August 2021",
    endDate: "December 2022",
    gpa: 3.8,
    highlights: [
      "Focus on Software Engineering and Full Stack Development",
      "Completed advanced coursework in Distributed Systems and Cloud Computing",
    ],
  },
  {
    degree: "B.E. Information Technology",
    institution: "University of Pune",
    location: "Pune, India",
    startDate: "August 2014",
    endDate: "June 2018",
    gpa: 3.7,
    highlights: [
      "Strong foundation in Computer Science fundamentals",
      "Developed multiple mobile and web applications",
    ],
  },
]

export interface ImpactMetric {
  label: string
  value: string | number
  change?: string
  icon: string
  description: string
}

export const impactMetrics: ImpactMetric[] = [
  {
    label: "Latency Improvement",
    value: "40%",
    change: "+40%",
    icon: "⚡",
    description: "Reduced user interaction latency through AI-driven chat interface",
  },
  {
    label: "TTI Improvement",
    value: "40%",
    change: "+40%",
    icon: "🚀",
    description: "Improved Time to Interactive using Chrome DevTools and Lighthouse",
  },
  {
    label: "Test Coverage",
    value: "90%",
    icon: "✅",
    description: "Achieved comprehensive test coverage with Jest and React Testing Library",
  },
  {
    label: "Production Incidents",
    value: "35%",
    change: "-35%",
    icon: "🛡️",
    description: "Reduced production incidents through robust testing",
  },
  {
    label: "Team Productivity",
    value: "30%",
    change: "+30%",
    icon: "📈",
    description: "Boosted productivity with React Flow workflow dashboard",
  },
  {
    label: "Compile Time",
    value: "50%",
    change: "-50%",
    icon: "⏱️",
    description: "Reduced compile time through legacy code refactoring",
  },
  {
    label: "Addresses Processed",
    value: "1.2M",
    icon: "🌍",
    description: "Validated and geocoded addresses across 195 countries",
  },
  {
    label: "Throughput Increase",
    value: "400%",
    change: "+400%",
    icon: "📊",
    description: "Enhanced data quality solution throughput at Accenture",
  },
]
