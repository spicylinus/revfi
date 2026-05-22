'use client';

import React from 'react';
import { ExternalLink, Globe, Layout, Smartphone } from 'lucide-react';
import Link from 'next/link';

const ACTIVE_PROJECTS = [
  {
    id: 'spruce-salon',
    name: 'Spruce Salon',
    url: '/projects/spruce-salon/',
    style: 'Editorial',
    status: 'Live',
    tier: 'Lead Gen ($1,900/mo)'
  },
  {
    id: 'sd-plumbing',
    name: 'S & D Plumbing',
    url: '/projects/sd-plumbing/',
    style: 'Swiss',
    status: 'Live',
    tier: 'SEO ($1,500/mo)'
  }
];

export default function ProjectsIndex() {
  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Active Client Sites</h1>
            <p className="text-slate-500 font-medium text-lg text-slate-600">Production builds for our premium partners.</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Back to Audit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACTIVE_PROJECTS.map((project) => (
            <div key={project.id} className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Globe size={24} />
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  {project.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{project.name}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 font-medium">
                <span className="flex items-center gap-1.5">
                  <Layout size={14} />
                  {project.style} Style
                </span>
                <span>•</span>
                <span className="text-secondary font-bold">{project.tier}</span>
              </div>
              <Link 
                href={project.url}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
              >
                View Live Site
                <ExternalLink size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-blue-600 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
             <Smartphone size={32} />
           </div>
           <div className="flex-1 text-center md:text-left">
             <h4 className="text-xl font-bold mb-2 uppercase italic tracking-tight">Growth Engine Ready</h4>
             <p className="text-blue-100 text-sm opacity-80">All production sites are mobile-optimized and integrated with our revenue tracking system.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
