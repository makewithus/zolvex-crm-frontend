import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 800
      }
    });
    const page = await browser.newPage();
    
    // Set a timeout of 10s to give React time to mount and render animations
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait an extra second for any initial animations to finish
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture screenshot
    await page.screenshot({ path: 'public/crm_dashboard_real.png', type: 'png' });
    
    await browser.close();
    console.log('Successfully captured dashboard screenshot!');
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  }
})();
