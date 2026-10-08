import React, { useState } from 'react';
import { X, Save, AlertCircle, Calendar } from 'lucide-react';
import { LoanRecord, SaranaItem } from '../types/sarpras';

interface LoanModalProps {
  items: SaranaItem[];
  preselectedItemId?: string;
  onSave: (loan: LoanRecord) => void;
  onClose: () => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  items,
  preselectedItemId,
  onSave,
  onClose,
}) => {
  const availableItems = items.filter(it => it.status === 'Tersedia' || it.id === preselectedItemId);
  const initialItemId = preselectedItemId || (availableItems[0]?.id || items[0]?.id || '');

  const todayIso = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().split('T')[0];

  const [itemId, setItemId] = useState(initialItemId);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<'Guru' | 'Staf TU' | 'Siswa' | 'Pengurus OSIS / Ekskul' | 'Pihak Luar'>('Guru');
  const [borrowerContact, setBorrowerContact] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [borrowDate, setBorrowDate] = useState(todayIso);
  const [expectedReturnDate, setExpectedReturnDate] = useState(tomorrowIso);
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  const selectedItem = items.find(it => it.id === itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim()) {
      setError('Nama peminjam wajib diisi');
      return;
    }
    if (!purpose.trim()) {
      setError('Keperluan peminjaman sarana wajib diisi');
      return;
    }
    if (!selectedItem) {
      setError('Silakan pilih barang inventaris yang ingin dipinjam');
      return;
    }

    const loanNumber = `PJM-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newLoan: LoanRecord = {
      id: `loan-${Date.now()}`,
      loanNumber,
      borrowerName: borrowerName.trim(),
      borrowerRole,
      borrowerContact: borrowerContact.trim() || '-',
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemCode: selectedItem.code,
      quantity: Number(quantity),
      borrowDate,
      expectedReturnDate,
      purpose: purpose.trim(),
      status: 'Menunggu Persetujuan',
    };

    onSave(newLoan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Form Peminjaman Sarana</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengajuan izin pemakaian fasilitas & peralatan sarana sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Pilih Sarana / Barang Inventaris *
            </label>
            <select
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
            >
              {items.map(it => (
                <option key={it.id} value={it.id}>
                  {it.name} [{it.code}] · {it.locationName} ({it.status})
                </option>
              ))}
            </select>
            {selectedItem && selectedItem.status !== 'Tersedia' && (
              <p className="mt-1 text-[11px] text-amber-600">
                Catatan: Barang ini saat ini berstatus "{selectedItem.status}". Peminjaman akan masuk antrean pengajuan persetujuan.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Peminjam *
              </label>
              <input
                type="text"
                required
                value={borrowerName}
                onChange={e => setBorrowerName(e.target.value)}
                placeholder="Contoh: Siti Rohmah, S.Pd."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kategori Peminjam *
              </label>
              <select
                value={borrowerRole}
                onChange={e => setBorrowerRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                <option value="Guru">Guru / Tenaga Pendidik</option>
                <option value="Staf TU">Staf Tata Usaha</option>
                <option value="Pengurus OSIS / Ekskul">Pengurus OSIS / Ekskul</option>
                <option value="Siswa">Siswa</option>
                <option value="Pihak Luar">Pihak Luar / Tamu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor Kontak / WhatsApp *
              </label>
              <input
                type="text"
                value={borrowerContact}
                onChange={e => setBorrowerContact(e.target.value)}
                placeholder="Contoh: 0812-8877-6655"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Jumlah Dipinjam (Unit)
              </label>
              <input
                type="number"
                min={1}
                max={selectedItem?.quantity || 1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Pinjam
              </label>
              <input
                type="date"
                value={borrowDate}
                onChange={e => setBorrowDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Batas Pengembalian
              </label>
              <input
                type="date"
                min={borrowDate}
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Keperluan Penggunaan *
            </label>
            <textarea
              rows={3}
              required
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Jelaskan mata pelajaran, ruang kelas, atau kegiatan spesifik penggunaan barang"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Kirim Pengajuan Peminjaman</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
