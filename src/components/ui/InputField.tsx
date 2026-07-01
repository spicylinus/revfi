'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputFieldProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export default function InputField({ onAudit, isLoading }: InputFieldProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAudit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-secondary transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter your website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className={cn(
                "w-full pl-12 pr-4 py-4 bg-surface border-2 border-slate-200 rounded-xl text-lg outline-none transition-all",
                "focus:border-secondary focus:ring-4 focus:ring-secondary/10",
                "disabled:bg-slate-50 disabled:cursor-not-allowed",
                isLoading ? "opacity-75" : "opacity-100"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={cn(
              "px-8 py-4 bg-ember text-white font-bold rounded-xl transition-all shadow-lg",
              "hover:bg-ember/90 active:scale-95 disabled:bg-slate-300 disabled:scale-100 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2 sm:min-w-[200px]"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              "Scan my site"
            )}
          </button>
        </div>
      </form>
      <p className="mt-3 text-center text-sm text-text-secondary">
        Takes about 30 seconds. No credit card required.
      </p>
    </div>
  );
}
