'use client'

import { useEffect, useState } from 'react'
import { DESIGN_STYLE_NAMES, type DesignStyle } from '@/lib/style-presets'

const STYLES = Object.keys(DESIGN_STYLE_NAMES) as DesignStyle[]

export function StyleSwitcher() {
  if (process.env.NODE_ENV !== 'development') return null

  return <StyleSwitcherPanel />
}

function StyleSwitcherPanel() {
  const [active, setActive] = useState<DesignStyle | null>(null)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-style') as DesignStyle | null
    setActive(current)
  }, [])

  function apply(style: DesignStyle) {
    document.documentElement.setAttribute('data-style', style)
    setActive(style)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        background: '#fff',
        border: '2px solid #000',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        boxShadow: '4px 4px 0 0 #000',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.75rem',
        maxWidth: '200px',
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Style Switcher
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => apply(style)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              textAlign: 'left',
              background: active === style ? '#000' : '#fff',
              color: active === style ? '#fff' : '#000',
              fontWeight: active === style ? 700 : 400,
            }}
          >
            {DESIGN_STYLE_NAMES[style]}
          </button>
        ))}
      </div>
    </div>
  )
}
