'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface GapAnalysisProps {
  goal: number;
  totalLeaked: number;
}

const GapAnalysis: React.FC<GapAnalysisProps> = ({ goal, totalLeaked }) => {
  const router = useRouter();
  const gap = Math.max(0, goal - totalLeaked);
  const percentageOfGoal = Math.min(100, Math.round((totalLeaked / goal) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-white border border-primary/20 rounded-2xl p-8 mt-6 shadow-lg shadow-primary/5 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              <TrendingUp size={20} />
            </div>
            <h4 className="font-bold text-xl text-primary">Revenue Gap Analysis</h4>
          </div>
          <p className="text-text-secondary mb-6">
            By fixing the identified leaks, you can recapture <span className="text-accent font-bold">${totalLeaked.toLocaleString()}</span> in annual revenue.
            That's <span className="text-primary font-bold">{percentageOfGoal}%</span> of your yearly goal.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-text-secondary uppercase">Goal Progress via Fixes</span>
                <span className="text-primary">{percentageOfGoal}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageOfGoal}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-accent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 flex flex-col justify-center gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-text-secondary uppercase block mb-1">Recapturable Revenue</span>
            <span className="text-3xl font-bold text-accent">${totalLeaked.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-primary text-white rounded-xl">
            <span className="text-xs font-bold text-white/70 uppercase block mb-1">Remaining Gap</span>
            <span className="text-3xl font-bold">${gap.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-danger">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-text-primary">Current Situation</h5>
            <p className="text-xs text-text-secondary">You are losing leads due to technical and conversion issues that are easily fixable.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 text-accent">
            <CheckCircle size={18} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-text-primary">The Opportunity</h5>
            <p className="text-xs text-text-secondary">Closing these gaps moves you significantly closer to your ${goal.toLocaleString()} goal without increasing ad spend.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => router.push('/upsell/grand-slam-bundle')}
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
        >
          Get the Grand Slam Revenue Machine 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default GapAnalysis;
