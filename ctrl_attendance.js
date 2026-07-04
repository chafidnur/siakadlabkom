/**
 * ctrl_attendance.js
 * Controller untuk mengelola logika absensi
 */
const AttendanceController = {
  
  // Method yang akan dipanggil oleh View menggunakan google.script.run
  processScan: function(kd_siswa, jenis_kehadiran) {
    try {
      // 1. Cari siswa
      const student = StudentModel.findByKd(kd_siswa);
      
      if (!student) {
        return { 
          status: 'error', 
          message: `Siswa dengan NIS ${kd_siswa} tidak terdaftar.` 
        };
      }
      
      // 2. Simpan kehadiran
      AttendanceModel.create({
        kd_siswa: student.kd_siswa,
        nama_siswa: student.nama_lengkap,
        jenis_kehadiran: jenis_kehadiran
      });
      
      // 3. Return JSON Response
      return { 
        status: 'success', 
        message: 'Kehadiran tercatat!',
        data: student
      };
      
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Terjadi kesalahan sistem: ' + error.message 
      };
    }
  }
};

/**
 * Wrapper global agar Controller bisa diakses oleh View via RPC (google.script.run)
 * (Setara dengan mendaftarkan Route API)
 */
function apiProcessScan(kd_siswa, jenis_kehadiran) {
  return AttendanceController.processScan(kd_siswa, jenis_kehadiran);
}