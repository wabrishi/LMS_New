import React, { useState } from 'react';
import type { Certificate } from '../../../types';
import { mockCertificates } from '../../../data/mockData';
import { CertificateTemplate } from '../../common/CertificateTemplate';
import { Search, ShieldCheck } from 'lucide-react';

export const CertificateModuleView: React.FC = () => {
  const [certificates] = useState<Certificate[]>(mockCertificates);
  const [selectedCert, setSelectedCert] = useState<Certificate>(mockCertificates[0]);
  const [searchCertNo, setSearchCertNo] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = () => {
    const found = certificates.find(c => c.certificateNumber.toLowerCase() === searchCertNo.toLowerCase().trim());
    if (found) {
      setSelectedCert(found);
      setVerificationResult(`Verified! Valid Certificate issued to ${found.studentName}`);
    } else {
      setVerificationResult('Certificate ID not found in global blockchain ledger.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Certificate Generation & Public Verification</h1>
          <p className="text-xs text-gray-500">Issue official course completion certificates with unique IDs and QR code verification links.</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verify Certificate Authenticity
        </h3>
        <p className="text-xs text-gray-500 mb-3">Enter Certificate ID (e.g. CERT-2026-FS-9012) to verify credentials.</p>

        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder="CERT-2026-FS-9012"
            value={searchCertNo}
            onChange={(e) => setSearchCertNo(e.target.value)}
            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
          />
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Verify
          </button>
        </div>

        {verificationResult && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold ${
            verificationResult.includes('Verified') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {verificationResult}
          </div>
        )}
      </div>

      <CertificateTemplate certificate={selectedCert} />
    </div>
  );
};
