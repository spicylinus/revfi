'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Globe, 
  ArrowLeft,
  ChevronRight,
  Settings,
  Mail,
  Zap,
  LayoutDashboard,
  Receipt,
  Search,
  Lock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import DeliveryMetricCard from '@/components/delivery/DeliveryMetricCard';
import WorkLogItem from '@/components/delivery/WorkLogItem';
import ReportPreview from '@/components/delivery/ReportPreview';
import BillingSection from '@/components/delivery/BillingSection';
import CompetitorSection from '@/components/delivery/CompetitorSection';
import { CLIENT_DELIVERIES } from '@/lib/mock-deliveries';

export default function ClientDeliveryDashboard() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const data = CLIENT_DELIVERIES[clientId];
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'competitor'>('overview');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(c => c.trim().startsWith('auth-session='));
        if (authCookie) {
          const token = authCookie.split('=')[1];
          const session = JSON.parse(atob(decodeURIComponent(token)));
          
          if (session.role === 'admin') {
            setIsAuthorized(true);
          } else if (session.role === 'client' && session.clientId === clientId) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
          router.push(`/login?callbackUrl=/delivery/${clientId}`);
        }
      } catch (e) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [clientId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6">
          <Lock size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-500 max-w-md mb-8">You do not have permission to view this client's dashboard. If you believe this is an error, please contact support.</p>
        <Link href="/delivery" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
          Back to Portal
        </Link>
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/delivery/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{data.clientName}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Globe size={12} />
                <span>{data.websiteUrl.replace('https://', '').replace('www.', '')}</span>
                <span>•</span>
                <span className="text-secondary font-bold uppercase">{data.tier} Tier</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Report</span>
              <span className="text-sm font-bold text-slate-700">{data.nextReportDate}</span>
            </div>
            <Link 
              href={`/delivery/${clientId}/profile`}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-200/50 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'billing' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Receipt size={18} />
            Billing
          </button>
          <button 
            onClick={() => setActiveTab('competitor')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'competitor' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Search size={18} />
            Competitor
          </button>
        </div>

        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              {data.metrics.map((metric, i) => (
                <DeliveryMetricCard key={i} metric={metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-secondary" />
                      <h3 className="text-xl font-bold text-slate-900">Recent Deliverables</h3>
                    </div>
                    <button className="text-sm font-bold text-secondary hover:underline">View All Log</button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {data.recentWork.length > 0 ? (
                      data.recentWork.map(entry => (
                        <WorkLogItem key={entry.id} entry={entry} />
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-400">
                        No recent work logged for this period.
                      </div>
                    )}
                  </div>
                </section>
                
                <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Zap size={32} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-emerald-900 mb-2">Growth Engine is Active</h4>
                    <p className="text-emerald-700/80">We are currently executing the {data.tier} workstream. Check the sidebar for active focus areas.</p>
                  </div>
                  <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl whitespace-nowrap hover:bg-emerald-700 transition-all">
                    View Strategy Plan
                  </button>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <ReportPreview 
                  date={data.nextReportDate} 
                  clientName={data.clientName} 
                />

                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-secondary" />
                    Active Workstreams
                  </h3>
                  <div className="space-y-4">
                    {data.activeWorkstreams.map((stream, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-slate-600">{stream}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Monthly Progress</span>
                      <span className="text-sm font-bold text-slate-700">35%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[35%]" />
                    </div>
                  </div>
                </section>

                <section className="bg-blue-600 rounded-3xl p-8 text-white">
                  <Mail className="mb-4 opacity-50" size={32} />
                  <h4 className="text-xl font-bold mb-2">Need to discuss?</h4>
                  <p className="text-blue-100 text-sm mb-6">Your dedicated account manager is available for a strategy sync at any time.</p>
                  <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                    <span>Book Strategy Call</span>
                    <ChevronRight size={18} />
                  </button>
                </section>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {data.billing ? (
              <BillingSection 
                monthlyRate={data.billing.monthlyRate}
                nextBillingDate={data.billing.nextBillingDate}
                invoices={data.billing.invoices}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <Receipt size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Billing Info</h3>
                <p className="text-slate-500">We haven't set up your billing profile yet. Contact your account manager for assistance.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'competitor' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompetitorSection audits={data.competitorAudits || []} />
          </motion.div>
        )}
      </div>
    </main>
  );
}
