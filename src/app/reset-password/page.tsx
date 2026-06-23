'use client';
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Missing reset token. Please request a new password reset.');
      setStatus('error');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setStatus('error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: emailParam, newPassword: password }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
      } else {
        setErrorMsg(data.message || 'Failed to reset password.');
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
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">Password Updated</h1>
          <p className="text-text-secondary mb-6">
            Your password has been changed. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            Sign In
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
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Set New Password</h1>
          <p className="text-text-secondary text-center mt-2 text-sm">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Lock size={16} className="text-text-secondary" />
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-background border-2 border-slate-100 rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Lock size={16} className="text-text-secondary" />
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-4 bg-background border-2 border-slate-100 rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Re-enter your password"
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
                Updating password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
