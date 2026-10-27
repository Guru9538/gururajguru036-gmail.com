import React, { useState } from 'react';
import { FeeInvoice, UserRole, Student } from '../types';
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
  X,
  Building2,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { calculateFeeMetrics } from '../utils/schoolMath';
import { formatCurrency } from '../utils/helpers';

interface FeeManagementProps {
  currentRole: UserRole;
  invoices: FeeInvoice[];
  students: Student[];
  onPayInvoice: (invoiceId: string, paymentMethod: 'Credit Card' | 'Bank Transfer' | 'UPI / Digital' | 'Cash Receipt') => void;
  onCreateInvoice: (invoice: Omit<FeeInvoice, 'id' | 'status' | 'paidDate' | 'paymentMethod'>) => void;
  selectedInvoiceForPay: FeeInvoice | null;
  onClosePayModal: () => void;
  onOpenPayModal: (invoice: FeeInvoice) => void;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  currentRole,
  invoices,
  students,
  onPayInvoice,
  onCreateInvoice,
  selectedInvoiceForPay,
  onClosePayModal,
  onOpenPayModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<FeeInvoice | null>(null);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Bank Transfer' | 'UPI / Digital' | 'Cash Receipt'>('Credit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  // New Invoice Form state
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    invoiceNo: `INV-2026-${String(invoices.length + 101)}`,
    studentId: students[0]?.id || '',
    title: 'Term 2 Academic Tuition Fee',
    category: 'Tuition Fee' as 'Tuition Fee' | 'Laboratory Fee' | 'Library & Tech' | 'Sports & Transport',
    amount: 1450,
    dueDate: '2026-11-20',
  });

  const metrics = calculateFeeMetrics(invoices);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;
    setIsProcessing(true);

    setTimeout(() => {
      onPayInvoice(selectedInvoiceForPay.id, paymentMethod);
      setIsProcessing(false);
      const paidInvoice: FeeInvoice = {
        ...selectedInvoiceForPay,
        status: 'Paid',
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod,
      };
      onClosePayModal();
      setViewingReceipt(paidInvoice);
    }, 700);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === newInvoiceForm.studentId) || students[0];
    onCreateInvoice({
      ...newInvoiceForm,
      studentName: `${st.firstName} ${st.lastName}`,
      grade: st.grade,
      section: st.section,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tuition & School Fee Management
          </h2>
          <p className="text-sm text-slate-500">
            Term invoices, fee clearance ledger, online payment portal, and digital receipts.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Issue Fee Invoice
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium uppercase">Total Billed</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(metrics.totalBilled)}</p>
          <span className="text-xs text-slate-400">Current term charges</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-emerald-700 font-medium uppercase">Total Collected</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(metrics.totalCollected)}</p>
          <span className="text-xs text-emerald-600 font-semibold">{metrics.collectionRate}% collected</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-amber-700 font-medium uppercase">Pending Dues</span>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(metrics.totalPending)}</p>
          <span className="text-xs text-slate-400">Due before month end</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-rose-700 font-medium uppercase">Overdue Amount</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(metrics.totalOverdue)}</p>
          <span className="text-xs text-rose-500 font-medium">Follow-up needed</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, invoice # or fee title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No & Date</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Fee Category & Title</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-800">
                    <div>{inv.invoiceNo}</div>
                    {inv.paidDate && (
                      <div className="text-[11px] text-emerald-600 font-sans font-normal">
                        Paid on {inv.paidDate}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{inv.studentName}</div>
                    <div className="text-xs text-slate-400">
                      {inv.grade} - {inv.section}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{inv.title}</div>
                    <div className="text-xs text-slate-400">{inv.category}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(inv.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-600">{inv.dueDate}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {inv.status !== 'Paid' ? (
                      <button
                        onClick={() => onOpenPayModal(inv)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Pay Fee
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewingReceipt(inv)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-500" /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- PAY FEE MODAL ---------------- */}
      {selectedInvoiceForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Secure Fee Checkout</h3>
              </div>
              <button onClick={onClosePayModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Student:</span>
                <span className="font-bold text-slate-900">{selectedInvoiceForPay.studentName}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Item:</span>
                <span className="text-slate-800">{selectedInvoiceForPay.title}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Invoice Number:</span>
                <span className="font-mono text-slate-800">{selectedInvoiceForPay.invoiceNo}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Amount Due:</span>
                <span className="text-xl font-black text-indigo-600">
                  {formatCurrency(selectedInvoiceForPay.amount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Credit Card', 'UPI / Digital', 'Bank Transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-lg border text-center font-medium transition ${
                        paymentMethod === method
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Details</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number"
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/28"
                      className="text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-center"
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      defaultValue="123"
                      className="text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI / Digital' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Virtual Payment Address (VPA / UPI)</label>
                  <input
                    type="text"
                    defaultValue="eleanor.vance@okaxis"
                    placeholder="user@upi"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Crestview Academy Trust Account:</p>
                  <p>Account: 9481 0029 4819 • Routing: 021000021</p>
                  <p>Bank: Chase Educational Banking Services</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encrypted
                </span>
                <span>Instant Receipt Generation</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClosePayModal}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  {isProcessing ? 'Authorizing Payment...' : `Authorize ${formatCurrency(selectedInvoiceForPay.amount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- OFFICIAL RECEIPT MODAL ---------------- */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 print:m-0 print:border-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Payment Settled Successfully
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setViewingReceipt(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Certificate Content */}
            <div className="border border-slate-200 rounded-xl p-5 bg-radial from-slate-50 to-white space-y-4">
              <div className="text-center pb-3 border-b border-slate-200">
                <h3 className="font-serif font-black text-lg text-slate-900 uppercase">
                  Crestview Preparatory Academy
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Official Electronic Fee Receipt & Discharge Certificate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Receipt No:</span>
                  <p className="font-mono font-bold text-slate-900">REC-{viewingReceipt.invoiceNo.replace('INV-', '')}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Date Settled:</span>
                  <p className="font-semibold text-slate-800">{viewingReceipt.paidDate || 'Today'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Student:</span>
                  <p className="font-bold text-slate-900">{viewingReceipt.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Class:</span>
                  <p className="font-semibold text-slate-800">
                    {viewingReceipt.grade} - {viewingReceipt.section}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between text-xs py-1.5 font-medium text-slate-700">
                  <span>{viewingReceipt.title} ({viewingReceipt.category})</span>
                  <span>{formatCurrency(viewingReceipt.amount)}</span>
                </div>
                <div className="flex justify-between text-xs py-1.5 font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Amount Paid:</span>
                  <span className="text-base text-emerald-700">{formatCurrency(viewingReceipt.amount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Gateway:</span>
                  <span>{viewingReceipt.paymentMethod || 'Online'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Authorized Accounts Seal</span>
                <span className="font-mono text-[10px]">TXN-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={() => setViewingReceipt(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold print:hidden"
            >
              Done & Return to Ledger
            </button>
          </div>
        </div>
      )}

      {/* ---------------- CREATE INVOICE MODAL (Admin) ---------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Issue Fee Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={newInvoiceForm.studentId}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, studentId: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.grade}-{st.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Description</label>
                <input
                  type="text"
                  required
                  value={newInvoiceForm.title}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, title: e.target.value })}
                  placeholder="e.g. Term 2 Academic Tuition Fee"
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Category</label>
                  <select
                    value={newInvoiceForm.category}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, category: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Tuition Fee">Tuition Fee</option>
                    <option value="Laboratory Fee">Laboratory Fee</option>
                    <option value="Library & Tech">Library & Tech</option>
                    <option value="Sports & Transport">Sports & Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    min={1}
                    value={newInvoiceForm.amount}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newInvoiceForm.dueDate}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Create & Dispatch Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
