import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Coins, 
  User, 
  Edit3, 
  Trash2, 
  Download,
  AlertCircle
} from 'lucide-react';
import { MaintenanceTicket, TicketStatus, TicketSeverity, UserRole } from '../types/sarpras';
import { formatRupiah, formatDateId, exportToCSV } from '../utils/formatters';

interface MaintenanceViewProps {
  tickets: MaintenanceTicket[];
  userRole: UserRole;
  onOpenAddTicket: () => void;
  onEditTicket: (ticket: MaintenanceTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  tickets,
  userRole,
  onOpenAddTicket,
  onEditTicket,
  onDeleteTicket,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t => {
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.targetName.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      t.damageDescription.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || t.actionStatus === statusFilter;
    const matchSeverity = severityFilter === 'all' || t.severity === severityFilter;

    return matchSearch && matchStatus && matchSeverity;
  });

  const totalEstimatedCost = filteredTickets.reduce((acc, t) => acc + t.estimatedCost, 0);
  const totalActualCost = filteredTickets.reduce((acc, t) => acc + (t.actualCost || 0), 0);

  const handleExportCSV = () => {
    const data = filteredTickets.map((t, idx) => ({
      No: idx + 1,
      'No. Tiket': t.ticketNumber,
      Pelapor: t.reporterName,
      'Tgl Lapor': t.reportedDate,
      Tipe: t.targetType,
      'Nama Sarana / Prasarana': t.targetName,
      Lokasi: t.location,
      Tingkat: t.severity,
      'Deskripsi Kerusakan': t.damageDescription,
      Status: t.actionStatus,
      Teknisi: t.technicianName || '-',
      'Estimasi Biaya (Rp)': t.estimatedCost,
      'Biaya Riil (Rp)': t.actualCost || 0,
      'Catatan Perbaikan': t.actionNotes || '-',
      'Tgl Selesai': t.completionDate || '-',
    }));
    exportToCSV('Data_Pemeliharaan_Dan_Kerusakan_Sarpras', data);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Pemeliharaan, Kerusakan & Perbaikan Aset
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring tiket kerusakan teknis, jadwal servis berkala, dan realisasi anggaran perbaikan
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
            onClick={onOpenAddTicket}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lapor Kerusakan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500">Tiket Belum Selesai</span>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {tickets.filter(t => t.actionStatus !== 'Selesai Diperbaiki' && t.actionStatus !== 'Afkir / Rekomendasi Penghapusan').length} Tiket
            </div>
          </div>
          <Clock className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500">Total Estimasi Kebutuhan</span>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {formatRupiah(totalEstimatedCost)}
            </div>
          </div>
          <Coins className="w-5 h-5 text-slate-500" />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500">Realisasi Biaya Perbaikan</span>
            <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
              {formatRupiah(totalActualCost)}
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setStatusFilter('Menunggu Verifikasi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Menunggu Verifikasi'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu
          </button>
          <button
            onClick={() => setStatusFilter('Sedang Dikerjakan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Sedang Dikerjakan'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dikerjakan
          </button>
          <button
            onClick={() => setStatusFilter('Selesai Diperbaiki')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'Selesai Diperbaiki'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Urgensi</option>
            <option value="Tinggi / Kritis">Tinggi / Kritis</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tiket kerusakan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Ticket List Cards */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-2xs">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">Tidak ada tiket perbaikan</h3>
            <p className="text-xs text-slate-500 mt-1">Semua sarana prasarana saat ini dalam kondisi terpantau baik.</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {ticket.ticketNumber}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className={
                    ticket.severity === 'Tinggi / Kritis' ? 'text-rose-700 font-semibold' :
                    ticket.severity === 'Sedang' ? 'text-amber-700 font-medium' : 'text-slate-600'
                  }>
                    Tingkat: {ticket.severity}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    Dilaporkan: {formatDateId(ticket.reportedDate)} oleh {ticket.reporterName} ({ticket.reporterRole})
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {ticket.targetName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Lokasi: <span className="font-medium text-slate-700">{ticket.location}</span> ({ticket.targetType})
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {ticket.damageDescription}
                </p>

                {ticket.actionNotes && (
                  <div className="text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span className="font-medium">Catatan Penanganan:</span> {ticket.actionNotes}
                  </div>
                )}
              </div>

              {/* Status & Actions Column */}
              <div className="md:w-64 shrink-0 flex flex-col justify-between items-start md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${
                    ticket.actionStatus === 'Selesai Diperbaiki' ? 'bg-emerald-100 text-emerald-800' :
                    ticket.actionStatus === 'Sedang Dikerjakan' ? 'bg-amber-100 text-amber-800' :
                    ticket.actionStatus === 'Diverifikasi' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {ticket.actionStatus}
                  </span>
                  <div className="mt-1.5 text-xs text-slate-600">
                    Estimasi: <span className="font-mono font-medium text-slate-900">{formatRupiah(ticket.estimatedCost)}</span>
                  </div>
                  {ticket.actualCost ? (
                    <div className="text-[11px] text-emerald-700">
                      Biaya Riil: <span className="font-mono font-medium">{formatRupiah(ticket.actualCost)}</span>
                    </div>
                  ) : null}
                  {ticket.technicianName && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Teknisi: {ticket.technicianName}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onEditTicket(ticket)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Update Penanganan</span>
                  </button>

                  {userRole === 'admin_sarpras' && (
                    <button
                      onClick={() => {
                        if (deleteConfirmId === ticket.id) {
                          onDeleteTicket(ticket.id);
                          setDeleteConfirmId(null);
                        } else {
                          setDeleteConfirmId(ticket.id);
                          setTimeout(() => setDeleteConfirmId(null), 3500);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        deleteConfirmId === ticket.id
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title={deleteConfirmId === ticket.id ? 'Klik sekali lagi untuk menghapus' : 'Hapus Tiket'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
