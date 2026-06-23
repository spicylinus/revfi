'use client';

import React from 'react';
import { CheckCircle2, Link as LinkIcon, FileText, Settings, MapPin, Search } from 'lucide-react';
import { WorkLogEntry } from '@/types/delivery';

interface WorkLogItemProps {
  entry: WorkLogEntry;
}

const CATEGORY_ICONS = {
  content: FileText,
  technical: Settings,
  local: MapPin,
  aeo: Search,
};

const CATEGORY_COLORS = {
  content: 'text-secondary bg-secondary/10',
  technical: 'text-slate-600 bg-slate-50',
  local: 'text-accent bg-accent/10',
  aeo: 'text-purple-600 bg-purple-50',
};

export default function WorkLogItem({ entry }: WorkLogItemProps) {
  const Icon = CATEGORY_ICONS[entry.category];
  
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <div className={`p-2 rounded-lg ${CATEGORY_COLORS[entry.category]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-900">{entry.title}</h4>
          <span className="text-xs font-medium text-slate-400">{entry.date}</span>
        </div>
        <p className="text-sm text-slate-600 mb-2">{entry.description}</p>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_COLORS[entry.category]}`}>
            {entry.category}
          </span>
          {entry.link && (
            <a 
              href={entry.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-secondary flex items-center gap-1 hover:underline"
            >
              <LinkIcon size={12} />
              View Work
            </a>
          )}
        </div>
      </div>
      <div className="text-emerald-500">
        <CheckCircle2 size={20} />
      </div>
    </div>
  );
}
