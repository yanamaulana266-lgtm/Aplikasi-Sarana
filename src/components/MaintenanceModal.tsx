import React, { useState } from 'react';
import { X, Save, AlertCircle, Wrench } from 'lucide-react';
import { MaintenanceTicket, SaranaItem, PrasaranaRoom, TicketSeverity, TicketStatus } from '../types/sarpras';

interface MaintenanceModalProps {
  ticket?: MaintenanceTicket | null;
  items: SaranaItem[];
  rooms: PrasaranaRoom[];
  preselectedItem?: SaranaItem;
  preselectedRoom?: PrasaranaRoom;
  onSave: (ticket: MaintenanceTicket) => void;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  ticket,
  items,
  rooms,
  preselectedItem,
  preselectedRoom,
  onSave,
  onClose,
}) => {
  const isEdit = Boolean(ticket);

  const [targetType, setTargetType] = useState<'Sarana' | 'Prasarana'>(
    ticket?.targetType || (preselectedRoom ? 'Prasarana' : 'Sarana')
  );

  const [saranaId, setSaranaId] = useState(
    ticket?.targetType === 'Sarana' ? ticket.targetId : (preselectedItem?.id || items[0]?.id || '')
  );

  const [roomId, setRoomId] = useState(
    ticket?.targetType === 'Prasarana' ? ticket.targetId : (preselectedRoom?.id || rooms[0]?.id || '')
  );

  const [reporterName, setReporterName] = useState(ticket?.reporterName || '');
  const [reporterRole, setReporterRole] = useState(ticket?.reporterRole || 'Guru Pengajar');
  const [severity, setSeverity] = useState<TicketSeverity>(ticket?.severity || 'Sedang');
  const [damageDescription, setDamageDescription] = useState(ticket?.damageDescription || '');
  const [actionStatus, setActionStatus] = useState<TicketStatus>(ticket?.actionStatus || 'Menunggu Verifikasi');
  const [technicianName, setTechnicianName] = useState(ticket?.technicianName || '');
  const [estimatedCost, setEstimatedCost] = useState<number>(ticket?.estimatedCost || 150000);
  const [actualCost, setActualCost] = useState<number>(ticket?.actualCost || 0);
  const [actionNotes, setActionNotes] = useState(ticket?.actionNotes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim()) {
      setError('Nama pelapor wajib diisi');
      return;
    }
    if (!damageDescription.trim()) {
      setError('Deskripsi kerusakan wajib diisi');
      return;
    }

    let targetId = '';
    let targetName = '';
    let location = '';

    if (targetType === 'Sarana') {
      const selectedSarana = items.find(i => i.id === saranaId);
      if (!selectedSarana) {
        setError('Pilih sarana / barang yang mengalami kendala');
        return;
      }
      targetId = selectedSarana.id;
      targetName = `${selectedSarana.name} (${selectedSarana.code})`;
      location = selectedSarana.locationName;
    } else {
      const selectedRoom = rooms.find(r => r.id === roomId);
      if (!selectedRoom) {
        setError('Pilih prasarana / ruangan yang mengalami kendala');
        return;
      }
      targetId = selectedRoom.id;
      targetName = `${selectedRoom.name} (${selectedRoom.code})`;
      location = `${selectedRoom.building}`;
    }

    const ticketNumber = ticket?.ticketNumber || `TIK-MNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newTicket: MaintenanceTicket = {
      id: ticket?.id || `ticket-${Date.now()}`,
      ticketNumber,
      reporterName: reporterName.trim(),
      reporterRole: reporterRole.trim(),
      reportedDate: ticket?.reportedDate || new Date().toISOString().split('T')[0],
      targetType,
      targetId,
      targetName,
      location,
      severity,
      damageDescription: damageDescription.trim(),
      actionStatus,
      technicianName: technicianName.trim() || undefined,
      estimatedCost: Number(estimatedCost),
      actualCost: actualCost ? Number(actualCost) : undefined,
      actionNotes: actionNotes.trim() || undefined,
      completionDate: actionStatus === 'Selesai Diperbaiki' ? new Date().toISOString().split('T')[0] : ticket?.completionDate,
    };

    onSave(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {isEdit ? 'Update Tiket Pemeliharaan & Kerusakan' : 'Lapor Kerusakan Sarana Prasarana'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan laporan kerusakan, investigasi teknisi, & estimasi biaya
              </p>
            </div>
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

          {/* Type Selector (Sarana vs Prasarana) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Objek yang Dilaporkan *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('Sarana')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                  targetType === 'Sarana'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sarana (Peralatan / Aset Barang)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('Prasarana')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                  targetType === 'Prasarana'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Prasarana (Ruangan / Fasilitas Fisik)
              </button>
            </div>
          </div>

          {targetType === 'Sarana' ? (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Sarana / Barang Inventaris *
              </label>
              <select
                value={saranaId}
                onChange={e => setSaranaId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.name} [{it.code}] - Lokasi: {it.locationName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Prasarana / Ruangan *
              </label>
              <select
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {rooms.map(rm => (
                  <option key={rm.id} value={rm.id}>
                    {rm.name} [{rm.code}] - {rm.building}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Pelapor *
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                placeholder="Contoh: Rian Kurniawan, S.Kom."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Peran / Jabatan Pelapor
              </label>
              <input
                type="text"
                value={reporterRole}
                onChange={e => setReporterRole(e.target.value)}
                placeholder="Laboran / Guru / Wali Kelas / Siswa"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tingkat Keparahan / Urgensi *
            </label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value as TicketSeverity)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
            >
              <option value="Rendah">Rendah (Fasilitas masih dapat difungsikan)</option>
              <option value="Sedang">Sedang (Mengganggu kenyamanan / fungsional sebagian)</option>
              <option value="Tinggi / Kritis">Tinggi / Kritis (Mati total / membahayakan keselamatan)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Uraian Kerusakan & Gejala *
            </label>
            <textarea
              rows={3}
              required
              value={damageDescription}
              onChange={e => setDamageDescription(e.target.value)}
              placeholder="Jelaskan detail apa yang rusak, kapan terjadi, dan gejala spesifik"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
          </div>

          {/* Maintenance & Technician Details */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Tindakan Penanganan & Biaya
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status Penanganan *
                </label>
                <select
                  value={actionStatus}
                  onChange={e => setActionStatus(e.target.value as TicketStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                >
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Diverifikasi">Diverifikasi Tim Sarpras</option>
                  <option value="Sedang Dikerjakan">Sedang Dikerjakan (Dalam Perbaikan)</option>
                  <option value="Selesai Diperbaiki">Selesai Diperbaiki</option>
                  <option value="Afkir / Rekomendasi Penghapusan">Afkir / Rekomendasi Penghapusan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Teknisi / Vendor Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={e => setTechnicianName(e.target.value)}
                  placeholder="Bengkel Sekolah / CV. Vendor Luar"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estimasi Biaya Perbaikan (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={25000}
                  value={estimatedCost}
                  onChange={e => setEstimatedCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Biaya Riil Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={25000}
                  value={actualCost}
                  onChange={e => setActualCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Catatan Teknis / Solusi Perbaikan
              </label>
              <input
                type="text"
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                placeholder="Komponen yang diganti, garansi perbaikan, atau catatan pemakaian"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Pembaruan Tiket' : 'Terbitkan Laporan Kerusakan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
