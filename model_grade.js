/**
 * model_grade.js
 * Menangani operasi database untuk tabel grades
 */
const GradeModel = {
  // Setara dengan: Grade::create($data);
  create: function(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(Config.TABLE_GRADES);
    
    if (!sheet) throw new Error("Tabel grades tidak ditemukan.");

    const id = Utilities.getUuid();
    const created_at = new Date();
    
    sheet.appendRow([
      id,
      created_at,
      data.kd_siswa,
      data.kategori_nilai,
      data.judul_materi,
      data.nilai,
      data.keterangan
    ]);
    
    return true;
  }
};