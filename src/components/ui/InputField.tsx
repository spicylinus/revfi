'use client';

import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface InputFieldProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export default function InputField({ onAudit, isLoading }: InputFieldProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    onAudit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Enter your website URL (e.g., example.com)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-slate-200 rounded-xl font-medium text-lg outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl whitespace-nowrap hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Audit Now'}
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2 text-danger text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
