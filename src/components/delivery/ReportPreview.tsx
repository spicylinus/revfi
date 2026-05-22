'use client';

import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface ReportPreviewProps {
  date: string;
  clientName: string;
}

export default function ReportPreview({ date, clientName }: ReportPreviewProps) {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-secondary/30" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Monthly Performance Report</h3>
            <p className="text-slate-400 text-sm">Scheduled for {date}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <p className="text-slate-300 text-sm leading-relaxed">
            Your monthly deep-dive report for <span className="text-white font-bold">{clientName}</span> is currently being compiled. 
            It will include full keyword tracking, lead attribution, and GBP engagement metrics.
          </p>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">SEO Progress</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">Lead Attribution</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all">
            <ExternalLink size={18} />
            <span>Live Dashboard</span>
          </button>
          <button className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10">
            <Download size={18} />
            <span>Last Month's PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
