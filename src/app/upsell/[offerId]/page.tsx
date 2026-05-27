'use client';

import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Gift,
  Flame,
  ArrowLeft,
  Mail,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function UpsellPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchOffer() {
      try {
        const res = await fetch('/api/offers');
        const data = await res.json();
        const found = data.offers.find((o: any) =>
          o.id === offerId || (o.legacyIds && o.legacyIds.includes(offerId))
        );
        setOffer(found);
      } catch (err) {
        console.error('Failed to fetch offer');
      } finally {
        setLoading(false);
      }
    }
    fetchOffer();
  }, [offerId]);

  const handleAccept = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    
    setProcessing(true);
    try {
      // 1. Create/Get Customer
      const custRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const custData = await custRes.json();
      
      if (custData.status !== 'success') {
        throw new Error(custData.message || 'Failed to create customer');
      }

      const customerId = custData.data.id;

      // 2. Create Invoice
      const invRes = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          amount: offer.upfront_bnpl || offer.deposit || offer.total_price,
          description: `Grand Slam Acceptance: ${offer.name}`,
          bnplEnabled: !!offer.upfront_bnpl
        })
      });
      const invData = await invRes.json();
      
      if (invData.status === 'success') {
        // 3. Trigger Competitor Audit (Background)
        if (competitorUrl) {
          fetch('/api/audit/competitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: competitorUrl,
              clientEmail: email
            })
          }).catch(err => console.error('Failed to trigger competitor audit:', err));
        }

        setSuccess(true);
        // Redirect to secure Stripe payment page
        if (invData.data.url) {
          window.location.href = invData.data.url;
        }
      } else {
        throw new Error(invData.message || 'Failed to create invoice');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to process. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Loading Premium Offer...</div>;
  if (!offer) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold text-xl">Offer not found</div>;

  if (success) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white text-slate-900 rounded-[40px] p-12 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4 uppercase italic">You're In!</h2>
          <p className="text-slate-500 mb-8 font-medium">
            We've created your secure Stripe payment portal and sent the details to <span className="font-bold text-slate-900">{email}</span>. 
            {competitorUrl ? " We've also started your competitor's audit — we'll have that strategy report ready for you in the dashboard." : ""}
            Once the deposit is confirmed, we'll start building your growth engine immediately.
          </p>
          <button 
            onClick={() => router.push('/delivery/')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Go to Client Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          Back to Audit
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6"
          >
            <Flame size={14} />
            Limited Time Offer
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase italic tracking-tighter"
          >
            The <span className="text-emerald-400 underline decoration-emerald-400/30">Grand Slam</span> Revenue Machine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            {offer.description}
          </motion.p>
        </div>

        {/* Offer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">The Deliverables</h3>
            <ul className="space-y-4">
              {offer.details && Object.values(offer.details).map((detail: any, i: number) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                  <span className="font-medium">{detail}</span>
                </li>
              ))}
              {offer.id === 'dominance-stack' && (
                <li className="flex gap-3 text-emerald-400">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                  <span className="font-black uppercase tracking-tight">Free Competitor Visibility Audit</span>
                </li>
              )}
              {!offer.details && (
                <>
                  <li className="flex gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                    <span className="font-medium">Complete Website Redesign</span>
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                    <span className="font-medium">Lead Capture Optimization</span>
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 p-8 rounded-3xl"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">The Ironclad Guarantee</h3>
            <div className="space-y-6">
              {offer.subscription_guarantee && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Ongoing Subscriptions</span>
                  <p className="text-emerald-50 text-lg leading-relaxed italic font-serif">
                    "{offer.subscription_guarantee}"
                  </p>
                </div>
              )}
              {offer.flat_fee_guarantee && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Project Completion</span>
                  <p className="text-blue-50 text-lg leading-relaxed italic font-serif">
                    "{offer.flat_fee_guarantee}"
                  </p>
                </div>
              )}
              {!offer.subscription_guarantee && !offer.flat_fee_guarantee && (
                <p className="text-emerald-50/90 text-lg leading-relaxed italic font-serif">
                  "{offer.guarantee || "Project delivered to agreed scope or we keep working until it is — revisions included. Site goes live only after your final payment clears."}"
                </p>
              )}
            </div>
            <div className="p-4 mt-8 bg-emerald-500/10 rounded-2xl flex items-center gap-4 border border-emerald-500/20">
              <Gift className="text-emerald-400" size={32} />
              <div className="text-sm">
                <span className="block font-black text-emerald-400 uppercase tracking-widest">Bonus Gift</span>
                <span className="text-emerald-100/60 font-medium">Includes 30 days of VIP tech support.</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Checkout Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white text-slate-900 rounded-[40px] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase opacity-40">
               <ShieldCheck size={16} />
               Secure Stripe Checkout
             </div>
          </div>
          
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Finalize Investment</h2>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-5xl md:text-8xl font-black tracking-tighter">
              ${offer.upfront_bnpl ? offer.upfront_bnpl.toLocaleString() : offer.total_price.toLocaleString()}
            </span>
            <div className="text-left">
               <span className="block text-xl font-bold line-through text-slate-300">${(offer.total_value || offer.total_price * 1.5).toLocaleString()}</span>
               <span className="block text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-tighter">SAVE 30%+ TODAY</span>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-10 space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Work Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold"
              />
            </div>

            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Top Competitor URL (Optional)"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold"
              />
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-xs py-4 justify-center font-medium">
              <AlertCircle size={14} />
              <span>Payments handled securely via Stripe.</span>
            </div>
            
            <button 
              onClick={handleAccept}
              disabled={processing}
              className="w-full py-6 bg-slate-900 text-white rounded-2xl text-xl font-black hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {processing ? 'CREATING SECURE PORTAL...' : (
                <>
                  ACTIVATE GROWTH ENGINE
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              No long-term contracts. Cancel anytime after 30 days.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-100">
             {['High Performance', 'Mobile Optimized', 'Lead Focused', '24/7 Support'].map((badge, i) => (
               <div key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {badge}
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
