import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Coins, 
  CheckCircle, 
  Clock, 
  Download, 
  Trash2, 
  Edit3,
  X,
  Save,
  Check
} from 'lucide-react';
import { ProcurementItem, ProcurementPriority, ProcurementStatus, ItemCategory, UserRole } from '../types/sarpras';
import { formatRupiah, exportToCSV } from '../utils/formatters';

interface ProcurementViewProps {
  procurement: ProcurementItem[];
  userRole: UserRole;
  onAddProcurement: (item: ProcurementItem) => void;
  onUpdateStatus: (id: string, status: ProcurementStatus) => void;
  onDeleteProcurement: (id: string) => void;
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  procurement,
  userRole,
  onAddProcurement,
  onUpdateStatus,
  onDeleteProcurement,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Elektronik & Multimedia');
  const [targetRoom, setTargetRoom] = useState('Laboratorium Komputer / Multimedia');
  const [estimatedQuantity, setEstimatedQuantity] = useState(1);
  const [unit, setUnit] = useState('Unit');
  const [estimatedBudget, setEstimatedBudget] = useState(10000000);
  const [priority, setPriority] = useState<ProcurementPriority>('Prioritas Tinggi');
  const [urgencyReason, setUrgencyReason] = useState('');
  const [proposedYear, setProposedYear] = useState(2026);

  const filteredItems = procurement.filter(p =>
    p.itemName.toLowerCase().includes(search.toLowerCase()) ||
    p.targetRoom.toLowerCase().includes(search.toLowerCase()) ||
    p.urgencyReason.toLowerCase().includes(search.toLowerCase())
  );

  const totalBudget = filteredItems.reduce((acc, curr) => acc + curr.estimatedBudget, 0);
  const approvedBudget = filteredItems
    .filter(p => p.status === 'Disetujui RKAS' || p.status === 'Terealisasi')
    .reduce((acc, curr) => acc + curr.estimatedBudget, 0);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newItem: ProcurementItem = {
      id: `proc-${Date.now()}`,
      itemName: itemName.trim(),
      category,
      targetRoom: targetRoom.trim(),
      estimatedQuantity: Number(estimatedQuantity),
      unit: unit.trim(),
      estimatedBudget: Number(estimatedBudget),
      priority,
      urgencyReason: urgencyReason.trim(),
      status: 'Usulan Baru',
      proposedYear: Number(proposedYear),
    };

    onAddProcurement(newItem);
    setIsModalOpen(false);
    setItemName('');
    setUrgencyReason('');
  };

  const handleExportCSV = () => {
    const data = filteredItems.map((p, idx) => ({
      No: idx + 1,
      'Nama Usulan Sarpras': p.itemName,
      Kategori: p.category,
      'Alokasi Ruang': p.targetRoom,
      Jumlah: p.estimatedQuantity,
      Satuan: p.unit,
      'Estimasi Anggaran (Rp)': p.estimatedBudget,
      Prioritas: p.priority,
      'Alasan Kebutuhan': p.urgencyReason,
      Status: p.status,
      'Tahun Anggaran': p.proposedYear,
    }));
    exportToCSV('Rencana_Kebutuhan_Sarpras_RKAS', data);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Perencanaan Pengadaan & Usulan RKAS Sarpras
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis kebutuhan sarana baru, peremajaan peralatan lapuk, dan usulan Rencana Kerja & Anggaran Sekolah
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor RKAS (CSV)</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajukan Usulan Baru</span>
          </button>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500">Total Nilai Usulan Kebutuhan</span>
          <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
            {formatRupiah(totalBudget)}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{filteredItems.length} item usulan sarana</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500">Anggaran Disetujui (RKAS)</span>
          <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
            {formatRupiah(approvedBudget)}
          </div>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">Alokasi resmi tahun berjalan</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500">Menunggu Verifikasi Komite</span>
          <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
            {formatRupiah(totalBudget - approvedBudget)}
          </div>
          <span className="text-[10px] text-amber-600 mt-0.5 block">Proses sidang pleno anggaran</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari usulan barang, target penempatan, atau alasan urgensi..."
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Proposal Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Nama Usulan Sarpras</th>
                <th className="py-2.5 px-3">Peruntukan / Target Ruang</th>
                <th className="py-2.5 px-2 text-center">Volume</th>
                <th className="py-2.5 px-3 text-right">Estimasi Pagu</th>
                <th className="py-2.5 px-2 text-center">Prioritas</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-slate-900">{item.itemName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.urgencyReason}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    <div>{item.targetRoom}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-800">
                    {item.estimatedQuantity} {item.unit}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-[11px] text-slate-900">
                    {formatRupiah(item.estimatedBudget)}
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span className={`text-[11px] font-medium ${
                      item.priority === 'Mendesak' ? 'text-rose-700' :
                      item.priority === 'Prioritas Tinggi' ? 'text-amber-700' : 'text-slate-600'
                    }`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded ${
                      item.status === 'Disetujui RKAS' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Terealisasi' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'Usulan Baru' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {userRole === 'admin_sarpras' && (
                        <select
                          value={item.status}
                          onChange={e => onUpdateStatus(item.id, e.target.value as ProcurementStatus)}
                          className="text-[11px] py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none"
                        >
                          <option value="Usulan Baru">Usulan Baru</option>
                          <option value="Disetujui RKAS">Disetujui RKAS</option>
                          <option value="Terealisasi">Terealisasi</option>
                          <option value="Ditunda">Ditunda</option>
                        </select>
                      )}

                      {userRole === 'admin_sarpras' && (
                        <button
                          onClick={() => onDeleteProcurement(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Usulan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Usulan RKAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Ajukan Kebutuhan Sarpras (RKAS)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Perencanaan belanja modal dan pengadaan sarana sekolah</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Sarana / Peralatan yang Diusulkan *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="Contoh: Interactive Flat Panel Smart Board 75 Inch"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kategori Sarana
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
                    <option value="Mebeuler & Perabot">Mebeuler & Perabot</option>
                    <option value="Alat Laboratorium">Alat Laboratorium</option>
                    <option value="Alat Olahraga">Alat Olahraga</option>
                    <option value="Buku & Media Belajar">Buku & Media Belajar</option>
                    <option value="Peralatan Kebersihan">Peralatan Kebersihan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prioritas Urgensi
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as ProcurementPriority)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Mendesak">Mendesak (Darurat Pembelajaran)</option>
                    <option value="Prioritas Tinggi">Prioritas Tinggi</option>
                    <option value="Reguler">Reguler (Rencana Rutin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rencana Penempatan / Ruangan Sasaran
                </label>
                <input
                  type="text"
                  value={targetRoom}
                  onChange={e => setTargetRoom(e.target.value)}
                  placeholder="Contoh: Laboratorium Komputer 2 / Kelas VII-A"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Jumlah Volume
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedQuantity}
                    onChange={e => setEstimatedQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="Unit / Set"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Estimasi Pagu (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={estimatedBudget}
                    onChange={e => setEstimatedBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alasan Kebutuhan & Justifikasi Urgensi *
                </label>
                <textarea
                  rows={3}
                  required
                  value={urgencyReason}
                  onChange={e => setUrgencyReason(e.target.value)}
                  placeholder="Jelaskan rasionalisasi pemenuhan standar sarpras sekolah dan dampak terhadap kegiatan belajar mengajar"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Kirim Usulan RKAS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
