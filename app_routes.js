function doGet(e) {
  const page = e.parameter.page || 'home'; 
  let template;

  switch(page) {
    case 'kbm': template = HtmlService.createTemplateFromFile('view_scan_kbm'); break;
    case 'kunjungan': template = HtmlService.createTemplateFromFile('view_scan_kunjungan'); break;
    case 'admin': template = HtmlService.createTemplateFromFile('view_admin'); break;
    case 'home':
    default: template = HtmlService.createTemplateFromFile('view_home'); break;
  }
  
  // Tangkap Web App URL sebagai base_url
  template.base_url = ScriptApp.getService().getUrl();
  template.appName = Config.APP_NAME;
  
  return template.evaluate()
      .setTitle(Config.APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}