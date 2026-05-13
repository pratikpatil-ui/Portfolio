export const profile = {
  name: 'Pratik Patil',
  location: 'Jersey City, NJ',
  openTo: 'NYC, hybrid, remote US, relocation anywhere in US',
  email: 'pratikpatilui@gmail.com',
  phone: '+1 201-993-4276',
  linkedin: 'https://www.linkedin.com/in/pratik-patil-ui/',
  github: 'https://github.com/pratikpatil-ui',
  domain: 'https://pratikpatil.dev',
  bioMaker: 'https://bio-maker-in.vercel.app',
  tulsee: 'https://github.com/pratikpatil-ui/work-management-collab-tool',
  workAuth: 'Authorized to work in US. H1B Transfer required. Available immediately.',
  yearsExperience: 7,
  currentRole: 'Senior Software Engineer, Full Stack at BDIPlus',
  currentCompany: 'BDIPlus',
  currentCompanyContext:
    'Enterprise SaaS for banking compliance and customer data platforms distributed under a Microsoft partnership.',
  education: [
    {
      degree: 'M.S. Computer Science',
      school: 'Stevens Institute of Technology',
      year: 'Dec 2022',
      gpa: '3.8/4.0',
    },
    {
      degree: 'B.E. Information Technology',
      school: 'University of Pune',
      year: 'Jun 2018',
      gpa: '3.7/4.0',
    },
  ],
  certifications: ['Microsoft Certified: Azure Fundamentals (AZ-900), Jan 2021'],
} as const

export type HomeMetric = {
  value: string
  label: string
  footnote: string
  emphasis?: 'ai'
}

export const metrics: HomeMetric[] = [
  { value: '7', label: 'years production', footnote: 'React, React Native, full stack' },
  { value: '28', label: 'module React 18 migration', footnote: '7-day sprint' },
  { value: '7.2s to 2s', label: 'Time to Interactive cut', footnote: 'verified in Lighthouse' },
  {
    value: '10K',
    label: 'node D3 network graph',
    footnote: 'star-field universe view',
    emphasis: 'ai',
  },
  {
    value: '3 months',
    label: 'React Native to both stores',
    footnote: 'no prior mobile experience',
  },
]
