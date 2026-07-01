'use client';

import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadCaptureFormProps {
  businessName: string;
  auditUrl: string;
  primaryLeak?: string;
  primaryLeakTitle?: string;
  leadImpact?: string;
  onSuccess?: () => void;
  auditGrade?: string;
  leakEstimate?: number;
}

export default function LeadCaptureForm({
  businessName,
  auditUrl,
  primaryLeak,
  primaryLeakTitle,
  leadImpact,
  onSuccess,
  auditGrade,
  leakEstimate
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConsent) {
      setError('Please agree to receive your report via email before continuing.');
      return;
    }
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
          primaryLeak: primaryLeak || auditGrade || 'Audit',
          leadImpact: leadImpact || (leakEstimate ? `$${leakEstimate.toLocaleString()}/mo` : 'Significant leakage'),
          emailConsent: true,
          smsConsent: smsConsent && phone ? true : false,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        if (onSuccess) onSuccess();
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

  const displayLeak = primaryLeakTitle || primaryLeak || "major revenue leak";
  const displayImpact = leadImpact || (leakEstimate ? `$${leakEstimate.toLocaleString()}/mo` : "lost customers");

  return (
    <section className="my-16 bg-white rounded-3xl border-2 border-primary/10 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-primary text-white flex flex-col justify-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
            <Mail size={24} className="text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get the full report</h3>
          <p className="text-white/80 text-lg mb-0 leading-relaxed">
            I've identified a <span className="text-white font-bold">{displayLeak}</span> for <span className="text-white font-bold">{businessName}</span>.
          </p>
          <p className="text-white/80 text-lg mt-2">
            Estimated impact: <span className="text-ember font-bold">{displayImpact}</span>
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Complete breakdown of all technical findings</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Step-by-step fix guide for your team</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent" />
              <span className="text-sm font-medium">Direct line to Claire for questions</span>
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
                <h4 className="text-xl font-bold text-text-primary mb-6">Where should I send your diagnosis?</h4>
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

                  {/* Consent checkboxes */}
                  <div className="space-y-3 pt-2">
                    {/* Email consent — required */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          required
                          checked={emailConsent}
                          onChange={(e) => setEmailConsent(e.target.checked)}
                          className="peer w-5 h-5 rounded border-2 border-slate-200 appearance-none cursor-pointer transition-all checked:bg-primary checked:border-primary"
                        />
                        <CheckCircle2
                          size={14}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="text-xs text-text-secondary leading-relaxed">
                        <span className="font-semibold text-text-primary">I agree to receive my free website audit report </span>
                        and occasional marketing messages from Social Linus Web Services at <span className="font-semibold">{email || 'this address'}</span>. I can unsubscribe at any time. Message & data rates may apply for SMS.
                      </div>
                    </label>

                    {/* SMS consent — only shown if phone is entered */}
                    {phone.length >= 10 && (
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={smsConsent}
                            onChange={(e) => setSmsConsent(e.target.checked)}
                            className="peer w-5 h-5 rounded border-2 border-slate-200 appearance-none cursor-pointer transition-all checked:bg-ember checked:border-ember"
                          />
                          <CheckCircle2
                            size={14}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                          />
                        </div>
                        <div className="text-xs text-text-secondary leading-relaxed">
                          <span className="font-semibold text-text-primary">I also agree to receive SMS messages</span>
                          {' '}from Social Linus Web Services at <span className="font-semibold">{phone}</span> with marketing offers. Reply STOP to opt out at any time. Message & data rates apply.
                        </div>
                      </label>
                    )}
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
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Preparing Report...
                      </>
                    ) : (
                      <>
                        Send My Full Diagnosis
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium">
                    I'll send your report immediately. No spam, just the facts.
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
                <p className="text-text-secondary mb-8">I've sent the full audit breakdown to <span className="font-bold text-primary">{email}</span>. Check your inbox in the next minute.</p>
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-text-primary text-sm font-medium">
                  🚀 Let's plug those leaks.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
