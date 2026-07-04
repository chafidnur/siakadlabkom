/**
 * ctrl_admin.js
 * Controller untuk mengelola Dashboard Admin dan Input Nilai
 */
const AdminController = {
  
  // Mengambil data untuk halaman awal Dashboard
  getDashboardData: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Ambil List Siswa (Untuk Dropdown Form Nilai)
    const sheetStudent = ss.getSheetByName(Config.TABLE_STUDENTS);
    const dataStudent = sheetStudent.getDataRange().getValues();
    let students = [];
    
    for (let i = 1; i < dataStudent.length; i++) {
      students.push({
        kd_siswa: dataStudent[i][0].toString(),
        nama: dataStudent[i][1],
        kelas: dataStudent[i][2],
        jurusan: dataStudent[i][3]
      });
    }

    // 2. Ambil 10 Log Kehadiran Terbaru
    const sheetAbsen = ss.getSheetByName(Config.TABLE_ATTENDANCES);
    const dataAbsen = sheetAbsen.getDataRange().getValues();
    let attendances = [];
    
    // Looping dari belakang agar yang terbaru di atas
    for (let i = dataAbsen.length - 1; i > 0 && attendances.length < 10; i--) {
      attendances.push({
        waktu: Utilities.formatDate(new Date(dataAbsen[i][1]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
        kd_siswa: dataAbsen[i][2],
        nama: dataAbsen[i][3],
        jenis: dataAbsen[i][4]
      });
    }

    return {
      students: students,
      attendances: attendances,
      kategori_nilai: Config.KATEGORI_NILAI
    };
  },

  // Menyimpan Nilai ke Database
  saveGrade: function(data) {
    try {
      GradeModel.create(data);
      return { status: 'success', message: 'Data nilai berhasil disimpan ke rapor.' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
};

/**
 * Wrapper Global API Route
 */
function apiGetDashboardData() {
  return AdminController.getDashboardData();
}

function apiSaveGrade(data) {
  return AdminController.saveGrade(data);
}

/**
 * Mengambil semua data siswa khusus untuk halaman cetak ID Card
 * Lengkap dengan pencarian foto dari Google Drive
 */
function apiGetAllStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(Config.TABLE_STUDENTS);
  const data = sheet.getDataRange().getValues();
  let students = [];
  
  // 1. Hubungkan ke Folder Google Drive
  let folderFoto = null;
  try {
    if (Config.FOLDER_FOTO_ID && Config.FOLDER_FOTO_ID !== 'MASUKKAN_ID_FOLDER_ANDA_DISINI') {
      folderFoto = DriveApp.getFolderById(Config.FOLDER_FOTO_ID);
    }
  } catch(e) {
    Logger.log("Folder Foto tidak dapat diakses: " + e.message);
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      const nis = data[i][0].toString();
      
      // Default foto jika tidak ditemukan (Avatar Inisial)
      let fotoUrl = `https://ui-avatars.com/api/?name=${nis}&background=e2e8f0&color=475569&size=150`;
      
      // 2. Cari file gambar berdasarkan NIS di dalam folder
      if (folderFoto) {
        // Mencari file yang judulnya mengandung NIS (misal: 1001.jpg atau 1001.png)
        const files = folderFoto.searchFiles(`title contains '${nis}'`);
        if (files.hasNext()) {
          const file = files.next();
          // Convert ID file Drive menjadi URL gambar langsung
          fotoUrl = `https://drive.google.com/uc?export=view&id=${file.getId()}`;
        }
      }

      students.push({
        kd_siswa: nis,
        nama: data[i][1],
        kelas: data[i][2],
        jurusan: data[i][3],
        foto: fotoUrl
      });
    }
  }
  return students;
}