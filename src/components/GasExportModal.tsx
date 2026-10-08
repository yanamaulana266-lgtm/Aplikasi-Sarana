import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface GasExportModalProps {
  onClose: () => void;
}

export const GasExportModal: React.FC<GasExportModalProps> = ({ onClose }) => {
  const [activeFile, setActiveFile] = useState<'kodegs' | 'indexhtml'>('kodegs');
  const [copied, setCopied] = useState(false);

  // Kode.gs source code
  const kodeGsContent = `/**
 * SIM-SARPRAS (Sistem Informasi Manajemen Sarana & Prasarana)
 * Google Apps Script Backend (Kode.gs)
 * Terintegrasi otomatis dengan Google Sheets sebagai Database
 */

var SHEET_NAMES = {
  SCHOOLS: 'Sekolah',
  ITEMS: 'Sarana',
  ROOMS: 'Prasarana',
  LOANS: 'Peminjaman',
  TICKETS: 'Pemeliharaan',
  USERS: 'Pengguna'
};

function doGet(e) {
  checkAndInitializeDatabase();
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('SIM-SARPRAS - Sistem Informasi Sarana & Prasarana')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDatabase() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    var files = DriveApp.getFilesByName('DATABASE_SIM_SARPRAS');
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    } else {
      return SpreadsheetApp.create('DATABASE_SIM_SARPRAS');
    }
  }
}

function checkAndInitializeDatabase() {
  var ss = getDatabase();

  // 1. Sheet Pengguna
  var userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEET_NAMES.USERS);
    userSheet.appendRow(['ID', 'Username', 'Password', 'Nama Lengkap', 'Peran', 'NIP', 'Inisial']);
    userSheet.appendRow(['usr-1', 'admin', 'admin123', 'Yana Maulana, S.Pd., M.Kom.', 'admin_sarpras', '19850918 201001 1 012', 'YM']);
    userSheet.appendRow(['usr-2', 'guru', 'guru123', 'Siti Rohmah, S.Pd.', 'guru_peminjam', '19900315 201503 2 008', 'SR']);
    userSheet.appendRow(['usr-3', 'teknisi', 'teknisi123', 'Agus Triono', 'teknisi', '19881102 201201 1 007', 'AT']);
    userSheet.getRange(1, 1, 1, 7).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 2. Sheet Sekolah
  var schSheet = ss.getSheetByName(SHEET_NAMES.SCHOOLS);
  if (!schSheet) {
    schSheet = ss.insertSheet(SHEET_NAMES.SCHOOLS);
    schSheet.appendRow(['ID', 'Nama Sekolah', 'NPSN', 'Jenjang', 'Status', 'Alamat', 'Kecamatan', 'Kota', 'Provinsi', 'Telepon', 'Email', 'Kepala Sekolah', 'NIP Kepala', 'Koordinator Sarpras', 'NIP Sarpras', 'Tahun Ajaran']);
    schSheet.appendRow(['sch-1', 'SMP Negeri 1 Cerdas Mandiri', '20214589', 'SMP', 'Negeri', 'Jl. Pendidikan No. 45', 'Sukamaju', 'Kota Pelajar', 'Jawa Barat', '(022) 728-1945', 'sarpras@smpn1.sch.id', 'Dr. H. Bambang Hartono, M.Pd.', '19740512 199802 1 004', 'Yana Maulana, S.Pd.', '19850918 201001 1 012', '2025/2026 Ganjil']);
    schSheet.getRange(1, 1, 1, 16).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 3. Sheet Sarana
  var itemSheet = ss.getSheetByName(SHEET_NAMES.ITEMS);
  if (!itemSheet) {
    itemSheet = ss.insertSheet(SHEET_NAMES.ITEMS);
    itemSheet.appendRow(['ID', 'Kode Barang', 'Nama Barang', 'Kategori', 'Merk', 'Spesifikasi', 'Kondisi', 'Status', 'ID Lokasi', 'Nama Lokasi', 'Tahun', 'Sumber Dana', 'Harga', 'Jumlah', 'Satuan', 'Nomor Seri', 'Catatan']);
    itemSheet.appendRow(['it-1', 'SPR-2024-ELK-001', 'Proyektor LCD Epson EB-E500', 'Elektronik & Multimedia', 'Epson', '3.300 ANSI Lumens, HDMI, XGA', 'Baik', 'Tersedia', 'room-1', 'Laboratorium Komputer 1', 2024, 'BOS Reguler', 6850000, 1, 'Unit', 'EPS-X99', 'Lengkap tas remote']);
    itemSheet.appendRow(['it-2', 'SPR-2023-ELK-003', 'Laptop Chromebook Asus C214', 'Elektronik & Multimedia', 'Asus', 'Intel Celeron N4020, RAM 4GB', 'Baik', 'Tersedia', 'room-1', 'Laboratorium Komputer 1', 2023, 'DAK Fisik', 6500000, 30, 'Unit', 'CB-BATCH3', 'Troli charging mobile']);
    itemSheet.getRange(1, 1, 1, 17).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
  }
}

function apiLogin(username, password) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sheet) return { success: false, message: 'Sheet Pengguna tidak ada.' };
  var data = sheet.getDataRange().getValues();
  var cleanUser = String(username).trim().toLowerCase();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toLowerCase() === cleanUser && String(data[i][2]).trim() === password) {
      return {
        success: true,
        user: { id: data[i][0], username: data[i][1], fullName: data[i][3], role: data[i][4], nipOrId: data[i][5], avatarText: data[i][6] }
      };
    }
  }
  return { success: false, message: 'Username atau password salah.' };
}

function apiGetAllData() {
  var ss = getDatabase();
  function getRows(name) {
    var s = ss.getSheetByName(name);
    if (!s) return [];
    var d = s.getDataRange().getValues();
    if (d.length <= 1) return [];
    var h = d[0], res = [];
    for (var i = 1; i < d.length; i++) {
      var o = {};
      for (var j = 0; j < h.length; j++) o[h[j]] = d[i][j];
      res.push(o);
    }
    return res;
  }
  return {
    schools: getRows(SHEET_NAMES.SCHOOLS),
    items: getRows(SHEET_NAMES.ITEMS),
    rooms: getRows(SHEET_NAMES.ROOMS),
    loans: getRows(SHEET_NAMES.LOANS),
    tickets: getRows(SHEET_NAMES.TICKETS)
  };
}

function apiSaveSchool(school) {
  var ss = getDatabase(), s = ss.getSheetByName(SHEET_NAMES.SCHOOLS), d = s.getDataRange().getValues(), row = -1;
  for (var i = 1; i < d.length; i++) { if (d[i][0] === school.id) { row = i + 1; break; } }
  var val = [school.id || ('sch-' + new Date().getTime()), school.name, school.npsn, school.level || 'SMP', school.status || 'Negeri', school.address, school.subdistrict, school.city, school.province, school.telephone, school.email, school.principal, school.principalNip, school.sarprasHead, school.sarprasNip, school.academicYear];
  if (row > 0) s.getRange(row, 1, 1, val.length).setValues([val]);
  else s.appendRow(val);
  return { success: true };
}

function apiSaveItem(item) {
  var ss = getDatabase(), s = ss.getSheetByName(SHEET_NAMES.ITEMS), d = s.getDataRange().getValues(), row = -1;
  for (var i = 1; i < d.length; i++) { if (d[i][0] === item.id) { row = i + 1; break; } }
  var val = [item.id || ('it-' + new Date().getTime()), item.code, item.name, item.category, item.brand, item.specification, item.condition, item.status, item.locationId, item.locationName, item.acquisitionYear, item.sourceOfFund, item.price, item.quantity, item.unit, item.serialNumber || '', item.notes || ''];
  if (row > 0) s.getRange(row, 1, 1, val.length).setValues([val]);
  else s.appendRow(val);
  return { success: true };
}`;

  // Index.html source code for GAS
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIM-SARPRAS - Sistem Informasi Sarana & Prasarana</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; margin: 0 !important; }
      .f4-label-card { break-inside: avoid !important; }
      @page { size: 215mm 330mm; margin: 8mm 6mm; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen">
  <div id="app"></div>
  <script>
    // QR Matrix Generator
    function pseudoHash(str, seed) {
      let h = seed;
      for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      return Math.abs(h);
    }
    function generateQrSvg(text) {
      const size = 25, matrix = Array.from({ length: size }, () => Array(size).fill(false));
      const drawFinder = (sx, sy) => {
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < 7; c++) {
            matrix[sy + r][sx + c] = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          }
        }
      };
      drawFinder(0, 0); drawFinder(size - 7, 0); drawFinder(0, size - 7);
      for (let i = 8; i < size - 8; i++) { matrix[6][i] = i % 2 === 0; matrix[i][6] = i % 2 === 0; }
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8) || (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8))) {
            const h = pseudoHash(text + ':' + r + ':' + c, r * 33 + c * 7 + 101);
            matrix[r][c] = (h % 3) === 0 || ((r + c + h) % 2 === 0);
          }
        }
      }
      let rects = '';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c]) rects += '<rect x="' + c + '" y="' + r + '" width="1" height="1" fill="#0f172a" />';
        }
      }
      return '<svg viewBox="0 0 ' + size + ' ' + size + '" class="w-full h-full">' + rects + '</svg>';
    }

    const state = {
      currentUser: null, activeTab: 'dashboard',
      activeSchool: { name: 'SMP Negeri 1 Cerdas Mandiri', npsn: '20214589', academicYear: '2025/2026 Ganjil' },
      items: [
        { code: 'SPR-2024-ELK-001', name: 'Proyektor LCD Epson EB-E500', brand: 'Epson', locationName: 'Lab Komputer 1', condition: 'Baik' },
        { code: 'SPR-2023-ELK-003', name: 'Laptop Chromebook Asus C214', brand: 'Asus', locationName: 'Lab Komputer 1', condition: 'Baik' }
      ]
    };

    function render() {
      const app = document.getElementById('app');
      if (!state.currentUser) {
        app.innerHTML = '<div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">' +
          '<div class="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 max-w-md w-full space-y-4">' +
            '<div class="text-center">' +
              '<div class="w-12 h-12 bg-blue-600 text-white rounded-xl mx-auto flex items-center justify-center font-bold mb-2 border border-orange-400">SP</div>' +
              '<h1 class="text-xl font-bold text-blue-950">SIM-SARPRAS</h1>' +
              '<p class="text-xs text-orange-600 font-semibold">' + state.activeSchool.name + '</p>' +
            '</div>' +
            '<form onsubmit="handleLogin(event)" class="space-y-3">' +
              '<div><label class="text-xs font-semibold text-slate-700">Username</label><input id="u" value="admin" class="w-full p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500"></div>' +
              '<div><label class="text-xs font-semibold text-slate-700">Password</label><input id="p" type="password" value="admin123" class="w-full p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500"></div>' +
              '<button type="submit" class="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg shadow-md">Masuk ke Aplikasi</button>' +
            '</form>' +
          '</div></div>';
        return;
      }

      app.innerHTML = '<div class="min-h-screen flex flex-col">' +
        '<header class="h-14 bg-white border-b border-blue-100 px-6 flex items-center justify-between no-print shadow-2xs">' +
          '<div class="flex items-center gap-2 font-bold text-blue-950"><span>SIM-SARPRAS</span><span class="text-slate-300">/</span><span class="text-xs font-semibold text-slate-600">' + state.activeSchool.name + '</span></div>' +
          '<div class="flex items-center gap-2">' +
            '<button onclick="window.print()" class="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg">Cetak 10 Label F4</button>' +
            '<button onclick="state.currentUser=null;render()" class="text-xs text-slate-500 hover:text-rose-600">Keluar</button>' +
          '</div>' +
        '</header>' +
        '<div class="p-6">' +
          '<h2 class="text-lg font-bold text-blue-950 mb-3">Pratinjau Lembar 10 Label F4 (Folio 215 x 330 mm)</h2>' +
          '<div class="grid grid-cols-2 gap-3 max-w-4xl mx-auto p-4 bg-white border rounded-xl">' +
            Array(10).fill(state.items[0]).map(it =>
              '<div class="f4-label-card border-2 border-slate-800 rounded-lg p-2.5 flex flex-col justify-between" style="min-height:185px">' +
                '<div class="border-b-2 border-slate-800 pb-1 mb-1 text-center font-bold text-[10px] text-blue-950">' + state.activeSchool.name.toUpperCase() + '</div>' +
                '<div class="flex items-start gap-2">' +
                  '<div class="w-20 h-20 shrink-0 border p-1">' + generateQrSvg(it.code) + '</div>' +
                  '<div class="flex-1">' +
                    '<span class="bg-slate-100 font-mono font-bold text-[10px] px-1 py-0.5 rounded">' + it.code + '</span>' +
                    '<h4 class="text-xs font-bold mt-1">' + it.name + '</h4>' +
                    '<div class="text-[9px] text-slate-600 mt-1">Ruang: <strong>' + it.locationName + '</strong> · Kondisi: <strong>' + it.condition + '</strong></div>' +
                  '</div>' +
                '</div>' +
                '<div class="text-center font-mono text-[8px] pt-1 border-t">*' + it.code + '*</div>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function handleLogin(e) {
      e.preventDefault();
      const u = document.getElementById('u').value, p = document.getElementById('p').value;
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.withSuccessHandler(res => { if(res.success){ state.currentUser = res.user; render(); } else alert(res.message); }).apiLogin(u, p);
      } else {
        if (p === 'admin123' || p === 'guru123') { state.currentUser = { username: u }; render(); }
        else alert('Password salah');
      }
    }
    window.onload = render;
  </script>
</body>
</html>`;

  const currentContent = activeFile === 'kodegs' ? kodeGsContent : indexHtmlContent;
  const currentFileName = activeFile === 'kodegs' ? 'Kode.gs' : 'Index.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-orange-400 shadow-2xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950">
                Berkas Google Apps Script (Kode.gs & Index.html)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Salin atau unduh berkas ini untuk dipasang di script.google.com dengan database Google Sheets
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

        {/* Tab File Selector & Actions */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setActiveFile('kodegs')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeFile === 'kodegs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Kode.gs (Server / Database)</span>
            </button>
            <button
              onClick={() => setActiveFile('indexhtml')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeFile === 'indexhtml'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Index.html (Frontend Tampilan)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : `Salin ${currentFileName}`}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh {currentFileName}</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-6 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Cara pasang di Google Spreadsheet: Buka Spreadsheet &gt; Menu <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong> &gt; Tempelkan Kode.gs & Index.html &gt; <strong>Terapkan (Deploy)</strong>.</span>
          </div>
        </div>

        {/* Code Viewport with Monospace & Line Numbers */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Berkas siap pakai untuk Google Workspace (@admin.smp.belajar.id atau akun Google pribadi).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
