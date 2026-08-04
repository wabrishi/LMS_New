import React from 'react';
import { Award, Download, Printer, ShieldCheck } from 'lucide-react';
import type { Certificate } from '../../types';

interface CertificateTemplateProps {
  certificate: Certificate;
  onDownloadPdf?: () => void;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  onDownloadPdf
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-8 border-double border-blue-600/30 p-8 rounded-2xl shadow-card relative max-w-3xl mx-auto my-4 text-center select-none font-sans">
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-blue-600" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-blue-600" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-blue-600" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-blue-600" />

      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 border-2 border-blue-600 rounded-full text-blue-600 mb-3 shadow-md">
        <Award className="w-8 h-8" />
      </div>

      <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-blue-600 mb-1">
        Apex Tech University &bull; Executive Academy
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
        Certificate of Completion
      </h1>
      <p className="text-xs text-gray-500 mt-1 italic">This is proudly presented to</p>

      <div className="my-5 border-b border-gray-200 pb-2 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 font-serif">{certificate.studentName}</h2>
      </div>

      <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
        for successfully completing the advanced enterprise training curriculum and demonstrating overall mastery in:
      </p>

      <h3 className="text-lg font-bold text-slate-900 my-3">{certificate.courseName}</h3>

      <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold mb-6">
        Grade Awarded: {certificate.grade}
      </div>

      <div className="pt-6 border-t border-gray-200 flex items-center justify-between px-6 text-left">
        <div>
          <div className="text-[10px] uppercase text-gray-400 font-semibold">Certificate ID</div>
          <div className="text-xs font-mono font-bold text-slate-800">{certificate.certificateNumber}</div>
          <div className="text-[10px] text-gray-400 mt-1">Issued: {certificate.issueDate}</div>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={certificate.qrCodeUrl}
            alt="QR Verification"
            className="w-16 h-16 border p-1 rounded bg-white shadow-xs"
          />
          <span className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
          </span>
        </div>

        <div className="text-right">
          <div className="h-8 font-serif italic text-blue-900 font-bold text-lg">Dr. Rajesh Kumar</div>
          <div className="border-t border-gray-300 pt-1 text-[10px] uppercase font-bold text-gray-500">
            Director of Academic Affairs
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-200"
        >
          <Printer className="w-4 h-4" /> Print Certificate
        </button>
        <button
          onClick={onDownloadPdf}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-200"
        >
          <Download className="w-4 h-4" /> Download Official PDF
        </button>
      </div>
    </div>
  );
};
