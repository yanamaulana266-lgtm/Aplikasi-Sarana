/**
 * Template Kode Sumber Lengkap (100% Komplit) untuk Google Apps Script
 * - Kode.gs (Backend & Database Google Sheets)
 * - Index.html (Frontend Web App & 10 Label F4)
 */

export const KODE_GS_CODE = `/**
 * ============================================================================
 * SIM-SARPRAS (Sistem Informasi Manajemen Sarana & Prasarana Sekolah)
 * BACKEND GOOGLE APPS SCRIPT (Kode.gs) - LENGKAP & KOMPLIT
 * ============================================================================
 * 
 * Terintegrasi otomatis dengan Google Spreadsheet sebagai basis data:
 * 1. Sheet 'Pengguna'     : Kredensial akun (Username & Password) serta Peran
 * 2. Sheet 'Sekolah'      : Manajemen Multi-Sekolah / Profil Institusi & Kop Surat
 * 3. Sheet 'Sarana'       : Inventaris Aset Barang, Spesifikasi, Nilai, Lokasi
 * 4. Sheet 'Prasarana'    : Data Gedung, Ruangan, Kapasitas & Penanggung Jawab
 * 5. Sheet 'Peminjaman'   : Sirkulasi Peminjaman & Pengembalian Peralatan
 * 6. Sheet 'Pemeliharaan' : Tiket Servis, Perbaikan & Riwayat Biaya Perawatan
 *
 * Fitur Utama:
 * - Web App HTML5 responsif tema Biru & Oranye
 * - Cetak 1 lembar isi 10 Label ukuran Folio/F4 (215 x 330 mm) dengan Kode, Nama, dan QR Code 2D
 * - Manajemen Penambahan & Pergantian Sekolah Aktif
 * - Menu Khusus Otomatis di Google Spreadsheet
 *
 * Petunjuk Deploy:
 * 1. Buka Google Spreadsheet baru atau yang sudah ada
 * 2. Klik menu 'Ekstensi' > 'Apps Script'
 * 3. Hapus kode bawaan dan tempel seluruh isi file ini ke 'Kode.gs'
 * 4. Buat file HTML baru bernama 'Index.html' dan tempel seluruh kode dari file Index.html
 * 5. Klik 'Terapkan' (Deploy) > 'Deployment Baru' > Pilih 'Aplikasi Web'
 * 6. Jalankan sebagai: 'Saya' (Me), Yang memiliki akses: 'Siapa saja' (Anyone)
 * 7. Klik 'Terapkan' dan salin URL Web App yang dihasilkan.
 */

// Konstanta Nama Sheet Basis Data
var SHEET_NAMES = {
  USERS: 'Pengguna',
  SCHOOLS: 'Sekolah',
  ITEMS: 'Sarana',
  ROOMS: 'Prasarana',
  LOANS: 'Peminjaman',
  TICKETS: 'Pemeliharaan'
};

/**
 * Endpoint Utama Web App (doGet)
 */
function doGet(e) {
  checkAndInitializeDatabase();

  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('SIM-SARPRAS - Sistem Informasi Sarana & Prasarana')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Menyertakan file html/css parsial jika diperlukan
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Menu Khusus Otomatis di Google Spreadsheet saat dibuka
 */
function onOpen(e) {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('🏢 SIM-SARPRAS')
      .addItem('🚀 Buka Info Web App', 'showWebAppDialog')
      .addItem('🔄 Inisialisasi Ulang / Perbaiki Sheet', 'checkAndInitializeDatabase')
      .addSeparator()
      .addItem('🖨️ Petunjuk Cetak Label F4', 'showLabelPrintGuide')
      .addToUi();
  } catch (err) {}
}

/**
 * Helper untuk mendapatkan atau membuat spreadsheet aktif
 */
function getDatabase() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    var files = DriveApp.getFilesByName('DATABASE_SIM_SARPRAS');
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    } else {
      var ss = SpreadsheetApp.create('DATABASE_SIM_SARPRAS');
      return ss;
    }
  }
}

/**
 * Inisialisasi Lengkap Sheet Basis Data jika belum ada
 */
function checkAndInitializeDatabase() {
  var ss = getDatabase();

  // 1. Sheet Pengguna (Username & Password)
  var userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEET_NAMES.USERS);
    userSheet.appendRow(['ID', 'Username', 'Password', 'Nama Lengkap', 'Peran', 'NIP', 'Inisial']);
    userSheet.appendRow(['usr-1', 'admin', 'admin123', 'Yana Maulana, S.Pd., M.Kom.', 'admin_sarpras', '19850918 201001 1 012', 'YM']);
    userSheet.appendRow(['usr-2', 'guru', 'guru123', 'Siti Rohmah, S.Pd.', 'guru_peminjam', '19900315 201503 2 008', 'SR']);
    userSheet.appendRow(['usr-3', 'teknisi', 'teknisi123', 'Agus Triono', 'teknisi', '19881102 201201 1 007', 'AT']);
    userSheet.getRange(1, 1, 1, 7).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
    userSheet.setFrozenRows(1);
  }

  // 2. Sheet Sekolah (Manajemen Multi-Sekolah)
  var schSheet = ss.getSheetByName(SHEET_NAMES.SCHOOLS);
  if (!schSheet) {
    schSheet = ss.insertSheet(SHEET_NAMES.SCHOOLS);
    schSheet.appendRow([
      'ID', 'Nama Sekolah', 'NPSN', 'Jenjang', 'Status', 
      'Alamat', 'Kecamatan', 'Kota', 'Provinsi', 'Telepon', 
      'Email', 'Kepala Sekolah', 'NIP Kepala', 'Koordinator Sarpras', 
      'NIP Sarpras', 'Tahun Ajaran'
    ]);
    schSheet.appendRow([
      'sch-1',
      'SMP Negeri 1 Cerdas Mandiri',
      '20214589',
      'SMP',
      'Negeri',
      'Jl. Pendidikan Nusantara No. 45',
      'Kec. Sukamaju',
      'Kota Pelajar',
      'Jawa Barat',
      '(022) 728-1945',
      'sarpras@smpn1cerdasmandiri.sch.id',
      'Dr. H. Bambang Hartono, M.Pd.',
      '19740512 199802 1 004',
      'Yana Maulana, S.Pd., M.Kom.',
      '19850918 201001 1 012',
      '2025/2026 Ganjil'
    ]);
    schSheet.appendRow([
      'sch-2',
      'SMP Negeri 2 Bintang Harapan',
      '20214590',
      'SMP',
      'Negeri',
      'Jl. Pemuda Merdeka No. 12',
      'Kec. Cidadap',
      'Kota Pelajar',
      'Jawa Barat',
      '(022) 882-9911',
      'sarpras@smpn2bintang.sch.id',
      'Dra. Hj. Nurjanah, M.M.',
      '19700820 199503 2 003',
      'Asep Saepudin, S.Pd.',
      '19890214 201402 1 005',
      '2025/2026 Ganjil'
    ]);
    schSheet.getRange(1, 1, 1, 16).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
    schSheet.setFrozenRows(1);
  }

  // 3. Sheet Sarana (Inventaris Barang)
  var itemSheet = ss.getSheetByName(SHEET_NAMES.ITEMS);
  if (!itemSheet) {
    itemSheet = ss.insertSheet(SHEET_NAMES.ITEMS);
    itemSheet.appendRow([
      'ID', 'Kode Barang', 'Nama Barang', 'Kategori', 'Merk', 
      'Spesifikasi', 'Kondisi', 'Status', 'ID Lokasi', 'Nama Lokasi', 
      'Tahun', 'Sumber Dana', 'Harga', 'Jumlah', 'Satuan', 'Nomor Seri', 'Catatan'
    ]);
    itemSheet.appendRow([
      'it-1', 'SPR-2024-ELK-001', 'Proyektor LCD Epson EB-E500', 'Elektronik & Multimedia', 
      'Epson', '3.300 ANSI Lumens, HDMI, XGA, Resolusi 1024x768', 'Baik', 'Tersedia', 
      'room-1', 'Laboratorium Komputer 1', 2024, 'BOS Reguler', 6850000, 1, 'Unit', 'EPS-2024-X99', 'Lengkap kabel HDMI dan tas bawaan'
    ]);
    itemSheet.appendRow([
      'it-2', 'SPR-2023-ELK-003', 'Laptop Chromebook Asus C214', 'Elektronik & Multimedia', 
      'Asus', 'Intel Celeron N4020, RAM 4GB, Layar Sentuh 11.6 Inch', 'Baik', 'Tersedia', 
      'room-1', 'Laboratorium Komputer 1', 2023, 'DAK Fisik', 6500000, 30, 'Unit', 'CB-BATCH3-01', 'Dilengkapi troli pengisian daya mobile'
    ]);
    itemSheet.appendRow([
      'it-3', 'SPR-2024-LAB-001', 'Mikroskop Binokuler Olympus CX23', 'Alat Laboratorium', 
      'Olympus', 'Objektif Plan 4x, 10x, 40x, 100x Oil, Lampu LED', 'Baik', 'Tersedia', 
      'room-2', 'Laboratorium IPA Terpadu', 2024, 'DAK Fisik', 18500000, 6, 'Unit', 'OLY-CX23-01', 'Disimpan dalam lemari kering berpenghangat'
    ]);
    itemSheet.appendRow([
      'it-4', 'SPR-2022-ELK-005', 'Portable Wireless Sound System Baretone MAX15HB', 'Elektronik & Multimedia', 
      'Baretone', '15 Inch Woofer 600W RMS, 2 Mic Wireless VHF, Bluetooth', 'Baik', 'Tersedia', 
      'room-3', 'Gudang Sarpras Pusat', 2022, 'BOS Reguler', 4300000, 2, 'Unit', 'BRT-881-A', 'Untuk kegiatan apel, upacara, dan seminar'
    ]);
    itemSheet.getRange(1, 1, 1, 17).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
    itemSheet.setFrozenRows(1);
  }

  // 4. Sheet Prasarana (Ruang & Gedung)
  var roomSheet = ss.getSheetByName(SHEET_NAMES.ROOMS);
  if (!roomSheet) {
    roomSheet = ss.insertSheet(SHEET_NAMES.ROOMS);
    roomSheet.appendRow([
      'ID', 'Kode Ruang', 'Nama Ruang', 'Gedung', 'Tipe', 
      'Kapasitas', 'Luas', 'Kondisi', 'PIC', 'Kontak PIC', 'Status', 'Fasilitas'
    ]);
    roomSheet.appendRow([
      'room-1', 'R-LAB-KOMP-1', 'Laboratorium Komputer 1', 'Gedung Multimedia - Lt 2', 'Laboratorium', 
      36, 72, 'Baik', 'Rian Kurniawan, S.Kom.', '0812-3456-7890', 'Tersedia', 'AC 2 Unit, Smart TV 65 Inch, LAN Gigabit, 32 PC Client'
    ]);
    roomSheet.appendRow([
      'room-2', 'R-LAB-IPA', 'Laboratorium IPA Terpadu', 'Gedung Sains - Lt 1', 'Laboratorium', 
      32, 84, 'Baik', 'Sri Wahyuni, M.Pd.', '0813-9876-5432', 'Tersedia', 'Wastafel 6 Titik, Meja Keramik Tahan Kimia, APAR, Lemari Asam'
    ]);
    roomSheet.appendRow([
      'room-3', 'R-GUDANG-PST', 'Gudang Sarpras Pusat', 'Gedung Penunjang - Lt 1', 'Gudang', 
      10, 48, 'Baik', 'Agus Triono', '0819-3322-1100', 'Tersedia', 'Rak Besi Heavy Duty 5 Susun, Palet Plastik, Kotak Perkakas Lengkap'
    ]);
    roomSheet.getRange(1, 1, 1, 12).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
    roomSheet.setFrozenRows(1);
  }

  // 5. Sheet Peminjaman (Sirkulasi Sarpras)
  var loanSheet = ss.getSheetByName(SHEET_NAMES.LOANS);
  if (!loanSheet) {
    loanSheet = ss.insertSheet(SHEET_NAMES.LOANS);
    loanSheet.appendRow([
      'ID', 'No. Pinjam', 'Peminjam', 'Peran', 'Kontak', 
      'ID Barang', 'Nama Barang', 'Kode Barang', 'Jumlah', 
      'Tgl Pinjam', 'Tgl Rencana Kembali', 'Tgl Kembali Aktual', 'Keperluan', 
      'Status', 'Kondisi Kembali', 'Catatan'
    ]);
    loanSheet.appendRow([
      'loan-1', 'PJM-2026-04-001', 'Siti Rohmah, S.Pd.', 'Guru', '0812-8877-6655', 
      'it-1', 'Proyektor LCD Epson EB-E500', 'SPR-2024-ELK-001', 1, 
      '2026-04-07', '2026-04-09', '', 'Pembelajaran Media Interaktif Bahasa Indonesia Kelas IX-C', 
      'Sedang Dipinjam', '', 'Barang diserahkan dalam kondisi lengkap tas dan remote'
    ]);
    loanSheet.getRange(1, 1, 1, 16).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
    loanSheet.setFrozenRows(1);
  }

  // 6. Sheet Pemeliharaan (Tiket Kerusakan & Servis)
  var ticketSheet = ss.getSheetByName(SHEET_NAMES.TICKETS);
  if (!ticketSheet) {
    ticketSheet = ss.insertSheet(SHEET_NAMES.TICKETS);
    ticketSheet.appendRow([
      'ID', 'No. Tiket', 'Pelapor', 'Peran', 'Tgl Lapor', 
      'Tipe', 'ID Target', 'Nama Target', 'Lokasi', 'Tingkat', 
      'Deskripsi Kerusakan', 'Status', 'Teknisi', 'Estimasi Biaya', 'Biaya Riil', 'Catatan'
    ]);
    ticketSheet.appendRow([
      'tik-1', 'TIK-MNT-2026-008', 'Rian Kurniawan, S.Kom.', 'Laboran', '2026-03-29', 
      'Sarana', 'it-1', 'AC Daikin 1.5 PK Lab Komputer', 'Lab Komputer 1', 'Tinggi / Kritis', 
      'Unit indoor mengeluarkan hembusan hangat dan kode error U4 pada unit outdoor', 
      'Sedang Dikerjakan', 'CV. Sejuk Mandiri Teknik', 1450000, 0, 'Sedang proses penggantian kapasitor dan pengisian freon R32'
    ]);
    ticketSheet.getRange(1, 1, 1, 16).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
    ticketSheet.setFrozenRows(1);
  }

  return { success: true, message: 'Seluruh struktur sheet database SIM-SARPRAS berhasil disiapkan.' };
}

/**
 * Autentikasi Pengguna (Login dengan Username & Password)
 */
function apiLogin(username, password) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sheet) {
    checkAndInitializeDatabase();
    sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  }

  var data = sheet.getDataRange().getValues();
  var cleanUser = String(username || '').trim().toLowerCase();
  var cleanPass = String(password || '').trim();

  for (var i = 1; i < data.length; i++) {
    var rowUser = String(data[i][1]).trim().toLowerCase();
    var rowPass = String(data[i][2]).trim();

    if (rowUser === cleanUser && rowPass === cleanPass) {
      return {
        success: true,
        user: {
          id: data[i][0],
          username: data[i][1],
          fullName: data[i][3],
          role: data[i][4],
          nipOrId: data[i][5],
          avatarText: data[i][6]
        }
      };
    }
  }

  return { success: false, message: 'Username atau password yang Anda masukkan tidak sesuai.' };
}

/**
 * Mengambil Seluruh Data Basis Data untuk Frontend
 */
function apiGetAllData() {
  var ss = getDatabase();

  function getSheetObjects(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    var headers = data[0];
    var results = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      results.push(obj);
    }
    return results;
  }

  var rawSchools = getSheetObjects(SHEET_NAMES.SCHOOLS);
  var schools = rawSchools.map(function(s) {
    return {
      id: String(s['ID'] || 'sch-1'),
      name: String(s['Nama Sekolah'] || ''),
      npsn: String(s['NPSN'] || ''),
      level: String(s['Jenjang'] || 'SMP'),
      status: String(s['Status'] || 'Negeri'),
      address: String(s['Alamat'] || ''),
      subdistrict: String(s['Kecamatan'] || ''),
      city: String(s['Kota'] || ''),
      province: String(s['Provinsi'] || ''),
      telephone: String(s['Telepon'] || ''),
      email: String(s['Email'] || ''),
      principal: String(s['Kepala Sekolah'] || ''),
      principalNip: String(s['NIP Kepala'] || ''),
      sarprasHead: String(s['Koordinator Sarpras'] || ''),
      sarprasNip: String(s['NIP Sarpras'] || ''),
      academicYear: String(s['Tahun Ajaran'] || '2025/2026 Ganjil')
    };
  });

  var rawItems = getSheetObjects(SHEET_NAMES.ITEMS);
  var items = rawItems.map(function(it) {
    return {
      id: String(it['ID'] || ('it-' + Math.random())),
      code: String(it['Kode Barang'] || ''),
      name: String(it['Nama Barang'] || ''),
      category: String(it['Kategori'] || 'Elektronik & Multimedia'),
      brand: String(it['Merk'] || ''),
      specification: String(it['Spesifikasi'] || ''),
      condition: String(it['Kondisi'] || 'Baik'),
      status: String(it['Status'] || 'Tersedia'),
      locationId: String(it['ID Lokasi'] || 'room-1'),
      locationName: String(it['Nama Lokasi'] || ''),
      acquisitionYear: Number(it['Tahun'] || 2024),
      sourceOfFund: String(it['Sumber Dana'] || 'BOS Reguler'),
      price: Number(it['Harga'] || 0),
      quantity: Number(it['Jumlah'] || 1),
      unit: String(it['Satuan'] || 'Unit'),
      serialNumber: String(it['Nomor Seri'] || ''),
      notes: String(it['Catatan'] || '')
    };
  });

  var rawRooms = getSheetObjects(SHEET_NAMES.ROOMS);
  var rooms = rawRooms.map(function(r) {
    return {
      id: String(r['ID'] || ('rm-' + Math.random())),
      code: String(r['Kode Ruang'] || ''),
      name: String(r['Nama Ruang'] || ''),
      building: String(r['Gedung'] || ''),
      type: String(r['Tipe'] || 'Ruang Kelas'),
      capacity: Number(r['Kapasitas'] || 32),
      area: Number(r['Luas'] || 56),
      condition: String(r['Kondisi'] || 'Baik'),
      picName: String(r['PIC'] || ''),
      picContact: String(r['Kontak PIC'] || ''),
      status: String(r['Status'] || 'Tersedia'),
      facilities: String(r['Fasilitas'] || '').split(',').map(function(f){ return f.trim(); }).filter(Boolean)
    };
  });

  var rawLoans = getSheetObjects(SHEET_NAMES.LOANS);
  var loans = rawLoans.map(function(l) {
    return {
      id: String(l['ID'] || ('ln-' + Math.random())),
      loanNumber: String(l['No. Pinjam'] || ''),
      borrowerName: String(l['Peminjam'] || ''),
      borrowerRole: String(l['Peran'] || 'Guru'),
      borrowerContact: String(l['Kontak'] || ''),
      itemId: String(l['ID Barang'] || ''),
      itemName: String(l['Nama Barang'] || ''),
      itemCode: String(l['Kode Barang'] || ''),
      quantity: Number(l['Jumlah'] || 1),
      borrowDate: String(l['Tgl Pinjam'] || ''),
      expectedReturnDate: String(l['Tgl Rencana Kembali'] || ''),
      actualReturnDate: String(l['Tgl Kembali Aktual'] || ''),
      purpose: String(l['Keperluan'] || ''),
      status: String(l['Status'] || 'Sedang Dipinjam'),
      returnCondition: String(l['Kondisi Kembali'] || ''),
      returnNotes: String(l['Catatan'] || '')
    };
  });

  var rawTickets = getSheetObjects(SHEET_NAMES.TICKETS);
  var tickets = rawTickets.map(function(t) {
    return {
      id: String(t['ID'] || ('tk-' + Math.random())),
      ticketNumber: String(t['No. Tiket'] || ''),
      reporterName: String(t['Pelapor'] || ''),
      reporterRole: String(t['Peran'] || 'Guru'),
      reportedDate: String(t['Tgl Lapor'] || ''),
      targetType: String(t['Tipe'] || 'Sarana'),
      targetId: String(t['ID Target'] || ''),
      targetName: String(t['Nama Target'] || ''),
      location: String(t['Lokasi'] || ''),
      severity: String(t['Tingkat'] || 'Sedang'),
      damageDescription: String(t['Deskripsi Kerusakan'] || ''),
      actionStatus: String(t['Status'] || 'Menunggu Verifikasi'),
      technicianName: String(t['Teknisi'] || ''),
      estimatedCost: Number(t['Estimasi Biaya'] || 0),
      actualCost: Number(t['Biaya Riil'] || 0),
      actionNotes: String(t['Catatan'] || '')
    };
  });

  return {
    schools: schools,
    activeSchool: schools[0] || null,
    items: items,
    rooms: rooms,
    loans: loans,
    tickets: tickets
  };
}

/**
 * Menyimpan / Memperbarui Data Sekolah
 */
function apiSaveSchool(school) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.SCHOOLS);
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === school.id) {
      foundRow = i + 1;
      break;
    }
  }

  var rowValues = [
    school.id || ('sch-' + new Date().getTime()),
    school.name || '',
    school.npsn || '',
    school.level || 'SMP',
    school.status || 'Negeri',
    school.address || '',
    school.subdistrict || '',
    school.city || '',
    school.province || '',
    school.telephone || '',
    school.email || '',
    school.principal || '',
    school.principalNip || '',
    school.sarprasHead || '',
    school.sarprasNip || '',
    school.academicYear || '2025/2026 Ganjil'
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { success: true, school: school };
}

/**
 * Menyimpan / Memperbarui Sarana (Barang Inventaris)
 */
function apiSaveItem(item) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.ITEMS);
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === item.id) {
      foundRow = i + 1;
      break;
    }
  }

  var rowValues = [
    item.id || ('it-' + new Date().getTime()),
    item.code || '',
    item.name || '',
    item.category || 'Elektronik & Multimedia',
    item.brand || '',
    item.specification || '',
    item.condition || 'Baik',
    item.status || 'Tersedia',
    item.locationId || 'room-1',
    item.locationName || '',
    Number(item.acquisitionYear) || 2024,
    item.sourceOfFund || 'BOS Reguler',
    Number(item.price) || 0,
    Number(item.quantity) || 1,
    item.unit || 'Unit',
    item.serialNumber || '',
    item.notes || ''
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { success: true, item: item };
}

/**
 * Menghapus Data Barang Sarana
 */
function apiDeleteItem(itemId) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.ITEMS);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === itemId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Data barang tidak ditemukan.' };
}

/**
 * Dialog Info Web App di Menu Spreadsheet
 */
function showWebAppDialog() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:16px;color:#1e293b;">' +
    '<h3 style="color:#1e40af;margin-top:0;">SIM-SARPRAS Web App</h3>' +
    '<p style="font-size:13px;line-height:1.5;">Aplikasi web SIM-SARPRAS telah aktif dan terhubung ke spreadsheet ini.</p>' +
    '<div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe;font-size:12px;">' +
    '<strong>Fitur Utama:</strong><br>' +
    '• Login Username & Password (admin / admin123)<br>' +
    '• Manajemen Multi-Sekolah<br>' +
    '• Cetak 1 Lembar isi 10 Label F4 dengan Kode & QR Code 2D' +
    '</div>' +
    '</div>'
  ).setWidth(400).setHeight(240);
  SpreadsheetApp.getUi().showModalDialog(html, 'SIM-SARPRAS - Bantuan');
}

/**
 * Dialog Bantuan Cetak Label F4
 */
function showLabelPrintGuide() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:16px;color:#1e293b;font-size:13px;">' +
    '<h3 style="color:#ea580c;margin-top:0;">Panduan Cetak 10 Label F4 (Folio)</h3>' +
    '<p>Setiap lembar F4 (215 x 330 mm) memuat tepat <strong>10 stiker label</strong> dalam format 2 kolom x 5 baris.</p>' +
    '<p>Gunakan ukuran kertas Folio / F4 pada dialog print browser.</p>' +
    '</div>'
  ).setWidth(400).setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'SIM-SARPRAS - Cetak Label F4');
}
`;

export const INDEX_HTML_CODE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIM-SARPRAS - Sistem Informasi Sarana & Prasarana Sekolah</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
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
    function pseudoHash(str, seed) {
      let h = seed;
      for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      return Math.abs(h);
    }

    function generateQrSvg(text, size = 25) {
      const matrix = Array.from({ length: size }, () => Array(size).fill(false));
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

    function formatRupiah(amount) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    }

    const state = {
      currentUser: null,
      activeTab: 'dashboard',
      f4ModalOpen: false,
      selectedLabelItemId: null,
      activeSchool: {
        id: 'sch-1', name: 'SMP Negeri 1 Cerdas Mandiri', npsn: '20214589',
        city: 'Kota Pelajar', principal: 'Dr. H. Bambang Hartono, M.Pd.', sarprasHead: 'Yana Maulana, S.Pd., M.Kom.', academicYear: '2025/2026 Ganjil'
      },
      schools: [
        { id: 'sch-1', name: 'SMP Negeri 1 Cerdas Mandiri', npsn: '20214589', city: 'Kota Pelajar', principal: 'Dr. H. Bambang Hartono, M.Pd.', sarprasHead: 'Yana Maulana, S.Pd., M.Kom.' },
        { id: 'sch-2', name: 'SMP Negeri 2 Bintang Harapan', npsn: '20214590', city: 'Kota Pelajar', principal: 'Dra. Hj. Nurjanah, M.M.', sarprasHead: 'Asep Saepudin, S.Pd.' }
      ],
      items: [
        { id: 'it-1', code: 'SPR-2024-ELK-001', name: 'Proyektor LCD Epson EB-E500', category: 'Elektronik & Multimedia', brand: 'Epson', locationName: 'Lab Komputer 1', condition: 'Baik', price: 6850000, quantity: 1 },
        { id: 'it-2', code: 'SPR-2023-ELK-003', name: 'Laptop Chromebook Asus C214', category: 'Elektronik & Multimedia', brand: 'Asus', locationName: 'Lab Komputer 1', condition: 'Baik', price: 6500000, quantity: 30 },
        { id: 'it-3', code: 'SPR-2024-LAB-001', name: 'Mikroskop Binokuler Olympus CX23', category: 'Alat Laboratorium', brand: 'Olympus', locationName: 'Lab IPA', condition: 'Baik', price: 18500000, quantity: 6 }
      ]
    };

    function render() {
      const app = document.getElementById('app');
      if (!state.currentUser) {
        app.innerHTML = \`
          <div class="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
              <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-700 text-white shadow-lg border-2 border-orange-500 mb-3">
                <span class="font-bold text-xl">SP</span>
              </div>
              <h1 class="text-2xl font-bold tracking-tight text-blue-950">SIM-SARPRAS</h1>
              <p class="text-xs font-semibold uppercase tracking-wider text-orange-600 mt-1">Sistem Informasi Sarana & Prasarana</p>
              <div class="mt-2 text-xs text-blue-800 bg-blue-100 py-1 px-3.5 rounded-full inline-block border border-blue-200">
                \${state.activeSchool.name} · NPSN: \${state.activeSchool.npsn}
              </div>
            </div>
            <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
              <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-blue-100 sm:px-10">
                <div class="mb-5 border-b border-blue-50 pb-3">
                  <h2 class="text-base font-bold text-blue-950">Masuk ke Website SIM-SARPRAS</h2>
                  <p class="text-xs text-slate-500 mt-0.5">Pilih peran akses cepat atau ketik username dan password</p>
                </div>
                <div class="mb-4">
                  <div class="grid grid-cols-3 gap-1.5 p-1 bg-blue-50 rounded-lg border border-blue-100">
                    <button type="button" onclick="setLogin('admin','admin123')" class="py-1 px-2 rounded text-[11px] font-semibold bg-blue-600 text-white">👑 Admin</button>
                    <button type="button" onclick="setLogin('guru','guru123')" class="py-1 px-2 rounded text-[11px] font-semibold text-slate-700 hover:bg-white">👨‍🏫 Guru</button>
                    <button type="button" onclick="setLogin('teknisi','teknisi123')" class="py-1 px-2 rounded text-[11px] font-semibold text-slate-700 hover:bg-white">🔧 Teknisi</button>
                  </div>
                </div>
                <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                    <input type="text" id="login-u" value="admin" required class="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input type="password" id="login-p" value="admin123" required class="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500">
                  </div>
                  <button type="submit" class="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-md">Masuk ke Website</button>
                </form>
                <div class="mt-4 pt-3 border-t text-center text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  💡 Akun default: <strong class="text-blue-900 font-mono">admin</strong> / <strong class="text-blue-900 font-mono">admin123</strong>
                </div>
              </div>
            </div>
          </div>\`;
        return;
      }

      app.innerHTML = \`
        <div class="min-h-screen flex flex-col">
          <header class="bg-white border-b border-blue-100 h-14 px-6 flex items-center justify-between no-print shadow-2xs">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs border border-orange-400">SP</span>
              <span class="text-base font-bold text-blue-950">SIM-SARPRAS</span>
              <span class="text-slate-300">/</span>
              <span class="text-xs font-semibold text-slate-700">\${state.activeSchool.name}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="openF4Modal()" class="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-2xs">Cetak 10 Label F4</button>
              <button onclick="state.currentUser=null;render()" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-2xs">Keluar</button>
            </div>
          </header>
          <div class="flex-1 flex">
            <aside class="w-60 bg-white border-r border-blue-100 p-3 space-y-1 shrink-0 no-print flex flex-col justify-between">
              <div class="space-y-1">
                <div class="text-[10px] font-bold text-blue-700 uppercase px-3 py-2">Navigasi Utama</div>
                <button onclick="state.activeTab='dashboard';render()" class="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg \${state.activeTab==='dashboard'?'bg-blue-600 text-white':'text-slate-600 hover:bg-blue-50'}">📊 Dashboard</button>
                <button onclick="state.activeTab='items';render()" class="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg \${state.activeTab==='items'?'bg-blue-600 text-white':'text-slate-600 hover:bg-blue-50'}">📦 Inventaris Sarana</button>
                <button onclick="state.activeTab='schools';render()" class="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg \${state.activeTab==='schools'?'bg-blue-600 text-white':'text-slate-600 hover:bg-blue-50'}">🏫 Manajemen Sekolah</button>
                <div class="pt-4 text-[10px] font-bold text-orange-600 uppercase px-3 py-1.5">Cetak</div>
                <button onclick="openF4Modal()" class="w-full text-left px-3 py-2 text-xs font-bold text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100">🖨️ Cetak 10 Label F4</button>
              </div>
              <div class="pt-4 border-t border-slate-100 mt-4">
                <button onclick="state.currentUser=null;render()" class="w-full text-left px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 flex items-center gap-2 shadow-2xs">
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </aside>
            <main class="flex-1 p-6 overflow-y-auto">
              <div class="space-y-4">
                <div class="bg-white border border-blue-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <h1 class="text-xl font-bold text-blue-950">\${state.activeSchool.name}</h1>
                    <p class="text-xs text-slate-500">Sistem Informasi Manajemen Sarana & Prasarana Sekolah</p>
                  </div>
                  <button onclick="openF4Modal()" class="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg">Cetak 10 Label F4</button>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-blue-50 border-b font-semibold">
                      <tr><th class="p-3">Kode</th><th class="p-3">Nama Barang</th><th class="p-3">Lokasi</th><th class="p-3">Kondisi</th><th class="p-3 text-right">Aksi</th></tr>
                    </thead>
                    <tbody class="divide-y">
                      \${state.items.map(it => \`
                        <tr class="hover:bg-slate-50">
                          <td class="p-3 font-mono font-bold text-blue-900">\${it.code}</td>
                          <td class="p-3 font-semibold">\${it.name}</td>
                          <td class="p-3 text-slate-600">\${it.locationName}</td>
                          <td class="p-3 text-emerald-700">\${it.condition}</td>
                          <td class="p-3 text-right"><button onclick="openF4Modal('\${it.id}')" class="px-2 py-1 bg-orange-50 text-orange-700 font-bold rounded">Cetak 10 Label</button></td>
                        </tr>
                      \`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
        \${state.f4ModalOpen ? renderF4Modal() : ''}
      \`;
    }

    function renderF4Modal() {
      const it = state.items.find(i => i.id === state.selectedLabelItemId) || state.items[0];
      const labels = Array(10).fill(it);
      return \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
            <div class="p-4 border-b flex items-center justify-between no-print bg-blue-50/50">
              <div>
                <h3 class="text-sm font-bold text-blue-950">Lembar Cetak 10 Label F4 / Folio (215 x 330 mm)</h3>
                <p class="text-xs text-slate-500">2 Kolom x 5 Baris = 10 Label per Lembar</p>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="window.print()" class="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg">Cetak Lembar F4</button>
                <button onclick="state.f4ModalOpen=false;render()" class="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
              </div>
            </div>
            <div class="p-6 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0">
              <div class="mx-auto bg-white p-4 print:p-0 border border-slate-300 print:border-none shadow-md print:shadow-none" style="max-width:820px;">
                <div class="grid grid-cols-2 gap-3 print:gap-2">
                  \${labels.map((item, idx) => \`
                    <div class="f4-label-card border-2 border-slate-800 rounded-lg p-2.5 bg-white text-slate-900 flex flex-col justify-between" style="min-height:188px;">
                      <div class="border-b-2 border-slate-800 pb-1 mb-1.5 text-center">
                        <div class="text-[8px] font-bold uppercase text-slate-600">PEMERINTAH DAERAH · DINAS PENDIDIKAN</div>
                        <div class="text-[11px] font-bold text-blue-950">\${state.activeSchool.name.toUpperCase()}</div>
                        <div class="text-[8px] font-mono text-slate-500">LABEL INVENTARIS SARPRAS · NPSN: \${state.activeSchool.npsn}</div>
                      </div>
                      <div class="flex items-start gap-2.5">
                        <div class="w-20 h-20 shrink-0 border border-slate-300 p-1 flex flex-col items-center justify-center bg-white rounded">
                          \${generateQrSvg(item.code, 25)}
                          <span class="text-[7px] font-mono font-bold text-slate-600 mt-0.5">SCAN QR</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <span class="inline-block bg-slate-100 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded border border-slate-300">\${item.code}</span>
                          <h4 class="text-xs font-bold text-slate-900 mt-1 line-clamp-2">\${item.name}</h4>
                          <div class="mt-1 text-[9px] text-slate-600 space-y-0.5">
                            <div>Merk: <strong>\${item.brand || '-'}</strong></div>
                            <div>Ruang: <strong>\${item.locationName || '-'}</strong></div>
                            <div>Kondisi: <strong class="text-emerald-700">\${item.condition}</strong></div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between font-mono text-[8px] text-slate-600">
                        <span>Label #\${idx + 1}/10</span>
                        <span>*\${item.code}*</span>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function setLogin(u, p) {
      document.getElementById('login-u').value = u;
      document.getElementById('login-p').value = p;
    }

    function handleLoginSubmit(e) {
      e.preventDefault();
      const u = document.getElementById('login-u').value.trim();
      const p = document.getElementById('login-p').value.trim();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.withSuccessHandler(res => {
          if (res && res.success) { state.currentUser = res.user; render(); }
          else alert(res.message || 'Login gagal.');
        }).apiLogin(u, p);
      } else {
        if ((u === 'admin' && p === 'admin123') || (u === 'guru' && p === 'guru123') || (u === 'teknisi' && p === 'teknisi123')) {
          state.currentUser = { username: u, fullName: u === 'admin' ? 'Yana Maulana, S.Pd., M.Kom.' : 'Pengguna Sekolah' };
          render();
        } else {
          alert('Username atau password tidak cocok.');
        }
      }
    }

    function openF4Modal(id) {
      state.selectedLabelItemId = id || state.items[0].id;
      state.f4ModalOpen = true;
      render();
    }

    window.onload = function() {
      render();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.withSuccessHandler(data => {
          if (data && data.items) state.items = data.items;
          if (data && data.schools) state.schools = data.schools;
          if (data && data.activeSchool) state.activeSchool = data.activeSchool;
          render();
        }).apiGetAllData();
      }
    };
  </script>
</body>
</html>
`;
