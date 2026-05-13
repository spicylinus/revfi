export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Linus-Boscovitch
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Design system scaffold ready. See CLAUDE.md to begin.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <a
            href="https://labs.google/stitch"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded text-sm font-medium text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Open Google Stitch
          </a>
          <a
            href="https://v0.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded text-sm font-medium"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            Open v0.dev
          </a>
        </div>
      </div>
    </main>
  )
}
