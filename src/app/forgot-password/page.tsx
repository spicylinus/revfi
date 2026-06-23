'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
      } else {
        setErrorMsg(data.message || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">Check your email</h1>
          <p className="text-text-secondary mb-6">
            We sent a password reset link to <strong>{email}</strong>. It expires in 1 hour. Check your spam folder if you don't see it.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-slate-100 shadow-sm">
        <Link href="/login" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 text-sm">
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Forgot Password</h1>
          <p className="text-text-secondary text-center mt-2 text-sm">
            Enter your admin email and we'll send you a secure reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-text-secondary" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-background border-2 border-slate-100 rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Enter email address"
            />
          </div>

          {status === 'error' && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger">
              <AlertCircle size={20} />
              <p className="text-sm font-semibold">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
