'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  value: number;
  total?: number;
}

export default function ProgressBar({ label, value, total = 100 }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / total) * 100, 0), 100);

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return 'bg-accent';
    if (pct >= 60) return 'bg-secondary';
    if (pct >= 40) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-text-primary uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono font-bold text-text-primary">{value}/{total}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getProgressColor(percentage)}`}
        />
      </div>
    </div>
  );
}
