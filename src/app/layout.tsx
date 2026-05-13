import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RevFi Auditor',
  description: 'RevFi website auditor for local businesses. Analyze SEO, lead capture, mobile performance, and revenue leaks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        {children}
      </body>
    </html>
  )
}
