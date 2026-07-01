
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function fetchAndSaveImages(url: string, clientId: string) {
  console.log(`Fetching images for ${url} (clientId: ${clientId})...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    const images = await page.evaluate(() => {
      const imgSources = Array.from(document.images)
        .map(img => img.src)
        .filter(src => src.startsWith('http') && !src.includes('data:image'));
      
      // Also look for background images in common hero/section areas
      const bgImages: string[] = [];
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundImage;
        if (bg && bg.startsWith('url(')) {
          const match = bg.match(/url\("?(.+?)"?\)/);
          if (match && match[1].startsWith('http')) {
            bgImages.push(match[1]);
          }
        }
      });
      
      return [...new Set([...imgSources, ...bgImages])];
    });

    console.log(`Found ${images.length} images.`);

    const dir = `/home/team/shared/sales/client-assets/${clientId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, 'images.json'), JSON.stringify(images, null, 2));
    console.log(`Saved to ${dir}/images.json`);
  } catch (e) {
    console.error(`Failed to fetch images for ${url}:`, e);
  } finally {
    await browser.close();
  }
}

async function run() {
  await fetchAndSaveImages('https://www.sprucesalonaustin.com/', 'sprucesalonaustin');
  await fetchAndSaveImages('https://sanddplumbing.com/', 'sanddplumbing');
}

run();
