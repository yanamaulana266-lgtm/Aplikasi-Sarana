import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Printer, 
  Download, 
  User, 
  RotateCcw
} from 'lucide-react';
import { LoanRecord, LoanStatus, SaranaItem, UserRole, ItemCondition } from '../types/sarpras';
import { formatDateId, exportToCSV } from '../utils/formatters';

interface LoansViewProps {
  loans: LoanRecord[];
  items: SaranaItem[];
  userRole: UserRole;
  onOpenAddLoan: () => void;
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onReturnLoan: (loanId: string, condition: ItemCondition, notes: string) => void;
  onPrintBAST: (loan: LoanRecord) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  items,
  userRole,
  onOpenAddLoan,
  onApproveLoan,
  onRejectLoan,
  onReturnLoan,
  onPrintBAST,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [returningLoan, setReturningLoan] = useState<LoanRecord | null>(null);
  const [returnCondition, setReturnCondition] = useState<ItemCondition>('Baik');
  const [returnNotes, setReturnNotes] = useState('');

  const filteredLoans = loans.filter(l => {
    const matchSearch =
      l.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      l.loanNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.itemName.toLowerCase().includes(search.toLowerCase()) ||
      l.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      l.purpose.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExportCSV = () => {
    const data = filteredLoans.map((l, idx) => ({
      No: idx + 1,
      'No. Peminjaman': l.loanNumber,
      Peminjam: l.borrowerName,
      Peran: l.borrowerRole,
      Kontak: l.borrowerContact,
      'Nama Barang': l.itemName,
      'Kode Barang': l.itemCode,
      Jumlah: l.quantity,
      'Tgl Pinjam': l.borrowDate,
      'Tgl Rencana Kembali': l.expectedReturnDate,
      'Tgl Aktual Kembali': l.actualReturnDate || '-',
      Keperluan: l.purpose,
      Status: l.status,
      'Kondisi Kembali': l.returnCondition || '-',
      'Disetujui Oleh': l.approvedBy || '-',
    }));
    exportToCSV('Data_Peminjaman_Sarpras', data);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningLoan) return;
    onReturnLoan(returningLoan.id, returnCondition, returnNotes);
    setReturningLoan(null);
    setReturnNotes('');
    setReturnCondition('Baik');
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Peminjaman & Sirkulasi Sarana
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola izin peminjaman, permohonan penggunaan alat, dan pemantauan batas waktu pengembalian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onOpenAddLoan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajukan Pinjam</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tab buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({loans.length})
          </button>
          <button
            onClick={() => setStatusFilter('Menunggu Persetujuan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Menunggu Persetujuan'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu ({loans.filter(l => l.status === 'Menunggu Persetujuan').length})
          </button>
          <button
            onClick={() => setStatusFilter('Sedang Dipinjam')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Sedang Dipinjam'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dipinjam ({loans.filter(l => l.status === 'Sedang Dipinjam').length})
          </button>
          <button
            onClick={() => setStatusFilter('Selesai Dikembalikan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Selesai Dikembalikan'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({loans.filter(l => l.status === 'Selesai Dikembalikan').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari peminjam, barang..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Table List of Loans */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">No. Peminjaman</th>
                <th className="py-2.5 px-3">Peminjam</th>
                <th className="py-2.5 px-3">Sarana / Barang</th>
                <th className="py-2.5 px-2 text-center">Jumlah</th>
                <th className="py-2.5 px-3">Periode Pinjam</th>
                <th className="py-2.5 px-3">Keperluan</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada riwayat peminjaman yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-[11px] text-slate-900 whitespace-nowrap">
                      {loan.loanNumber}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{loan.borrowerName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {loan.borrowerRole} · {loan.borrowerContact}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900">{loan.itemName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{loan.itemCode}</div>
                    </td>

                    <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {loan.quantity} Unit
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[11px] text-slate-700">{formatDateId(loan.borrowDate)}</div>
                      <div className="text-[10px] text-slate-400">s/d {formatDateId(loan.expectedReturnDate)}</div>
                    </td>

                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="text-[11px] text-slate-600 truncate" title={loan.purpose}>
                        {loan.purpose}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        loan.status === 'Sedang Dipinjam' ? 'text-blue-700' :
                        loan.status === 'Menunggu Persetujuan' ? 'text-amber-700' :
                        loan.status === 'Selesai Dikembalikan' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {loan.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approval actions for Admin */}
                        {loan.status === 'Menunggu Persetujuan' && userRole === 'admin_sarpras' && (
                          <>
                            <button
                              onClick={() => onApproveLoan(loan.id)}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => onRejectLoan(loan.id)}
                              className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {/* Return action */}
                        {loan.status === 'Sedang Dipinjam' && (
                          <button
                            onClick={() => setReturningLoan(loan)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            <RotateCcw className="w-3 h-3 text-slate-500" />
                            <span>Kembalikan</span>
                          </button>
                        )}

                        {/* Print BAST */}
                        <button
                          onClick={() => onPrintBAST(loan)}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Cetak Berita Acara Peminjaman (BAST)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Dialog Modal */}
      {returningLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Konfirmasi Pengembalian Sarana</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {returningLoan.itemName} ({returningLoan.quantity} Unit) oleh {returningLoan.borrowerName}
              </p>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kondisi Saat Dikembalikan *
                </label>
                <select
                  value={returnCondition}
                  onChange={e => setReturnCondition(e.target.value as ItemCondition)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="Baik">Kondisi Baik (Lengkap & Normal)</option>
                  <option value="Rusak Ringan">Ada Kerusakan Ringan</option>
                  <option value="Rusak Berat">Rusak Berat / Komponen Hilang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Pengecekan Petugas
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  placeholder="Kondisi kelengkapan aksesoris, kebersihan, atau keluhan pengguna"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturningLoan(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Simpan Pengembalian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
