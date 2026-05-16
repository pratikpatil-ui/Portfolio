// Resolve to whatever host is actually serving production traffic so social
// crawlers (WhatsApp, iMessage, Slack) fetch the OG image from a domain that
// actually resolves. `VERCEL_PROJECT_PRODUCTION_URL` becomes the custom apex
// once it's attached on Vercel; until then it's the *.vercel.app fallback.
const VERCEL_PROD_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const SITE_URL = VERCEL_PROD_HOST
  ? `https://${VERCEL_PROD_HOST}`
  : 'https://pratikpatil.dev'

export const SITE_NAME = 'Pratik Patil'

export const SITE_DESCRIPTION =
  'Senior software engineer. 7 years shipping React, React Native, and LLM product UIs for Fortune 100 banking, brokerage, and insurance. Sole frontend architect at an enterprise SaaS distributed by Microsoft.'

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/pratik-patil-ui/',
  github: 'https://github.com/pratikpatil-ui',
  email: 'pratikpatilui@gmail.com',
  phone: '+1 201-993-4276',
  bioMaker: 'https://bio-maker-in.vercel.app',
  tulsee: 'https://github.com/pratikpatil-ui/work-management-collab-tool',
} as const

export const RESUME_PDF_PATH = '/resumes/Pratik_Patil_Resume.pdf'

export const VISA_CAPTION = 'Authorized to work in US. H1B Transfer required. Available immediately.'

export const ROUTES = [
  '/',
  '/work',
  '/lab',
  '/writing',
  '/now',
  '/about',
  '/resume',
  '/contact',
] as const
