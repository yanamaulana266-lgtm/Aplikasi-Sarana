import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  DoorOpen, 
  ArrowLeftRight, 
  Wrench, 
  ShoppingBag, 
  School, 
  FileSpreadsheet, 
  QrCode, 
  Code2,
  LogOut,
  User,
  Info 
} from 'lucide-react';
import { SaranaItem, PrasaranaRoom, LoanRecord, MaintenanceTicket, InstitutionInfo, AuthUser } from '../types/sarpras';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  items: SaranaItem[];
  rooms: PrasaranaRoom[];
  loans: LoanRecord[];
  tickets: MaintenanceTicket[];
  schoolsCount: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenReportModal: () => void;
  onOpenLabelModal: () => void;
  onOpenGasModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  items,
  rooms,
  loans,
  tickets,
  schoolsCount,
  currentUser,
  onLogout,
  onOpenReportModal,
  onOpenLabelModal,
  onOpenGasModal,
}) => {
  const activeLoansCount = loans.filter(l => l.status === 'Sedang Dipinjam' || l.status === 'Menunggu Persetujuan').length;
  const pendingTicketsCount = tickets.filter(t => t.actionStatus !== 'Selesai Diperbaiki' && t.actionStatus !== 'Afkir / Rekomendasi Penghapusan').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Ringkasan',
      icon: LayoutDashboard,
      count: undefined,
    },
    {
      id: 'items',
      label: 'Inventaris Sarana',
      icon: Package,
      count: items.length,
    },
    {
      id: 'rooms',
      label: 'Prasarana & Ruang',
      icon: DoorOpen,
      count: rooms.length,
    },
    {
      id: 'loans',
      label: 'Peminjaman Barang',
      icon: ArrowLeftRight,
      count: activeLoansCount > 0 ? activeLoansCount : undefined,
      highlightCount: activeLoansCount > 0,
    },
    {
      id: 'maintenance',
      label: 'Pemeliharaan & Rusak',
      icon: Wrench,
      count: pendingTicketsCount > 0 ? pendingTicketsCount : undefined,
      highlightCount: pendingTicketsCount > 0,
    },
    {
      id: 'procurement',
      label: 'Perencanaan RKAS',
      icon: ShoppingBag,
      count: undefined,
    },
    {
      id: 'schools',
      label: 'Manajemen Sekolah',
      icon: School,
      count: schoolsCount,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-blue-100 flex flex-col shrink-0 no-print shadow-2xs">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
          Menu Aplikasi
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? 'text-blue-100 bg-blue-700'
                      : item.highlightCount
                      ? 'text-orange-700 bg-orange-100 border border-orange-200'
                      : 'text-slate-500 bg-slate-100'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[10px] font-bold tracking-wider text-orange-600 uppercase">
          Cetak & Dokumen
        </div>

        {/* 10 Labels F4 button with Orange accent */}
        <button
          onClick={onOpenLabelModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-orange-700 hover:text-orange-800 hover:bg-orange-50 transition-colors text-left cursor-pointer border border-transparent hover:border-orange-200"
        >
          <QrCode className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="truncate">Cetak 10 Label F4 (QR)</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50/70 transition-colors text-left cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Cetak Buku KIB & BAST</span>
        </button>

        {onOpenGasModal && (
          <button
            onClick={onOpenGasModal}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-blue-800 hover:text-blue-950 hover:bg-blue-50/80 transition-colors text-left cursor-pointer border border-blue-200/60 mt-1"
            title="Lihat & Salin Kode.gs dan Index.html untuk Google Apps Script"
          >
            <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Kode.gs & Index.html (GAS)</span>
          </button>
        )}
      </div>

      {/* Institutional Info Card at bottom with Blue & Orange accents */}
      <div className="p-3 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50/50">
        <div className="p-2.5 bg-white rounded-lg border border-blue-200/80 text-[11px] space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Format F4 Folio Standar</span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">
            1 Lembar isi 10 Label QR & Barcode lengkap Kode dan Nama Barang.
          </p>
        </div>
      </div>

      {/* User Session & Tombol Keluar dari Sistem */}
      {onLogout && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
          {currentUser && (
            <div className="flex items-center gap-2 px-1 py-0.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center border border-orange-400 shrink-0 shadow-2xs">
                {currentUser.avatarText || currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {currentUser.fullName || currentUser.username}
                </div>
                <div className="text-[10px] text-slate-500 font-mono capitalize">
                  {currentUser.role === 'admin_sarpras' ? 'Administrator' : currentUser.role}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-lg transition-all shadow-2xs cursor-pointer"
            title="Keluar / Logout dari Sistem"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      )}
    </aside>
  );
};
