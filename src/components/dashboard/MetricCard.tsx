'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  score: number;
}

export default function MetricCard({ icon: Icon, label, score }: MetricCardProps) {
  const getProgressColor = (val: number) => {
    if (val >= 80) return 'bg-accent';
    if (val >= 60) return 'bg-secondary';
    if (val >= 40) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface p-6 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-primary">
          <Icon size={20} />
        </div>
        <span className="font-semibold text-text-secondary text-sm uppercase tracking-wider">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold font-mono text-text-primary">{score}</span>
        <span className="text-text-secondary text-sm">/ 100</span>
      </div>
      
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getProgressColor(score)}`}
        />
      </div>
    </motion.div>
  );
}
