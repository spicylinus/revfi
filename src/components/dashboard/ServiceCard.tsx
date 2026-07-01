'use client';

import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priceRange: string;
  impact: string;
  href?: string;
  isPopular?: boolean;
}

export default function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  priceRange, 
  impact,
  href,
  isPopular
}: ServiceCardProps) {
  const CardContent = (
    <motion.div
      whileHover={{ y: -8 }}
      className={`bg-surface p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl flex flex-col h-full relative ${
        isPopular ? 'border-primary/30 ring-1 ring-primary/20 shadow-primary/5' : 'hover:border-primary/20'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
          Best Value
        </div>
      )}
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary text-sm mb-6 flex-1">{description}</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-400">Typical Impact</span>
          <span className="text-accent">{impact}</span>
        </div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-400">Starting At</span>
          <span className="text-text-primary">{priceRange}</span>
        </div>
      </div>

      <div className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-primary/90 group">
        <span>{href ? 'View Plan' : 'Book a Call'}</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}
