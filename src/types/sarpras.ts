export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
export type ItemStatus = 'Tersedia' | 'Dipinjam' | 'Dalam Perbaikan' | 'Dihapuskan';
export type ItemCategory = 
  | 'Elektronik & Multimedia'
  | 'Mebeuler & Perabot'
  | 'Alat Laboratorium'
  | 'Alat Olahraga'
  | 'Buku & Media Belajar'
  | 'Peralatan Kebersihan'
  | 'Lainnya';

export type FundingSource = 
  | 'BOS Reguler'
  | 'DAK Fisik'
  | 'Komite Sekolah'
  | 'Bantuan / Hibah'
  | 'APBD / Pemerintah';

export interface SaranaItem {
  id: string;
  code: string; // e.g. SPR-2024-ELK-001
  name: string;
  category: ItemCategory;
  brand: string;
  specification: string;
  condition: ItemCondition;
  status: ItemStatus;
  locationId: string;
  locationName: string;
  acquisitionYear: number;
  sourceOfFund: FundingSource;
  price: number; // perolehan dalam Rupiah
  quantity: number;
  unit: string;
  serialNumber?: string;
  notes?: string;
  lastChecked: string;
}

export type RoomType = 
  | 'Ruang Kelas'
  | 'Laboratorium'
  | 'Perpustakaan'
  | 'Ruang Guru & TU'
  | 'Aula & Serbaguna'
  | 'Fasilitas Olahraga'
  | 'UKS & Penunjang'
  | 'Gudang Sarpras';

export type RoomCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';

export interface PrasaranaRoom {
  id: string;
  code: string;
  name: string;
  building: string;
  type: RoomType;
  capacity: number; // siswa / orang
  area: number; // meter persegi
  condition: RoomCondition;
  picName: string;
  picContact: string;
  status: 'Tersedia' | 'Digunakan' | 'Dalam Renovasi';
  facilities: string[];
  notes?: string;
}

export type LoanStatus = 
  | 'Menunggu Persetujuan'
  | 'Disetujui'
  | 'Sedang Dipinjam'
  | 'Selesai Dikembalikan'
  | 'Ditolak';

export interface LoanRecord {
  id: string;
  loanNumber: string;
  borrowerName: string;
  borrowerRole: 'Guru' | 'Staf TU' | 'Siswa' | 'Pengurus OSIS / Ekskul' | 'Pihak Luar';
  borrowerContact: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  purpose: string;
  status: LoanStatus;
  returnCondition?: ItemCondition;
  returnNotes?: string;
  approvedBy?: string;
}

export type TicketSeverity = 'Rendah' | 'Sedang' | 'Tinggi / Kritis';
export type TicketStatus = 
  | 'Menunggu Verifikasi'
  | 'Diverifikasi'
  | 'Sedang Dikerjakan'
  | 'Selesai Diperbaiki'
  | 'Afkir / Rekomendasi Penghapusan';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  reporterName: string;
  reporterRole: string;
  reportedDate: string;
  targetType: 'Sarana' | 'Prasarana';
  targetId: string;
  targetName: string;
  location: string;
  severity: TicketSeverity;
  damageDescription: string;
  actionStatus: TicketStatus;
  technicianName?: string;
  estimatedCost: number;
  actualCost?: number;
  completionDate?: string;
  actionNotes?: string;
}

export type ProcurementPriority = 'Mendesak' | 'Prioritas Tinggi' | 'Reguler';
export type ProcurementStatus = 'Usulan Baru' | 'Disetujui RKAS' | 'Terealisasi' | 'Ditunda';

export interface ProcurementItem {
  id: string;
  itemName: string;
  category: ItemCategory;
  targetRoom: string;
  estimatedQuantity: number;
  unit: string;
  estimatedBudget: number;
  priority: ProcurementPriority;
  urgencyReason: string;
  status: ProcurementStatus;
  proposedYear: number;
}

export interface InstitutionInfo {
  id: string;
  name: string;
  npsn: string;
  level?: 'SD' | 'SMP' | 'SMA' | 'SMK';
  status?: 'Negeri' | 'Swasta';
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  telephone: string;
  email: string;
  principal: string;
  principalNip: string;
  sarprasHead: string;
  sarprasNip: string;
  academicYear: string;
}

export type UserRole = 'admin_sarpras' | 'guru_peminjam' | 'teknisi';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  nipOrId?: string;
  avatarText?: string;
}

