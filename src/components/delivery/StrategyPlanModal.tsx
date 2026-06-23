'use client';

import React from 'react';
import { X, Target, CheckCircle2, Clock, ChevronRight, Calendar } from 'lucide-react';
import { StrategyPlan } from '@/types/delivery';

interface StrategyPlanModalProps {
  plan: StrategyPlan;
  clientName: string;
  onClose: () => void;
}

const statusConfig = {
  'completed': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={14} /> },
  'in-progress': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={14} /> },
  'upcoming': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={14} /> },
};

export default function StrategyPlanModal({ plan, clientName, onClose }: StrategyPlanModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-primary px-8 py-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium mb-2">
              <Target size={16} />
              <span>90-Day Growth Strategy</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{clientName}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-8 space-y-8">
          {/* Goal */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Goal</h3>
            <p className="text-slate-800 font-medium leading-relaxed">{plan.goal}</p>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Target Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {plan.primaryKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Milestones</h3>
            <div className="space-y-4">
              {plan.milestones.map((milestone, i) => (
                <div key={i} className="flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${statusConfig[milestone.status].color}`}>
                      {statusConfig[milestone.status].icon}
                    </div>
                    {i < plan.milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase">{milestone.week}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusConfig[milestone.status].color}`}>
                        {milestone.status === 'in-progress' ? 'In Progress' : milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{milestone.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Review */}
          <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Next Strategy Review</div>
              <div className="font-bold text-slate-900">{plan.nextReviewDate}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
