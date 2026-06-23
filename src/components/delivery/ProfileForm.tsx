'use client';

import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClientProfile } from '@/types/delivery';

interface ProfileFormProps {
  clientId: string;
  initialProfile: ClientProfile;
}

export default function ProfileForm({ clientId, initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<ClientProfile>(initialProfile);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialProfile.logoUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // 1. Upload logo if changed
      let currentLogoUrl = profile.logoUrl;
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        const logoRes = await fetch(`/api/clients/${clientId}/logo`, {
          method: 'POST',
          body: formData,
        });
        const logoData = await logoRes.json();
        if (logoData.success) {
          currentLogoUrl = logoData.logoUrl;
        }
      }

      // 2. Save profile data
      const res = await fetch(`/api/clients/${clientId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, logoUrl: currentLogoUrl }),
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Logo Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Business Logo</h3>
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-secondary">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-bold text-slate-400">{profile.businessName.charAt(0)}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-all">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 mb-1">Update brand mark</p>
            <p className="text-xs text-slate-500">JPG, PNG, SVG or WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Business Name *</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={profile.businessName}
              onChange={e => setProfile({...profile, businessName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Owner / Contact Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={profile.ownerName}
              onChange={e => setProfile({...profile, ownerName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email (Read-only)</label>
            <input 
              type="email" 
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
              value={profile.email}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Phone Number *</label>
            <input 
              type="tel" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={profile.phone}
              onChange={e => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Website URL</label>
            <input 
              type="url" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={profile.websiteUrl}
              onChange={e => setProfile({...profile, websiteUrl: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Industry</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
              value={profile.industry}
              onChange={e => setProfile({...profile, industry: e.target.value as any})}
            >
              <option value="Home Services">Home Services</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Retail">Retail</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700">Business Address</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700">Business Bio / Description</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-accent font-bold animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 size={20} />
              <span>Profile updated!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-danger font-bold animate-in fade-in slide-in-from-left-2">
              <AlertCircle size={20} />
              <span>Failed to save. Try again.</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving && <Loader2 className="animate-spin" size={20} />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>
    </form>
  );
}
