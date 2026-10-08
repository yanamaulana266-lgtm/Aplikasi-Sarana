import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { 
  SaranaItem, 
  ItemCategory, 
  ItemCondition, 
  ItemStatus, 
  FundingSource, 
  PrasaranaRoom 
} from '../types/sarpras';

interface ItemModalProps {
  item?: SaranaItem | null;
  rooms: PrasaranaRoom[];
  onSave: (item: SaranaItem) => void;
  onClose: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Elektronik & Multimedia',
  'Mebeuler & Perabot',
  'Alat Laboratorium',
  'Alat Olahraga',
  'Buku & Media Belajar',
  'Peralatan Kebersihan',
  'Lainnya',
];

const FUNDING_SOURCES: FundingSource[] = [
  'BOS Reguler',
  'DAK Fisik',
  'Komite Sekolah',
  'Bantuan / Hibah',
  'APBD / Pemerintah',
];

export const ItemModal: React.FC<ItemModalProps> = ({ item, rooms, onSave, onClose }) => {
  const isEdit = Boolean(item);

  const [name, setName] = useState(item?.name || '');
  const [code, setCode] = useState(
    item?.code || `SPR-${new Date().getFullYear()}-ELK-${String(Math.floor(Math.random() * 900) + 100)}`
  );
  const [category, setCategory] = useState<ItemCategory>(item?.category || 'Elektronik & Multimedia');
  const [brand, setBrand] = useState(item?.brand || '');
  const [specification, setSpecification] = useState(item?.specification || '');
  const [condition, setCondition] = useState<ItemCondition>(item?.condition || 'Baik');
  const [status, setStatus] = useState<ItemStatus>(item?.status || 'Tersedia');
  const [locationId, setLocationId] = useState(item?.locationId || (rooms[0]?.id || ''));
  const [acquisitionYear, setAcquisitionYear] = useState<number>(item?.acquisitionYear || new Date().getFullYear());
  const [sourceOfFund, setSourceOfFund] = useState<FundingSource>(item?.sourceOfFund || 'BOS Reguler');
  const [price, setPrice] = useState<number>(item?.price || 1500000);
  const [quantity, setQuantity] = useState<number>(item?.quantity || 1);
  const [unit, setUnit] = useState(item?.unit || 'Unit');
  const [serialNumber, setSerialNumber] = useState(item?.serialNumber || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama barang inventaris wajib diisi');
      return;
    }
    if (!code.trim()) {
      setError('Kode register barang wajib diisi');
      return;
    }

    const selectedRoom = rooms.find(r => r.id === locationId);
    const locationName = selectedRoom ? selectedRoom.name : 'Gudang Sarpras';

    const newItem: SaranaItem = {
      id: item?.id || `item-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      category,
      brand: brand.trim(),
      specification: specification.trim(),
      condition,
      status,
      locationId,
      locationName,
      acquisitionYear: Number(acquisitionYear),
      sourceOfFund,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit.trim(),
      serialNumber: serialNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      lastChecked: new Date().toISOString().split('T')[0],
    };

    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {isEdit ? 'Ubah Data Sarana (Barang)' : 'Tambah Sarana (Barang) Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan aset sarana sekolah untuk Buku Inventaris Barang
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kode Barang / Registrasi *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Contoh: SPR-2026-ELK-001"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kategori Sarana *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Barang Inventaris *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Proyektor Epson EB-E500"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Merk / Pabrikan
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Contoh: Epson / Samsung / Chitose"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor Seri / SN (Jika Ada)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder="Contoh: SN-882910-ID"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Spesifikasi Teknis
            </label>
            <textarea
              rows={2}
              value={specification}
              onChange={e => setSpecification(e.target.value)}
              placeholder="Rincian dimensi, resolusi, bahan material, daya listrik, dll."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Lokasi Penempatan *
              </label>
              <select
                value={locationId}
                onChange={e => setLocationId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {rooms.map(rm => (
                  <option key={rm.id} value={rm.id}>
                    {rm.name} ({rm.building})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kondisi Fisik *
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                <option value="Baik">Baik (B)</option>
                <option value="Rusak Ringan">Rusak Ringan (RR)</option>
                <option value="Rusak Berat">Rusak Berat (RB)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status Ketersediaan *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam</option>
                <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                <option value="Dihapuskan">Dihapuskan (Afkir)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tahun Pengadaan *
              </label>
              <input
                type="number"
                min={2000}
                max={2035}
                value={acquisitionYear}
                onChange={e => setAcquisitionYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Sumber Anggaran *
              </label>
              <select
                value={sourceOfFund}
                onChange={e => setSourceOfFund(e.target.value as FundingSource)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {FUNDING_SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Harga Perolehan (Rp) *
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Jumlah *
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Satuan Ukuran *
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="Unit / Buah / Set / Pcs"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Catatan Khusus / Kelengkapan
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Kabel power, remote, dan tas pembungkus lengkap"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Perubahan Sarana' : 'Daftarkan Sarana Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
