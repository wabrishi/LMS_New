import React, { useState } from 'react';
import { Building2, CreditCard, Mail, Save, CheckCircle } from 'lucide-react';

export const SettingsModuleView: React.FC = () => {
  const [instituteName, setInstituteName] = useState('Apex Tech University');
  const [smtpHost, setSmtpHost] = useState('smtp.mailgun.org');
  const [stripeKey, setStripeKey] = useState('pk_live_51Mxxxxxxxxxxxxxxxx');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Institute Settings & Configurations</h1>
        <p className="text-xs text-gray-500">Configure global institute branding, SMTP mail servers, payment gateways, and security policies.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-blue-600" /> Institute Branding & General Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institute Name</label>
              <input
                type="text"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Color Theme</label>
              <div className="flex items-center gap-3">
                <input type="color" defaultValue="#2563EB" className="w-10 h-10 rounded-xl cursor-pointer" />
                <span className="text-xs font-mono text-gray-600">#2563EB (Light Mode Blue)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Gateway API Keys
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
              <input
                type="text"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                defaultValue="rzp_live_891238910"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
            <Mail className="w-4 h-4 text-purple-600" /> Automated Email SMTP Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Port</label>
              <input
                type="number"
                defaultValue={587}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
