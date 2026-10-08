import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { PrasaranaRoom, RoomType, RoomCondition } from '../types/sarpras';

interface RoomModalProps {
  room?: PrasaranaRoom | null;
  onSave: (room: PrasaranaRoom) => void;
  onClose: () => void;
}

const ROOM_TYPES: RoomType[] = [
  'Ruang Kelas',
  'Laboratorium',
  'Perpustakaan',
  'Ruang Guru & TU',
  'Aula & Serbaguna',
  'Fasilitas Olahraga',
  'UKS & Penunjang',
  'Gudang Sarpras',
];

export const RoomModal: React.FC<RoomModalProps> = ({ room, onSave, onClose }) => {
  const isEdit = Boolean(room);

  const [name, setName] = useState(room?.name || '');
  const [code, setCode] = useState(
    room?.code || `R-KLS-${String(Math.floor(Math.random() * 90) + 10)}`
  );
  const [building, setBuilding] = useState(room?.building || 'Gedung Pembelajaran - Lantai 1');
  const [type, setType] = useState<RoomType>(room?.type || 'Ruang Kelas');
  const [capacity, setCapacity] = useState<number>(room?.capacity || 32);
  const [area, setArea] = useState<number>(room?.area || 56);
  const [condition, setCondition] = useState<RoomCondition>(room?.condition || 'Baik');
  const [picName, setPicName] = useState(room?.picName || '');
  const [picContact, setPicContact] = useState(room?.picContact || '');
  const [status, setStatus] = useState<'Tersedia' | 'Digunakan' | 'Dalam Renovasi'>(room?.status || 'Tersedia');
  const [facilitiesStr, setFacilitiesStr] = useState(room?.facilities?.join(', ') || 'Meja Kursi, Whiteboard, Kipas Angin');
  const [notes, setNotes] = useState(room?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama ruangan/prasarana wajib diisi');
      return;
    }
    if (!code.trim()) {
      setError('Kode ruangan wajib diisi');
      return;
    }

    const facilities = facilitiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newRoom: PrasaranaRoom = {
      id: room?.id || `room-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      building: building.trim(),
      type,
      capacity: Number(capacity),
      area: Number(area),
      condition,
      picName: picName.trim() || 'Staf Sarpras',
      picContact: picContact.trim() || '-',
      status,
      facilities,
      notes: notes.trim() || undefined,
    };

    onSave(newRoom);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {isEdit ? 'Ubah Data Prasarana (Ruangan)' : 'Tambah Prasarana (Ruangan) Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data fisik gedung, kapasitas, dan fasilitas ruang
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
                Kode Ruangan *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Contoh: R-LAB-KOMP-1"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tipe Ruangan *
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as RoomType)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {ROOM_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Ruangan *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Laboratorium Komputer 2"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Lokasi Gedung / Lantai *
            </label>
            <input
              type="text"
              required
              value={building}
              onChange={e => setBuilding(e.target.value)}
              placeholder="Contoh: Gedung Multimedia - Lantai 2"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kapasitas (Orang)
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Luas Ruang (m²)
              </label>
              <input
                type="number"
                min={1}
                value={area}
                onChange={e => setArea(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kondisi Fisik
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as RoomCondition)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Sedang">Rusak Sedang</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Penanggung Jawab / PIC
              </label>
              <input
                type="text"
                value={picName}
                onChange={e => setPicName(e.target.value)}
                placeholder="Nama Guru / Staf / Laboran"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kontak PIC (No. WA / Telp)
              </label>
              <input
                type="text"
                value={picContact}
                onChange={e => setPicContact(e.target.value)}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Status Keterisian
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'Tersedia' | 'Digunakan' | 'Dalam Renovasi')}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
            >
              <option value="Tersedia">Tersedia (Bisa Dijadwalkan)</option>
              <option value="Digunakan">Digunakan (Kelas Reguler)</option>
              <option value="Dalam Renovasi">Dalam Renovasi / Perbaikan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Fasilitas Terpasang (Pisahkan dengan tanda koma)
            </label>
            <input
              type="text"
              value={facilitiesStr}
              onChange={e => setFacilitiesStr(e.target.value)}
              placeholder="Contoh: AC 2 Unit, Proyektor, WiFi, CCTV"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Catatan / Fungsi Khusus
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Keterangan jadwal atau spesifikasi khusus ruang"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Perubahan Ruangan' : 'Daftarkan Ruangan Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
