import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/layout/toaster'
import { AssistantSheet } from '@/components/ai/assistant-sheet'
import { AssistantTrigger } from '@/components/ai/assistant-trigger'
import { CommandPalette } from '@/components/cmdk/command-palette'
import { geistSans, geistMono } from '@/lib/fonts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Senior Software Engineer, AI Product UI`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    title: `${SITE_NAME} | Senior Software Engineer, AI Product UI`,
    description: SITE_DESCRIPTION,
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Senior Software Engineer, AI Product UI`,
    description: SITE_DESCRIPTION,
    images: ['/api/og'],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pratik Patil',
  url: SITE_URL,
  jobTitle: 'Senior Software Engineer, Full Stack',
  worksFor: { '@type': 'Organization', name: 'BDIPlus' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jersey City',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
  sameAs: ['https://www.linkedin.com/in/pratik-patil-ui/', 'https://github.com/pratikpatil-ui'],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Stevens Institute of Technology' },
    { '@type': 'CollegeOrUniversity', name: 'University of Pune' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)]"
      >
        <ThemeProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <AssistantTrigger />
          <AssistantSheet />
          <CommandPalette />
          <Toaster />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
