const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(8103, async () => {
  console.log('Popover test server running on port 8103');
  const browser = await chromium.launch({ headless: true });

  const pages = ['index.html', 'discover.html'];

  for (const pageName of pages) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://localhost:8103/${pageName}`);
    await page.waitForSelector('.book-card');

    // Open first book
    await page.click('.book-card');
    await page.waitForSelector('.reader.entered');

    // Click first word
    const firstWord = page.locator('.page-front .w').first();
    const wordText = await firstWord.textContent();
    await firstWord.click();

    await page.waitForSelector('#wordPopover.visible');

    const popoverWord = await page.textContent('.wp-word');
    console.log(`[${pageName}] Popover word: "${popoverWord}" (expected: "${wordText}")`);

    const hasPlayBtn = await page.isVisible('.wp-btn[data-action="speak"]');
    const hasKnownBtn = await page.isVisible('.wp-btn[data-action="known"]');
    const hasLearnBtn = await page.isVisible('.wp-btn[data-action="learning"]');
    const hasCloseBtn = await page.isVisible('.wp-close');

    console.log(`[${pageName}] Buttons visible -> speak:${hasPlayBtn}, known:${hasKnownBtn}, learn:${hasLearnBtn}, close:${hasCloseBtn}`);

    if (!hasPlayBtn || !hasKnownBtn || !hasLearnBtn || !hasCloseBtn) {
      throw new Error(`Missing popover buttons on ${pageName}`);
    }

    // Check button click
    await page.click('.wp-btn[data-action="known"]');
    await page.waitForTimeout(200);

    const isKnownClass = await page.$eval('.wp-btn[data-action="known"]', el => el.classList.contains('is-known'));
    console.log(`[${pageName}] Known button toggled active class:`, isKnownClass);

    if (!isKnownClass) {
      throw new Error(`Known button failed to toggle on ${pageName}`);
    }

    // Close popover via close button
    await page.click('.wp-close');
    await page.waitForTimeout(200);

    const isVisible = await page.$eval('#wordPopover', el => el.classList.contains('visible'));
    console.log(`[${pageName}] Popover visible after close:`, isVisible);

    if (isVisible) {
      throw new Error(`Popover did not close on ${pageName}`);
    }

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Popover parity test PASSED on both index.html and discover.html!');
});
