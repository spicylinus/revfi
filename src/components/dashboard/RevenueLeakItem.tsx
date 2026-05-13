'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevenueLeak } from '@/types/audit';

interface RevenueLeakItemProps {
  leak: RevenueLeak;
}

export default function RevenueLeakItem({ leak }: RevenueLeakItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: RevenueLeak['severity']) => {
    switch (severity) {
      case 'critical': return 'text-danger bg-danger/10';
      case 'high': return 'text-warning bg-warning/10';
      default: return 'text-secondary bg-secondary/10';
    }
  };

  return (
    <div className="bg-surface border border-slate-100 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-slate-50/50"
      >
        <div className={`p-2 rounded-lg ${getSeverityColor(leak.severity)}`}>
          <AlertCircle size={20} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-text-primary">{leak.title}</h4>
          <p className="text-sm text-text-secondary line-clamp-1">{leak.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            <DollarSign size={14} />
            <span>${leak.estimatedImpact.toLocaleString()}/yr</span>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 ml-14 border-t border-slate-50 mt-2">
              <div className="py-4">
                <p className="text-text-secondary text-sm mb-4">{leak.description}</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">How to fix this:</h5>
                  <p className="text-sm text-text-primary">{leak.fix}</p>
                </div>
                <div className="mt-4 sm:hidden flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 w-fit">
                  <DollarSign size={14} />
                  <span>Est. Impact: ${leak.estimatedImpact.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
