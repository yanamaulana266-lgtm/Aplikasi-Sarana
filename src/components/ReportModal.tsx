import React, { useState } from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SaranaItem, PrasaranaRoom, LoanRecord, MaintenanceTicket, InstitutionInfo } from '../types/sarpras';
import { formatRupiah, formatDateId, exportToCSV } from '../utils/formatters';

interface ReportModalProps {
  institution: InstitutionInfo;
  items: SaranaItem[];
  rooms: PrasaranaRoom[];
  loans: LoanRecord[];
  tickets: MaintenanceTicket[];
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  institution,
  items,
  rooms,
  loans,
  tickets,
  onClose,
}) => {
  const [reportType, setReportType] = useState<'inventory' | 'loans' | 'maintenance' | 'rooms'>('inventory');

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const totalAssetValue = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (reportType === 'inventory') {
      const data = items.map((it, idx) => ({
        No: idx + 1,
        'Kode Barang': it.code,
        'Nama Barang': it.name,
        Kategori: it.category,
        Merk: it.brand,
        Spesifikasi: it.specification,
        Kondisi: it.condition,
        Status: it.status,
        Lokasi: it.locationName,
        'Tahun Pengadaan': it.acquisitionYear,
        'Sumber Dana': it.sourceOfFund,
        Jumlah: it.quantity,
        Satuan: it.unit,
        'Harga Satuan (Rp)': it.price,
        'Total Nilai (Rp)': it.price * it.quantity,
      }));
      exportToCSV(`Buku_Inventaris_Sarpras_${institution.name.replace(/\s+/g, '_')}`, data);
    } else if (reportType === 'loans') {
      const data = loans.map((l, idx) => ({
        No: idx + 1,
        'Nomor Peminjaman': l.loanNumber,
        Peminjam: l.borrowerName,
        Peran: l.borrowerRole,
        Kontak: l.borrowerContact,
        'Nama Barang': l.itemName,
        'Kode Barang': l.itemCode,
        Jumlah: l.quantity,
        'Tgl Pinjam': l.borrowDate,
        'Tgl Rencana Kembali': l.expectedReturnDate,
        'Tgl Kembali Aktual': l.actualReturnDate || '-',
        Keperluan: l.purpose,
        Status: l.status,
      }));
      exportToCSV(`Rekap_Peminjaman_Sarpras`, data);
    } else if (reportType === 'maintenance') {
      const data = tickets.map((t, idx) => ({
        No: idx + 1,
        'No Tiket': t.ticketNumber,
        Pelapor: t.reporterName,
        'Tgl Lapor': t.reportedDate,
        'Nama Sarana / Prasarana': t.targetName,
        Lokasi: t.location,
        Tingkat: t.severity,
        'Deskripsi Kerusakan': t.damageDescription,
        Status: t.actionStatus,
        Teknisi: t.technicianName || '-',
        'Estimasi Biaya (Rp)': t.estimatedCost,
        'Biaya Riil (Rp)': t.actualCost || 0,
      }));
      exportToCSV(`Laporan_Kerusakan_Pemeliharaan`, data);
    } else if (reportType === 'rooms') {
      const data = rooms.map((r, idx) => ({
        No: idx + 1,
        'Kode Ruang': r.code,
        'Nama Ruangan': r.name,
        Gedung: r.building,
        Tipe: r.type,
        'Kapasitas (Orang)': r.capacity,
        'Luas (m2)': r.area,
        Kondisi: r.condition,
        'Kepala Ruangan (PIC)': r.picName,
        Kontak: r.picContact,
        Status: r.status,
      }));
      exportToCSV(`Daftar_Prasarana_Ruangan`, data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Top Header (No print) */}
        <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between no-print bg-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center border border-orange-400 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950">
                Pusat Cetak & Pelaporan Sarana Prasarana
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Format resmi sesuai standar Buku Inventaris Barang (BMN/KIB) dan Berita Acara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Tab Selector (No print) */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3 no-print">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setReportType('inventory')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                reportType === 'inventory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Buku Inventaris (KIB)
            </button>
            <button
              onClick={() => setReportType('loans')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                reportType === 'loans'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Rekap Peminjaman
            </button>
            <button
              onClick={() => setReportType('maintenance')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                reportType === 'maintenance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Pemeliharaan & Kerusakan
            </button>
            <button
              onClick={() => setReportType('rooms')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                reportType === 'rooms'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Data Prasarana Ruang
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Unduh CSV / Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
          </div>
        </div>

        {/* Document Body (Printable Official Sheet) */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 printable-document">
          {/* Official Kop Surat */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-600">
              PEMERINTAH DAERAH PROVINSI {institution.province.toUpperCase()}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-600">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
              {institution.name.toUpperCase()}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {institution.address}, {institution.subdistrict}, {institution.city} · Telp: {institution.telephone} · Email: {institution.email}
            </p>
            <div className="text-[11px] font-mono font-medium text-slate-500 mt-1">
              NPSN: {institution.npsn} · Tahun Ajaran: {institution.academicYear}
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              {reportType === 'inventory' && 'BUKU INVENTARIS SARANA & DAFTAR ASET (KIB)'}
              {reportType === 'loans' && 'REKAPITULASI PEMINJAMAN SARANA PRASARANA'}
              {reportType === 'maintenance' && 'LAPORAN KERUSAKAN DAN PEMELIHARAAN SARPRAS'}
              {reportType === 'rooms' && 'BUKU INDUK PRASARANA (DATA GEDUNG & RUANGAN)'}
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Periode Tahun Berjalan · Dicetak pada: {todayStr}
            </div>
          </div>

          {/* Content Tables Based on Mode */}
          {reportType === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-600 px-1 font-mono">
                <span>Total Register: <strong>{items.length} Barang</strong></span>
                <span>Total Nilai Inventaris: <strong className="text-slate-900">{formatRupiah(totalAssetValue)}</strong></span>
              </div>

              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                      <th className="py-2.5 px-2 border-r border-slate-300 w-10 text-center">No</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Kode Barang</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Nama Barang & Spesifikasi</th>
                      <th className="py-2.5 px-2 border-r border-slate-300">Kategori</th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center">Tahun</th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center">Kondisi</th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center">Jml</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-right">Harga Satuan</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-right">Total Nilai</th>
                      <th className="py-2.5 px-2">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-slate-200 font-mono font-medium text-[11px] text-slate-900">{item.code}</td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{item.specification}</div>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-[11px] text-slate-600">{item.category}</td>
                        <td className="py-2 px-2 border-r border-slate-200 text-center font-mono text-[11px]">{item.acquisitionYear}</td>
                        <td className="py-2 px-2 border-r border-slate-200 text-center text-[11px]">
                          <span className={
                            item.condition === 'Baik' ? 'text-emerald-700 font-medium' :
                            item.condition === 'Rusak Ringan' ? 'text-amber-700 font-medium' : 'text-rose-700 font-medium'
                          }>
                            {item.condition}
                          </span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-center font-mono text-[11px]">{item.quantity} {item.unit}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-[11px]">{formatRupiah(item.price)}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-[11px] font-semibold text-slate-900">
                          {formatRupiah(item.price * item.quantity)}
                        </td>
                        <td className="py-2 px-2 text-[11px] text-slate-600 truncate max-w-[120px]">{item.locationName}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-semibold border-t-2 border-slate-300">
                      <td colSpan={8} className="py-2.5 px-3 text-right text-slate-700">Total Akumulasi Nilai Sarpras:</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900">{formatRupiah(totalAssetValue)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {reportType === 'loans' && (
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                    <th className="py-2 px-2 border-r border-slate-300 text-center w-10">No</th>
                    <th className="py-2 px-3 border-r border-slate-300">No. Peminjaman</th>
                    <th className="py-2 px-3 border-r border-slate-300">Peminjam</th>
                    <th className="py-2 px-3 border-r border-slate-300">Nama Barang Dipinjam</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Jumlah</th>
                    <th className="py-2 px-3 border-r border-slate-300">Tgl Pinjam</th>
                    <th className="py-2 px-3 border-r border-slate-300">Tgl Estimasi / Kembali</th>
                    <th className="py-2 px-3 border-r border-slate-300">Keperluan</th>
                    <th className="py-2 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loans.map((loan, idx) => (
                    <tr key={loan.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-mono font-medium text-[11px] text-slate-900">{loan.loanNumber}</td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <div className="font-semibold text-slate-900">{loan.borrowerName}</div>
                        <div className="text-[10px] text-slate-500">{loan.borrowerRole} · {loan.borrowerContact}</div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium text-slate-800">{loan.itemName}</td>
                      <td className="py-2 px-2 border-r border-slate-200 text-center font-mono">{loan.quantity} Unit</td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px]">{formatDateId(loan.borrowDate)}</td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                        <div>Rencana: {formatDateId(loan.expectedReturnDate)}</div>
                        {loan.actualReturnDate && (
                          <div className="text-emerald-700 font-medium">Kembali: {formatDateId(loan.actualReturnDate)}</div>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">{loan.purpose}</td>
                      <td className="py-2 px-2 text-center text-[11px] font-medium">
                        {loan.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'maintenance' && (
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                    <th className="py-2 px-2 border-r border-slate-300 text-center w-10">No</th>
                    <th className="py-2 px-3 border-r border-slate-300">No. Tiket</th>
                    <th className="py-2 px-3 border-r border-slate-300">Objek Sarpras</th>
                    <th className="py-2 px-3 border-r border-slate-300">Lokasi</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Tingkat</th>
                    <th className="py-2 px-4 border-r border-slate-300">Deskripsi Kerusakan</th>
                    <th className="py-2 px-3 border-r border-slate-300">Status Tindakan</th>
                    <th className="py-2 px-3 text-right">Estimasi Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tickets.map((tk, idx) => (
                    <tr key={tk.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-mono font-medium text-[11px] text-slate-900">{tk.ticketNumber}</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900">{tk.targetName}</td>
                      <td className="py-2 px-3 border-r border-slate-200 text-slate-600">{tk.location}</td>
                      <td className="py-2 px-2 border-r border-slate-200 text-center text-[11px] font-medium">{tk.severity}</td>
                      <td className="py-2 px-4 border-r border-slate-200 text-[11px] text-slate-700">{tk.damageDescription}</td>
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                        <div className="font-medium text-slate-800">{tk.actionStatus}</div>
                        {tk.technicianName && <div className="text-[10px] text-slate-500">Oleh: {tk.technicianName}</div>}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[11px]">{formatRupiah(tk.estimatedCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'rooms' && (
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                    <th className="py-2 px-2 border-r border-slate-300 text-center w-10">No</th>
                    <th className="py-2 px-3 border-r border-slate-300">Kode Ruang</th>
                    <th className="py-2 px-4 border-r border-slate-300">Nama Ruangan</th>
                    <th className="py-2 px-3 border-r border-slate-300">Gedung / Lantai</th>
                    <th className="py-2 px-3 border-r border-slate-300">Tipe Ruangan</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Kapasitas</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Luas</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Kondisi</th>
                    <th className="py-2 px-3">Penanggung Jawab (PIC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rooms.map((rm, idx) => (
                    <tr key={rm.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-mono font-medium text-[11px] text-slate-900">{rm.code}</td>
                      <td className="py-2 px-4 border-r border-slate-200 font-semibold text-slate-900">{rm.name}</td>
                      <td className="py-2 px-3 border-r border-slate-200 text-slate-600">{rm.building}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{rm.type}</td>
                      <td className="py-2 px-2 border-r border-slate-200 text-center font-mono">{rm.capacity} org</td>
                      <td className="py-2 px-2 border-r border-slate-200 text-center font-mono">{rm.area} m²</td>
                      <td className="py-2 px-2 border-r border-slate-200 text-center text-[11px] font-medium">{rm.condition}</td>
                      <td className="py-2 px-3 text-slate-700">
                        <div className="font-medium text-slate-900">{rm.picName}</div>
                        <div className="text-[10px] text-slate-500">{rm.picContact}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Signatures Section */}
          <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-center text-xs text-slate-800 break-inside-avoid">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-semibold text-slate-900">Kepala Sekolah</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">( Tanda Tangan & Cap Sekolah )</span>
              </div>
              <p className="font-bold underline text-slate-900">{institution.principal}</p>
              <p className="text-[11px] font-mono text-slate-600">NIP. {institution.principalNip}</p>
            </div>

            <div>
              <p className="text-slate-500">{institution.city}, {todayStr}</p>
              <p className="font-semibold text-slate-900">Pengelola / Koordinator Sarpras</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">( Tanda Tangan Pengelola )</span>
              </div>
              <p className="font-bold underline text-slate-900">{institution.sarprasHead}</p>
              <p className="text-[11px] font-mono text-slate-600">NIP. {institution.sarprasNip}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format cetak otomatis disesuaikan untuk dokumen resmi A4 / F4 landscape & portrait</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
