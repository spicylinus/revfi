'use client';

import React from 'react';
import { CreditCard, Download, ExternalLink, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Invoice } from '@/types/delivery';

interface BillingSectionProps {
  monthlyRate: number;
  nextBillingDate: string;
  invoices: Invoice[];
  stripeCustomerPortalUrl?: string;
}

const BillingSection: React.FC<BillingSectionProps> = ({ monthlyRate, nextBillingDate, invoices, stripeCustomerPortalUrl }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'overdue': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      default: return null;
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.stripeUrl) {
      window.open(invoice.stripeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8">
      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Subscription Overview</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Monthly Rate</span>
              <span className="text-xl font-bold text-slate-900">${monthlyRate.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Next Billing Date</span>
              <span className="text-slate-900 font-bold">{nextBillingDate}</span>
            </div>
          </div>
          <a
            href={stripeCustomerPortalUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-sm text-center"
          >
            Manage Payment Method
          </a>
        </div>

        <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">Financing Available</h4>
            <h3 className="text-2xl font-bold mb-4">Flexible Payments</h3>
            <p className="text-emerald-100/80 text-sm mb-6 max-w-[200px]">
              Use Stripe to split your website investment into smaller, manageable payments.
            </p>
            <a
              href="https://stripe.com/payments"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-all text-sm"
            >
              Learn More
              <ExternalLink size={14} />
            </a>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{invoice.id}</span>
                      <span className="text-xs text-slate-500">{invoice.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{invoice.date}</td>
                  <td className="px-8 py-5 font-bold text-slate-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="uppercase tracking-wider">{invoice.status}</span>
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {invoice.status === 'paid' ? (
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Download Invoice"
                      >
                        <Download size={18} />
                      </button>
                    ) : (
                      <a
                        href={invoice.stripeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-end gap-1"
                      >
                        Pay Now
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
