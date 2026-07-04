/**
 * model_student.js
 * Menangani operasi database untuk tabel students
 */
const StudentModel = {
  // Setara dengan: Student::where('kd_siswa', $kd_siswa)->first();
  findByKd: function(kd_siswa) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(Config.TABLE_STUDENTS);
    
    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();
    
    // Looping dari index 1 (baris ke-2) untuk melewati header
    for (let i = 1; i < data.length; i++) {
      // Pastikan tipe data disamakan menjadi string saat pengecekan
      if (data[i][0].toString() === kd_siswa.toString()) {
        return {
          kd_siswa: data[i][0],
          nama_lengkap: data[i][1],
          kelas: data[i][2],
          jurusan: data[i][3]
        };
      }
    }
    
    return null; // Return null jika siswa tidak ditemukan
  }
};