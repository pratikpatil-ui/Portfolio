export interface Education {
  degree: string
  field: string
  institution: string
  location: string
  gpa: string
  date: string
}

export interface Certification {
  name: string
  issuer: string
  credentialId?: string
}

export const education: Education[] = [
  {
    degree: "M.S.",
    field: "Computer Science",
    institution: "Stevens Institute of Technology",
    location: "Hoboken, NJ",
    gpa: "3.8",
    date: "Dec 2022",
  },
  {
    degree: "B.E.",
    field: "Information Technology",
    institution: "University of Pune",
    location: "Pune, India",
    gpa: "3.7",
    date: "Jun 2018",
  },
]

export const certifications: Certification[] = [
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    credentialId: "AZ-900",
  },
]
