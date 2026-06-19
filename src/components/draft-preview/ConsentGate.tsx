'use client';
import React, { useState } from 'react';
import { Shield, Phone, MessageSquare, Lock, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsentGateProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  businessName: string;
  draftUrl?: string;
}

export default function ConsentGate({ isOpen, onClose, clientId, businessName }: ConsentGateProps) {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone && !email) {
      setError('Please enter your phone number or email');
      return;
    }
    if (!consent) {
      setError('Please consent to receive marketing communications');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/draft-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          email,
          consent,
          clientId,
          businessName,
          source: 'draft_preview_optin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {!success ? (
              <>
                {/* Header */}
                <div className="bg-[#1E3A5F] px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Secure Preview Access</h2>
                      <p className="text-white/70 text-sm">Protect your redesign before launch</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="text-white/60 hover:text-white transition">
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                    To protect your unreleased design, we'll send you a secure login link via SMS or email. 
                    This also lets us keep you updated on your project.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Phone or Email <span className="text-slate-400 font-normal">(whichever you prefer)</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (512) 555-1234"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                        />
                      </div>
                      <div className="relative mt-3">
                        <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="or your@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Consent checkbox */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I consent to receive marketing communications from Social Linus, 
                          including SMS and email updates about my website project. 
                          I understand I can opt out at any time.
                        </span>
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#1E3A5F] hover:bg-[#2a4f7a] disabled:bg-slate-300 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Sending secure link...
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Send My Secure Login Link
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Link sent!</h3>
                <p className="text-slate-600 text-sm mb-1">
                  {phone && email ? `Sent to ${phone} (SMS) and ${email} (email).` : phone ? `Sent to ${phone} via SMS.` : `Sent to ${email} via email.`}
                </p>
                <p className="text-slate-500 text-xs mb-5">Check your inbox or messages — the link expires in 24 hours.</p>
                <div className="bg-slate-50 rounded-xl p-4 mb-5 text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Your secure access link</div>
                  <div className="text-sm font-mono text-slate-700 break-all">
                    app.sociallinus.com/delivery/{clientId}
                  </div>
                </div>
                <a
                  href={`/delivery/${clientId}`}
                  className="block w-full py-3 bg-[#1E3A5F] hover:bg-[#2a4f7a] text-white font-bold rounded-xl transition-all text-sm text-center"
                >
                  View My Draft Now →
                </a>
                <button onClick={onClose} className="mt-3 text-slate-500 text-sm hover:text-slate-700 transition">
                  Close window
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
