'use client';

import React from 'react';
import { StyleWrapper } from '@/components/design-system/StyleWrapper';
import { motion } from 'framer-motion';

export default function SpruceSalonMockup() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as any }
  };

  return (
    <StyleWrapper style="editorial" className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-[var(--font-sans)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-background)] z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold font-[var(--font-display)] tracking-tight"
        >
          SPRUCE SALON
        </motion.div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em]">
          {['Services', 'Portfolio', 'Our Story', 'Contact'].map((item, i) => (
            <motion.a 
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * (i + 1) }}
              href="#" 
              className="hover:opacity-60 transition-opacity"
            >
              {item}
            </motion.a>
          ))}
        </div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-background)] text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-opacity"
        >
          Book Experience
        </motion.button>
      </nav>

      {/* Hero */}
      <section className="px-8 py-32 md:py-56 flex flex-col items-center text-center max-w-7xl mx-auto overflow-hidden">
        <motion.span 
          {...fadeUp}
          className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-60 block"
        >
          Established 2018 — Austin, TX
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-[120px] font-[var(--font-display)] mb-12 leading-[0.85] tracking-tighter"
        >
          The art of <br /><span className="italic underline decoration-1 underline-offset-8">being you.</span>
        </motion.h1>
        <motion.p 
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="text-[var(--color-text-muted)] max-w-2xl mb-16 text-xl leading-relaxed font-light"
        >
          A bespoke salon experience designed for the modern individual. 
          Our master stylists specialize in editorial-grade color and precision cutting.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <button className="px-12 py-5 bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase text-[11px] tracking-[0.2em] hover:opacity-90 transition-opacity">
            Reserve Your Session
          </button>
          <button className="px-12 py-5 border border-[var(--color-border)] font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[var(--color-surface-muted)] transition-colors">
            Explore Services
          </button>
        </motion.div>
      </section>

      {/* Hero Image Section */}
      <section className="px-8 mb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full aspect-[21/9] bg-[var(--color-surface-muted)] overflow-hidden relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2000&auto=format&fit=crop" 
            alt="Salon Interior" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent opacity-40" />
        </motion.div>
      </section>

      {/* Featured Services */}
      <section className="px-8 py-32 bg-[var(--color-surface-muted)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-5xl font-[var(--font-display)] leading-none">Curated <br />Services</h2>
            <p className="max-w-sm text-sm text-[var(--color-text-muted)] leading-relaxed">
              We believe in quality over quantity. Each service is tailored to your unique hair profile and lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                name: 'Editorial Cut', 
                price: '$95+', 
                desc: 'Precision cutting techniques designed for longevity and effortless style.',
                img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Lived-in Color', 
                price: '$180+', 
                desc: 'Bespoke hand-painted techniques for natural, sun-kissed dimension.',
                img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'The Ritual', 
                price: '$75+', 
                desc: 'Deep conditioning treatment paired with a signature blowout.',
                img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop'
              }
            ].map((s, i) => (
              <motion.div 
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col group cursor-pointer"
              >
                <div className="overflow-hidden mb-8 aspect-[4/5] bg-[var(--color-border)] relative">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="text-2xl font-[var(--font-display)]">{s.name}</h3>
                  <span className="text-sm font-medium opacity-60">{s.price}</span>
                </div>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">{s.desc}</p>
                <div className="w-full h-px bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Integration (Mockup) */}
      <section className="px-8 py-40 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]"
        >
          <div className="p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--color-border)]">
            <h2 className="text-4xl font-[var(--font-display)] mb-6">Begin Your <br />Transformation</h2>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">
              We recommend booking 2-3 weeks in advance. For first-time color clients, a consultation is required.
            </p>
            <div className="space-y-2 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                <span>Tuesday – Friday</span>
                <span>10am – 8pm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                <span>Saturday</span>
                <span>9am – 6pm</span>
              </div>
            </div>
          </div>
          <div className="p-16 bg-[var(--color-background)]">
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-60">Service Category</label>
                  <div className="p-4 border border-[var(--color-border)] flex justify-between items-center text-xs cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                    <span>Precision Cutting</span>
                    <span>↓</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-60">Preferred Stylist</label>
                  <div className="p-4 border border-[var(--color-border)] flex justify-between items-center text-xs cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                    <span>Any Senior Stylist</span>
                    <span>↓</span>
                  </div>
                </div>
                <button className="w-full py-5 bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase text-[11px] tracking-[0.2em] mt-4 hover:opacity-90 transition-opacity">
                  Check Availability
                </button>
             </div>
          </div>
        </motion.div>
      </section>

      <footer className="px-8 py-24 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="text-xl font-bold font-[var(--font-display)]">SPRUCE SALON</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-[10px] uppercase tracking-widest font-bold">
            <div className="flex flex-col gap-4">
              <span className="opacity-40">Follow</span>
              <a href="#" className="hover:text-[var(--color-accent)]">Instagram</a>
              <a href="#" className="hover:text-[var(--color-accent)]">Pinterest</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="opacity-40">Visit</span>
              <span>1201 S Congress Ave<br />Austin, TX 78704</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="opacity-40">Connect</span>
              <a href="mailto:hello@spruceaustin.com" className="hover:text-[var(--color-accent)]">hello@spruceaustin.com</a>
              <span>512.555.0199</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-[var(--color-border)] opacity-30 text-[9px] uppercase tracking-[0.2em] flex justify-between">
          <span>© 2026 Spruce Salon</span>
          <span>Privacy / Terms</span>
        </div>
      </footer>
    </StyleWrapper>
  );
}
