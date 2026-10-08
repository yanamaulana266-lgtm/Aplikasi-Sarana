import React from 'react';
import { 
  Package, 
  DoorOpen, 
  ArrowLeftRight, 
  Wrench, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Plus,
  QrCode
} from 'lucide-react';
import { 
  SaranaItem, 
  PrasaranaRoom, 
  LoanRecord, 
  MaintenanceTicket, 
  InstitutionInfo 
} from '../types/sarpras';
import { formatRupiah, formatDateId } from '../utils/formatters';

interface DashboardViewProps {
  institution: InstitutionInfo;
  items: SaranaItem[];
  rooms: PrasaranaRoom[];
  loans: LoanRecord[];
  tickets: MaintenanceTicket[];
  onNavigate: (tab: string) => void;
  onOpenAddItem: () => void;
  onOpenAddLoan: () => void;
  onOpenAddTicket: () => void;
  onOpenLabelModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  institution,
  items,
  rooms,
  loans,
  tickets,
  onNavigate,
  onOpenAddItem,
  onOpenAddLoan,
  onOpenAddTicket,
  onOpenLabelModal,
}) => {
  // Aggregate Metrics
  const totalValue = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const totalPhysicalUnits = items.reduce((acc, it) => acc + it.quantity, 0);

  const goodCondition = items.filter(i => i.condition === 'Baik').length;
  const minorDamage = items.filter(i => i.condition === 'Rusak Ringan').length;
  const severeDamage = items.filter(i => i.condition === 'Rusak Berat').length;

  const availableItems = items.filter(i => i.status === 'Tersedia').length;
  const loanedItems = items.filter(i => i.status === 'Dipinjam').length;
  const repairingItems = items.filter(i => i.status === 'Dalam Perbaikan').length;

  const activeLoans = loans.filter(l => l.status === 'Sedang Dipinjam' || l.status === 'Menunggu Persetujuan');
  const activeTickets = tickets.filter(t => t.actionStatus !== 'Selesai Diperbaiki' && t.actionStatus !== 'Afkir / Rekomendasi Penghapusan');

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Sistem Informasi Manajemen Sarana & Prasarana
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-950 mt-1">
            {institution.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pengelolaan aset fisik, pengawasan kondisi gedung, monitoring peminjaman peralatan sekolah, dan pencatatan perbaikan sarana secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenLabelModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-md shadow-orange-600/20 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Cetak 10 Label F4</span>
          </button>
          <button
            onClick={onOpenAddLoan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinjam Barang</span>
          </button>
          <button
            onClick={onOpenAddTicket}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            <span>Lapor Kerusakan</span>
          </button>
          <button
            onClick={onOpenAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sarana</span>
          </button>
        </div>
      </div>

      {/* Top 5 High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nilai Aset Sarpras</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
            {formatRupiah(totalValue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Total harga perolehan
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Barang Inventaris</span>
            <Package className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
            {items.length} <span className="text-xs font-normal text-slate-500">jenis ({totalPhysicalUnits} unit)</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Tercatat di buku inventaris
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Prasarana Ruang</span>
            <DoorOpen className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
            {rooms.length} <span className="text-xs font-normal text-slate-500">ruang & aula</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Kelas, lab, perpustakaan
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Peminjaman Aktif</span>
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
            {activeLoans.length} <span className="text-xs font-normal text-slate-500">transaksi</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Peralatan di luar gudang
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tiket Pemeliharaan</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
            {activeTickets.length} <span className="text-xs font-normal text-slate-500">tiket aktif</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Butuh inspeksi & perbaikan
          </div>
        </div>
      </div>

      {/* Condition & Status Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Kondisi Fisik Sarana */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Kondisi Kelayakan Sarana</h3>
              <p className="text-xs text-slate-500 mt-0.5">Klasifikasi tingkat kelaikan pemakaian barang</p>
            </div>
            <button
              onClick={() => onNavigate('items')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-emerald-700">Kondisi Baik (B)</span>
                <span className="font-mono tabular-nums text-slate-700">{goodCondition} barang ({Math.round((goodCondition / items.length) * 100 || 0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(goodCondition / items.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-amber-700">Rusak Ringan (RR)</span>
                <span className="font-mono tabular-nums text-slate-700">{minorDamage} barang ({Math.round((minorDamage / items.length) * 100 || 0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${(minorDamage / items.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-rose-700">Rusak Berat (RB)</span>
                <span className="font-mono tabular-nums text-slate-700">{severeDamage} barang ({Math.round((severeDamage / items.length) * 100 || 0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${(severeDamage / items.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standar audit sarpras: Baik $\ge$ 80%</span>
            <span className="font-medium text-slate-800">
              {Math.round((goodCondition / items.length) * 100 || 0)}% Siap Pakai
            </span>
          </div>
        </div>

        {/* Card 2: Status Distribusi & Sirkulasi */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Sirkulasi & Ketersediaan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Status pemakaian sarana di lingkungan sekolah</p>
            </div>
            <button
              onClick={() => onNavigate('loans')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Riwayat Pinjam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Tersedia di Gudang</span>
              <span className="text-lg font-bold font-mono text-slate-900 block mt-1">{availableItems}</span>
              <span className="text-[10px] text-emerald-600 font-medium">Dapat dipinjam</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Sedang Dipinjam</span>
              <span className="text-lg font-bold font-mono text-slate-900 block mt-1">{loanedItems}</span>
              <span className="text-[10px] text-blue-600 font-medium">Dalam penggunaan</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Dalam Perbaikan</span>
              <span className="text-lg font-bold font-mono text-slate-900 block mt-1">{repairingItems}</span>
              <span className="text-[10px] text-amber-600 font-medium">Proses teknisi</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kapasitas penyimpanan gudang pusat</span>
            <span className="font-medium text-slate-800">Status Operasional Optimal</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Peminjaman Terkini & Tiket Kerusakan Prioritas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peminjaman Terkini */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Peminjaman Sarana Terkini</h3>
            </div>
            <button
              onClick={() => onNavigate('loans')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {loans.slice(0, 4).map(loan => (
              <div
                key={loan.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-lg border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{loan.itemName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{loan.borrowerName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{loan.borrowerRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-600">{loan.quantity} Unit</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    Keperluan: {loan.purpose}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-medium block ${
                    loan.status === 'Sedang Dipinjam' ? 'text-blue-700' :
                    loan.status === 'Menunggu Persetujuan' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {loan.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    Hingga: {formatDateId(loan.expectedReturnDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiket Kerusakan & Perbaikan */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-900">Laporan Kerusakan Perlu Penanganan</h3>
            </div>
            <button
              onClick={() => onNavigate('maintenance')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {tickets.slice(0, 4).map(ticket => (
              <div
                key={ticket.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-lg border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{ticket.targetName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{ticket.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className={
                      ticket.severity === 'Tinggi / Kritis' ? 'text-rose-600 font-medium' :
                      ticket.severity === 'Sedang' ? 'text-amber-600 font-medium' : 'text-slate-600'
                    }>
                      Urgensi: {ticket.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {ticket.damageDescription}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-medium block ${
                    ticket.actionStatus === 'Selesai Diperbaiki' ? 'text-emerald-700' :
                    ticket.actionStatus === 'Sedang Dikerjakan' ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    {ticket.actionStatus}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    Est: {formatRupiah(ticket.estimatedCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
