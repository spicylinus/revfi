'use client';

import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Layout,
  BarChart3,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import InputField from '@/components/ui/InputField';
import LeadCaptureForm from '@/components/dashboard/LeadCaptureForm';
import ClaireReport from '@/components/dashboard/ClaireReport';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { AuditData, AuditResponse } from '@/types/audit';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleAudit = async (url: string) => {
    setIsLoading(true);
    setAuditData(null);
    setError(null);
    setIsFormSubmitted(false);
    
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

  return (
    <main className="flex-1 pb-24">
      {/* Header */}
      <header className="py-8 px-6 border-b border-slate-200 bg-surface">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">SL</div>
            <h1 className="text-2xl font-bold text-primary">Social Linus</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-secondary uppercase tracking-widest">
            <a href="mailto:support@sociallinus.com" className="px-4 py-2 bg-slate-100 text-primary rounded-lg hover:bg-slate-200 transition-all">Support</a>
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
            Most small business websites are <span className="text-accent underline decoration-accent/30 underline-offset-8">losing leads.</span> Find out if yours is.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
          >
            Type your website URL below. Get a plain-English diagnosis of the single most costly problem on your site, and how to fix it.
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

      {/* Audit Results */}
      <AnimatePresence>
        {auditData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 mt-12"
          >
            {/* The Claire Report Component */}
            <ClaireReport data={auditData} />

            {/* Lead Capture Form */}
            <div className="max-w-4xl mx-auto mt-16 mb-24">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Get the full diagnosis</h3>
                <p className="text-text-secondary">Enter your details below to receive this report and my full breakdown of how to fix these leaks.</p>
              </div>
              <LeadCaptureForm 
                businessName={auditData.businessName || auditData.url.replace('https://', '').replace('www.', '').split('.')[0]} 
                auditUrl={auditData.url} 
                primaryLeak={auditData.primaryLeakTitle}
                leadImpact={auditData.leadImpact}
                onSuccess={() => setIsFormSubmitted(true)}
              />
            </div>

            {/* Upsell Section */}
            <AnimatePresence>
              {isFormSubmitted && (
                <motion.section 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 rounded-[40px] p-12 md:p-20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 blur-[120px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-1/4 h-full bg-accent/5 blur-[100px] rounded-full" />
                  
                  <div className="relative z-10 text-center mb-16">
                    <h3 className="text-white text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to dominate your market?</h3>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">We build high-performance revenue engines for local businesses. Here is how we can help.</p>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ServiceCard 
                      icon={Layout} 
                      title="The Dominance Stack" 
                      description="The complete growth engine: 5-page redesign, local SEO, automated lead capture, and a 90-day launch sprint."
                      impact="2x - 5x Leads" 
                      isPopular={auditData.recommendationType === 'rebuild'} 
                      href="https://calendly.com/sociallinus/strategy"
                      priceRange="$3,000 to start"
                    />
                    <ServiceCard 
                      icon={BarChart3} 
                      title="SEO Dominance" 
                      description="Rank #1 on Google for your local keywords and dominate the search map." 
                      impact="+300% Traffic"
                      isPopular={auditData.recommendationType === 'seo'}
                      href="https://calendly.com/sociallinus/strategy"
                      priceRange="$1,500/mo"
                    />
                    <ServiceCard 
                      icon={Mail} 
                      title="Lead Gen Engine" 
                      description="We set up automated lead capture and follow-up systems that work 24/7." 
                      impact="Predictable ROI"
                      isPopular={auditData.recommendationType === 'website_fix'}
                      href="https://calendly.com/sociallinus/strategy"
                      priceRange="$1,900/mo"
                    />
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!auditData && !isLoading && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Honest Review</h4>
              <p className="text-text-secondary">I look at your site like a customer does. No scary dashboards, just plain English.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Lead Gaps</h4>
              <p className="text-text-secondary">I'll show you exactly where you're losing customers before they even call you.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChevronRight size={32} />
              </div>
              <h4 className="font-bold text-xl mb-3">Simple Fixes</h4>
              <p className="text-text-secondary">No complex jargon. Just one clear recommendation on what to fix first.</p>
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 border-8 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-8"></div>
          <h3 className="text-2xl font-bold mb-4">Reviewing your website...</h3>
          <p className="text-text-secondary mb-8">Claire is taking a look at your site now. This usually takes about 20 seconds.</p>
          <div className="max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Checking site accessibility</span>
              <span className="text-accent">Running...</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Analyzing lead capture</span>
              <span className="text-slate-300">Pending</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-text-secondary uppercase">
              <span>Evaluating search presence</span>
              <span className="text-slate-300">Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <footer className="py-12 border-t border-slate-100 mt-12 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Social Linus is owned by Social Linus Web Services, LLC.
          </p>
        </div>
      </footer>
    </main>
  );
}
