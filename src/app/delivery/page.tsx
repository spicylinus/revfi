'use client';

import React from 'react';
import { Users, ChevronRight, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CLIENT_DELIVERIES } from '@/lib/mock-deliveries';

export default function ClientSelectorPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Client Delivery Portal</h1>
          <p className="text-slate-500 text-lg">Select a client to view their active delivery dashboard and metrics.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(CLIENT_DELIVERIES).map(([id, client]) => (
            <Link 
              key={id} 
              href={`/delivery/${id}/`}
              className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{client.clientName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
                    <Globe size={12} />
                    <span>{client.websiteUrl.replace('https://', '')}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {client.tier}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-sm font-bold text-slate-400">View Dashboard</span>
                <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-sm transition-colors">
             <ArrowLeft size={16} />
             <span>Back to Auditor</span>
           </Link>
        </div>
      </div>
    </main>
  );
}
