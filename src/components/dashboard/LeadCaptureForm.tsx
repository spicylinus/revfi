'use client';

import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadCaptureFormProps {
  businessName: string;
  auditUrl: string;
  auditGrade: string;
  leakEstimate: number;
}

export default function LeadCaptureForm({ 
  businessName, 
  auditUrl, 
  auditGrade,
  leakEstimate 
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          phone, 
          businessName, 
          url: auditUrl, 
          grade: auditGrade,
          leakEstimate
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-16 bg-white rounded-3xl border-2 border-primary/10 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-primary text-white flex flex-col justify-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
            <Mail size={24} className="text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get your full Revenue Leak Report</h3>
          <p className="text-primary-foreground/80 text-lg mb-0">
            We've identified <span className="text-white font-bold">${leakEstimate.toLocaleString()}/mo</span> in potential revenue leaks for <span className="text-white font-bold">{businessName}</span>.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Detailed breakdown of all {auditGrade} grade factors</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Custom 90-day execution roadmap</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Competitor benchmark analysis</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center relative bg-surface">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h4 className="text-xl font-bold text-text-primary mb-6">Where should we send the report?</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@business.com"
                        className="w-full pl-12 pr-4 py-4 bg-background border-2 border-slate-100 rounded-xl outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(512) 555-0123"
                        className="w-full pl-12 pr-4 py-4 bg-background border-2 border-slate-100 rounded-xl outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger">
                      <AlertCircle size={20} />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        Send My Full Report
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium">
                    By submitting, you agree to our Terms of Service and Privacy Policy. No spam, ever.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-bold text-text-primary mb-2">Report Sent!</h4>
                <p className="text-text-secondary mb-8">We've sent the full audit breakdown to <span className="font-bold text-primary">{email}</span>. One of our strategists will reach out shortly to discuss your custom action plan.</p>
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-accent-foreground text-sm font-medium">
                  🚀 Your website dominance starts today.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
