import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  ArrowLeftRight, 
  Wrench, 
  Edit3, 
  Trash2, 
  Download, 
  LayoutGrid, 
  List,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  SaranaItem, 
  PrasaranaRoom, 
  ItemCategory, 
  ItemCondition, 
  ItemStatus, 
  UserRole 
} from '../types/sarpras';
import { formatRupiah, formatDateId, exportToCSV } from '../utils/formatters';

interface ItemsViewProps {
  items: SaranaItem[];
  rooms: PrasaranaRoom[];
  userRole: UserRole;
  onAddItem: () => void;
  onEditItem: (item: SaranaItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenBarcode: (item: SaranaItem) => void;
  onBorrowItem: (item: SaranaItem) => void;
  onReportDamage: (item: SaranaItem) => void;
}

export const ItemsView: React.FC<ItemsViewProps> = ({
  items,
  rooms,
  userRole,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onOpenBarcode,
  onBorrowItem,
  onReportDamage,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchSearch = 
        it.name.toLowerCase().includes(search.toLowerCase()) ||
        it.code.toLowerCase().includes(search.toLowerCase()) ||
        it.brand.toLowerCase().includes(search.toLowerCase()) ||
        it.specification.toLowerCase().includes(search.toLowerCase()) ||
        it.locationName.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === 'all' || it.category === selectedCategory;
      const matchCond = selectedCondition === 'all' || it.condition === selectedCondition;
      const matchStat = selectedStatus === 'all' || it.status === selectedStatus;
      const matchRoom = selectedRoom === 'all' || it.locationId === selectedRoom;

      return matchSearch && matchCat && matchCond && matchStat && matchRoom;
    });
  }, [items, search, selectedCategory, selectedCondition, selectedStatus, selectedRoom]);

  const totalFilteredValue = filteredItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);

  const handleExportCSV = () => {
    const data = filteredItems.map((it, idx) => ({
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
      'Terakhir Diperiksa': it.lastChecked,
    }));
    exportToCSV('Data_Sarana_Inventaris', data);
  };

  return (
    <div className="space-y-4">
      {/* View Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Daftar Inventaris Sarana (Aset Peralatan)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {filteredItems.length} dari {items.length} master barang · Nilai terfilter: <span className="font-mono font-medium text-slate-800">{formatRupiah(totalFilteredValue)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Ekspor CSV</span>
          </button>

          {userRole === 'admin_sarpras' && (
            <button
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sarana</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Live Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama barang, kode NUP, merk, spesifikasi, lokasi..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            <option value="all">Semua Kategori</option>
            <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
            <option value="Mebeuler & Perabot">Mebeuler & Perabot</option>
            <option value="Alat Laboratorium">Alat Laboratorium</option>
            <option value="Alat Olahraga">Alat Olahraga</option>
            <option value="Buku & Media Belajar">Buku & Media Belajar</option>
            <option value="Peralatan Kebersihan">Peralatan Kebersihan</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            <option value="all">Semua Kondisi</option>
            <option value="Baik">Baik (B)</option>
            <option value="Rusak Ringan">Rusak Ringan (RR)</option>
            <option value="Rusak Berat">Rusak Berat (RB)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Dipinjam">Sedang Dipinjam</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Dihapuskan">Dihapuskan</option>
          </select>

          {/* Room Filter */}
          <select
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            <option value="all">Semua Ruangan</option>
            {rooms.map(rm => (
              <option key={rm.id} value={rm.id}>{rm.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Tidak ada sarana ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada barang inventaris yang sesuai dengan pencarian atau filter yang dipilih.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedCondition('all');
              setSelectedStatus('all');
              setSelectedRoom('all');
            }}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center font-mono">No</th>
                  <th className="py-2.5 px-3">Kode Barang</th>
                  <th className="py-2.5 px-3">Nama Sarana & Spesifikasi</th>
                  <th className="py-2.5 px-2">Kategori</th>
                  <th className="py-2.5 px-2 text-center">Kondisi</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-center">Jumlah</th>
                  <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                  <th className="py-2.5 px-3">Lokasi Ruang</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-medium text-[11px] text-slate-900 whitespace-nowrap">
                      {item.code}
                    </td>

                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.brand && <span className="font-medium text-slate-700">{item.brand} · </span>}
                        {item.specification}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {item.category}
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        item.condition === 'Baik' ? 'text-emerald-700' :
                        item.condition === 'Rusak Ringan' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {item.condition}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        item.status === 'Tersedia' ? 'text-emerald-700' :
                        item.status === 'Dipinjam' ? 'text-blue-700' :
                        item.status === 'Dalam Perbaikan' ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-900 whitespace-nowrap">
                      {formatRupiah(item.price)}
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-slate-600 truncate max-w-[140px]">
                      {item.locationName}
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Barcode/QR modal trigger */}
                        <button
                          onClick={() => onOpenBarcode(item)}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Cetak Label QR & Barcode"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Borrow item */}
                        <button
                          onClick={() => onBorrowItem(item)}
                          className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Ajukan Peminjaman"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Report damage */}
                        <button
                          onClick={() => onReportDamage(item)}
                          className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                          title="Lapor Kerusakan"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Item */}
                        {userRole === 'admin_sarpras' && (
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="Ubah Data"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Item */}
                        {userRole === 'admin_sarpras' && (
                          <button
                            onClick={() => {
                              if (deleteConfirmId === item.id) {
                                onDeleteItem(item.id);
                                setDeleteConfirmId(null);
                              } else {
                                setDeleteConfirmId(item.id);
                                setTimeout(() => setDeleteConfirmId(null), 3500);
                              }
                            }}
                            className={`p-1 rounded transition-colors ${
                              deleteConfirmId === item.id
                                ? 'bg-rose-100 text-rose-700'
                                : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title={deleteConfirmId === item.id ? 'Klik sekali lagi untuk menghapus' : 'Hapus Barang'}
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
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium ${
                      item.condition === 'Baik' ? 'text-emerald-700' :
                      item.condition === 'Rusak Ringan' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {item.condition}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[11px] font-medium ${
                      item.status === 'Tersedia' ? 'text-emerald-700' :
                      item.status === 'Dipinjam' ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mt-2 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.specification}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lokasi:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{item.locationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah:</span>
                    <span className="font-mono text-slate-800">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Harga Perolehan:</span>
                    <span className="font-mono font-medium text-slate-900">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sumber Dana:</span>
                    <span>{item.sourceOfFund} ({item.acquisitionYear})</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenBarcode(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Label QR</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onBorrowItem(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ajukan Pinjam"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onReportDamage(item)}
                    className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Lapor Kerusakan"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                  {userRole === 'admin_sarpras' && (
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ubah Data"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
