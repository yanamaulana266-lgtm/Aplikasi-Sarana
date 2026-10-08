/**
 * SIM-SARPRAS (Sistem Informasi Manajemen Sarana & Prasarana)
 * Google Apps Script Backend (Kode.gs)
 * 
 * Terintegrasi dengan Google Spreadsheet sebagai basis data:
 * - Sheet 'Sekolah' (Profil Institusi)
 * - Sheet 'Sarana' (Inventaris Barang)
 * - Sheet 'Prasarana' (Gedung & Ruangan)
 * - Sheet 'Peminjaman' (Sirkulasi & Peminjaman)
 * - Sheet 'Pemeliharaan' (Tiket Kerusakan & Servis)
 * - Sheet 'Pengguna' (Autentikasi Username & Password)
 */

// Konfigurasi Nama Sheet Basis Data
var SHEET_NAMES = {
  SCHOOLS: 'Sekolah',
  ITEMS: 'Sarana',
  ROOMS: 'Prasarana',
  LOANS: 'Peminjaman',
  TICKETS: 'Pemeliharaan',
  USERS: 'Pengguna'
};

/**
 * Endpoint Utama Web App (doGet)
 */
function doGet(e) {
  // Pastikan struktur sheet database telah siap
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
 * Helper untuk mendapatkan atau membuat spreadsheet aktif
 */
function getDatabase() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    // Jika dijalankan sebagai Standalone Script tanpa Bound Sheet
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
 * Inisialisasi Sheet Basis Data jika belum ada
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
  }

  // 2. Sheet Sekolah
  var schSheet = ss.getSheetByName(SHEET_NAMES.SCHOOLS);
  if (!schSheet) {
    schSheet = ss.insertSheet(SHEET_NAMES.SCHOOLS);
    schSheet.appendRow(['ID', 'Nama Sekolah', 'NPSN', 'Jenjang', 'Status', 'Alamat', 'Kecamatan', 'Kota', 'Provinsi', 'Telepon', 'Email', 'Kepala Sekolah', 'NIP Kepala', 'Koordinator Sarpras', 'NIP Sarpras', 'Tahun Ajaran']);
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
    schSheet.getRange(1, 1, 1, 16).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 3. Sheet Sarana (Barang)
  var itemSheet = ss.getSheetByName(SHEET_NAMES.ITEMS);
  if (!itemSheet) {
    itemSheet = ss.insertSheet(SHEET_NAMES.ITEMS);
    itemSheet.appendRow(['ID', 'Kode Barang', 'Nama Barang', 'Kategori', 'Merk', 'Spesifikasi', 'Kondisi', 'Status', 'ID Lokasi', 'Nama Lokasi', 'Tahun', 'Sumber Dana', 'Harga', 'Jumlah', 'Satuan', 'Nomor Seri', 'Catatan']);
    itemSheet.appendRow(['it-1', 'SPR-2024-ELK-001', 'Proyektor LCD Epson EB-E500', 'Elektronik & Multimedia', 'Epson', '3.300 ANSI Lumens, HDMI, XGA', 'Baik', 'Tersedia', 'room-1', 'Laboratorium Komputer 1', 2024, 'BOS Reguler', 6850000, 1, 'Unit', 'EPS-2024-X99', 'Lengkap tas dan remote']);
    itemSheet.appendRow(['it-2', 'SPR-2023-ELK-003', 'Laptop Chromebook Asus C214', 'Elektronik & Multimedia', 'Asus', 'Intel Celeron N4020, RAM 4GB, eMMC', 'Baik', 'Tersedia', 'room-1', 'Laboratorium Komputer 1', 2023, 'DAK Fisik', 6500000, 30, 'Unit', 'CB-BATCH3', 'Troli pengisian daya']);
    itemSheet.appendRow(['it-3', 'SPR-2024-LAB-001', 'Mikroskop Binokuler Olympus CX23', 'Alat Laboratorium', 'Olympus', 'Objektif Plan 4x 10x 40x 100x Oil', 'Baik', 'Tersedia', 'room-2', 'Laboratorium IPA Terpadu', 2024, 'DAK Fisik', 18500000, 6, 'Unit', 'OLY-CX23-01', 'Lengkap silika gel']);
    itemSheet.appendRow(['it-4', 'SPR-2022-ELK-005', 'Portable Sound System Baretone MAX15HB', 'Elektronik & Multimedia', 'Baretone', '15 Inch Woofer 600W RMS, 2 Mic', 'Baik', 'Tersedia', 'room-3', 'Gudang Sarpras', 2022, 'BOS Reguler', 4300000, 2, 'Unit', 'BRT-881', 'Untuk upacara dan apel']);
    itemSheet.getRange(1, 1, 1, 17).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 4. Sheet Prasarana (Ruang)
  var roomSheet = ss.getSheetByName(SHEET_NAMES.ROOMS);
  if (!roomSheet) {
    roomSheet = ss.insertSheet(SHEET_NAMES.ROOMS);
    roomSheet.appendRow(['ID', 'Kode Ruang', 'Nama Ruang', 'Gedung', 'Tipe', 'Kapasitas', 'Luas', 'Kondisi', 'PIC', 'Kontak PIC', 'Status', 'Fasilitas']);
    roomSheet.appendRow(['room-1', 'R-LAB-KOMP-1', 'Laboratorium Komputer 1', 'Gedung Multimedia - Lt 2', 'Laboratorium', 36, 72, 'Baik', 'Rian Kurniawan, S.Kom.', '0812-3456-7890', 'Tersedia', 'AC 2 Unit, LAN, CCTV, Smart Board']);
    roomSheet.appendRow(['room-2', 'R-LAB-IPA', 'Laboratorium IPA Terpadu', 'Gedung Sains - Lt 1', 'Laboratorium', 32, 84, 'Baik', 'Sri Wahyuni, M.Pd.', '0813-9876-5432', 'Tersedia', 'Wastafel, Meja Granit, APAR']);
    roomSheet.appendRow(['room-3', 'R-GUDANG', 'Gudang Pusat Sarpras', 'Gedung Penunjang - Lt 1', 'Gudang Sarpras', 10, 48, 'Baik', 'Agus Triono', '0819-3322-1100', 'Tersedia', 'Rak Besi Heavy Duty, Palet']);
    roomSheet.getRange(1, 1, 1, 12).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 5. Sheet Peminjaman
  var loanSheet = ss.getSheetByName(SHEET_NAMES.LOANS);
  if (!loanSheet) {
    loanSheet = ss.insertSheet(SHEET_NAMES.LOANS);
    loanSheet.appendRow(['ID', 'No. Pinjam', 'Peminjam', 'Peran', 'Kontak', 'ID Barang', 'Nama Barang', 'Kode Barang', 'Jumlah', 'Tgl Pinjam', 'Tgl Rencana Kembali', 'Tgl Kembali Aktual', 'Keperluan', 'Status', 'Kondisi Kembali', 'Catatan']);
    loanSheet.appendRow(['loan-1', 'PJM-2026-04-001', 'Siti Rohmah, S.Pd.', 'Guru', '0812-8877-6655', 'it-1', 'Proyektor LCD Epson EB-E500', 'SPR-2024-ELK-001', 1, '2026-04-07', '2026-04-09', '', 'Pembelajaran Media Interaktif Bahasa Indonesia Kelas IX-C', 'Sedang Dipinjam', '', '']);
    loanSheet.getRange(1, 1, 1, 16).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 6. Sheet Pemeliharaan
  var ticketSheet = ss.getSheetByName(SHEET_NAMES.TICKETS);
  if (!ticketSheet) {
    ticketSheet = ss.insertSheet(SHEET_NAMES.TICKETS);
    ticketSheet.appendRow(['ID', 'No. Tiket', 'Pelapor', 'Peran', 'Tgl Lapor', 'Tipe', 'ID Target', 'Nama Target', 'Lokasi', 'Tingkat', 'Deskripsi Kerusakan', 'Status', 'Teknisi', 'Estimasi Biaya', 'Biaya Riil', 'Catatan']);
    ticketSheet.appendRow(['tik-1', 'TIK-MNT-2026-008', 'Rian Kurniawan, S.Kom.', 'Laboran', '2026-03-29', 'Sarana', 'it-1', 'AC Daikin 1.5 PK Lab Komputer', 'Lab Komputer 1', 'Tinggi / Kritis', 'Unit indoor angin hangat kode error U4 outdoor', 'Sedang Dikerjakan', 'CV. Sejuk Mandiri Teknik', 1450000, 0, 'Sedang penggantian kapasitor kompresor']);
    ticketSheet.getRange(1, 1, 1, 16).setBackground('#ea580c').setFontColor('#ffffff').setFontWeight('bold');
  }
}

/**
 * Autentikasi Pengguna (Login)
 */
function apiLogin(username, password) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sheet) return { success: false, message: 'Sheet Pengguna tidak ditemukan.' };

  var data = sheet.getDataRange().getValues();
  var cleanUser = String(username).trim().toLowerCase();

  for (var i = 1; i < data.length; i++) {
    var rowUser = String(data[i][1]).trim().toLowerCase();
    var rowPass = String(data[i][2]).trim();

    if (rowUser === cleanUser && rowPass === password) {
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

  return { success: false, message: 'Username atau password yang Anda masukkan salah.' };
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
 * Menyimpan / Menambah Sekolah Baru
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
    school.name,
    school.npsn,
    school.level || 'SMP',
    school.status || 'Negeri',
    school.address,
    school.subdistrict,
    school.city,
    school.province,
    school.telephone,
    school.email,
    school.principal,
    school.principalNip,
    school.sarprasHead,
    school.sarprasNip,
    school.academicYear
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { success: true };
}

/**
 * Menyimpan / Menambah Sarana Barang
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
    item.code,
    item.name,
    item.category,
    item.brand,
    item.specification,
    item.condition,
    item.status,
    item.locationId,
    item.locationName,
    item.acquisitionYear,
    item.sourceOfFund,
    item.price,
    item.quantity,
    item.unit,
    item.serialNumber || '',
    item.notes || ''
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { success: true };
}

/**
 * Menghapus Barang Sarana
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
