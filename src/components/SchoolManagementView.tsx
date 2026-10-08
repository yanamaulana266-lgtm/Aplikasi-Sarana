import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Check, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { InstitutionInfo, UserRole } from '../types/sarpras';

interface SchoolManagementViewProps {
  schools: InstitutionInfo[];
  activeSchoolId: string;
  userRole: UserRole;
  onSelectSchool: (school: InstitutionInfo) => void;
  onAddSchool: (school: InstitutionInfo) => void;
  onUpdateSchool: (school: InstitutionInfo) => void;
  onDeleteSchool: (schoolId: string) => void;
}

export const SchoolManagementView: React.FC<SchoolManagementViewProps> = ({
  schools,
  activeSchoolId,
  userRole,
  onSelectSchool,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<InstitutionInfo | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [level, setLevel] = useState<'SD' | 'SMP' | 'SMA' | 'SMK'>('SMP');
  const [status, setStatus] = useState<'Negeri' | 'Swasta'>('Negeri');
  const [address, setAddress] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [city, setCity] = useState('Kota Pelajar');
  const [province, setProvince] = useState('Jawa Barat');
  const [postalCode, setPostalCode] = useState('40123');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [principal, setPrincipal] = useState('');
  const [principalNip, setPrincipalNip] = useState('');
  const [sarprasHead, setSarprasHead] = useState('');
  const [sarprasNip, setSarprasNip] = useState('');
  const [academicYear, setAcademicYear] = useState('2025/2026 Ganjil');
  const [formError, setFormError] = useState('');

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.npsn.includes(search) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setName('');
    setNpsn(`2021${Math.floor(1000 + Math.random() * 9000)}`);
    setLevel('SMP');
    setStatus('Negeri');
    setAddress('');
    setSubdistrict('');
    setCity('Kota Pelajar');
    setProvince('Jawa Barat');
    setPostalCode('40123');
    setTelephone('(022) 728-0000');
    setEmail('');
    setPrincipal('');
    setPrincipalNip('');
    setSarprasHead('');
    setSarprasNip('');
    setAcademicYear('2025/2026 Ganjil');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: InstitutionInfo) => {
    setEditingSchool(sch);
    setName(sch.name);
    setNpsn(sch.npsn);
    setLevel(sch.level || 'SMP');
    setStatus(sch.status || 'Negeri');
    setAddress(sch.address);
    setSubdistrict(sch.subdistrict);
    setCity(sch.city);
    setProvince(sch.province);
    setPostalCode(sch.postalCode);
    setTelephone(sch.telephone);
    setEmail(sch.email);
    setPrincipal(sch.principal);
    setPrincipalNip(sch.principalNip);
    setSarprasHead(sch.sarprasHead);
    setSarprasNip(sch.sarprasNip);
    setAcademicYear(sch.academicYear);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama sekolah wajib diisi');
      return;
    }
    if (!npsn.trim()) {
      setFormError('NPSN wajib diisi');
      return;
    }

    const schoolData: InstitutionInfo = {
      id: editingSchool?.id || `sch-${Date.now()}`,
      name: name.trim(),
      npsn: npsn.trim(),
      level,
      status,
      address: address.trim(),
      subdistrict: subdistrict.trim(),
      city: city.trim(),
      province: province.trim(),
      postalCode: postalCode.trim(),
      telephone: telephone.trim() || '-',
      email: email.trim() || `sarpras@${npsn.trim()}.sch.id`,
      principal: principal.trim() || 'Kepala Sekolah',
      principalNip: principalNip.trim() || '-',
      sarprasHead: sarprasHead.trim() || 'Koordinator Sarpras',
      sarprasNip: sarprasNip.trim() || '-',
      academicYear: academicYear.trim(),
    };

    if (editingSchool) {
      onUpdateSchool(schoolData);
    } else {
      onAddSchool(schoolData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* View Header with Blue and Orange styling */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Modul Manajemen Sekolah
            </span>
          </div>
          <h2 className="text-xl font-bold text-blue-950 mt-1 tracking-tight">
            Pengelolaan Data Institusi & Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kelola dan tambahkan profil sekolah baru dengan mudah. Anda dapat berganti sekolah aktif untuk memuat kop surat, daftar sarpras, dan label aset yang sesuai.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Sekolah Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-blue-100 rounded-xl p-3.5 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama sekolah, NPSN, atau kota..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map(sch => {
          const isActive = sch.id === activeSchoolId;

          return (
            <div
              key={sch.id}
              className={`bg-white rounded-xl p-5 shadow-2xs border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-2 border-blue-600 ring-2 ring-blue-500/10'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                {/* Active Indicator & Level Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    NPSN: {sch.npsn}
                  </span>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                      <Check className="w-3 h-3 text-orange-600" />
                      <span>Sedang Aktif</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectSchool(sch)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Pilih Sekolah Ini
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-xs ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sch.level || 'SM'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate" title={sch.name}>
                      {sch.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span>{sch.city}, {sch.province}</span>
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Kepala Sekolah:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={sch.principal}>
                      {sch.principal}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Koord. Sarpras:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px]" title={sch.sarprasHead}>
                      {sch.sarprasHead}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Tahun Ajaran:</span>
                    <span className="font-medium text-blue-700">{sch.academicYear}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {isActive ? (
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digunakan di sistem</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectSchool(sch)}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Gunakan Sekolah Ini
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sch)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Ubah Profil Sekolah"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {schools.length > 1 && (
                    <button
                      onClick={() => {
                        if (deleteConfirmId === sch.id) {
                          onDeleteSchool(sch.id);
                          setDeleteConfirmId(null);
                        } else {
                          setDeleteConfirmId(sch.id);
                          setTimeout(() => setDeleteConfirmId(null), 3000);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        deleteConfirmId === sch.id
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title={deleteConfirmId === sch.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus Sekolah'}
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

      {/* Modal Tambah / Ubah Sekolah */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-950">
                    {editingSchool ? 'Ubah Data Sekolah' : 'Tambah Sekolah Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi identitas sekolah resmi untuk administrasi sarana dan prasarana
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Sekolah / Institusi *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: SMP Negeri 3 Cerdas Mandiri"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={npsn}
                    onChange={e => setNpsn(e.target.value)}
                    placeholder="Contoh: 20214590"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenjang Pendidikan
                  </label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                    <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                    <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Sekolah
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Nama jalan, nomor, kompleks gedung"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={subdistrict}
                    onChange={e => setSubdistrict(e.target.value)}
                    placeholder="Contoh: Sukamaju"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    placeholder="(022) 728-1945"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarpras@sekolah.sch.id"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-blue-900 mb-3">Penanggung Jawab Sarana</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={principal}
                      onChange={e => setPrincipal(e.target.value)}
                      placeholder="Dr. H. Bambang Hartono, M.Pd."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={principalNip}
                      onChange={e => setPrincipalNip(e.target.value)}
                      placeholder="19740512 199802 1 004"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Koordinator Sarpras</label>
                    <input
                      type="text"
                      value={sarprasHead}
                      onChange={e => setSarprasHead(e.target.value)}
                      placeholder="Yana Maulana, S.Pd., M.Kom."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Koordinator Sarpras</label>
                    <input
                      type="text"
                      value={sarprasNip}
                      onChange={e => setSarprasNip(e.target.value)}
                      placeholder="19850918 201001 1 012"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="2025/2026 Ganjil"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSchool ? 'Simpan Perubahan Sekolah' : 'Daftarkan Sekolah Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
