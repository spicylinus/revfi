const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(process.argv[2], { waitUntil: 'domcontentloaded', timeout: 10000 });
    const images = await page.evaluate(() => Array.from(document.images).map(img => img.src).filter(s => s.startsWith('http')));
    console.log(JSON.stringify(images));
  } catch (e) {
    console.log('[]');
  }
  await browser.close();
})();
