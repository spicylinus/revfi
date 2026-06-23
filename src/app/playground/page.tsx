'use client';

import React from 'react';
import { StyleWrapper } from '@/components/design-system/StyleWrapper';
import { StyleSwitcher } from '@/components/design-system/StyleSwitcher';
import { DESIGN_STYLE_NAMES, DESIGN_STYLE_DESCRIPTIONS, type DesignStyle } from '@/lib/style-presets';

const STYLES = Object.keys(DESIGN_STYLE_NAMES) as DesignStyle[];

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Web Design Playground</h1>
          <p className="text-slate-600">
            Experiment with different design styles and component patterns for the website redesign deliverable.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {STYLES.map((style) => (
            <StyleWrapper 
              key={style} 
              style={style} 
              className="p-8 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-base)] flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {DESIGN_STYLE_NAMES[style]}
                </h2>
                <p className="text-[var(--text-muted)] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                  {DESIGN_STYLE_DESCRIPTIONS[style]}
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  className="px-6 py-3 bg-[var(--primary)] text-[var(--background)] font-bold rounded-[var(--radius-base)] shadow-[var(--shadow-sm)] hover:opacity-90 transition-all"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Primary Action
                </button>
                
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-[var(--surface-muted)] rounded-[var(--radius-sm)] text-[var(--text)] text-xs font-mono">
                    Token: --primary
                  </div>
                  <div className="flex-1 p-4 bg-[var(--accent)] rounded-[var(--radius-sm)] text-[var(--background)] text-xs font-bold text-center">
                    Accent
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)]" />
                  <div>
                    <div className="text-sm font-bold text-[var(--text)]">Component Example</div>
                    <div className="text-xs text-[var(--text-muted)]">Using design tokens</div>
                  </div>
                </div>
              </div>
            </StyleWrapper>
          ))}
        </div>

        <section className="bg-white p-12 rounded-[40px] border border-slate-200">
          <h2 className="text-3xl font-bold mb-8">Component Pipeline POC</h2>
          <p className="mb-8 text-slate-600 max-w-2xl">
            This demonstrates how components from v0.dev or 21st.dev are integrated. 
            The workflow ensures all hardcoded colors are replaced with these CSS variables.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">1. Generate</h3>
              <p className="text-slate-400 text-sm">Use AI tools to generate the raw React component based on client requirements.</p>
            </div>
            <div className="p-8 bg-primary rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">2. Tokenize</h3>
              <p className="text-blue-100 text-sm">Replace hardcoded hex codes with our standard CSS variable system.</p>
            </div>
            <div className="p-8 bg-accent rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">3. Deploy</h3>
              <p className="text-emerald-100 text-sm">The component now automatically adapts to whichever style preset the client chooses.</p>
            </div>
          </div>
        </section>
      </div>

      <StyleSwitcher />
    </div>
  );
}
