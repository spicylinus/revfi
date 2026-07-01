import React, { useState, useRef } from 'react';
import { AuditData } from '@/types/audit';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Calendar } from 'lucide-react';

interface ClaireReportProps {
  data: AuditData;
}

const CALENDLY_URL = 'https://calendly.com/social-linus/siteaudit-15-minute-discovery-call';

export default function ClaireReport({ data }: ClaireReportProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="bg-surface rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm max-w-4xl mx-auto my-12">
      {/* Branding */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border-2 border-white shadow-inner">
          <User size={32} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-primary">Claire Danforth</h3>
          <p className="text-sm text-text-secondary">Website Audit Specialist at <span className="font-bold">Social Linus Web Services, LLC</span></p>
        </div>
        <div className="ml-auto hidden sm:block">
          <div className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">
            Verified Specialist
          </div>
        </div>
      </div>

      {/* One-line summary */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-text-primary mb-8 leading-tight"
      >
        {data.primaryLeakTitle}
      </motion.h2>

      {/* The primary leak */}
      <div className="mb-10 p-6 bg-danger/5 border border-danger/10 rounded-2xl">
        <p className="text-xl text-text-primary font-semibold mb-3">
          {data.primaryLeak}
        </p>
        <p className="text-danger font-bold uppercase tracking-wider text-sm">
          Estimated Lead Impact: {data.leadImpact}
        </p>
      </div>

      {/* What this means */}
      <div className="mb-10">
        <h4 className="font-bold text-text-primary mb-2">What this means</h4>
        <p className="text-lg text-text-secondary italic">
          "{data.whatThisMeans}"
        </p>
      </div>

      {/* Secondary notes */}
      {data.secondaryNotes && data.secondaryNotes.length > 0 && (
        <div className="mb-10">
          <h4 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-widest opacity-60">Also worth knowing</h4>
          <ul className="space-y-3">
            {data.secondaryNotes.map((note, i) => (
              <li key={i} className="flex gap-3 text-text-secondary text-sm">
                <span className="text-slate-300">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The one recommendation */}
      <div className="mb-12">
        <h4 className="font-bold text-text-primary mb-3">Recommendation</h4>
        <p className="text-lg text-text-primary leading-relaxed">
          {data.recommendation}
        </p>
      </div>

      {/* Soft CTA */}
      <div className="text-center">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mx-auto"
        >
          <Calendar size={20} />
          {data.softCTA || "Want me to walk you through this?"}
        </button>

        {/* Inline Calendly iframe */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mt-6 overflow-hidden rounded-2xl"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden" style={{ height: 730 }}>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white hover:bg-slate-100 rounded-full text-void shadow-md transition-colors"
                  aria-label="Close calendar"
                >
                  <X size={16} />
                </button>
                <iframe
                  src={`${CALENDLY_URL}?embed_type=Inline&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : ''}`}
                  title="Book a discovery call"
                  className="w-full border-0"
                  style={{ height: '100%' }}
                  scrolling="no"
                  allow="payment"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
