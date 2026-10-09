import React from 'react';
import { 
  Building2, 
  Plus, 
  Printer, 
  Settings, 
  QrCode,
  LogOut,
  School,
  ChevronDown,
  Code2
} from 'lucide-react';
import { InstitutionInfo, UserRole, AuthUser } from '../types/sarpras';

interface NavbarProps {
  institution: InstitutionInfo;
  schools: InstitutionInfo[];
  onSelectSchool: (school: InstitutionInfo) => void;
  activeTab: string;
  currentUser: AuthUser;
  onLogout: () => void;
  onOpenReportModal: () => void;
  onOpenLabelModal: () => void;
  onOpenGasModal: () => void;
  onOpenSettingsModal: () => void;
  onQuickAddItem: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Ringkasan Eksekutif',
  items: 'Inventaris Sarana (Barang)',
  rooms: 'Prasarana (Ruang & Bangunan)',
  loans: 'Peminjaman & Pengembalian',
  maintenance: 'Pemeliharaan & Kerusakan',
  procurement: 'Rencana Pengadaan (RKAS)',
  schools: 'Manajemen Sekolah',
};

export const Navbar: React.FC<NavbarProps> = ({
  institution,
  schools,
  onSelectSchool,
  activeTab,
  currentUser,
  onLogout,
  onOpenReportModal,
  onOpenLabelModal,
  onOpenGasModal,
  onOpenSettingsModal,
  onQuickAddItem,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-blue-100 h-14 px-4 sm:px-6 flex items-center justify-between no-print shadow-2xs">
      {/* Zone 1: Brand Wordmark (Single text element with Blue & Orange accents) */}
      <div className="flex items-center gap-3">
        <a href="#dashboard" className="text-base font-bold tracking-tight text-blue-950 flex items-center gap-2 whitespace-nowrap">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs border border-orange-400">
            SP
          </span>
          <span>SIM-SARPRAS</span>
        </a>

        {/* Quick School Switcher Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200">
          <School className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <select
            value={institution.id || ''}
            onChange={e => {
              const found = schools.find(s => s.id === e.target.value);
              if (found) onSelectSchool(found);
            }}
            className="text-xs font-semibold text-slate-800 bg-blue-50/70 border border-blue-200 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[210px] truncate cursor-pointer"
            title="Ganti Sekolah Aktif"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 2: Contextual Page Title & User Badge */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="text-xs text-slate-400 font-medium">Menu:</span>
        <span className="text-xs font-bold text-blue-900">
          {TAB_TITLES[activeTab] || 'Sistem Sarpras'}
        </span>
        <span className="text-slate-200">|</span>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px] font-mono">
            {currentUser.avatarText || 'US'}
          </div>
          <span className="font-semibold text-slate-800 max-w-[150px] truncate">{currentUser.fullName}</span>
          <span className="text-[10px] text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded font-bold">
            {currentUser.role === 'admin_sarpras' ? 'Admin' : currentUser.role === 'guru_peminjam' ? 'Guru' : 'Teknisi'}
          </span>
        </div>
      </div>

      {/* Zone 3: Primary Action Buttons (Biru & Oranye) */}
      <div className="flex items-center gap-2">
        {/* Tombol Cetak 10 Label F4 (Orange vibrant accent) */}
        <button
          onClick={onOpenLabelModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer"
          title="Cetak Lembar F4 Berisi 10 Label QR & Barcode"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cetak 10 Label F4</span>
        </button>

        {/* Tombol Cetak Buku KIB (Clean Blue Accent) */}
        <button
          onClick={onOpenReportModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          title="Cetak Buku Inventaris & Laporan"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600" />
          <span>Buku KIB</span>
        </button>

        {/* Tombol Akses Kode.gs & HTML */}
        {onOpenGasModal && (
          <button
            onClick={onOpenGasModal}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50/80 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
            title="Lihat Kode.gs & Index.html Google Apps Script"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Kode.gs & HTML</span>
          </button>
        )}

        {currentUser.role === 'admin_sarpras' && (
          <button
            onClick={onQuickAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sarana</span>
          </button>
        )}

        {/* Tombol Pengaturan */}
        <button
          onClick={onOpenSettingsModal}
          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title="Pengaturan & Cadangan Database"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Tombol Keluar dari Sistem (Jelas & Terlihat) */}
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          title="Keluar dari Sistem (Logout)"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
};
