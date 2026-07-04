/**
 * model_attendance.js
 * Menangani operasi database untuk tabel attendances
 */
const AttendanceModel = {
  // Setara dengan: Attendance::create($data);
  create: function(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(Config.TABLE_ATTENDANCES);
    
    if (!sheet) throw new Error("Tabel attendances tidak ditemukan.");

    // Generate ID unik
    const id = Utilities.getUuid();
    const created_at = new Date(); // Timestamp saat ini
    
    // Susunan array harus persis dengan urutan kolom di tabel
    sheet.appendRow([
      id,
      created_at,
      data.kd_siswa,
      data.nama_siswa,
      data.jenis_kehadiran
    ]);
    
    return true;
  }
};