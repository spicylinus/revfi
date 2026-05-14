'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Zap, 
  BarChart3, 
  Target, 
  Layout, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  Mail,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import InputField from '@/components/ui/InputField';
import GradeGauge from '@/components/dashboard/GradeGauge';
import MetricCard from '@/components/dashboard/MetricCard';
import RevenueLeakItem from '@/components/dashboard/RevenueLeakItem';
import ChecklistItem from '@/components/dashboard/ChecklistItem';
import ActionCard from '@/components/dashboard/ActionCard';
import ServiceCard from '@/components/dashboard/ServiceCard';
import GapAnalysis from '@/components/dashboard/GapAnalysis';
import GrandSlamCallout from '@/components/dashboard/GrandSlamCallout';
import { AuditData, AuditResponse } from '@/types/audit';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [revenueGoal, setRevenueGoal] = useState<string>('');
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (url: string) => {
    setIsLoading(true);
    setAuditData(null);
    setShowGapAnalysis(false);
    setCheckedItems({});
    setError(null);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result: AuditResponse = await response.json();

      if (result.success && result.data) {
        setAuditData(result.data);
      } else {
        setError(result.error || 'Failed to analyze website. Please check the URL and try again.');
      }
    } catch (err) {
      console.error('Audit error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <main className="flex-1 pb-24">
      {/* Header */}
      <header className="py-8 px-6 border-b border-slate-200 bg-surface">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">R</div>
            <h1 className="text-2xl font-bold text-primary">RevFi</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-secondary uppercase tracking-widest">
            <Link href="/projects" className="hover:text-primary transition-colors text-accent">Portfolio</Link>
            <Link href="/delivery" className="hover:text-primary transition-colors">Client Portal</Link>
            <a href="#" className="px-4 py-2 bg-slate-100 text-primary rounded-lg hover:bg-slate-200 transition-all">Support</a>
          </div>
        </div>
      </header>

      {/* Hero / Input Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-surface to-background border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight"
          >
            Stop leaving <span className="text-accent underline decoration-accent/30 underline-offset-8">revenue</span> on the table.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
          >
            Audit your local business website in seconds. Get a grade, identify revenue leaks, and follow a clear action plan to grow.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InputField onAudit={handleAudit} isLoading={isLoading} />
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger max-w-2xl mx-auto justify-center"
            >
              <AlertCircle size={20} />
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}
        </div>
      </section>

      {!auditData && !isLoading && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Deep Analysis</h4>
              <p className="text-text-secondary">We crawl your site like Google does to find technical and conversion issues.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Revenue Gaps</h4>
              <p className="text-text-secondary">We calculate exactly how much money you're losing from missed opportunities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChevronRight size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Action Plan</h4>
              <p className="text-text-secondary">No vague advice. We give you a daily checklist to get your business back on track.</p>
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 border-8 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-8"></div>
          <h3 className="text-2xl font-bold mb-4">Analyzing your website...</h3>
          <p className="text-text-secondary mb-8">This usually takes about 20-30 seconds. We're crawling your site and identifying revenue leaks.</p>
          <div className="max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Checking SEO signals</span>
              <span className="text-accent">Running...</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Analyzing lead capture</span>
              <span className="text-slate-300">Pending</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Scanning local citations</span>
              <span className="text-slate-300">Pending</span>
            </div>
          </div>
        </div>
      )}

      {auditData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-6 mt-12 pb-12"
        >
          {auditData.warnings && auditData.warnings.length > 0 && (
            <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
              <div className="flex items-center gap-2 text-warning mb-2">
                <AlertCircle size={18} />
                <h4 className="font-bold uppercase tracking-wider text-xs">Audit Warnings</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-text-secondary">
                {auditData.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1 bg-surface p-10 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center">
              <GradeGauge score={auditData.overallScore} grade={auditData.overallGrade} />
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard icon={Search} label="SEO Score" score={auditData.subScores.seo} />
              <MetricCard icon={Zap} label="Lead Capture" score={auditData.subScores.leadCapture} />
              <MetricCard icon={MapPin} label="Local SEO" score={auditData.subScores.localSeo} />
              <MetricCard icon={Smartphone} label="Mobile Score" score={auditData.subScores.mobile} />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-secondary" />
                  <h3 className="text-xl font-bold text-primary">What's your revenue goal?</h3>
                </div>
                <p className="text-text-secondary">Tell us what you want to make this year.</p>
              </div>
              <div className="w-full md:w-72 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">$</span>
                <input 
                  type="text" 
                  placeholder="e.g. 250,000"
                  value={revenueGoal}
                  onChange={(e) => setRevenueGoal(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-surface border-2 border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-secondary"
                />
              </div>
              <button 
                onClick={() => setShowGapAnalysis(true)}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl whitespace-nowrap hover:bg-primary/90 transition-all"
              >
                Analyze Gap
              </button>
            </div>

            {showGapAnalysis && (
              <div className="space-y-8 mt-8">
                <GapAnalysis
                  goal={parseInt(revenueGoal.replace(/,/g, '')) || 0}
                  totalLeaked={auditData.revenueLeaks.reduce((sum, leak) => sum + leak.estimatedImpact, 0)}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
            <section>
              <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="text-danger" />
                Revenue Leaks
              </h3>
              <div className="space-y-4">
                {auditData.revenueLeaks.map(leak => (
                  <RevenueLeakItem key={leak.id} leak={leak} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <ShieldCheck className="text-accent" />
                Checklist
              </h3>
              <div className="bg-surface border border-slate-100 rounded-2xl p-6 space-y-4">
                {auditData.checklist.map((item, index) => (
                  <ChecklistItem 
                    key={item.id} 
                    item={item} 
                    isChecked={!!checkedItems[item.id]} 
                    onToggle={toggleChecklistItem} 
                    isTopPriority={index === 0}
                  />
                ))}
              </div>
            </section>
          </div>

          <section className="mb-24">
            <h3 className="text-2xl font-bold text-text-primary mb-2">Your 30-Day Growth Plan</h3>
            <p className="text-text-secondary mb-8">Actionable steps to fix your revenue leaks.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard timeframe="Today" tasks={auditData.actionPlan.daily} />
              <ActionCard timeframe="This Week" tasks={auditData.actionPlan.weekly} />
              <ActionCard timeframe="This Month" tasks={auditData.actionPlan.monthly} />
            </div>
          </section>

          <section className="bg-slate-900 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 text-center mb-16">
              <h3 className="text-white text-3xl md:text-5xl font-bold mb-6">Want us to handle this?</h3>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">We'll fix your website and lead generation for you.</p>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={Layout} 
                title="Grand Slam Bundle" 
                description="Website Redesign + Lead Gen. $5,000 guarantee." 
                impact="2x - 5x Leads" isPopular={true}
                priceRange="$6,000 (BNPL)"
              />
              <ServiceCard 
                icon={BarChart3} 
                title="SEO Dominance" 
                description="Rank #1 on Google for local keywords." 
                impact="+300% Traffic"
                priceRange="$1,500/mo"
              />
              <ServiceCard 
                icon={Mail} 
                title="Lead Gen Engine" 
                description="Automated lead capture and follow-up 24/7." 
                impact="Predictable ROI"
                priceRange="$1,900/mo"
              />
            </div>
          </section>
        </motion.div>
      )}
    </main>
  );
}
