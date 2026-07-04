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
 */
function apiGetAllStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(Config.TABLE_STUDENTS);
  const data = sheet.getDataRange().getValues();
  let students = [];
  
  for (let i = 1; i < data.length; i++) {
    // Pastikan hanya mengambil baris yang memiliki NIS
    if (data[i][0]) {
      students.push({
        kd_siswa: data[i][0].toString(),
        nama: data[i][1],
        kelas: data[i][2],
        jurusan: data[i][3]
      });
    }
  }
  return students;
}