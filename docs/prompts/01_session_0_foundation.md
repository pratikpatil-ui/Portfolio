# Session 0: Foundation

## Your mission this session

Scaffold a Next.js 15 project for Pratik Patil's personal portfolio. End state: a deployed Vercel preview with a routing skeleton, design tokens, fonts, theme toggle, lint, and a folder structure ready for Phase 1. No visual UI yet. Empty pages that resolve.

Stop when the foundation is wired and deployed. Do not start building the hero, case studies, or any visible page content. That is Session 1's job.

This is the first of 7 sessions. Each session has its own scope. Strictly stay inside this session's scope.

---

## Profile facts (single source of truth, do not modify)

```ts
// content/profile.ts
export const profile = {
  name: "Pratik Patil",
  location: "Jersey City, NJ",
  openTo: "NYC, hybrid, remote US, relocation anywhere in US",
  email: "pratikpatilui@gmail.com",
  phone: "+1 201-993-4276",
  linkedin: "https://www.linkedin.com/in/pratik-patil-ui/",
  github: "https://github.com/pratikpatil-ui",
  domain: "https://pratikpatil.dev",
  workAuth: "Authorized to work in US. H1B Transfer required.",
  yearsExperience: 7,
  currentRole: "Senior Software Engineer, Full Stack",
  currentCompany: "BDIPlus",
  currentCompanyContext: "Enterprise SaaS for banking compliance and customer data platforms. Microsoft is the distribution partner.",
  // Display rule: never show client logos. Use prose like "Fortune 100 banking client".
  clientNames: ["American Express", "Citizens Bank", "Morgan Stanley", "Afficiency"],
  education: [
    { degree: "M.S. Computer Science", school: "Stevens Institute of Technology", year: "Dec 2022", gpa: "3.8/4.0" },
    { degree: "B.E. Information Technology", school: "University of Pune", year: "Jun 2018", gpa: "3.7/4.0" },
  ],
  certifications: ["Microsoft Azure Fundamentals (AZ-900), Jan 2021"],
};
```

Headline metrics (use these exact values, do not invent):
- 7 years production engineering experience
- 28-module React 18 migration in a 7-day sprint
- Time to Interactive cut from 7.2s to 2s
- 10K-node D3.js network graph (star-field universe view)
- React Native iOS and Android shipped in 3 months
- 4 pricing tiers on multi-tenant SaaS with Stripe Checkout
- Coordinated 5-engineer mobile team, mentored 3 juniors
- Accenture: 1.2M records across 195 countries, 4x throughput, 96% data quality improvement, GBP 330K bid wins

---

(See the original prompt in the conversation history; this file is a snapshot saved at the end of Session 0.)
