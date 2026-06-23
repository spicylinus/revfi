'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, DollarSign } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from '@/types/audit';

interface ChecklistItemProps {
  item: ChecklistItemType;
  isChecked: boolean;
  onToggle: (id: string) => void;
  isTopPriority?: boolean;
}

export default function ChecklistItem({ item, isChecked, onToggle, isTopPriority }: ChecklistItemProps) {
  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
        isChecked 
          ? 'bg-slate-50 border-slate-200' 
          : isTopPriority 
            ? 'bg-primary/5 border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/10'
            : 'bg-surface border-slate-100 hover:border-secondary/30'
      }`}
    >
      <button 
        onClick={() => onToggle(item.id)}
        className={`mt-1 transition-colors ${isChecked ? 'text-accent' : isTopPriority ? 'text-primary' : 'text-slate-300 hover:text-slate-400'}`}
      >
        {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {isTopPriority && !isChecked && (
            <span className="px-2 py-0.5 bg-primary text-white rounded text-[10px] font-bold uppercase tracking-wider">
              Top Lever
            </span>
          )}
          <h4 className={`font-bold transition-all ${isChecked ? 'text-text-secondary line-through opacity-60' : 'text-text-primary'}`}>
            {item.title}
          </h4>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <p className={`text-sm mb-3 transition-all ${isChecked ? 'text-slate-400 opacity-60' : 'text-text-secondary'}`}>
          {item.action}
        </p>
        
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-accent">
            <DollarSign size={14} />
            <span>+${item.estimatedValue.toLocaleString()}/yr</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={14} />
            <span>{item.timeEstimate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
