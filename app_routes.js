/**
 * app_routes.js
 * Menangani routing URL dan memuat View HTML.
 */
function doGet(e) {
  // Menangkap parameter '?page=' dari URL. Jika kosong, default ke 'home'
  const page = e.parameter.page || 'home'; 
  let template;

  // Switch case untuk routing halaman
  switch(page) {
    case 'kbm': 
      template = HtmlService.createTemplateFromFile('view_scan_kbm'); 
      break;
    case 'kunjungan': 
      template = HtmlService.createTemplateFromFile('view_scan_kunjungan'); 
      break;
    case 'admin': 
      template = HtmlService.createTemplateFromFile('view_admin'); 
      break;
    case 'cetak':
      template = HtmlService.createTemplateFromFile('view_cetak_kartu'); 
    break;
    case 'home':
    default: 
      template = HtmlService.createTemplateFromFile('view_home'); 
      break;
  }
  
  // Tangkap Web App URL sebagai base_url
  template.base_url = ScriptApp.getService().getUrl();
  
  // PASSING VARIABEL KE VIEW (Di sinilah letak perbaikannya)
  template.appName = Config.APP_NAME;
  template.adminName = Config.ADMIN_NAME; // <-- Baris ini sebelumnya terlewat!
  
  // Return HTML ke browser
  return template.evaluate()
      .setTitle(Config.APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}