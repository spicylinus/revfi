import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Linus-Boscovitch',
  description: 'Built with Google Stitch + Claude Code + v0.dev + UI/UX Pro Max',
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
