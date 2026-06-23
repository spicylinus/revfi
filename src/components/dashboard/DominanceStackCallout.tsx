'use client';

import React from 'react';
import { Sparkles, ArrowRight, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const DominanceStackCallout = () => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 md:p-12 text-white shadow-2xl border border-slate-700 relative overflow-hidden group"
    >
      {/* Animated Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/100/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/100/20 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/100/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Flame size={12} />
            Most Popular
          </div>
          <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
            The <span className="text-emerald-400">Dominance</span> Stack
          </h3>
          <p className="text-slate-400 text-lg mb-8 font-medium max-w-xl">
            Your website is losing leads every day it stays broken. The Dominance Stack fixes it — <span className="text-white font-bold">$3,000 to start, $3,000 when it goes live.</span> Site goes live only after your final payment clears.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
               <ShieldCheck className="text-emerald-500" size={18} />
               $4,500 in Bonuses — Pay in Full & Save $1,500
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
               <Sparkles className="text-emerald-500" size={18} />
               90 Days Priority Support Included
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <button 
            onClick={() => router.push('/upsell/dominance-stack/')}
            className="w-full md:w-auto px-10 py-6 bg-white text-slate-900 rounded-2xl text-xl font-black hover:bg-accent/10 transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
          >
            GET STARTED
            <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DominanceStackCallout;