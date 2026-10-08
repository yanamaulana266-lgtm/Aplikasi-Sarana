import React, { useState } from 'react';
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Wrench, 
  Users, 
  Maximize2, 
  Package, 
  Download,
  Building
} from 'lucide-react';
import { PrasaranaRoom, SaranaItem, UserRole } from '../types/sarpras';
import { exportToCSV, formatRupiah } from '../utils/formatters';

interface RoomsViewProps {
  rooms: PrasaranaRoom[];
  items: SaranaItem[];
  userRole: UserRole;
  onAddRoom: () => void;
  onEditRoom: (room: PrasaranaRoom) => void;
  onDeleteRoom: (roomId: string) => void;
  onReportRoomDamage: (room: PrasaranaRoom) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  rooms,
  items,
  userRole,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onReportRoomDamage,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeRoomDetail, setActiveRoomDetail] = useState<PrasaranaRoom | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredRooms = rooms.filter(rm => {
    const matchSearch =
      rm.name.toLowerCase().includes(search.toLowerCase()) ||
      rm.code.toLowerCase().includes(search.toLowerCase()) ||
      rm.building.toLowerCase().includes(search.toLowerCase()) ||
      rm.picName.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || rm.type === selectedType;
    return matchSearch && matchType;
  });

  const handleExportCSV = () => {
    const data = filteredRooms.map((r, idx) => ({
      No: idx + 1,
      'Kode Ruang': r.code,
      'Nama Ruangan': r.name,
      Gedung: r.building,
      Tipe: r.type,
      'Kapasitas (Orang)': r.capacity,
      'Luas (m2)': r.area,
      Kondisi: r.condition,
      'Penanggung Jawab (PIC)': r.picName,
      Kontak: r.picContact,
      Status: r.status,
      Fasilitas: r.facilities.join('; '),
    }));
    exportToCSV('Data_Prasarana_Ruang_Sekolah', data);
  };

  // Get items assigned to a specific room
  const getRoomItems = (roomId: string) => {
    return items.filter(it => it.locationId === roomId);
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Data Prasarana (Gedung & Ruangan)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {filteredRooms.length} ruangan aktif · Luas total: {filteredRooms.reduce((a, b) => a + b.area, 0)} m² · Daya tampung: {filteredRooms.reduce((a, b) => a + b.capacity, 0)} orang
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

          {userRole === 'admin_sarpras' && (
            <button
              onClick={onAddRoom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Ruangan</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama ruang, kode ruang, gedung, PIC..."
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
        >
          <option value="all">Semua Tipe Ruang</option>
          <option value="Ruang Kelas">Ruang Kelas</option>
          <option value="Laboratorium">Laboratorium</option>
          <option value="Perpustakaan">Perpustakaan</option>
          <option value="Ruang Guru & TU">Ruang Guru & TU</option>
          <option value="Aula & Serbaguna">Aula & Serbaguna</option>
          <option value="Fasilitas Olahraga">Fasilitas Olahraga</option>
          <option value="Gudang Sarpras">Gudang Sarpras</option>
        </select>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => {
          const roomItems = getRoomItems(room.id);
          const roomAssetValue = roomItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);

          return (
            <div
              key={room.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {room.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`font-medium ${
                      room.condition === 'Baik' ? 'text-emerald-700' :
                      room.condition === 'Rusak Ringan' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {room.condition}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{room.status}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mt-2 truncate">
                  {room.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{room.building}</span>
                </div>

                {/* Spatial and PIC specs */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">Kapasitas:</span>
                    <span className="font-mono font-medium text-slate-800">{room.capacity} Siswa/Org</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Luas Ruang:</span>
                    <span className="font-mono font-medium text-slate-800">{room.area} m²</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 block">Penanggung Jawab (PIC):</span>
                    <span className="font-medium text-slate-800 truncate block">{room.picName}</span>
                  </div>
                </div>

                {/* Facilities Pills */}
                {room.facilities.length > 0 && (
                  <div className="mt-2.5">
                    <span className="text-[10px] text-slate-400 block mb-1">Fasilitas Utama:</span>
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                      {room.facilities.slice(0, 3).map((f, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                      {room.facilities.length > 3 && (
                        <span className="text-slate-400">+{room.facilities.length - 3} lainnya</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Registered Asset summary in this room */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>Aset Terdaftar:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-800">
                    {roomItems.length} Sarana ({formatRupiah(roomAssetValue)})
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveRoomDetail(room)}
                  className="text-[11px] font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
                >
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lihat Sarana ({roomItems.length})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onReportRoomDamage(room)}
                    className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Lapor Kerusakan Ruang"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>

                  {userRole === 'admin_sarpras' && (
                    <button
                      onClick={() => onEditRoom(room)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ubah Ruangan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {userRole === 'admin_sarpras' && (
                    <button
                      onClick={() => {
                        if (deleteConfirmId === room.id) {
                          onDeleteRoom(room.id);
                          setDeleteConfirmId(null);
                        } else {
                          setDeleteConfirmId(room.id);
                          setTimeout(() => setDeleteConfirmId(null), 3500);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        deleteConfirmId === room.id
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-500 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title={deleteConfirmId === room.id ? 'Klik sekali lagi untuk menghapus' : 'Hapus Ruangan'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Modal (Showing all Sarana located inside) */}
      {activeRoomDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Daftar Sarana di {activeRoomDetail.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kode: {activeRoomDetail.code} · Gedung: {activeRoomDetail.building} · PIC: {activeRoomDetail.picName}
                </p>
              </div>
              <button
                onClick={() => setActiveRoomDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {getRoomItems(activeRoomDetail.id).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada sarana (barang inventaris) yang dialokasikan di ruangan ini.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Kode</th>
                        <th className="py-2.5 px-3">Nama Barang</th>
                        <th className="py-2.5 px-2 text-center">Kondisi</th>
                        <th className="py-2.5 px-2 text-center">Jumlah</th>
                        <th className="py-2.5 px-3 text-right">Nilai Aset</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getRoomItems(activeRoomDetail.id).map(it => (
                        <tr key={it.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{it.code}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            <div>{it.name}</div>
                            <div className="text-[10px] text-slate-500">{it.brand}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`text-[11px] font-medium ${
                              it.condition === 'Baik' ? 'text-emerald-700' :
                              it.condition === 'Rusak Ringan' ? 'text-amber-700' : 'text-rose-700'
                            }`}>
                              {it.condition}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">{it.quantity} {it.unit}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">
                            {formatRupiah(it.price * it.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveRoomDetail(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
