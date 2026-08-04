import React, { useState } from 'react';
import type { FeeInvoice } from '../../../types';
import { mockFeeInvoices } from '../../../data/mockData';
import { CreditCard, DollarSign, ShieldCheck } from 'lucide-react';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const FeeModuleView: React.FC = () => {
  const [invoices, setInvoices] = useState<FeeInvoice[]>(mockFeeInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const handlePayInvoice = () => {
    if (!selectedInvoice) return;
    setInvoices(invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          paidAmount: inv.amount,
          status: 'PAID',
          paymentHistory: [
            ...inv.paymentHistory,
            {
              transactionId: `TXN-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount: inv.amount,
              method: 'Online Checkout (Stripe/Razorpay)'
            }
          ]
        };
      }
      return inv;
    }));
    setIsPayModalOpen(false);
    alert('Payment processed successfully! Invoice receipt generated.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-sans">Fees & Financial Invoices</h1>
          <p className="text-xs text-gray-500">Manage tuition installments, payment gateways, receipts, and overdue billing.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-slate-900">
            <tr>
              <th className="p-3.5">Invoice #</th>
              <th className="p-3.5">Student Name</th>
              <th className="p-3.5">Course Name</th>
              <th className="p-3.5">Total Amount</th>
              <th className="p-3.5">Due Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-200">
                <td className="p-3.5 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{inv.studentName}</div>
                  <div className="text-[10px] text-gray-400">{inv.studentRoll}</div>
                </td>
                <td className="p-3.5">{inv.courseName}</td>
                <td className="p-3.5 font-bold text-slate-900">${inv.amount}</td>
                <td className="p-3.5 text-gray-500">{inv.dueDate}</td>
                <td className="p-3.5">
                  <Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'PENDING' ? 'warning' : 'error'}>
                    {inv.status}
                  </Badge>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  {inv.status !== 'PAID' && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsPayModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Pay Online
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Receipt downloaded for ${inv.invoiceNumber}`)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Receipt PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Secure Checkout: Invoice #${selectedInvoice.invoiceNumber}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <div className="text-xs text-gray-500">Total Due Amount</div>
              <div className="text-2xl font-bold text-slate-900">${selectedInvoice.amount} USD</div>
              <div className="text-[11px] text-blue-600 font-semibold">{selectedInvoice.courseName}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Gateway</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border-2 border-blue-600 bg-blue-50/50 rounded-xl font-bold text-xs text-blue-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Stripe Credit Card
                </div>
                <div className="p-3 border border-gray-200 bg-white rounded-xl text-xs text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Razorpay UPI / Bank
                </div>
              </div>
            </div>

            <button
              onClick={handlePayInvoice}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <ShieldCheck className="w-4 h-4" /> Authorize & Pay ${selectedInvoice.amount}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
