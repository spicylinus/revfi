'use client';

import React from 'react';
import { StyleWrapper } from '@/components/design-system/StyleWrapper';
import { motion } from 'framer-motion';
import { Phone, Clock, Shield, Award, CheckCircle2, ChevronRight, Droplets, Flame, Hammer, Trash2, Bath, AlertTriangle } from 'lucide-react';

export default function SDPlumbingMockup() {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  };

  return (
    <StyleWrapper style="swiss" className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-[var(--font-sans)]">
      {/* Emergency Header */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-[var(--color-primary)] text-[var(--color-background)] py-4 px-8 text-center font-bold text-xl tracking-tighter uppercase sticky top-0 z-50 shadow-xl"
      >
        <span className="inline-flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          24/7 Emergency Service: (512) 555-0123 — Call Now for 60-Min Arrival
        </span>
      </motion.div>

      {/* Main Nav */}
      <nav className="flex flex-wrap items-center justify-between px-8 py-8 border-b-8 border-[var(--color-text)]">
        <div className="text-5xl font-black italic tracking-tighter leading-none mb-4 md:mb-0">
          S&D <br /> PLUMBING
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm font-black uppercase">
          {['Emergency', 'Residential', 'Commercial', 'Reviews', 'About'].map((item) => (
            <a key={item} href="#" className="hover:text-[var(--color-primary)] transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <a href="tel:5125550123" className="px-10 py-5 bg-[var(--color-text)] text-[var(--color-background)] font-black text-2xl hover:bg-[var(--color-primary)] transition-colors flex items-center gap-3">
          <Phone className="w-6 h-6" />
          CALL NOW
        </a>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="p-12 lg:p-24 border-b-8 lg:border-b-0 lg:border-r-8 border-[var(--color-text)] flex flex-col justify-center">
          <motion.h1 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-[140px] font-black uppercase leading-[0.8] tracking-tighter mb-12"
          >
            WE FIX <br /> <span className="text-[var(--color-primary)]">WHAT</span> <br /> BREAKS.
          </motion.h1>
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold uppercase mb-16 leading-tight max-w-lg"
          >
            Austin's highest rated plumbing team. <br />Licensed, insured, and ready 24/7.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <button className="px-12 py-8 bg-[var(--color-primary)] text-[var(--color-background)] font-black text-3xl uppercase hover:translate-x-2 hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_var(--color-text)]">
              Book Online
            </button>
            <button className="px-12 py-8 border-4 border-[var(--color-text)] font-black text-3xl uppercase hover:bg-[var(--color-surface-muted)] transition-colors">
              Our Rates
            </button>
          </motion.div>
        </div>
        <div className="bg-[var(--color-surface-muted)] p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
            {[
              { title: 'Leak Detection', icon: <Droplets className="w-10 h-10" /> },
              { title: 'Water Heaters', icon: <Flame className="w-10 h-10" /> },
              { title: 'Drain Cleaning', icon: <Trash2 className="w-10 h-10" /> },
              { title: 'Pipe Repair', icon: <Hammer className="w-10 h-10" /> },
              { title: 'Toilet Repair', icon: <Bath className="w-10 h-10" /> },
              { title: 'Emergency', icon: <AlertTriangle className="w-10 h-10" /> }
            ].map((s, i) => (
              <motion.div 
                key={s.title} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-[var(--color-background)] p-8 border-4 border-[var(--color-text)] hover:translate-x-2 hover:-translate-y-2 transition-transform cursor-pointer group shadow-[4px_4px_0px_var(--color-text)]"
              >
                <div className="text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <h3 className="text-2xl font-black uppercase group-hover:text-[var(--color-primary)]">{s.title}</h3>
              </motion.div>
            ))}
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 border-[40px] border-[var(--color-text)] opacity-5 rounded-full" />
        </div>
      </section>

      {/* Trust Grid */}
      <section className="bg-[var(--color-text)] text-[var(--color-background)] px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center uppercase">
          {[
            { val: '4.9', label: 'Google Rating', icon: <Award className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" /> },
            { val: '20+', label: 'Years in Austin', icon: <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" /> },
            { val: '10k+', label: 'Happy Clients', icon: <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" /> },
            { val: '60m', label: 'Avg. Arrival', icon: <Shield className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" /> }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {item.icon}
              <div className="text-6xl font-black mb-2">{item.val}</div>
              <div className="text-sm font-bold opacity-60 tracking-widest">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lead Generation Section */}
      <section className="px-8 py-32 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-6xl font-black uppercase leading-[0.9] mb-8"
          >
            Don't Wait <br /><span className="text-[var(--color-primary)]">Call the Experts</span>
          </motion.h2>
          <p className="text-xl font-bold uppercase mb-12 leading-tight">
            Plumbing issues get worse (and more expensive) every minute you wait. Get a free upfront quote today.
          </p>
          <ul className="space-y-6 font-black uppercase text-lg">
            {[
              'No hidden fees — ever',
              'Master Plumbers on staff',
              'Same-day service guaranteed'
            ].map((text) => (
              <li key={text} className="flex items-center gap-4 group">
                <span className="w-10 h-10 bg-[var(--color-primary)] flex items-center justify-center text-white border-2 border-[var(--color-text)] group-hover:rotate-12 transition-transform">✓</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-[var(--color-surface)] border-8 border-[var(--color-text)] p-12 shadow-[12px_12px_0px_var(--color-text)]"
        >
          <h3 className="text-4xl font-black uppercase mb-8 text-center">Get A Free Quote</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Full Name</label>
              <input type="text" placeholder="YOUR NAME" className="w-full p-5 border-4 border-[var(--color-text)] bg-[var(--color-background)] font-bold uppercase focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Phone Number</label>
              <input type="tel" placeholder="512-555-0123" className="w-full p-5 border-4 border-[var(--color-text)] bg-[var(--color-background)] font-bold uppercase focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Service Needed</label>
              <select className="w-full p-5 border-4 border-[var(--color-text)] bg-[var(--color-background)] font-bold uppercase focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer">
                <option>SELECT SERVICE</option>
                <option>LEAK REPAIR</option>
                <option>DRAIN CLEANING</option>
                <option>WATER HEATER</option>
                <option>OTHER</option>
              </select>
            </div>
            <button className="w-full py-6 bg-[var(--color-text)] text-[var(--color-background)] font-black text-2xl uppercase hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-3">
              SEND REQUEST
              <ChevronRight className="w-6 h-6" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Social Proof Footer */}
      <footer className="border-t-8 border-[var(--color-text)] px-8 py-20 bg-[var(--color-surface-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 font-black uppercase text-center md:text-left">
          <div className="text-4xl italic tracking-tighter leading-none">S&D <br /> PLUMBING</div>
          <div className="flex flex-wrap justify-center gap-12 text-sm tracking-widest">
            <div className="flex flex-col gap-2">
              <span className="opacity-40">Licensing</span>
              <span>License #M-42069</span>
              <span>Master Plumber Staff</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="opacity-40">Affiliations</span>
              <span>BBB Accredited A+</span>
              <span>Angi Certified</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="opacity-40">Location</span>
              <span>Austin, TX & Surrounding</span>
              <span>(512) 555-0123</span>
            </div>
          </div>
          <div className="text-[10px] opacity-40">
            © 2026 S&D Plumbing Austin. <br />All Rights Reserved.
          </div>
        </div>
      </footer>
    </StyleWrapper>
  );
}
