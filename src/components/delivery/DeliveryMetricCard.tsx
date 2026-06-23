'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricTrend } from '@/types/delivery';

interface DeliveryMetricCardProps {
  metric: MetricTrend;
}

export default function DeliveryMetricCard({ metric }: DeliveryMetricCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    >
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{metric.label}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-slate-900">{metric.value}</span>
        <div className={`flex items-center gap-1 text-sm font-bold ${metric.isPositive ? 'text-accent' : 'text-danger'}`}>
          {metric.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(metric.change)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
