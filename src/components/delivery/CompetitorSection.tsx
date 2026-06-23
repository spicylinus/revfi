'use client';

import React from 'react';
import { 
  Trophy, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CompetitorSectionProps {
  audits: any[];
}

export default function CompetitorSection({ audits }: CompetitorSectionProps) {
  if (!audits || audits.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <Search size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Competitor Data</h3>
        <p className="text-slate-500">We haven't analyzed your competitors yet. Add a competitor URL in your profile settings to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {audits.map((audit, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900">Competitor Analysis</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                Target: <span className="text-slate-900 font-bold">{audit.competitorUrl}</span>
                <a href={audit.competitorUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                  <ExternalLink size={14} />
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Audited</span>
                <span className="text-sm font-bold text-slate-700">{new Date(audit.auditedAt).toLocaleDateString()}</span>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                audit.result.overallScore >= 80 ? 'bg-emerald-100 text-accent' : 
                audit.result.overallScore >= 60 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {audit.result.overallGrade}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scores Grid */}
              <div className="lg:col-span-1 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Competitor Performance</h4>
                {Object.entries(audit.result.subScores).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm font-black text-slate-900">{value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          value >= 80 ? 'bg-accent/100' : 
                          value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Opportunities Feed */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-primary" />
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Revenue Exploitation Opportunities</h4>
                </div>
                
                <div className="space-y-4">
                  {audit.result.revenueLeaks.map((leak: any) => (
                    <div key={leak.id} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-primary/20 transition-all flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        leak.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 
                        leak.severity === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-secondary'
                      }`}>
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="font-bold text-slate-900">{leak.title}</h5>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            leak.severity === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {leak.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                          Your competitor is failing here. By fixing this on your site, you gain a massive advantage.
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-black text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                          <AlertTriangle size={12} />
                          Exploit Advantage: ${leak.estimatedImpact.toLocaleString()} Value
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-900 text-white flex justify-between items-center">
            <span className="text-xs font-bold opacity-70 italic">Strategy: Outpace competitors by patching your own leaks while they ignore theirs.</span>
            <button className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">
              Download Full Report
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
